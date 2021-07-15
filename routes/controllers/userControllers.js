import User from "../../models/userModel.js";
import { generateToken } from "../../middlewares/auth.js";
import { removeByAttr } from "../../utils/helpers.js";

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.status(200).json({
      name: user.name,
      mobile: user.mobile,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ Fail: error.message });
  }
};

export const postRegisterUser = async (req, res) => {
  const { name, mobile, email, password } = req.body;
  const existUser = await User.findOne({ email });

  if (existUser) {
    res.status(400).json({ Fail: "A user with that email is already exist" });
    return;
  }

  try {
    const user = await User.create({
      name,
      mobile,
      email,
      password,
    });
    if (user) {
      res.status(201).json({ Success: "User registered successfully" });
    }
  } catch (error) {
    res.status(400).json({ Fail: error.message });
  }
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ Fail: "No user with that email" });
      return;
    }

    if (!(await user.matchPassword(password))) {
      res.status(400).json({ Fail: "Incorrect password" });
      return;
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ Fail: error.message });
  }
};

export const postAddToWishlist = async (req, res) => {
  const { msg } = req.params;

  if (msg === "Add") {
    try {
      const user = await User.findById(req.user._id);
      user.wishlist = [...user.wishlist, req.body];
      await user.save();
      res.status(200).json({ Success: "Successfully added to wishlist" });
    } catch (error) {
      res.status(500).json({ Fail: error.message });
    }
    return;
  }

  if (msg === "Remove") {
    try {
      const user = await User.findById(req.user._id);
      const afterRemove = removeByAttr(user.wishlist, "_id", req.body._id);
      user.wishlist = afterRemove;
      await user.save();
      res.status(200).json({ Success: "Successfully removed from wishlist" });
    } catch (error) {
      res.status(500).json({ Fail: error.message });
    }
    return;
  }
};
