const express = require("express");
const userRouter = express.Router();

const { authUser } = require("../middlewares/auth");
const UserModel = require("../model/user");
const ConnectionRequestModel = require("../model/connectionRequest");

const USER_DATA = "firstName lastName about";

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Getting all the connections I have sent request to or received to me
    const allConnections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .select("fromUserId toUserId")
      .populate("fromUserId", USER_DATA)
      .populate("toUserId", USER_DATA);

    const data = allConnections.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUser._id.toString())
        return request.toUserId;
      return request.fromUserId;
    });
    res.status(200).json({
      message: "All connections",
      data,
    });
  } catch (error) {
    res.status(404).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

userRouter.get("/user/requests/received", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Getting all the requests I have received in my profile
    const receivedRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .select("fromUserId createdAt")
      .populate("fromUserId", USER_DATA);
    //   .populate("fromUserId", ["firstName", "lastName", "about"]);

    res.status(200).json({
      data: receivedRequests,
    });
  } catch (error) {
    res.status(404).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

userRouter.get("/user/feed", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let pageNo = parseInt(req.query.page) || 1;
    let limitFeed = parseInt(req.query.limit) || 10;

    limitFeed = limitFeed > 50 ? 50 : limitFeed;
    let skipFeed = (pageNo - 1) * limitFeed;

    // Finding all connection requests => sent + received
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    // Hiding these users from the feed
    const hidingUsersFromFeed = new Set(); // Set do not store duplicate entries
    connectionRequests.forEach((request) => {
      hidingUsersFromFeed.add(request.fromUserId.toString());
      hidingUsersFromFeed.add(request.toUserId.toString());
    });

    // Filtering from the Users Db to show only unique feed
    const usersToShow = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hidingUsersFromFeed) } }, // Converting Set to Array
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_DATA)
      .skip(skipFeed)
      .limit(limitFeed);

    res.send(usersToShow);
  } catch (error) {
    res.status(404).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = userRouter;
