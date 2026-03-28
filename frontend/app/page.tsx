"use client";

import { useState } from "react";

type Brief = {
  brandName: string;
  audience: string;
  brandValues: string;
  stylePreferences: string;
  colourPreferences: string;
  designNotes: string;
  garmentTypes: string;
  projectStartDate: string;
  launchDate: string;
};

type Direction = {
  id: string;
  title: string;
  hook: string;
  concept: string;
  visualStyle: string;
  typography: string;
  colourPalette: string[];
  graphicElements: string[];
  frontDesign: string;
  backDesign: string;
  placementNotes: string;
  printStyle: string;
  referenceVibe: string;
  rationale: string;
};

type Workspace = {
  pageId: string;
  url: string;
  title: string;
  productionDatabaseUrl?: string;
  milestonesDatabaseUrl?: string;
};

const initialBrief: Brief = {
  brandName: "North Collective",
  audience: "Men aged 20–35 interested in modern streetwear and minimalist fashion",
  brandValues: "confidence, discipline, community, self-improvement",
  stylePreferences: "premium, minimal, bold, modern streetwear",
  colourPreferences: "black, white, stone, earth tones",
  designNotes:
    "Designs should feel premium and identity-driven. Avoid overly complex graphics. Focus on bold typography, subtle symbolism, and wearable everyday pieces.",
  garmentTypes: "hoodie, t-shirt",
  projectStartDate: "",
  launchDate: "",
};

