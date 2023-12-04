import React from "react";
import styles from "./Buttons.module.css";
import { useSelector } from "react-redux";

const Button = ({ myFunction, color, text, children, size }) => {
  const  isSmallScreen = useSelector((state) => state.pattern);

  return (
    <button
      className={`${styles.Buttons} ${size === "small" ? styles.smallScrButton : ""} ${
        isSmallScreen && styles.smallButtonMobile
      }`}
      style={{ backgroundColor: color || "#FF7373" }}
      onClick={myFunction}
    >
      {children || text}
    </button>
  );
};

export default Button;
