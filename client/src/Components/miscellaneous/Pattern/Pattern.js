import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setScreenSize } from "../../Redux Slice/PatternSlice";

const Pattern = ({ children }) => {
  const dispatch = useDispatch();

  // Function to check the screen size and update Redux state
  const checkScreenSize = () => {
    // Get the current width of the window
    const screenWidth = window.innerWidth;

    // Dispatch an action to set the screen size in Redux state
    dispatch(
      setScreenSize({
        isSmallScreen: screenWidth < 768,    
        isLargeScreen: screenWidth >= 768,   
      })
    );
  };

  // useEffect hook to run the checkScreenSize function on component mount
  useEffect(() => {
    checkScreenSize();

    // Add an event listener to re-run checkScreenSize on window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup: Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };

    //eslint-disable-next-line
  }, []); 

  return <>{children}</>;
};

export default Pattern;
