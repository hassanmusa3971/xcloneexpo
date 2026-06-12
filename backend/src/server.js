import express from "express";
import "dotenv/config";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
const app = express();


app.get("/", (req, res) => {
  res.send("This is the backend server.");
});

const startServer = async () => {
  await connectDb();
  app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  })
};

startServer()

