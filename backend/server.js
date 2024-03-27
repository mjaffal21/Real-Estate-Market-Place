const express = require("express");
const dotenv = require("dotenv").config({ path: "./.env" });
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const asyncHandler = require("./middlewares/asyncHandler");
const errorHandler = require("./middlewares/ErrorHandler");
const cors = require("cors");
const path = require("path");

const port = process.env.PORT;

connectDB();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const listRoute = require("./routes/listRoute");
const uploadsRoute = require("./routes/uploadRoute");

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listings", listRoute);
app.use("/api/uploads", uploadsRoute);

const __dir = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use("/uploads", express.static("/var/data/uploads"));
  // set static folder
  app.use(express.static(path.join(__dir, "/frontend/build")));
  // any route that is not api will be redirected to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dir, "frontend", "build", "index.html"));
  });
} else {
  app.use("/uploads", express.static(path.join(__dir, "/uploads")));
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(asyncHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
