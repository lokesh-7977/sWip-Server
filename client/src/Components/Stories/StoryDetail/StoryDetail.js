import React, { useEffect, useState } from "react";
import styles from "./StoryDetail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, openModal } from "../../Redux Slice/ModalSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StorySlider from "../StorySlider/StorySlider";
import Loader from "../../miscellaneous/SpinLoaders/SpinLoader";
import shareIcon from "../../../assets/share.svg";
import { likeStory, bookmarkStory, getStory } from "../../ReduxAPI/Stories_API";

const ViewStory = () => {
  const dispatch = useDispatch();
  const { story, storyLoading, liked: likedState, bookmarked: bookmarkedState, totalLikes, newLike } = useSelector((state) => state.story);
  const { isAuthenticated, userId, loading } = useSelector((state) => state.auth);
  const { id } = useParams();
  const storyId = id;
  const navigate = useNavigate();

  const [localLiked, setLocalLiked] = useState(() => {
    const localLikedValue = localStorage.getItem(`liked_${storyId}`);
    return localLikedValue !== null ? JSON.parse(localLikedValue) : likedState;
  });

  const [localBookmarked, setLocalBookmarked] = useState(() => {
    const localBookmarkedValue = localStorage.getItem(`bookmarked_${storyId}`);
    return localBookmarkedValue !== null ? JSON.parse(localBookmarkedValue) : bookmarkedState;
  });

  const [localNewLike, setLocalNewLike] = useState(newLike);
  const [hasUserLiked, setHasUserLiked] = useState(false);
  const [hasUserBookmarked, setHasUserBookmarked] = useState(false);

  useEffect(() => {
    if (!loading) {
      handleFetchStory();
    }
    dispatch(openModal("VIEW_STORY"));
    return () => dispatch(closeModal());
  }, [isAuthenticated, dispatch, loading]);

  useEffect(() => {
    // Update localLiked and localBookmarked when the liked and bookmarked states change
    setLocalLiked(likedState);
    setLocalBookmarked(bookmarkedState);
  }, [likedState, bookmarkedState]);

  const handleFetchStory = async () => {
    dispatch(getStory(storyId, userId));
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/");
      dispatch(openModal("LOGIN"));
    } else {
      if (!localLiked && !hasUserLiked) {
        await dispatch(likeStory(storyId, userId, "red"));
        setLocalLiked(true);
        setLocalNewLike(true);
        setHasUserLiked(true);
        localStorage.setItem(`liked_${storyId}`, JSON.stringify(true));
      } else {
        if (!hasUserLiked) {
          toast.warning("You have already liked this story", {
            position: "top-right",
          });
        }
      }
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate("/");
      dispatch(openModal("LOGIN"));
    } else {
      if (!localBookmarked && !hasUserBookmarked) {
        await dispatch(bookmarkStory(storyId, userId));
        setLocalBookmarked(true);
        setHasUserBookmarked(true);
        localStorage.setItem(`bookmarked_${storyId}`, JSON.stringify(true));
      } else {
        if (!hasUserBookmarked) {
          toast.warning("You have already bookmarked this story", {
            position: "top-right",
          });
        }
      }
    }
  };

  const handleShareStory = () => {
    const url = window.location.href;
    window.navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Copied to clipboard successfully!", {
          position: "top-center",
        });
      })
      .catch((error) => {
        toast.error("Failed to copy to clipboard:", { position: "top-center" });
      });
  };

  if (storyLoading || loading) {
    return <Loader />;
  }

  return (
    <div className={`${styles.view_story_container}`}>
      <div className={`${styles.view_story} `}>
        <div className={`${styles.story_btns} ${styles.story_btns_1}`}>
          <div className={styles.close_btn} onClick={() => navigate("/")}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 17L-1 -1M17 -1L-1 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className={styles.share_btn} onClick={handleShareStory}>
            <img src={shareIcon} alt="share" />
          </div>
        </div>
        <StorySlider slides={story && story.slides} />
        <div className={`${styles.story_btns} ${styles.story_btns_2}`}>
          <div className={styles.bookmark}>
            <svg
              onClick={() => handleBookmark()}
              width="20"
              height="25"
              viewBox="0 0 20 25"
              fill={localBookmarked ? "blue" : "white"}
              xmlns="http://www.w3.org/2000/svg"
              key={localBookmarked ? "bookmarked" : "not-bookmarked"}
            >
              <path
                d="M19.1795 24.5071L9.58974 17.3148L0 24.5071V0H19.1795V24.5071Z"
                fill={localBookmarked ? "blue" : "white"}
              />
            </svg>
          </div>
          <div className={styles.like}>
            <svg
              onClick={() => handleLike()}
              width="36"
              height="27"
              viewBox="0 0 36 27"
              fill={localLiked ? "red" : "white"}
              xmlns="http://www.w3.org/2000/svg"
              key={localLiked ? "liked" : "not-liked"}
            >
              <path
                d="M14.207 26.0699L12.147 24.1946C4.83039 17.5599 0 13.1699 0 7.81387C0 3.42389 3.4381 0 7.81386 0C10.2859 0 12.6585 1.15077 14.207 2.95506C15.7556 1.15077 18.1282 0 20.6002 0C24.976 0 28.4141 3.42389 28.4141 7.81387C28.4141 13.1699 23.5837 17.5599 16.267 24.1946L14.207 26.0699Z"
                fill={localLiked ? "red" : "white"}
              />
            </svg>
            <p className={styles.totalLikes}>
              {totalLikes + (localLiked ? 1 : 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStory;
