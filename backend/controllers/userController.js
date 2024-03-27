const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/UserModel");
const Listing = require("../models/ListingModel");
const ErrorResponse = require("../utils/ErrorResponse");
const bcrypt = require("bcryptjs");

exports.UpdateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user._id.toString() === req.body.id) {
    user._id = req.body.id;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.password) {
      user.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
    });
  } else {
    next(new ErrorResponse("User not found", 404));
  }
});

exports.Profile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  } else {
    next(new ErrorResponse("User not found", 404));
  }
});

exports.DeleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user._id.toString() === req.body.id) {
    const deletedUser = await User.findByIdAndDelete(user._id);
    res.status(200).json(deletedUser);
  } else {
    next(new ErrorResponse("User cannot be deleted!", 400));
  }
});

exports.GetUserListings = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(req.user._id);
  if (user._id.toString() !== userId) {
    return next(new ErrorResponse("You can only access your listings", 401));
  }
  const listings = await Listing.find({ user: userId });
  res.status(200).json(listings);
});

exports.GetUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new ErrorResponse("User not found!", 404));

  const { password: pass, ...rest } = user._doc;

  res.status(200).json(rest);
});
