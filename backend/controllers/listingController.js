const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const List = require("../models/ListingModel");

exports.CreateListing = asyncHandler(async (req, res, next) => {
  const listing = await List.create(req.body);
  if (listing) {
    return res.status(201).json(listing);
  }
  next(new ErrorResponse("Error in creating a listing", 400));
});

exports.DeleteListing = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const listing = await List.findById(id);
  if (!listing) {
    return next(new ErrorResponse("Listing is not found!", 404));
  }
  if (req.user._id.toString() !== listing.user.toString()) {
    return next(new ErrorResponse("You can only delete your listings", 401));
  }
  const deleteList = await List.findByIdAndDelete(id);
  return res.status(200).json(deleteList);
});

exports.UpdateListing = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const listing = await List.findById(id);
  if (!listing) {
    return next(new ErrorResponse("No Listing Found!", 404));
  }
  if (req.user._id.toString() !== listing.user.toString()) {
    return next(
      new ErrorResponse("You can only update your own listing!", 401)
    );
  }
  const updatedListing = await List.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json(updatedListing);
});

exports.GetListingById = asyncHandler(async (req, res, next) => {
  const listing = await List.findById(req.params.id);
  if (!listing) {
    return next(new ErrorResponse("Listing not found!", 404));
  }
  res.status(200).json(listing);
});

exports.SearchListing = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit);
  const startIndex = parseInt(req.query.startIndex) || 0;
  let offer = req.query.offer;
  let furnished = req.query.furnished;
  let parking = req.query.parking;
  let type = req.query.type;
  const searchTerm = req.query.searchTerm || "";
  if (offer === undefined || offer === "false") {
    offer = { $in: [true, false] };
  }
  if (furnished === undefined || furnished === "false") {
    furnished = { $in: [true, false] };
  }
  if (parking === undefined || parking === "false") {
    parking = { $in: [true, false] };
  }
  if (type === undefined || type === "all") {
    type = { $in: ["rent", "sale"] };
  }
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "desc";

  const listings = await List.find({
    name: { $regex: searchTerm, $options: "i" },
    offer,
    furnished,
    parking,
    type,
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

  return res.status(200).json(listings);
});
