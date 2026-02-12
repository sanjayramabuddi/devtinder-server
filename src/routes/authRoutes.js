const express = require("express");
const authRouter = express.Router();

const User = require("../model/user");
const bcrypt = require("bcrypt");
const { validateSignup } = require("../utils/validate");
const SALT = 10;

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      imageUrl,
      skills,
      about,
    } = req.body;

    validateSignup(firstName, lastName, emailId, password);

    const hashedPassword = await bcrypt.hash(password, SALT);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
      imageUrl,
      skills,
      about
    });

    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Error registering the user",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      res.status(404).json({
        message: "Invalid Data",
      });
    }

    const findUser = await User.findOne({ emailId });
    if (!findUser) {
      res.status(404).json({
        message: "Invalid Credentials",
      });
    }

    const verifyUser = await findUser.validatePassword(password);
    if (verifyUser) {
      const token = await findUser.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.status(201).json({
        message: "Login Succcessful",
        token: token,
      });
    } else {
      res.status(400).json({
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Something is not right",
      error: error.message,
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.json({
    message: "Logout Successfull",
  });
});

module.exports = authRouter;
