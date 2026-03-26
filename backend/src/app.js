import express from "express";
import cors from "cors";

import generateDirectionsRouter from "./routes/generateDirections.js";
import createWorkspaceRouter from "./routes/createWorkspace.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Merch OS API running" });
});

app.use("/api/generate-directions", generateDirectionsRouter);
app.use("/api/create-workspace", createWorkspaceRouter);

export default app;