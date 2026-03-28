import { Router } from "express";
import { createNotionWorkspaceViaMcp } from "../services/notionMcpService.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { brief, selectedDirection } = req.body;

    if (!brief) {
      return res.status(400).json({ error: "Brief is required" });
    }

    if (!selectedDirection) {
      return res.status(400).json({ error: "Selected direction is required" });
    }

    const result = await createNotionWorkspaceViaMcp({ brief, selectedDirection });

    res.json({
      message: "Workspace created successfully via MCP",
      workspace: result,
    });
  } catch (error) {
    console.error("Create workspace via MCP error:", error.message);
    res.status(500).json({
      error: "Failed to create workspace via MCP",
      details: error.message,
    });
  }
});

export default router;