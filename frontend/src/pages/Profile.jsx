import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials, logout } from "../slices/authSlice";
import {
  useUpdateUserMutation,
  useProfileQuery,
  useDeleteUserMutation,
  useGetUserListingsQuery,
} from "../slices/userApiSlice";
import { useDeleteListMutation } from "../slices/listApiSlice";
import { useLogoutUserMutation } from "../slices/authApiSlice";
import Loader from "../components/Loader";
import { BASE_URL } from "../constants";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { isLoading } = useProfileQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [deleteList] = useDeleteListMutation();
  const [logoutUser] = useLogoutUserMutation();
  const { data: listings, isLoading: isLoadingListing } =
    useGetUserListingsQuery(userInfo._id);

  const [formData, setFormData] = useState({});
  const [redirect, setRedirect] = useState(false);
  const [openList, setOpenList] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser({
        id: userInfo._id,
        ...formData,
        avatar: userInfo.avatar,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      setRedirect(true);
      toast.success("Update successful!");
    } catch (error) {
      toast.error("Error in updating user!");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await deleteUser({ id: userInfo._id }).unwrap();
    await logoutUser().unwrap();
    dispatch(logout());
    toast.success("User deleted successfully");
    navigate("/login");
  };

  const handleDeleteListing = async (listingId) => {
    await deleteList({ id: listingId }).unwrap();
    toast.success("Listing deleted successfully");
  };

  const handleSignout = async (e) => {
    e.preventDefault();
    await logoutUser().unwrap();
    dispatch(logout());
    toast.success("User Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    if (redirect) {
      navigate("/");
    }
  }, [redirect, navigate]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="flex justify-center items-center min-h-[85vh]">
      <div className="w-[80%]">
        <h1 className="text-center text-3xl font-bold">Profile</h1>
        <img
          src={userInfo.avatar}
          alt="profile pic"
          className="text-center mx-auto my-6 w-24 h-24 rounded-full object-contain"
        />
        <div className="flex flex-col md:w-[75%] md:mx-auto">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="text-xl my-1">
                <p>Username:</p>
                <input
                  type="text"
                  id="username"
                  defaultValue={userInfo.username}
                  placeholder="Username"
                  className="border border-slate-400 rounded-lg p-1 w-full outline-none"
                  onChange={handleChange}
                />
              </div>
              <div className="text-xl my-1">
                <p>Email:</p>
                <input
                  type="text"
                  id="email"
                  defaultValue={userInfo.email}
                  placeholder="Email"
                  className="border border-slate-400 rounded-lg p-1 w-full outline-none"
                  onChange={handleChange}
                />
              </div>
              <div className="text-xl my-1">
                <p>Password:</p>
                <input
                  type="password"
                  id="password"
                  defaultValue={userInfo.password}
                  placeholder="Password"
                  className="border border-slate-400 rounded-lg p-1 w-full outline-none"
                  onChange={handleChange}
                />
              </div>
              <div>
                <button className="bg-red-500 w-full my-1 rounded-lg p-2 hover:bg-red-600 text-xl text-white">
                  Update User
                </button>
              </div>
            </div>
          </form>
          <span className="text-center bg-green-500 hover:bg-green-600 rounded-lg p-2 text-xl text-white">
            <Link to="/profile/create-listing">Create Listing</Link>
          </span>
          <div className="flex justify-between">
            <span
              onClick={handleDelete}
              className="text-red-700 cursor-pointer"
            >
              Delete Account
            </span>
            <span
              onClick={handleSignout}
              className="text-slate-600 cursor-pointer"
            >
              Sign out
            </span>
          </div>
          <button
            onClick={() => setOpenList(!openList)}
            className="text-green-700 text-lg my-5"
          >
            Show Listings
          </button>
        </div>
        {openList &&
          (isLoadingListing ? (
            <Loader />
          ) : (
            <div className="flex flex-col gap-4 w-[80%] mx-auto mb-5">
              <h1 className="text-center mt-7 text-2xl font-semibold">
                Your Listings
              </h1>
              {listings && listings.length > 0 ? (
                listings.map((listing) => (
                  <div
                    key={listing._id}
                    className="border rounded-lg p-3 flex justify-between items-center gap-4"
                  >
                    <Link to={`/listing/${listing._id}`}>
                      <img
                        src={`${BASE_URL}/uploads` + listing.imageUrls[0]}
                        alt="listing cover"
                        className="h-16 w-16 object-contain"
                      />
                    </Link>
                    <Link
                      className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                      to={`/listing/${listing._id}`}
                    >
                      <p>{listing.name}</p>
                    </Link>

                    <div className="flex flex-col item-center">
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className="text-red-700 uppercase"
                      >
                        Delete
                      </button>
                      <Link to={`/update-listing/${listing._id}`}>
                        <button className="text-green-700 uppercase">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-lg text-red-700">No Listings found!</div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;
