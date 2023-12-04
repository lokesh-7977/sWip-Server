import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../ReduxAPI/Authentication_API";
import { openModal } from "../../Redux Slice/ModalSlice";
import { useNavigate } from "react-router-dom";
import { REGISTER, LOGIN, ADD_STORY } from "../../../ReduxConstants";
import Button from "../Buttons/Buttons";
import styles from "./Header.module.css";

import avatar from "../../../assets/avatar.png";
import closeIcon from "../../../assets/close.png";

const HeaderMobile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, username } = useSelector((state) => state.auth);

  const [menuClick, setMenuClick] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleMenuClick = () => {
    setMenuClick((prevMenuClick) => !prevMenuClick);
  };

  return (
    <nav className={styles.headerMobile}>
      <div className={styles.navbarButtons}>
        <h2 className={styles.headingText}>SwipTory</h2>
        <div className={styles.Menu} onClick={handleMenuClick}>
          <svg
            width="20"
            height="20"
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
          {menuClick && (
            <div className={styles.menu_content_mob}>
              {!isAuthenticated ? (
                <>
                  {menuClick && (
                    <div className={styles.close} onClick={handleMenuClick}>
                      <img src={closeIcon} alt="close" />
                    </div>
                  )}
                  <Button
                    text="Register Now"
                    myFunction={() => dispatch(openModal(REGISTER))}
                    size="small"
                  />
                  <Button
                    text="Sign In"
                    myFunction={() => dispatch(openModal(LOGIN))}
                    size="small"
                  />
                </>
              ) : (
                <>
                  <div className={styles.user}>
                    <img
                      src={avatar}
                      alt="avatar"
                      className={styles.profilepic}
                      width="42rem"
                      onClick={() => navigate("/")}
                    />
                    <h5 style={{ marginBottom: "1rem" }}>{username}</h5>
                  </div>
                  {menuClick && (
                    <div className={styles.close} onClick={handleMenuClick}>
                      <img src={closeIcon} alt="close" />
                    </div>
                  )}

                  <Button
                    text="Your Story"
                    myFunction={() => navigate("/my/stories")}
                    size="small"
                  />
                  <Button
                    text="Bookmarks"
                    myFunction={() => navigate("/bookmarks")}
                    size="small"
                  ></Button>

                  <Button
                    text="Add story"
                    myFunction={() => dispatch(openModal(ADD_STORY))}
                    size="small"
                  />

                  <Button
                    text="Logout"
                    myFunction={handleLogout}
                    size="small"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HeaderMobile;
