// import express, { json } from "express";
// import logger from "morgan";
// import cors from "cors";
// import swaggerUi from "swagger-ui-express";
// import JSON5 from "json5";
// import fs from "fs";
// import authRouter from "./routes/api/auth.js";
// import dashboardRouter from "./routes/api/dashboards.js";
// import columnRouter from "./routes/api/column.js";
// import cardRouter from "./routes/api/card.js";
// import "dotenv/config";

// const app = express();

// const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// const swaggerDocument = JSON5.parse(fs.readFileSync("./swagger.json", "utf-8"));

// app.use(logger(formatsLogger));
// app.use(cors());
// app.use(json());

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use("/api/users", authRouter);

// app.use("/api/dashboard", dashboardRouter);

// app.use("/api/column", columnRouter);

// app.use("/api/card", cardRouter);

// app.use((_req, res) => {
//   res.status(404).json({ message: "Not found on 3000" });
// });

// app.use((err, _req, res, _next) => {
//   const { status = 500, message = "Server error" } = err;
//   res.status(status).json({ message });
// });

// export default app;

import express from "express";
import logger from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import JSON5 from "json5";
import fs from "fs";
import authRouter from "./routes/api/auth.js";
import dashboardRouter from "./routes/api/dashboards.js";
import columnRouter from "./routes/api/column.js";
import cardRouter from "./routes/api/card.js";
import "dotenv/config";

const app = express();
const { PORT = 3000 } = process.env;

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const swaggerDocument = JSON5.parse(fs.readFileSync("./swagger.json", "utf-8"));

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/users", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/column", columnRouter);
app.use("/api/card", cardRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use((_req, res) => {
  res.status(404).json({ message: "Not found on " + PORT });
});

app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
