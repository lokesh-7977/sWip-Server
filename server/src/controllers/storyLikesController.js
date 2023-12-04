const Story = require("../models/storyModel");
const User = require("../models/userModel");

// Helper function to handle errors and send a JSON response
const handleErrors = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

// Controller method to like a story
const likeStory = async (req, res) => {
  const storyId = req.params.id;
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId).lean();

    if (!user) {
      return handleErrors(res, 404, "User not found");
    }

    const likedStories = new Set(user.likes);

    if (likedStories.has(storyId)) {
      console.log("User has already liked this story");
      return res.status(400).json({
        error: "You have already liked this story",
        liked: true,
      });
    }

    const story = await Story.findById(storyId).lean();

    if (!story) {
      return handleErrors(res, 404, "Story not found");
    }

    const session = await Story.startSession();
    session.startTransaction();
    
    try {
      // Add the story to the liked stories set
      likedStories.add(storyId);

      // Update the user with the new liked stories set
      await User.findByIdAndUpdate(userId, { likes: Array.from(likedStories) });

      // Update the story with the new likes array
      story.likes.push(userId);
      await Story.findByIdAndUpdate(storyId, { likes: story.likes });

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
    });
  } catch (error) {
    console.error(error);
    handleErrors(res, 500, "An error occurred");
  }
};



// Controller method to get all likes for a story
const getAllLikes = async (req, res) => {
  const storyId = req.params.id;

  try {
    // Find the story and populate the 'likes' field with user details
    const story = await Story.findById(storyId).populate("likes").lean();

    // Check if the story is not found
    if (!story) {
      return handleErrors(res, 404, "Story not found");
    }

    // Extract relevant user details from the 'likes' field
    const likes = story.likes.map((like) => ({
      userId: like._id,
      // Add any other user details you want to include
    }));

    // Send a JSON response with the list of likes
    res.json({ likes });
  } catch (error) {
    console.error(error);
    handleErrors(res, 500, "An error occurred");
  }
};

module.exports = {
  likeStory,
  getAllLikes,
};
