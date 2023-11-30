const Story = require("../models/storyModel");
const User = require("../models/userModel");

const errorHandler = (res, status, message) => {
  return res.status(status).json({ error: message });
};

const validateFields = (...fields) => {
  return fields.every((field) => field);
};

const getSortedAndLimitedStories = async (query, limit) => {
  return await Story.find(query).sort({ createdAt: -1 }).limit(limit);
};

const createStory = async (req, res, next) => {
  try {
    const { slides, addedBy } = req.body;
    if (!validateFields(slides, addedBy)) {
      return errorHandler(res, 400, "Please provide all the required fields");
    }

    const story = new Story({ slides, addedBy });
    await story.save();
    res.status(201).json({ success: true, story });
  } catch (error) {
    next(new Error("Error creating story"));
  }
};

const getStories = async (req, res, next) => {
  const categories = [
    "food",
    "health and fitness",
    "travel",
    "movie",
    "education",
  ];
  const { userId, category, catLimit, cat } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 4 * page;

  try {
    let stories = [];

    if (userId) {
      stories = await getSortedAndLimitedStories({ addedBy: userId }, limit);
    } else if (category && category.toLowerCase() === "all") {
      const groupedStories = {};

      await Promise.all(
        categories.map(async (c) => {
          const categoryStories = await getSortedAndLimitedStories(
            { slides: { $elemMatch: { category: c } } },
            cat === c ? catLimit : 4
          );
          groupedStories[c] = categoryStories;
        })
      );

      return res.status(200).json({ success: true, stories: groupedStories, page });
    } else {
      stories = await getSortedAndLimitedStories(
        { slides: { $elemMatch: { category: category } } },
        limit
      );
      return res.status(200).json({ success: true, stories, page });
    }

    res.status(200).json({ success: true, stories, page });
  } catch (error) {
    next(new Error("Error getting stories"));
  }
};

const getStoryById = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { userId } = req.query;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    let totalLikes = story.likes ? story.likes.length : 0;

    if (userId) {
      const user = await User.findById(userId);

      if (user) {
        const liked = user.likes && user.likes.includes(storyId);
        const bookmarked = user.bookmarks && user.bookmarks.includes(storyId);

        return res.status(200).json({
          success: true,
          story,
          liked: liked || false,
          bookmarked: bookmarked || false,
          totalLikes,
        });
      }
    } else {
      return res.status(200).json({ success: true, story, totalLikes });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error getting story" });
  }
};


const updateStory = async (req, res, next) => {
  try {
    const { slides, addedBy } = req.body;
    if (!validateFields(slides, addedBy)) {
      return errorHandler(res, 400, "Please provide all the required fields");
    }

    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { slides, addedBy },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json({ success: true, story });
  } catch (error) {
    next(new Error("Error updating story"));
  }
};

module.exports = {
  createStory,
  getStories,
  getStoryById,
  updateStory,
};
