const mongoose = require("mongoose");
const User = require("../models/userModel");
const Story = require("../models/storyModel");

const errorHandler = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

const bookmarkStory = async (req, res) => {
  const storyId = req.params.id;
  const { userId } = req.body;

  try {
    const [story, user] = await Promise.all([
      Story.findById(storyId).lean(),
      User.findById(userId).lean(),
    ]);

    if (!user) {
      return errorHandler(res, 404, "User not found");
    }

    if (user.bookmarks && user.bookmarks.includes(storyId)) {
      return res.status(400).json({
        error: "You have already bookmarked this story",
        bookmarked: true,
        story,
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      story.bookmarks.push(userId);
      await Story.findByIdAndUpdate(storyId, { bookmarks: story.bookmarks });

      if (!user.bookmarks) {
        user.bookmarks = [];
      }

      user.bookmarks.push(storyId);
      await User.findByIdAndUpdate(userId, { bookmarks: user.bookmarks });

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

    story.totalBookmarks = story.bookmarks.length;

    res.json({
      message: "Story bookmarked successfully",
      totalBookmarks: story.totalBookmarks,
      story,
      bookmarked: true,
      bookmarks: story.bookmarks,
    });
  } catch (error) {
    console.error(error);
    errorHandler(res, 500, "An error occurred");
  }
};

const getAllBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).lean();
    if (!user) {
      return errorHandler(res, 404, "User not found");
    }

    const bookmarks = await Story.find({ _id: { $in: user.bookmarks } }).sort({ createdAt: -1 }).lean();

    res.status(200).json({ bookmarks });
  } catch (error) {
    errorHandler(res, 500, "Error retrieving bookmarks");
  }
};

const removeBookmark = async (req, res) => {
  try {
    const { id: storyId } = req.params;
    const { userId } = req.body;

    const [user, story] = await Promise.all([
      User.findById(userId),
      Story.findById(storyId),
    ]);

    if (!user || !story) {
      return errorHandler(res, 404, !user ? "User not found" : "Story not found");
    }

    if (!user.bookmarks.includes(storyId)) {
      return res.status(400).json({ error: "Story is not bookmarked", bookmarked: false });
    }

    user.bookmarks = user.bookmarks.filter((id) => id !== storyId);
    await User.findByIdAndUpdate(userId, { bookmarks: user.bookmarks });

    story.bookmarks = story.bookmarks.filter((id) => id !== userId);
    await Story.findByIdAndUpdate(storyId, { bookmarks: story.bookmarks });

    res.status(200).json({
      message: "Bookmark removed successfully",
      bookmarks: user.bookmarks,
      bookmarked: false,
      story,
    });
  } catch (error) {
    errorHandler(res, 500, "Error removing bookmark");
  }
};

module.exports = {
  bookmarkStory,
  getAllBookmarks,
  removeBookmark,
};
