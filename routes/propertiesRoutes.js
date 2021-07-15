import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getAllProperties,
  getFilteredProps,
  addProperty,
} from "./controllers/propertiesController.js";

const router = express.Router();

router.route("/").get(getAllProperties).post(protect, addProperty);
router.route("/filtered").get(getFilteredProps);

export default router;
