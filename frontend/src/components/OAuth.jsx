import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useGoogleMutation } from "../slices/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const [redirect, setRedirect] = useState(false);

  const [google] = useGoogleMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const res = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = res.user;
      await google({ username: displayName, email, avatar: photoURL }).unwrap();
      dispatch(
        setCredentials({ username: displayName, email, avatar: photoURL })
      );
      setRedirect(true);
      toast.success("Google Authentication successful");
    } catch (error) {
      toast.error("Google Authentication failed!");
    }
  };

  useEffect(() => {
    if (redirect) {
      navigate("/");
      setRedirect(false);
    }
  }, [redirect, navigate]);

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-500 rounded-lg p-2 hover:bg-red-600"
    >
      Continue With Google
    </button>
  );
};

export default OAuth;
