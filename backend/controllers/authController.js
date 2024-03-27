const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const jwt = require("jsonwebtoken");

exports.SignUp = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new ErrorResponse("These fields are required!", 400));
  }
  const userDoc = await User.create({
    username,
    email,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
  });
  if (userDoc) {
    let token = jwt.sign(
      { id: userDoc._id, username: userDoc.username, email: userDoc.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        token,
      });
  } else {
    next(new ErrorResponse("User cannot be registered", 400));
  }
});
exports.SignIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("These fields are required!", 400));
  }

  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const matchPassword = bcrypt.compareSync(password, userDoc.password);

    if (matchPassword) {
      let token = jwt.sign(
        { id: userDoc._id, email: userDoc.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          _id: userDoc._id,
          username: userDoc.username,
          email: userDoc.email,
          avatar: userDoc.avatar,
          token,
        });
    } else {
      next(new ErrorResponse("Invalid Credentials!", 400));
    }
  } else {
    next(new ErrorResponse("Invalid Credentials!", 400));
  }
});

exports.Google = asyncHandler(async (req, res, next) => {
  const { email, username, avatar } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    let token = jwt.sign(
      { id: userDoc._id, email: userDoc.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        _id: userDoc._id,
        username: userDoc.username,
        email: userDoc.email,
        token,
      });
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(
      generatedPassword,
      bcrypt.genSaltSync(10)
    );
    const userDoc = await User.create({
      username:
        username.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email,
      password: hashedPassword,
      avatar,
    });

    let token = jwt.sign(
      { id: userDoc._id, email: userDoc.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        _id: userDoc._id,
        username: userDoc.username,
        email: userDoc.email,
        token,
        avatar,
      });
  }
  return next(new ErrorResponse("Google Authentication Failed!", 400));
});
exports.LogOut = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});
