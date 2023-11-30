const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkRequiredFields = (fields) => {
  return fields.some((field) => !field);
};

const generateToken = (username) => {
  return jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

const loadedUser = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (user) {
      res.json({ success: true, username, userId: user._id, user });
    } else {
      res.status(400).json("User does not exist");
    }
  } catch (error) {
    next(new Error("Error getting user"));
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (checkRequiredFields([username, password])) {
      return res.status(400).json("Please provide username and password");
    }

    const existedUser = await User.findOne({ username });

    if (existedUser) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    const token = generateToken(username);
    res.cookie("token", token, { httpOnly: true, strict: true, secure: true });

    res.status(201).json({
      success: true,
      token,
      username,
      userId: user._id,
      user,
    });
  } catch (error) {
    next(new Error("Error registering user"));
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (checkRequiredFields([username, password])) {
      return res.status(400).json("Please provide username and password");
    }

    const user = await User.findOne({ username });

    if (!user) {
      res.status(400).json("User does not exist");
    } else {
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res.status(400).json("Invalid credentials");
      }

      const token = generateToken(username);
      res.cookie("token", token, { httpOnly: true, secure: true });

      res.status(200).json({
        success: true,
        token,
        username,
        userId: user._id,
        user,
      });
    }
  } catch (error) {
    next(new Error("Error logging in user"));
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(new Error("Error logging out user"));
  }
};

module.exports = {
  register,
  login,
  logoutUser,
  loadedUser,
};
