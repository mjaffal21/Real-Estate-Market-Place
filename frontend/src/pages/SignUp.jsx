import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../slices/authApiSlice";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [redirect, setRedirect] = useState(false);
  const [register] = useRegisterMutation();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ ...formData }).unwrap();
      setRedirect(true);
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(
        error?.data?.error ||
          error.error ||
          "Error occurred while registration!! "
      );
    }
  };
  useEffect(() => {
    if (redirect) {
      navigate("/");
      setRedirect(false);
    }
  }, [redirect, navigate]);
  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-[85vh] bg-slate-100">
      <div className="w-[70%]">
        <h1 className="text-3xl font-bold mb-4 text-center">Sign Up</h1>
        <div className="flex flex-col w-80 m-auto">
          <form onSubmit={handleSubmit}>
            <div className="text-xl">
              <p>Username:</p>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="border border-slate-400 rounded-lg p-1 w-full outline-none"
                onChange={handleChange}
              />
            </div>
            <div className="text-xl">
              <p>Email:</p>
              <input
                type="text"
                id="email"
                placeholder="Email"
                className="border border-slate-400 rounded-lg p-1 w-full outline-none"
                onChange={handleChange}
              />
            </div>
            <div className="text-xl">
              <p>Password:</p>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="border border-slate-400 rounded-lg p-1 w-full outline-none"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col mt-2 text-white text-xl">
              <button className="bg-slate-600 rounded-lg p-2 mb-2 hover:bg-slate-700">
                Sign Up
              </button>
              <OAuth />
            </div>
            <div className="flex items-center">
              <p className="p-2">Have an account ?</p>
              <Link to="/sign-in" className="text-blue-500">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
