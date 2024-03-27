import React, { useState } from "react";
import { useGetUserQuery } from "../slices/userApiSlice";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const {
    data: userInfo,
    isLoading,
    isError,
    isSuccess,
  } = useGetUserQuery(listing.user);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong...</div>}
      {isSuccess && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{userInfo.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${userInfo.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;
