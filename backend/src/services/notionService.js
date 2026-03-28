import dotenv from "dotenv";
dotenv.config();

import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const TASK_DB_FIELDS = {
  NAME: "Name",
  STATUS: "Status",
  CATEGORY: "Category",
  PRIORITY: "Priority",
  DIRECTION: "Direction",
};

const MILESTONE_DB_FIELDS = {
  NAME: "Name",
  STATUS: "Status",
  DUE_DATE: "Due Date",
};

function richText(content) {
  return [
    {
      type: "text",
      text: {
        content: String(content ?? ""),
      },
    },
  ];
}

function headingBlock(text) {
  return {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: richText(text),
    },
  };
}

function paragraphBlock(text) {
  return {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: richText(text),
    },
  };
}

function bulletedListItemBlock(text) {
  return {
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: richText(text),
    },
  };
}

function briefBlocks(brief) {
  return [
    headingBlock("Client Brief"),
    bulletedListItemBlock(`Brand Name: ${brief?.brandName || ""}`),
    bulletedListItemBlock(`Audience: ${brief?.audience || ""}`),
    bulletedListItemBlock(
      `Brand Values: ${(brief?.brandValues || []).join(", ")}`
    ),
    bulletedListItemBlock(
      `Style Preferences: ${(brief?.stylePreferences || []).join(", ")}`
    ),
    bulletedListItemBlock(
      `Colour Preferences: ${(brief?.colourPreferences || []).join(", ")}`
    ),
    bulletedListItemBlock(
      `Garment Types: ${(brief?.garmentTypes || []).join(", ")}`
    ),
    bulletedListItemBlock(
      `Project Start Date: ${brief?.projectStartDate || ""}`
    ),
    bulletedListItemBlock(`Launch Date: ${brief?.launchDate || ""}`),
    paragraphBlock(`Design Notes: ${brief?.designNotes || ""}`),
  ];
}

function directionBlocks(selectedDirection) {
  return [
    headingBlock("Selected Direction"),
    bulletedListItemBlock(`Title: ${selectedDirection?.title || ""}`),
    bulletedListItemBlock(`Hook: ${selectedDirection?.hook || ""}`),
    paragraphBlock(`Concept: ${selectedDirection?.concept || ""}`),
    bulletedListItemBlock(
      `Visual Style: ${selectedDirection?.visualStyle || ""}`
    ),
    bulletedListItemBlock(`Typography: ${selectedDirection?.typography || ""}`),
    bulletedListItemBlock(
      `Colour Palette: ${(selectedDirection?.colourPalette || []).join(", ")}`
    ),
    bulletedListItemBlock(
      `Graphic Elements: ${(selectedDirection?.graphicElements || []).join(", ")}`
    ),
    paragraphBlock(`Front Design: ${selectedDirection?.frontDesign || ""}`),
    paragraphBlock(`Back Design: ${selectedDirection?.backDesign || ""}`),
    paragraphBlock(
      `Placement Notes: ${selectedDirection?.placementNotes || ""}`
    ),
    bulletedListItemBlock(`Print Style: ${selectedDirection?.printStyle || ""}`),
    bulletedListItemBlock(
      `Reference Vibe: ${selectedDirection?.referenceVibe || ""}`
    ),
    paragraphBlock(`Rationale: ${selectedDirection?.rationale || ""}`),
  ];
}

function productionDatabaseProperties() {
  return {
    [TASK_DB_FIELDS.NAME]: {
      title: {},
    },
    [TASK_DB_FIELDS.STATUS]: {
      select: {
        options: [
          { name: "Not Started", color: "default" },
          { name: "In Progress", color: "yellow" },
          { name: "Done", color: "green" },
        ],
      },
    },
    [TASK_DB_FIELDS.CATEGORY]: {
      select: {
        options: [
          { name: "Design", color: "blue" },
          { name: "Review", color: "purple" },
          { name: "Production", color: "orange" },
          { name: "Launch", color: "green" },
        ],
      },
    },
    [TASK_DB_FIELDS.PRIORITY]: {
      select: {
        options: [
          { name: "Low", color: "gray" },
          { name: "Medium", color: "brown" },
          { name: "High", color: "red" },
        ],
      },
    },
    [TASK_DB_FIELDS.DIRECTION]: {
      rich_text: {},
    },
  };
}

