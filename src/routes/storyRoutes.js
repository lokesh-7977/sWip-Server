const { Router } = require("express");
const router = Router();

const {
  createStory,
  getStories,
  getStoryById,
  updateStory,
} = require("../controllers/storyController.js");

const { likeStory } = require("../controllers/storyLikesController.js");

router.route("/create").post(createStory);
router.route("/getallStories").get(getStories);
router.route("/id/:storyId").get(getStoryById);
router.route("/update/:id").put(updateStory);
router.route("/like/:id").put(likeStory);

module.exports = router;
