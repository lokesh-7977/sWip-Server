import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Categories from "../Components/Stories/Categories/Category.js";
import Stories from "../Components/Stories/StoryList/StoryList.js";
import {
  getStoriesByCategory,
  getStories,
  getStoriesByUser,
} from "../Components/ReduxAPI/Stories_API.js";
import { categories } from "../ReduxConstants.js";
import Loader from "../Components/miscellaneous/SpinLoaders/SpinLoader.js";
import { endRequest } from "../Components/Redux Slice/StorySlice.js";

const Home = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const {
    storiesLoading,
    categoryLoading,
    newStory,
    userStoriesPage,
    newLike,
  } = useSelector((state) => state.story);

  // State to manage the selected category
  const [category, setCategory] = useState("All");

  // Effect to fetch stories based on the selected category
  useEffect(() => {
    const fetchStories = async () => {
      if (category !== "All") {
        await dispatch(getStoriesByCategory(category, 1));
      } else {
        await dispatch(getStories(1));
      }
    };

    fetchStories();
  }, [category, dispatch]);

  // Effect to fetch data when a new story is added
  useEffect(() => {
    const fetchData = async () => {
      if (newStory) {
        await dispatch(getStories(1));
        await dispatch(getStoriesByUser(userId, userStoriesPage));
        dispatch(endRequest());
      }
    };

    fetchData();
  }, [newStory, userId, userStoriesPage, dispatch]);

  // Effect to handle the case when a new like is received
  useEffect(() => {
    if (newLike) {
      dispatch(endRequest());
    }
  }, [newLike, dispatch]);

  // Handle click on a category
  const handleCategoryClick = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  return (
    <>
      {/* Render Categories component */}
      <Categories
        categories={categories}
        handleCategoryClick={handleCategoryClick}
        selectedCategory={category}
      />

      {/* Render Stories component based on the selected category */}
      {!storiesLoading && <Stories category={category} />}

      {/* Display loader while stories are loading */}
      {storiesLoading && <Loader />}

      {/* Display loader while category is loading */}
      {categoryLoading && <Loader />}
    </>
  );
};

export default Home;
