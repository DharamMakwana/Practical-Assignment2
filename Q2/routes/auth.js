const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.render("login", { error: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    req.session.userId = user._id;
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

  const newUser = new User({
    username: username,
    password: hashedPassword,
  });

  await newUser.save();
  res.redirect("/auth/login");
});

router.get("/dashboard", async (req, res) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.render("dashboard", { username: user.username });
      } else {
        res.redirect("/auth/login");
      }
    } catch (error) {
      console.error(error);
      res.redirect("/auth/login");
    }
  } else {
    res.redirect("/auth/login");
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
    }
    res.redirect("/auth/login");
  });
});

module.exports = router;
