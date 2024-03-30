import express from "express";
import dotenv from "dotenv";
import { appRouter } from "./src/app.router.js";
import { connectDB } from "./DB/connection.js";
dotenv.config();
const app = express();
const port = 3000;
connectDB();
appRouter(app, express);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
