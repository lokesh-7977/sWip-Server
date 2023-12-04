import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { REGISTER, ADD_STORY, EDIT_STORY, LOGIN } from "./ReduxConstants.js";
import { loadUser } from "./Components/ReduxAPI/Authentication_API.js";

import Home from "./Pages/HomePage.js";
import Bookmarks from "./Pages/BookmarkStories.js";
import Loader from "./Components/miscellaneous/SpinLoaders/SpinLoader.js";
import UserStories from "./Pages/UserStories.js";
import Auth from "./Components/miscellaneous/Authentication/Authentication.js";
import Navbar from "./Components/miscellaneous/Header/Header.js";
import Modal from "./Components/miscellaneous/Modals/Modal.js";
import NotFound from "./Components/miscellaneous/Not_Found/NotFound.js";
import AddStory from "./Components/Stories/StoryForm/StoryAdd.js";
import EditStory from "./Components/Stories/StoryForm/StoryEdit.js";
import ViewStory from "./Components/Stories/StoryDetail/StoryDetail.js";

const App = () => {
  const dispatch = useDispatch();
  const { modalContent } = useSelector((state) => state.modal);
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <>
      <Navbar />

      {modalContent === REGISTER && (
        <Modal>
          <Auth />
        </Modal>
      )}
      {modalContent === LOGIN && (
        <Modal>
          <Auth />
        </Modal>
      )}
      {modalContent === ADD_STORY && (
        <Modal>
          <AddStory />
        </Modal>
      )}
      {modalContent === EDIT_STORY && (
        <Modal>
          <EditStory />
        </Modal>
      )}

      <ToastContainer></ToastContainer>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/story/:id"
          element={
            <Modal>
              <ViewStory />
            </Modal>
          }
        />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/my/stories" element={<UserStories />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
