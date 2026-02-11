const User = require("../model/user");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {
    const { token } = req?.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Token missing",
      });
    }

    const decoded = jwt.verify(token, "Devtinder@123");

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

module.exports = {
  authUser,
};
