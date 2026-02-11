const dbConnection = require("./config/database");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/profileRoutes");
// const connectionRouter = require("./routes/connectionRoutes");

app.use("/", authRouter);
app.use("/", profileRouter);
// app.use("/", connectionRouter);

dbConnection()
  .then(() => {
    console.log("Database connection successfull!!");
    app.listen(3000, () => {
      console.log("Server started on Port 3000");
    });
  })
  .catch((err) => {
    console.log("Something went wrong, ", err);
  });
