const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// connect to MongoDB Cloud
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB error", err));

// import routes
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
//app middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(cors());
if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: `http://localhost:3000` }));
}

// middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/api/`);
});
