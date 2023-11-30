const mongoose = require("mongoose");
const Story = require("../models/storyModel");
const User = require("../models/userModel");

const handleErrors = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

const likeStory = async (req, res) => {
  const storyId = req.params.id;
  const { userId } = req.body; // Corrected destructuring
  const likeColor = "red"; // Set your desired color for the like

  try {
    const story = await Story.findById(storyId).lean();
    const user = await User.findById(userId).lean();

    // Check if the user has already liked the story
    if (user.likes && user.likes.includes(storyId)) {
      return res.status(400).json({
        error: "You have already liked this story",
        liked: true,
        story,
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      story.likes.push(userId);
      await Story.findByIdAndUpdate(storyId, { likes: story.likes, likeColor });

      if (!user.likes) {
        user.likes = [];
      }

      user.likes.push(storyId);
      await User.findByIdAndUpdate(userId, { likes: user.likes });

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

    story.totalLikes = story.likes.length;
    res.json({
      message: "Story liked successfully",
      totalLikes: story.totalLikes,
      story,
      liked: true,
      likes: story.likes,
      likeColor,
    });
  } catch (error) {
    console.error(error);
    handleErrors(res, 500, "An error occurred");
  }
};

module.exports = {
  likeStory,
};
