import express from "express";
import cors from "cors";

import generateDirectionsRouter from "./routes/generateDirections.js";
import createWorkspaceRouter from "./routes/createWorkspace.js";
import mcpToolsRouter from "./routes/mcpTools.js";
import createWorkspaceMcpRouter from "./routes/createWorkspaceMcp.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Merch OS API running" });
});

app.use("/api/generate-directions", generateDirectionsRouter);
app.use("/api/create-workspace", createWorkspaceRouter);
app.use("/api/mcp-tools", mcpToolsRouter);
app.use("/api/create-workspace-mcp", createWorkspaceMcpRouter);

export default app;