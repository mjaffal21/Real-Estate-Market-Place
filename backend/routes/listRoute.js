const express = require("express");
const {
  CreateListing,
  DeleteListing,
  UpdateListing,
  GetListingById,
  SearchListing,
} = require("../controllers/listingController");
const { Protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/create-list").post(Protect, CreateListing);
router.route("/listing/:id").get(GetListingById);
router.route("/delete/:id").delete(Protect, DeleteListing);
router.route("/update-listing/:id").put(Protect, UpdateListing);
router.route("/get").get(SearchListing);

module.exports = router;
