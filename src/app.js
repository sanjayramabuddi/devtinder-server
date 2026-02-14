const dbConnection = require("./config/database");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/profileRoutes");
const requestRouter = require("./routes/requestRoutes");
const userRouter = require("./routes/userRoutes");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

dbConnection()
  .then(() => {
    console.log("Database connection successfull!!");
    app.listen(process.env.PORT, () => {
      console.log("Server started on Port 3000");
    });
  })
  .catch((err) => {
    console.log("Something went wrong, ", err);
  });
