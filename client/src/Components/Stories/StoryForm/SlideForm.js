import React from "react";
import styles from "./StoryForm.module.css";

import { categories } from "../../../ReduxConstants";

const SlideForm = ({ slide, slideIndex, handleChange }) => {
  return (
    <div className={styles.slideForm}>
      <div className={styles.slideFormContent}>
        <div className={styles.inputContainer}>
          <label className={styles.slideFormLabel}>Heading : </label>
          <input
            className={styles.slideFormInput}
            type="text"
            name={`heading`}
            value={slide.heading}
            placeholder="Your Heading"
            onChange={(e) => handleChange(e, slideIndex)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.slideFormLabel}>Description : </label>
          <input
            className={styles.slideFormInput}
            type="text"
            name={`description`}
            value={slide.description}
            placeholder="Story Description"
            onChange={(e) => handleChange(e, slideIndex)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.slideFormLabel}>Image URL : </label>
          <input
            className={styles.slideFormInput}
            type="text"
            name={`imageUrl`}
            value={slide.imageUrl}
            placeholder="Add Image URL"
            onChange={(e) => handleChange(e, slideIndex)}
          />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.slideFormLabel}>Category : </label>

          <select
            className={styles.slideFormInput}
            name="category"
            onChange={(e) => handleChange(e, slideIndex)}
            value={slide.category}
          >
            <option value="" style={{ color: "#847c7c" }}>
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category + slideIndex} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SlideForm;
