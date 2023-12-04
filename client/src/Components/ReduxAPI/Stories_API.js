import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createStoryRequest,
  createStorySuccess,
  createStoryFailure,
  getStoriesRequest,
  getStoriesSuccess,
  getStoriesFailure,
  getBookmarksRequest,
  getBookmarksSuccess,
  getBookmarksFailure,
  fetchStoryRequest,
  fetchStorySuccess,
  fetchStoryFailure,
  bookmarkRequest,
  bookmarkSuccess,
  bookmarkFailure,
  likeSuccess,
  likeFailure,
  getStoryByUserRequest,
  getStoryByUserSuccess,
  getStoryByUserFailure,
  getCategoryStoriesSuccess,
  getCategoryStoriesFailure,
  getCategoryStoriesRequest,
  editStorySuccess
} from "../Redux Slice/StorySlice.js";

// Axios configurations
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = false;

// CREATE STORY
export const createStory = (values) => async (dispatch) => {
  try {
    dispatch(createStoryRequest());
    const { data } = await axios.post("/api/story/create", values);
    dispatch(createStorySuccess(data));
    toast.success("Story created successfully", { position: "top-center" });
  } catch (error) {
    dispatch(createStoryFailure());
    toast.error(error.response.data, { position: "top-center" });
  }
};
export const editStory = (storyId, values) => async (dispatch) => {
  try {
    dispatch(createStoryRequest());
    await axios.put(`/api/story/update/${storyId}`, values);
    dispatch(editStorySuccess());
    toast.success("Story edited successfully", { position: "top-center" });
  } catch (error) {
    dispatch(createStoryFailure());
    toast.error(error.response.data, { position: "top-center" });
  }
};

// GET STORIES
export const getStories =
  (page = 1, catLimit = 4, cat = "All") =>
  async (dispatch) => {
    try {
      dispatch(getStoriesRequest());
      const { data } = await axios.get(
        `/api/story/getallStories?category=All&page=${page}&catLimit=${catLimit}&cat=${cat}`
      );
      dispatch(getStoriesSuccess(data));
    } catch (error) {
      dispatch(getStoriesFailure());
      toast.error(error.response.data);
    }
  };

// FETCH STORIES
export const getStory = (storyId, userId) => async (dispatch) => {
  try {
    dispatch(fetchStoryRequest());
    const { data } = await axios.get(
      `/api/story/id/${storyId}?userId=${userId ?? ""}`
    );
    dispatch(fetchStorySuccess(data));
  } catch (error) {
    dispatch(fetchStoryFailure());
    toast.error(error.response.data);
  }
};

// FETCH STORY BY USER
export const getStoriesByUser =
  (userId, userStoriesPage = 1) =>
  async (dispatch) => {
    try {
      dispatch(getStoryByUserRequest());
      const { data } = await axios.get(
        `/api/story/getallStories?pk=${userId}&page=${userStoriesPage}`
      );
      dispatch(getStoryByUserSuccess(data));
    } catch (error) {
      dispatch(getStoryByUserFailure());
      toast.error(error.response.data);
    }
  };

// FETCH STORY BY CATEGORY
export const getStoriesByCategory =
  (category, page = 1) =>
  async (dispatch) => {
    try {
      dispatch(getCategoryStoriesRequest());
      const { data } = await axios.get(
        `/api/story/getallStories?category=${category}&page=${page}`
      );
      dispatch(getCategoryStoriesSuccess(data));
    } catch (error) {
      dispatch(getCategoryStoriesFailure());
      toast.error(error.response.data);
    }
  };

// LIKE STORIES
export const likeStory = (id, userId) => async (dispatch) => {
  try {
    const { data } = await axios.post(`/api/story/like/${id}`, { userId });
    dispatch(likeSuccess(data));
    toast.success("Story liked successfully", { position: "top-center" });
  } catch (error) {
    dispatch(likeFailure());
    toast.error(error.response.data.message, { position: "top-center" });
  }
};

// FETCH BOOKMARKS
export const getBookmarks = (userId) => async (dispatch) => {
  try {
    if (!userId) {
      throw new Error("User ID is required"); // Or handle it in a way that makes sense for your application
    }

    dispatch(getBookmarksRequest());

    const { data } = await axios.get(`/auth/bookmarks/${userId}`);
    dispatch(getBookmarksSuccess(data.bookmarks));
  } catch (error) {
    console.log(userId + ": " + error.message);
    dispatch(getBookmarksFailure());
    toast.error(`Failed to fetch bookmarks: ${error.message},${userId}`, {
      position: "top-right",
    });
  }
};

// BOOKMARKS STORY
export const bookmarkStory = (id, userId) => async (dispatch) => {
  try {
    dispatch(bookmarkRequest());

    const response = await axios.post(`/auth/bookmarks/${id}`, { userId });

    // Destructure data from response
    const { data } = response;

    dispatch(bookmarkSuccess(data.story));

    // Configurable toast messages
    toast.success("Story bookmarked successfully", { position: "top-right" });
  } catch (error) {
    console.error(`${userId}: ${error.message}`);

    // Dispatch failure inside the catch block
    dispatch(bookmarkFailure());

    // Configurable toast messages
    toast.error(`Failed to bookmark story: ${error}, ${userId}`, {
      position: "bottom-right",
    });
  }
};


