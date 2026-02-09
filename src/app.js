const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send("Welcome guys to backend");
});

app.listen(3000, () => {
  console.log("Server started on Port 3000");
});
