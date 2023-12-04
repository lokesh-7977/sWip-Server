import React from "react";
import styles from "./Bookmarks.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getBookmarks } from "../../ReduxAPI/Stories_API";
import { useSelector } from "react-redux";
import Story from "../../Stories/StoryCards/StoryCard";
import Button from "../../miscellaneous/Buttons/Buttons";
import Loader from "../../miscellaneous/SpinLoaders/SpinLoader";

const Bookmarks = () => {
  const navigate = useNavigate();
  const { bookmarks, bookmarksLoading } = useSelector((state) => state.story);
  const { userId, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBookmarks(userId));
    //eslint-disable-next-line
  }, []);

  if (!isAuthenticated) {
    return (
      <h1 className={styles.heading}>Please Login to see your Bookmarks</h1>
    );
  }

  if (bookmarksLoading) {
    return <Loader></Loader>;
  }

  return (
    <div>
      <h1 className={styles.para}>Your Bookmarks</h1>
      <div className={styles.bookmarks_container}>
        {bookmarks &&
          bookmarks.map((bookmark, index) => (
            <Story story={bookmark} key={bookmark._id} />
          ))}

        {bookmarks.length === 0 && (
          <div className={styles.noBookmarks}>
            <h1 className={styles.noBookmark_heading}>
              You have no bookmarks!
            </h1>
            <Button className={"btnno"} text={"Go to Home"} myFunction={() => navigate("/")} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
