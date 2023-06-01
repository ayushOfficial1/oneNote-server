const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");


const SEC_KEY = "we are the warriors that build this town";

const createToken = (user) => {
  return jwt.sign({ id: user._id }, SEC_KEY, { expiresIn: "3d" });
};

router.get("/", (req, res) => {
  res.send("authworkingfine");
});

router.post("/", async (req, res) => {
  let { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      res.json({ msg: "All fields are required" });
    } else if (!validator.isEmail(email)) {
      res.json({ msg: "Invalid Email" });
    } else if (name.length < 3) {
      res.json({ msg: "Name must be at least 3 characters long" });
    } else if (password.length < 6) {
      res.json({ msg: "Password must be at least 6 characters long" });
    } else {
      bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
          res.json({err})
        }

        const user = new User({ name, email, password: hash });
        const result = await user.save();
        result && res.json({ status: true, msg: "New User Created" });
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      res.json({ msg: "Email already in use" });
    } else {
      console.log(error);
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = createToken(user);
        res.json({ status: true, msg: `Welcome! ${user.name}`, token: token });
      } else {
        res.json({ msg: "Incorrect Password!" });
      }
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.get("/getUser", fetchUser, async (req, res) => {
  const userId = req.body.userId;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    res.status(500).send("Something Went Wrong!");
  }
  res.status(200).json({ user });
});

module.exports = router;
