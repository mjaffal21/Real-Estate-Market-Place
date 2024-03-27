import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);
  return (
    <header className="p-5 bg-slate-200 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="font-bold flex flex-wrap font-serif border">
          <Link to="/">
            <span className="text-blue-500 pr-1">Tbilisi</span>
            <span className="text-blue-700">Comfort</span>
          </Link>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={handleChange}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <nav>
          <ul className="flex gap-5">
            <li className="font-serif max-md:hidden text-slate-700 hover:underline">
              <Link to="/">Home</Link>
            </li>
            <li className="font-serif max-md:hidden text-slate-700 hover:underline">
              <Link to="/about">About</Link>
            </li>
            {userInfo ? (
              <li className="font-serif text-ellipsis overflow-hidden w-20 h-12 text-slate-700 hover:underline">
                <Link to="/profile">{userInfo?.username}</Link>
              </li>
            ) : (
              <li className="font-serif text-ellipsis overflow-hidden w-20 text-slate-700 hover:underline">
                <Link to="/sign-in">Sign In</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
