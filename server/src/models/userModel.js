const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
    },
  ],
  likedStories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
