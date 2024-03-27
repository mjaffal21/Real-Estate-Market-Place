const express = require("express");
const {
  UpdateUser,
  Profile,
  DeleteUser,
  GetUserListings,
  GetUserById,
} = require("../controllers/userController");
const { Protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/profile").get(Protect, Profile);

router.route("/update-user").put(Protect, UpdateUser);

router.route("/delete-user").delete(Protect, DeleteUser);

router.route("/:userId/listings").get(Protect, GetUserListings);
router.route("/user/:id").get(Protect, GetUserById);

module.exports = router;
