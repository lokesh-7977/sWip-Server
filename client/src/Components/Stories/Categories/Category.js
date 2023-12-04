import React from "react";
import styles from "./Category.module.css";
import foodImg from "../../../assets/categories/food.jpg";
import healthImg from "../../../assets/categories/health.jpg";
import travelImg from "../../../assets/categories/travel.jpg";
import movieImg from "../../../assets/categories/movie.jpg";
import educationImg from "../../../assets/categories/education.webp";
import allImg from "../../../assets/categories/All.png";

const Categories = ({ handleCategoryClick, categories, selectedCategory }) => {
  const images = {
    food: foodImg,
    health: healthImg,
    travel: travelImg,
    movie: movieImg,
    education: educationImg,
  };

  // JSX for rendering category buttons
  return (
    <div className={styles.sections}>
      <div
        className={styles.categories}
        onClick={() => handleCategoryClick("All")}
        style={{
          // Styling for the All category button
          backgroundImage: `linear-gradient(#00000099, #00000099),url(${allImg})`,
          border: "All" === selectedCategory ? "0.3rem solid #73abff" : "none",
        }}
      >
        <h3 className={styles.Names}>All</h3>
      </div>

      {/* Map through categories and render each category button */}
      {categories &&
        categories.map((category, index) => (
          <div
            className={styles.categories}
            key={index}
            onClick={() => handleCategoryClick(category)}
            style={{
              // Styling for each category button
              backgroundImage: `linear-gradient(#00000099, #00000099),${
                category === "Food"
                  ? `url(${images.food})`
                  : category === "Travel"
                  ? `url(${images.travel})`
                  : category === "Movie"
                  ? `url(${images.movie})`
                  : category === "Education"
                  ? `url(${images.education})`
                  : `url(${images.health})`
              }`,
              border:
                category === selectedCategory ? "0.3rem solid #73abff" : "none",
            }}
          >
            <h3 className={styles.Names}>{category}</h3>
          </div>
        ))}
    </div>
  );
};

export default Categories;
