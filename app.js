import express, { json } from "express";
import logger from "morgan";
import cors from "cors";
import { serve, setup } from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };
import authRouter from "./routes/api/auth.js";
import dashboardRouter from "./routes/api/dashboards.js";
import columnRouter from "./routes/api/column.js";
import cardRouter from "./routes/api/card.js";
import "dotenv/config";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(json());

app.use("/api-docs", serve, setup(swaggerDocument));

app.use("/api/users", authRouter);

app.use("/api/dashboard", dashboardRouter);

app.use("/api/column", columnRouter);

app.use("/api/card", cardRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Not found on 3000" });
});

app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
