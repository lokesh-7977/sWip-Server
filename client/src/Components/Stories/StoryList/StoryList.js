import React, { useEffect } from "react";
import styles from "./StoryList.module.css";
import Story from "../StoryCards/StoryCard";
import { useDispatch, useSelector } from "react-redux";
import {
  getStories,
  getStoriesByCategory,
  getStoriesByUser,
} from "../../ReduxAPI/Stories_API";
import StoryLoader from "../../../Components/miscellaneous/SpinLoaders/StoryLoader";
import Button from "../../../Components/miscellaneous/Buttons/Buttons";

const Stories = ({ category }) => {
  const dispatch = useDispatch();
  const {
    stories,
    categoryStories,
    userStories,
    newStory,
    userStoriesPage,
    categoryLoading,
    storiesLoading,
  } = useSelector((state) => state.story);
  const isSmallScreen = useSelector((state) => state.pattern);
  const { userId, isAuthenticated } = useSelector((state) => state.auth);
  const page = useSelector((state) => state.story.page) || 1;

  const categoryLimits = {
    Food: 4,
    Travel: 4,
    Health: 4,
    Movie: 4,
    Education: 4,
  };

  useEffect(() => {
    // Fetch stories when the component mounts
    if (!stories && category === "All") {
      // Fetch all stories for all categories
      Object.keys(categoryLimits).forEach((cat) => {
        dispatch(getStoriesByCategory(page, categoryLimits[cat], cat));
      });
    } else if (!stories && category !== "All") {
      // Fetch stories for a specific category when category is not "All"
      dispatch(getStoriesByCategory(page, categoryLimits[category], category));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, dispatch, page, stories, categoryLimits]);

  useEffect(() => {
    // Refetch all stories if a new story is added
    if (newStory) {
      Object.keys(categoryLimits).forEach((cat) => {
        dispatch(getStoriesByCategory(page, categoryLimits[cat], cat));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, newStory, page, categoryLimits]);

  useEffect(() => {
    // Fetch user stories if the user is authenticated
    if (isAuthenticated && !userStories && userId) {
      dispatch(getStoriesByUser(userId, userStoriesPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAuthenticated, userId, userStories, userStoriesPage]);

  // Helper function to render stories and pagination button
  const moveStories = (storyArray, isLoading, pageFunction) => (
    <>
      {/* Rendering stories or story loaders based on the loading state */}
      <div
        className={`${styles.storiesMain} ${
          isSmallScreen ? styles.stories_mob : ""
        }`}
      >
        {storyArray &&
          storyArray.map((story) =>
            isLoading ? (
              <StoryLoader key={story._id} />
            ) : (
              <Story key={story._id} story={story} />
            )
          )}
      </div>
      {/* Pagination button */}
      {storyArray && storyArray.length >=3 && (
        <div
          style={{
            width: "100%",
            display: "inline-flex",
            justifyContent: "center",
          }}
        >
          <Button text="See more..." myFunction={pageFunction}></Button>
        </div>
      )}
    </>
  );

  // Helper function to render user stories
  const runUserStories = () => (
    <>
      {userStories && userStories.length > 0 && (
        <h2 className={styles.storiesHeading}>Your Stories</h2>
      )}
      {moveStories(userStories, false, () =>
        dispatch(getStoriesByUser(userId, userStoriesPage + 1))
      )}
    </>
  );

  return (
    <div className={styles.storiesContainerMain}>
      {category === "All" && (
        <>
          {isAuthenticated && runUserStories()}
          {Object.keys(stories).map(
            (key) =>
              stories[key].length > 0 && (
                <div key={key}>
                  <h2 className={styles.storiesHeading}>
                    Top Stories About {key === "all" ? "All Categories" : key}
                  </h2>
                  {moveStories(stories[key], storiesLoading, () => {
                    categoryLimits[key] = categoryLimits[key] + 4;
                    dispatch(getStories(page + 1, categoryLimits[key], key));
                  })}
                </div>
              )
          )}
        </>
      )}

      {category !== "All" && (
        <div>
          <h2 className={styles.storiesHeading}>
            Top Stories About {category}
          </h2>
          {moveStories(categoryStories, categoryLoading, () =>
            dispatch(getStoriesByCategory(category, page + 1))
          )}

          {categoryStories.length <= 0 && (
            <h1 className={styles.nothing}>No stories found!</h1>
          )}
        </div>
      )}
    </div>
  );
};

export default Stories;
