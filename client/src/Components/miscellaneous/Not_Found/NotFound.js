import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Buttons/Buttons";
import "./NotFound.modular.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img
        className="img"
        src="https://i.imgur.com/gV9UUmq.jpeg"
        alt="Not Found"
      />
      <h1 className="heading">Oops! Looks like you are Connection is Lost !</h1>

      <Button
        text="Go Home"
        myFunction={() => navigate("/")}
        color="#ffa143"
      />
    </div>
  );
};

export default NotFound;
