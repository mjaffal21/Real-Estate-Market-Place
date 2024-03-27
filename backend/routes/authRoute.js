const express = require("express");
const {
  SignIn,
  SignUp,
  LogOut,
  Google,
} = require("../controllers/authController");

const router = express.Router();

router.route("/sign-in").post(SignIn);
router.route("/sign-up").post(SignUp);
router.route("/google").post(Google);
router.route("/logout").post(LogOut);

module.exports = router;