function milestoneDatabaseProperties() {
  return {
    [MILESTONE_DB_FIELDS.NAME]: {
      title: {},
    },
    [MILESTONE_DB_FIELDS.STATUS]: {
      select: {
        options: [
          { name: "Not Started", color: "default" },
          { name: "In Progress", color: "yellow" },
          { name: "Done", color: "green" },
        ],
      },
    },
    [MILESTONE_DB_FIELDS.DUE_DATE]: {
      date: {},
    },
  };
}

function getDataSourceId(databaseResponse) {
  return (
    databaseResponse?.initial_data_source?.id ||
    databaseResponse?.data_sources?.[0]?.id ||
    null
  );
}

function buildDynamicTasks(selectedDirection, brief) {
  const directionTitle = selectedDirection?.title || "Selected Direction";
  const garmentTypes = brief?.garmentTypes || [];
  const frontDesign = selectedDirection?.frontDesign || "";
  const backDesign = selectedDirection?.backDesign || "";
  const typography = selectedDirection?.typography || "";
  const printStyle = selectedDirection?.printStyle || "";

  const tasks = [
    {
      name: `Refine concept board for ${directionTitle}`,
      category: "Review",
      priority: "High",
    },
  ];

  if (frontDesign.trim()) {
    tasks.push({
      name: "Design front artwork",
      category: "Design",
      priority: "High",
    });
  }

  if (backDesign.trim()) {
    tasks.push({
      name: "Design back artwork",
      category: "Design",
      priority: "High",
    });
  }

  if (typography.trim()) {
    tasks.push({
      name: `Develop typography treatment (${typography})`,
      category: "Design",
      priority: "Medium",
    });
  }

  if (printStyle.trim()) {
    tasks.push({
      name: `Prepare print files for ${printStyle}`,
      category: "Production",
      priority: "High",
    });
  } else {
    tasks.push({
      name: "Prepare print-ready artwork",
      category: "Production",
      priority: "High",
    });
  }

  if (
    garmentTypes.includes("Hoodie") ||
    garmentTypes.includes("Hoodies")
  ) {
    tasks.push({
      name: "Generate hoodie mockups",
      category: "Production",
      priority: "Medium",
    });
  }

  if (
    garmentTypes.includes("Tee") ||
    garmentTypes.includes("Tees") ||
    garmentTypes.includes("T-Shirt") ||
    garmentTypes.includes("T-Shirts")
  ) {
    tasks.push({
      name: "Generate tee mockups",
      category: "Production",
      priority: "Medium",
    });
  }

  if (
    garmentTypes.includes("Cap") ||
    garmentTypes.includes("Caps")
  ) {
    tasks.push({
      name: "Adapt artwork for caps",
      category: "Production",
      priority: "Medium",
    });
  }

  tasks.push(
    {
      name: "Review design placement and scale",
      category: "Review",
      priority: "Medium",
    },
    {
      name: "Review client feedback",
      category: "Review",
      priority: "Medium",
    },
    {
      name: "Prepare launch visuals",
      category: "Launch",
      priority: "Low",
    }
  );

  return tasks;
}

