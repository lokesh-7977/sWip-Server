import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../ReduxAPI/Authentication_API";
import { openModal } from "../../Redux Slice/ModalSlice";
import avatar from "../../../assets/avatar.png";
import { REGISTER, LOGIN, ADD_STORY } from "../../../ReduxConstants";
import Button from "../Buttons/Buttons";
import styles from "./Header.module.css";

const HeaderDesktop = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, username } = useSelector((state) => state.auth);

  // State to handle menu click
  const [menuClick, setMenuClick] = useState(false);

  // Callback for handling logout
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  // Callback for handling menu click
  const handleOnMenuClick = useCallback(() => {
    setMenuClick((prevMenuClick) => !prevMenuClick);
  }, []);

  // JSX structure for the header
  return (
    <nav className={styles.Header}>
      {/* Application logo */}
      <h2 className={styles.HeadingText}>SwipTory</h2>
      <div className={styles.navbarButtons}>
        {/* Conditionally render buttons based on authentication state */}
        {!isAuthenticated ? (
          <>
            {/* Register button */}
            <Button
              text="Register Now"
              myFunction={() => dispatch(openModal(REGISTER))}
              size="small"
            />
            {/* Sign In button */}
            <Button
              text="Sign In"
              myFunction={() => dispatch(openModal(LOGIN))}
              size="small"
              color="#73abff"
            />
          </>
        ) : (
          <>
            {/* Bookmarks button */}
            <Button
              text="Bookmarks"
              myFunction={() => navigate("/bookmarks")}
              size="small"
            ></Button>
            {/* Add story button */}
            <Button
              text="Add story"
              myFunction={() => dispatch(openModal(ADD_STORY))}
              size="small"
            />
            {/* User profile avatar */}
            <div>
              <img
                src={avatar}
                alt="avatar"
                className={styles.profilepic}
                width="40rem"
                onClick={() => navigate("/")}
              />
            </div>
            {/* Menu icon */}
            <div className={styles.Menu} onClick={handleOnMenuClick}>
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 13H19M1 7H19M1 1H19"
                  stroke="black"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
              </svg>
              {/* Render menu content if menuClick is true */}
              {menuClick && (
                <div className={styles.MenuContent}>
                  {/* Display username */}
                  <h4 style={{ marginBottom: "1rem" }}>{username}</h4>
                  {/* Logout button */}
                  <Button text="Logout" myFunction={handleLogout} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default HeaderDesktop;
