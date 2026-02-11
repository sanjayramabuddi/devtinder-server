const { validateCredentials } = require("./utils/validate");
const { authUser } = require("./middlewares/auth");
const User = require("./model/user");
const dbConnect = require("./config/database");
const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();
const SALT = 10;

app.use(cookieParser());
app.use(express.json());

app.post("/signup", async (req, res) => {
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
    } = req.body;

    validateCredentials(firstName, lastName, emailId, password);

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

app.post("/login", async (req, res) => {
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

app.get("/feed", authUser, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(401).json({
      message: "Invalid Credentials",
    });
  }
});

dbConnect()
  .then(() => {
    console.log("Database connection successfull!!");
    app.listen(3000, () => {
      console.log("Server started on Port 3000");
    });
  })
  .catch((err) => {
    console.log("Something went wrong, ", err);
  });
