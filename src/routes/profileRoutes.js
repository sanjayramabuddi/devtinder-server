const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const { authUser } = require("../middlewares/auth");
const { validateEditUser } = require("../utils/validate");

profileRouter.get("/profile/view", authUser, (req, res) => {
  res.send(req.user);
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    if (!validateEditUser(req)) {
      return res.status(401).json({
        message: "Fields can't be updated",
      });
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key])); // .forEach() => doing (updating)

    await loggedInUser.save();
    res.status(201).json({
      message: "Fields updated successfully!!",
      data: loggedInUser,
    });
  } catch (error) {
    res.status(401).json({
      message: "Can't edit these fields",
    });
  }
});

profileRouter.post("/profile/password", authUser, async (req, res) => {
  try {
    const { password } = req.body;

    // if (password !== confirmPassword) {
    //   return res.status(400).json({
    //     message: "Passwords do not match",
    //   });
    // }
    const loggedInUser = req.user;

    const hashedPassword = await bcrypt.hash(password, 10);

    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    return res.status(201).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = profileRouter;
