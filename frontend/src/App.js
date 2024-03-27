import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import About from "./pages/About";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./pages/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import ListingItem from "./pages/ListingItem";
import UpdateListing from "./pages/UpdateListing";
import Search from "./pages/Search";
export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/sign-in" element={<SignIn />} />
        <Route exact path="/sign-up" element={<SignUp />} />
        <Route exact path="/about" element={<About />} />
        <Route path="/listing/:listingId" element={<ListingItem />} />
        <Route path="/search" element={<Search />} />
        <Route path="" element={<PrivateRoute />}>
          <Route exact path="/profile" element={<Profile />} />
          <Route
            exact
            path="/profile/create-listing"
            element={<CreateListing />}
          />
          <Route exact path="/update-listing/:id" element={<UpdateListing />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}
