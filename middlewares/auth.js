import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.user._id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ Fail: error.message });
    }
  }

  if (!token) {
    res.status(401).json({ Fail: "Not authorized, no token" });
  }
};
