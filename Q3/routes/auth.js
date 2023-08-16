const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { createClient } = require("redis");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.userId = user._id.toString();
    res.redirect("/auth/dashboard");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, password: hashedPassword });

  // Store user data in Redis using simple key-value pairs
  const x = createClient({
    password: "ei0dzkorpt4ImgTxuUTCXHN8zc5SdK7h",
    socket: {
      host: "redis-12471.c264.ap-south-1-1.ec2.cloud.redislabs.com",
      port: 12471,
    },
  });

  x.on("connect", () => {
    x.set(
      `session-${username}`,
      JSON.stringify({ username, hashedPassword }),
      (err, reply) => {
        if (err) {
          console.error(err);
        } else {
          console.log(reply);
        }
        x.quit(); // Properly close the Redis client
      }
    );
  });

  res.redirect("/auth/login");
});

router.get("/dashboard", async (req, res) => {
  if (req.session.userId) {
    try {
      const newUser = await User.findById(req.session.userId);
      res.render("dashboard", { username: newUser.username });
    } catch (error) {
      console.error(error);
      res.redirect("/auth/login");
    }
  } else {
    res.redirect("/auth/login");
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
