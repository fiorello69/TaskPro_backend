import app from "./app.js";
import mongoose from "mongoose";
import "dotenv/config";

const { DB_HOST } = process.env;
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful.Use your API on port 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
