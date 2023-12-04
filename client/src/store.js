import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Components/Redux Slice/AuthenticationSlice.js";
import modalSlice from "./Components/Redux Slice/ModalSlice.js";
import storyReducer from "./Components/Redux Slice/StorySlice.js";
import patternReducer from "./Components/Redux Slice/PatternSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    modal: modalSlice,
    story: storyReducer,
    pattern: patternReducer,
  },
});

export default store;
