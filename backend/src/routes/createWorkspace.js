import { Router } from "express";
import { createNotionWorkspace } from "../services/notionService.js";

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

    const result = await createNotionWorkspace({ brief, selectedDirection });

    res.json({
      message: "Workspace created successfully",
      workspace: result,
    });
  } catch (error) {
    console.error("Create workspace error:", error.message);
    res.status(500).json({
      error: "Failed to create workspace",
      details: error.message,
    });
  }
});

export default router;