import React, { useEffect, useState } from "react";
import SlideForm from "./SlideForm.js";
import styles from "./StoryForm.module.css";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../Redux Slice/ModalSlice.js";
import { toast } from "react-toastify";
import axios from "axios";
import { ADD_STORY } from "../../../ReduxConstants";
import Button from "../../miscellaneous/Buttons/Buttons.js";
import {
  createStoryFailure,
  createStoryRequest,
  createStorySuccess,
} from "../../Redux Slice/StorySlice.js";

const StoryForm = () => {
  const dispatch = useDispatch();
  const { modalContent } = useSelector((state) => state.modal);
  const { user } = useSelector((state) => state.auth);
  const isSmallScreen = useSelector((state) => state.pattern);

  const initialSlide = {
    heading: "",
    description: "",
    imageUrl: "",
    category: "",
  };

  const [slides, setSlides] = useState([
    initialSlide,
    initialSlide,
    initialSlide,
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("currentSlide", currentSlide);
  }, [currentSlide]);

  useEffect(() => {
    if (slides.length > 6) {
      setError("Please remove slides");
    }
    if (slides.length < 3) {
      setError("Please add slides");
    }
  }, [slides]);

  const handleValidate = (name, value) => {
    if (name === "category" && value === "") {
      setError("Please select a category");
    } else if (name === "imageUrl" && value === "") {
      setError("Please add an image URL");
    } else if (name === "description" && value === "") {
      setError("Please add a description");
    } else if (name === "heading" && value === "") {
      setError("Please add a heading");
    } else {
      setError("");
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    handleValidate(name, value);

    setSlides((prevSlides) =>
      prevSlides.map((slide, i) =>
        i === index ? { ...slide, [name]: value } : slide
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const isValid = slides.some((slide, index) => {
        if (
          Object.keys(slide).length === 0 ||
          slide.heading?.trim() === "" ||
          slide.description?.trim() === "" ||
          slide.imageUrl?.trim() === "" ||
          slide.category?.trim() === ""
        ) {
          setError("Please fill out all fields");
        }
        return (
          Object.keys(slide).length === 0 ||
          slide.heading?.trim() === "" ||
          slide.description?.trim() === "" ||
          slide.imageUrl?.trim() === "" ||
          slide.category?.trim() === ""
        );
      });

      if (isValid) {
        return;
      }

      if (slides.length < 3) {
        setError("Please add at least 3 slides");
        return;
      } else if (slides.length > 6) {
        setError("Please remove slides");
        return;
      }

      dispatch(createStoryRequest());

      const response = await axios.post(`/api/story/create`, {
        slides,
        addedBy: user,
      });

      if (response.data.success) {
        toast.success("Story created successfully", {
          position: "top-center",
        });
      }

      dispatch(createStorySuccess());
      dispatch(closeModal());
    } catch (error) {
      dispatch(createStoryFailure());
      console.error(error);
      toast.error("Error creating story", { position: "top-center" });
    }
  };

  const handleAddSlide = () => {
    if (slides.length < 6) {
      setSlides((prevSlides) => [...prevSlides, {}]);
      setCurrentSlide(slides.length);
    }
  };

  const handleRemoveSlide = (index) => {
    if (slides && slides.length > 3) {
      setSlides((prevSlides) => prevSlides.filter((_, i) => i !== index));
      setCurrentSlide(Math.max(currentSlide - 1, 0));
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handlePrevClick = () => {
    setCurrentSlide((prevSlide) => Math.max(prevSlide - 1, 0));
  };

  const handleNextClick = () => {
    setCurrentSlide((prevSlide) => Math.min(prevSlide + 1, slides.length - 1));
  };

  return (
    <div
      className={`${styles.storyForm} ${
        isSmallScreen ? styles.storyFormSmall : ""
      }`}
      style={{ display: modalContent === ADD_STORY ? "flex" : "none" }}
    >
      {/* SLIDE BOXES */}
      <div className={styles.storySlideContainer}>
        {slides.map((_, index) => (
          <div
            key={index}
            className={styles.slideBox}
            onClick={() => setCurrentSlide(index)}
            style={{
              border: currentSlide === index ? "2px solid #73ABFF" : "none",
            }}
          >
            Slide {index + 1}
          </div>
        ))}
        <div
          className={styles.slideBox}
          onClick={handleAddSlide}
          style={{ cursor: "pointer" }}
        >
          Add +
        </div>
      </div>

      {/* CLOSE FORM ICON */}
      <svg
        className={styles.storyClose}
        onClick={handleClose}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 0C5.38341 0 0 5.38341 0 12C0 18.6166 5.38341 24 12 24C18.6166 24 24 18.6166 24 12C24 5.38341 18.6166 0 12 0ZM12 1.84615C17.6178 1.84615 22.1538 6.38221 22.1538 12C22.1538 17.6178 17.6178 22.1538 12 22.1538C6.38221 22.1538 1.84615 17.6178 1.84615 12C1.84615 6.38221 6.38221 1.84615 12 1.84615ZM8.50962 7.18269L7.18269 8.50962L10.6731 12L7.18269 15.4904L8.50962 16.8173L12 13.3269L15.4904 16.8173L16.8173 15.4904L13.3269 12L16.8173 8.50962L15.4904 7.18269L12 10.6731L8.50962 7.18269Z"
          fill="#FF0000"
        />
      </svg>

      {/* SLIDE FORM */}
      <div className={styles.slideFormContainer}>
        {slides.map((slide, slideIndex) => (
          <React.Fragment key={slideIndex}>
            {slideIndex === currentSlide && (
              <SlideForm
                slide={slide}
                slideIndex={slideIndex}
                handleChange={(e) => handleChange(e, slideIndex)}
                handleRemoveSlide={() => handleRemoveSlide(slideIndex)}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ERROR MESSAGE */}
      <span className={styles.form_err}>{error}</span>

      {/* BUTTONS */}
      <div className={styles.buttons}>
        <Button
          myFunction={handlePrevClick}
          color="#7eff73"
          text="Previous"
          size="small"
        />
        <Button
          myFunction={handleNextClick}
          color="#73abff"
          text="Next"
          size="small"
        />
        {slides.length > 3 ? (
          <Button
            myFunction={() => handleRemoveSlide(currentSlide)}
            color="#ff73b5"
            text="Remove"
            size="small"
          />
        ) : (
          <div style={{ width: "30%" }} />
        )}
        <Button myFunction={handleSubmit} text="Post" size="small" />
      </div>
    </div>
  );
};

export default StoryForm;
