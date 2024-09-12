import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./db/connection.js";
import BaseRouter from "./routes/index.js";
import Paths from "./Paths.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectToDatabase();

// Routes
app.use(Paths.Base, BaseRouter);

app.use("/", (req, res) => {
  res.send("server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
