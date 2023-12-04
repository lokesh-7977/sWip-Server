const express = require("express");
const router = express.Router();
const userAuthController = require("../controllers/userAuthController");
const bookmarkController = require("../controllers/bookmarksControllers");

// Load User
router.get("/loaded/:username", userAuthController.loadedUser);

// Register User
router.post("/register", userAuthController.register);

// Login User
router.post("/login", userAuthController.login);

// Logout User
router.post("/logout", userAuthController.logoutUser);

// Bookmarks
router.post('/bookmarks/:id', bookmarkController.bookmarkStory);
router.delete('/bookmarks/:id', bookmarkController.removeBookmark);
router.get('/bookmarks/:userId', bookmarkController.getAllBookmarks);

module.exports = router;
