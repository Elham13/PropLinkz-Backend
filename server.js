import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";

import uploadRoutes from "./routes/uploadRoutes.js";
import propertiesRoutes from "./routes/propertiesRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
connectDB();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json("Proplinks backend version 1");
});

app.use("/properties", propertiesRoutes);
app.use("/user", userRoutes);
app.use("/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
