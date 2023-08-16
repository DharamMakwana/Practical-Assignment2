// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { createClient } = require("redis");
const session = require("express-session");

const redisClient = createClient({
  password: "ei0dzkorpt4ImgTxuUTCXHN8zc5SdK7h",
  socket: {
    host: "redis-12471.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 12471,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async (app) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await redisClient.connect();
    app.listen(PORT, () => console.log("Server running on " + PORT));
  } catch (error) {
    console.log(error);
  }
};

// Redis setup

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Start the server
startServer(app);

module.exports = { redisClient };
