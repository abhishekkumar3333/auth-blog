import express from "express";
import cors from "cors";
import path from "path";
import { router } from "./routes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/v1", router);

export default app;


