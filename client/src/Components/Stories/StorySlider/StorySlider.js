import React, { useState, useEffect } from "react";
import styles from "./StorySlider.module.css";
import Progress from "./Progress";
import Slide from "./Slide";
import reloadImg from "../../../assets/reload (1).png";
import { useSelector } from "react-redux";
import arrow from "../../../assets/arrow.png";

const StorySlider = ({ slides }) => {

  const [reload, setReload] = useState(false);
  const isSmallScreen = useSelector((state) => state.pattern);

  // Extract image URLs from the slides
  const images = slides && slides.map((slide) => slide.imageUrl);

  // Initialize progress bars for each image
  const progress = images && images.map((_, index) => {
    return { id: index, progress: 0, image: images[index], completed: false };
  });

  // State variables for progress bars and current image index
  const [progressBars, setProgressBars] = useState(progress);
  const [imgIndex, setImgIndex] = useState(0);

  // Interval to update progress bars
  let interval;

  // Effect to start interval when component mounts
  useEffect(() => {
    const interval = setInterval(() => {
      updateProgress(imgIndex);
    }, 50);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [imgIndex, images]);

  // Function to update progress bars
  const updateProgress = (barIndex) => {
    setProgressBars((prevProgressBars) => {
      const newProgressBars = [...prevProgressBars];
      newProgressBars[barIndex].progress += 0.5;

      if (newProgressBars[barIndex].progress >= 100) {
        newProgressBars[barIndex].progress = 0;
        newProgressBars[barIndex].completed = true;

        if (barIndex !== images.length - 1) {
          setImgIndex((prevIndex) => (prevIndex + 1) % images.length);
          newProgressBars[barIndex + 1].completed = false;
        } else {
          clearInterval(interval);
        }
      }
      return newProgressBars;
    });
  };

  // Function to handle button clicks
  const handleBtns = (value) => {
    setProgressBars(progress);
    progressBars[imgIndex].progress = 0;

    if (value === "next") {
      if (reload || imgIndex === images.length - 1) {
        setImgIndex(0);
        setReload(!reload);
      } else {
        setImgIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    } else {
      if (imgIndex !== 0) {
        setImgIndex((prevIndex) => (prevIndex - 1) % images.length);
      }
    }
    
    updateProgress(imgIndex);
  };

  return (
    <div className={styles.imageSlider}>
      {/* Buttons for navigation */}
      <div className={styles.buttons}>
        <button className={styles.prevBtn} onClick={() => handleBtns("prev")}>
          {/* Arrow icon for previous button */}
          <img
            src={arrow}
            alt="<"
            style={{
              transform: "rotate(180deg)",
              width: isSmallScreen ? "1rem" : "1.5rem",
            }}
          />
        </button>
        <button className={styles.nextBtn} onClick={() => handleBtns("next")}>
          {/* Arrow or reload icon for next button */}
          {reload ? (
            <img src={reloadImg} alt="reload" style={{ width: isSmallScreen ? "1rem" : "1.5rem" }} />
          ) : (
            <img
              src={arrow}
              alt=">"
              style={{ width: isSmallScreen ? "1rem" : "1.5rem" }}
            />
          )}
        </button>
      </div>

      {/* Progress bar component */}
      <Progress images={images} progressBars={progressBars} />

      {/* Image slider component */}
      <Slide slides={slides} imgIndex={imgIndex} />
    </div>
  );
};

export default StorySlider;