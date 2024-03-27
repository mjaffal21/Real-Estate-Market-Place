const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

exports.Protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      next(new ErrorResponse("Not Authorized, Token invalid!", 401));
    }
  } else {
    next(new ErrorResponse("Not Authorized, No Token!", 401));
  }
});
