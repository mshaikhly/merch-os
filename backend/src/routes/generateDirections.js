import { Router } from "express";
import { generateDirectionsFromBrief } from "../services/geminiService.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const brief = req.body;

    if (!brief || Object.keys(brief).length === 0) {
      return res.status(400).json({ error: "Brief is required" });
    }

    const directions = await generateDirectionsFromBrief(brief);

    res.json(directions);
  } catch (error) {
    console.error("Generate directions error:", error.message);
    res.status(500).json({
      error: "Failed to generate directions",
      details: error.message,
    });
  }
});

export default router;