export default function Home() {
  const [brief, setBrief] = useState<Brief>(initialBrief);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loadingDirections, setLoadingDirections] = useState(false);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);
  const [error, setError] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleChange = (field: keyof Brief, value: string) => {
    setBrief((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = () => ({
    brandName: brief.brandName,
    audience: brief.audience,
    brandValues: brief.brandValues
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
    stylePreferences: brief.stylePreferences
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
    colourPreferences: brief.colourPreferences
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
    designNotes: brief.designNotes,
    garmentTypes: brief.garmentTypes
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
    projectStartDate: brief.projectStartDate,
    launchDate: brief.launchDate,
  });

  const generateDirections = async () => {
    try {
      setError("");
      setWorkspace(null);
      setSelectedDirection(null);
      setLoadingDirections(true);

      const response = await fetch(`${apiBaseUrl}/generate-directions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildPayload()),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate directions.");
      }

      const generatedDirections = data.directions || [];
      setDirections(generatedDirections);
      setSelectedDirection(generatedDirections[0] || null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate directions.";
      setError(message);
    } finally {
      setLoadingDirections(false);
    }
  };

  const createWorkspace = async () => {
    if (!selectedDirection) return;

    try {
      setError("");
      setLoadingWorkspace(true);

      const response = await fetch(`${apiBaseUrl}/create-workspace-mcp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brief: buildPayload(),
          selectedDirection,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.details || data?.error || "Failed to create workspace."
        );
      }

      setWorkspace(data.workspace);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create workspace.";
      setError(message);
    } finally {
      setLoadingWorkspace(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8">
          <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
            AI-powered merch workflow
          </div>

          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Merch OS
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Turn a merch brief into AI-generated design directions and a Notion
              execution workspace with production tasks and milestone planning.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[430px_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Client Brief</h2>
              <p className="mt-1 text-sm text-white/50">
                Define the brand, launch timing, and creative constraints.
              </p>
            </div>

            <div className="space-y-4">
              <Field label="Brand Name">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                  value={brief.brandName}
                  onChange={(e) => handleChange("brandName", e.target.value)}
                />
              </Field>

              <Field label="Audience">
                <textarea
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                  value={brief.audience}
                  onChange={(e) => handleChange("audience", e.target.value)}
                  rows={3}
                />
              </Field>

              <Field label="Brand Values (comma separated)">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                  value={brief.brandValues}
                  onChange={(e) => handleChange("brandValues", e.target.value)}
                />
              </Field>

              <Field label="Style Preferences (comma separated)">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                  value={brief.stylePreferences}
                  onChange={(e) => handleChange("stylePreferences", e.target.value)}
                />
              </Field>

              <Field label="Colour Preferences (comma separated)">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                  value={brief.colourPreferences}
                  onChange={(e) => handleChange("colourPreferences", e.target.value)}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Project Start Date">
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition [color-scheme:dark] focus:border-white/30"
                    value={brief.projectStartDate}
                    onChange={(e) =>
                      handleChange("projectStartDate", e.target.value)
                    }
                  />
                </Field>

                <Field label="Launch Date">
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition [color-scheme:dark] focus:border-white/30"
                    value={brief.launchDate}
                    onChange={(e) => handleChange("launchDate", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Design Notes">
                <textarea
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                  value={brief.designNotes}
                  onChange={(e) => handleChange("designNotes", e.target.value)}
                  rows={4}
                />
              </Field>

              <Field label="Garment Types (comma separated)">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                  value={brief.garmentTypes}
                  onChange={(e) => handleChange("garmentTypes", e.target.value)}
                />
              </Field>

              <button
                onClick={generateDirections}
                disabled={loadingDirections}
                className="w-full rounded-2xl border border-white/20 bg-white px-4 py-3 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingDirections ? "Generating..." : "Generate Directions"}
              </button>
            </div>
          </section>

          <section className="space-y-6">
            {error && (
              <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            {directions.length > 0 && !selectedDirection && (
              <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                Select a direction before creating the Notion workspace.
              </div>
            )}

            {directions.length > 0 && (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Generated Directions</h2>
                    <p className="mt-1 text-sm text-white/50">
                      Pick one direction and generate the Notion workspace.
                    </p>
                  </div>

                  <button
                    onClick={createWorkspace}
                    disabled={!selectedDirection || loadingWorkspace}
                    className="rounded-2xl border border-white/20 bg-white px-4 py-3 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingWorkspace
                      ? "Creating Workspace..."
                      : "Create Notion Workspace"}
                  </button>
                </div>

                {selectedDirection && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80">
                    <span className="font-medium text-white">Selected direction:</span>{" "}
                    {selectedDirection.title}
                  </div>
                )}

                <div className="grid gap-4 xl:grid-cols-2">
                  {directions.map((direction) => {
                    const isSelected = selectedDirection?.id === direction.id;

                    return (
                      <button
                        key={direction.id}
                        onClick={() => setSelectedDirection(direction)}
                        className={`rounded-3xl border p-5 text-left transition ${
                          isSelected
                            ? "border-white/40 bg-white/[0.06] ring-1 ring-white/30"
                            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {direction.title}
                            </h3>
                            <p className="mt-1 text-sm text-white/55">
                              {direction.hook}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              isSelected
                                ? "border border-white/20 bg-white text-black"
                                : "border border-white/10 bg-white/[0.04] text-white/70"
                            }`}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </span>
                        </div>

                        <div className="space-y-3 text-sm">
                          <Info label="Concept" value={direction.concept} />
                          <Info label="Front" value={direction.frontDesign} />
                          <Info label="Back" value={direction.backDesign} />
                          <Info label="Print Style" value={direction.printStyle} />
                          <Info
                            label="Reference Vibe"
                            value={direction.referenceVibe}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {workspace && (
              <div className="overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 via-white/[0.04] to-white/[0.02] shadow-[0_0_0_1px_rgba(16,185,129,0.08)]">
                <div className="border-b border-white/10 px-6 py-5">
                  <div className="mb-3 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-200">
                    Workspace Ready
                  </div>

                  <h2 className="text-2xl font-semibold text-white">
                    Workspace created successfully
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                    Your Notion workspace has been created with the brief,
                    selected direction, dynamic production tasks, and project milestones.
                  </p>
                </div>

                <div className="grid gap-4 px-6 py-5 md:grid-cols-3">
                  <SuccessStat
                    label="Workspace"
                    value="Created"
                  />
                  <SuccessStat
                    label="Production Tasks"
                    value={workspace.productionDatabaseUrl ? "Ready" : "Pending"}
                  />
                  <SuccessStat
                    label="Milestones"
                    value={workspace.milestonesDatabaseUrl ? "Ready" : "Pending"}
                  />
                </div>

                <div className="border-t border-white/10 px-6 py-5">
                  <p className="text-sm text-white/75">{workspace.title}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={workspace.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-2xl border border-white/20 bg-white px-4 py-3 font-medium text-black transition hover:bg-white/90"
                    >
                      Open Workspace
                    </a>

                    {workspace.productionDatabaseUrl && (
                      <a
                        href={workspace.productionDatabaseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 font-medium text-white transition hover:border-white/30 hover:bg-white/[0.08]"
                      >
                        Open Production Tasks
                      </a>
                    )}

                    {workspace.milestonesDatabaseUrl && (
                      <a
                        href={workspace.milestonesDatabaseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 font-medium text-white transition hover:border-white/30 hover:bg-white/[0.08]"
                      >
                        Open Milestones
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/80">{label}</span>
      {children}
    </label>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;

  return (
    <div>
      <p className="font-medium text-white">{label}</p>
      <p className="text-white/55">{value}</p>
    </div>
  );
}

function SuccessStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}