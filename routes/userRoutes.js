import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getUserById,
  postAddToWishlist,
  postRegisterUser,
  postLogin,
} from "./controllers/userControllers.js";

const router = express.Router();

router.route("/:id").get(protect, getUserById);
router.route("/wishlist/:msg").post(protect, postAddToWishlist);
router.route("/register").post(postRegisterUser);
router.route("/login").post(postLogin);

export default router;
