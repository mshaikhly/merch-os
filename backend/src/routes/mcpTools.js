import express from "express";
import { createNotionMcpClient } from "../services/notionMcpClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const client = await createNotionMcpClient();
    const result = await client.listTools();

    res.json({
      toolNames: result.tools.map((tool) => tool.name),
    });
  } catch (error) {
    console.error("MCP error:", error);

    res.status(500).json({
      error: "Failed to connect to MCP server",
      details: error.message,
    });
  }
});

export default router;