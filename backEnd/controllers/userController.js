
import User from "../models/user.js";
import HttpError from "../utlis/httpError.js";


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(new HttpError(404,"User not found"));
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};


export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userID).select("-password");
    if (!user) {
      return next(new HttpError(404,"User not found"));
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};


export const updateMyProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userID,
      { name, email },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    next(err);
  }
};


export const deleteMyAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.userID);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};