function parseDateSafely(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateOnly(date) {
  return date.toISOString().split("T")[0];
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildMilestones(brief) {
  const start = parseDateSafely(brief?.projectStartDate);
  const launch = parseDateSafely(brief?.launchDate);

  const milestones = [
    "Concept Approved",
    "Design Finalised",
    "Print Files Ready",
    "Mockups Ready",
    "Launch Ready",
  ];

  if (!start || !launch || launch <= start) {
    return milestones.map((name) => ({
      name,
      status: "Not Started",
      dueDate: null,
    }));
  }

  const totalMs = launch.getTime() - start.getTime();
  const totalDays = Math.max(1, Math.floor(totalMs / (1000 * 60 * 60 * 24)));

  const offsets = [
    Math.max(1, Math.round(totalDays * 0.2)),
    Math.max(2, Math.round(totalDays * 0.45)),
    Math.max(3, Math.round(totalDays * 0.65)),
    Math.max(4, Math.round(totalDays * 0.82)),
    totalDays,
  ];

  return milestones.map((name, index) => ({
    name,
    status: "Not Started",
    dueDate: formatDateOnly(addDays(start, offsets[index])),
  }));
}

export async function createProductionTasksDatabase(parentPageId) {
  const productionTasksDatabase = await notion.databases.create({
    parent: {
      type: "page_id",
      page_id: parentPageId,
    },
    title: richText("Production Tasks"),
    is_inline: true,
    initial_data_source: {
      properties: productionDatabaseProperties(),
    },
  });

  const dataSourceId = getDataSourceId(productionTasksDatabase);

  if (!dataSourceId) {
    throw new Error(
      "Production Tasks database was created, but no data source ID was returned."
    );
  }

  return {
    databaseId: productionTasksDatabase.id,
    dataSourceId,
    url: productionTasksDatabase.url,
  };
}

export async function seedProductionTasks(dataSourceId, selectedDirection, brief) {
  const starterTasks = buildDynamicTasks(selectedDirection, brief);

  for (const task of starterTasks) {
    await notion.pages.create({
      parent: {
        type: "data_source_id",
        data_source_id: dataSourceId,
      },
      properties: {
        [TASK_DB_FIELDS.NAME]: {
          title: richText(task.name),
        },
        [TASK_DB_FIELDS.STATUS]: {
          select: {
            name: "Not Started",
          },
        },
        [TASK_DB_FIELDS.CATEGORY]: {
          select: {
            name: task.category,
          },
        },
        [TASK_DB_FIELDS.PRIORITY]: {
          select: {
            name: task.priority,
          },
        },
        [TASK_DB_FIELDS.DIRECTION]: {
          rich_text: richText(
            selectedDirection?.title || "Selected Direction"
          ),
        },
      },
    });
  }
}

export async function createMilestonesDatabase(parentPageId) {
  const milestonesDatabase = await notion.databases.create({
    parent: {
      type: "page_id",
      page_id: parentPageId,
    },
    title: richText("Project Milestones"),
    is_inline: true,
    initial_data_source: {
      properties: milestoneDatabaseProperties(),
    },
  });

  const dataSourceId = getDataSourceId(milestonesDatabase);

  if (!dataSourceId) {
    throw new Error(
      "Project Milestones database was created, but no data source ID was returned."
    );
  }

  return {
    databaseId: milestonesDatabase.id,
    dataSourceId,
    url: milestonesDatabase.url,
  };
}

export async function seedMilestones(dataSourceId, brief) {
  const milestones = buildMilestones(brief);

  for (const milestone of milestones) {
    await notion.pages.create({
      parent: {
        type: "data_source_id",
        data_source_id: dataSourceId,
      },
      properties: {
        [MILESTONE_DB_FIELDS.NAME]: {
          title: richText(milestone.name),
        },
        [MILESTONE_DB_FIELDS.STATUS]: {
          select: {
            name: milestone.status,
          },
        },
        [MILESTONE_DB_FIELDS.DUE_DATE]: milestone.dueDate
          ? {
              date: {
                start: milestone.dueDate,
              },
            }
          : {
              date: null,
            },
      },
    });
  }
}

export async function createNotionWorkspace({ brief, selectedDirection }) {
  const workspaceTitle = `${
    brief?.brandName || "Untitled Brand"
  } – Merch Workspace`;

  const parentPage = await notion.pages.create({
    parent: {
      type: "page_id",
      page_id: process.env.NOTION_PARENT_PAGE_ID,
    },
    properties: {
      title: {
        title: richText(workspaceTitle),
      },
    },
    children: [
      headingBlock("Workspace Overview"),
      paragraphBlock(
        `Workspace generated by Merch OS for ${
          brief?.brandName || "the client project"
        }.`
      ),
    ],
  });

  await notion.pages.create({
    parent: {
      type: "page_id",
      page_id: parentPage.id,
    },
    properties: {
      title: {
        title: richText("Brand Brief"),
      },
    },
    children: briefBlocks(brief),
  });

  await notion.pages.create({
    parent: {
      type: "page_id",
      page_id: parentPage.id,
    },
    properties: {
      title: {
        title: richText("Design Directions"),
      },
    },
    children: directionBlocks(selectedDirection),
  });

  await notion.pages.create({
    parent: {
      type: "page_id",
      page_id: parentPage.id,
    },
    properties: {
      title: {
        title: richText("Feedback"),
      },
    },
    children: [
      headingBlock("Client Feedback"),
      paragraphBlock("Log client notes and approvals here."),
      headingBlock("Internal Feedback"),
      paragraphBlock("Track internal reviews and QA notes here."),
    ],
  });

  const productionDb = await createProductionTasksDatabase(parentPage.id);
  await seedProductionTasks(productionDb.dataSourceId, selectedDirection, brief);

  const milestonesDb = await createMilestonesDatabase(parentPage.id);
  await seedMilestones(milestonesDb.dataSourceId, brief);

  return {
    pageId: parentPage.id,
    url: parentPage.url,
    title: workspaceTitle,
    productionDatabaseUrl: productionDb.url,
    milestonesDatabaseUrl: milestonesDb.url,
  };
}