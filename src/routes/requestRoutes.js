const express = require("express");
const requestRouter = express.Router();

const mongoose = require("mongoose");

const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");

// Swiping right or left to send interested or ignored to the user
requestRouter.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const fromUser = req.user._id;
      const toUser = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(401).json({
          message: "Status type is not accepted",
        });
      }

      const verifyToUser = await User.findById(toUser);
      if (!verifyToUser) {
        return res.status(404).json({
          message: "User do not exist",
        });
      }

      const duplicateRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUser, toUserId: toUser },
          { toUserId: fromUser, fromUserId: toUser },
        ],
      });
      if (duplicateRequest) {
        return res.status(401).json({
          message: "Cannot send the same request again",
        });
      }

      const connection = new ConnectionRequest({
        fromUserId: fromUser,
        toUserId: toUser,
        status,
      });

      const connectionData = await connection.save();
      res.status(201).json({
        message: "Request sent successfully",
        connectionData,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Sending request failed!! " + error.message,
      });
    }
  },
);

// Accepting or Rejecting the received connections
requestRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(404).json({
          message: "Status not allowed",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({
          message: "Invalid request ID",
        });
      }

      const reviewConnection = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!reviewConnection) {
        return res.status(404).json({
          message: "No requests found for you",
        });
      }

      reviewConnection.status = status;

      const data = await reviewConnection.save();
      res.status(200).json({
        message: `Request ${status} successfully`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
);

module.exports = requestRouter;
