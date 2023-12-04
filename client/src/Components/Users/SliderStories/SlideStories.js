import React from "react";
import styles from "./SliderStories.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getStoriesByUser } from "../../ReduxAPI/Stories_API";
import { useSelector } from "react-redux";
import Story from "../../Stories/StoryCards/StoryCard";
import Loader from "../../miscellaneous/SpinLoaders/SpinLoader";
import Button from "../../miscellaneous/Buttons/Buttons";

const Stories = () => {
  const navigate = useNavigate();
  const { userStories, storiesLoading } = useSelector((state) => state.story);
  const { userId, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStoriesByUser(userId));
    //eslint-disable-next-line
  }, []);

  if (!isAuthenticated) {
    return <h1 className={styles.heading}>Please Login to see your Stories</h1>;
  }

  if (storiesLoading) {
    return <Loader></Loader>;
  }

  return (
    <div>
      <h1 className={styles.heading}>Your Stories</h1>
      <div className={styles.Stories}>
        {userStories &&
          userStories.map((story) => <Story story={story} key={story._id} />)}

        {userStories.length === 0 && (
          <div className={styles.noMyStories}>
            <h1 className={styles.noStoryHeading}>
              You have not added any stories yet!
            </h1>
            <Button text={"Go to Home"} myFunction={() => navigate("/")} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
