import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  usePhotoUploadMutation,
  useCreateListMutation,
} from "../slices/listApiSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";

const CreateListing = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [photoUpload] = usePhotoUploadMutation();
  const [createList] = useCreateListMutation();
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const onImageChange = (e) => {
    setImages(e.target.files);
  };
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (+formData.regularPrice < +formData.discountPrice) {
        return toast.error("Discount price must be lower than regular price");
      }
      const res = await createList({
        ...formData,
        user: userInfo._id,
        imageUrls: uploadedImages,
      }).unwrap();
      toast.success("Listing created successfully");
      navigate(`/listing/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleImageSubmit = async (e) => {
    if (images.length > 6 || uploadedImages.length + images.length > 6) {
      toast.error("You can upload a maximum of 6 images.");
      return;
    }
    if (uploadedImages.length > 6) {
      toast.error("You can upload a maximum of 6 images.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("image", images[i]);
    }

    try {
      const res = await photoUpload(formData).unwrap();
      setUploadedImages([...res.image, ...uploadedImages]);
      toast.success(res.message);
      setImages([]);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg bg-slate-100"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg bg-slate-100"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg bg-slate-100"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg bg-slate-100"
                onChange={handleChange}
                checked={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg bg-slate-100"
                onChange={handleChange}
                checked={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                required
                className="p-3 border border-gray-300 rounded-lg bg-slate-100"
                onChange={handleChange}
                checked={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>

                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex flex-col gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full bg-slate-100"
              type="file"
              multiple
              onChange={onImageChange}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={images.length <= 0 ? true : false}
              className="p-3 text-green-700 border bg-slate-200 hover:bg-green-500 hover:text-white border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold">Uploaded Images:</p>
                <div className="flex flex-col gap-4">
                  {uploadedImages.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={`${BASE_URL}/uploads` + imageUrl}
                      alt={`Uploaded Images ${index + 1}`}
                      className="rounded-lg max-w-32 max-h-32 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Add the validation error message */}
            {images.length > 6 && (
              <p className="text-red-500 mt-2">
                You can upload a maximum of 6 images.
              </p>
            )}
            {/* Add the validation error message for uploadedImages */}
            {uploadedImages.length + images.length > 6 && (
              <p className="text-red-500 mt-2">
                You can upload a maximum of 6 images.
              </p>
            )}
          </div>
          <button
            disabled={
              uploadedImages.length <= 0 ||
              uploadedImages.length > 6 ||
              uploadedImages.length + images.length > 6
            }
            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
