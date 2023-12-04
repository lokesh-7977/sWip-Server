import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  loadUserSuccess,
  loadUserRequest,
  loadUserFailure,
} from "../Redux Slice/AuthenticationSlice";
import { getStoriesByUser } from "./Stories_API";

// Set the base URL for Axios and allow credentials to be sent with requests
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || "https://swiptoryserver.onrender.com";
axios.defaults.withCredentials = true;

// Load User Action: Fetch user details based on the username stored in local storage
export const loadUser = () => async (dispatch) => {
  const username = localStorage.getItem("username");
  try {
    dispatch(loadUserRequest());

    // Fetch user details from the server based on the username
    const { data } = await axios.get(
      `/auth/loaded/${username}`
    );

    // Dispatch a success action with the user data
    dispatch(loadUserSuccess(data));
    toast.success("User Loaded");
  } catch (error) {
    console.error(error.message);
    // Dispatch a failure action if an error occurs
    dispatch(loadUserFailure());
  }
};

// Register Action: Register a new user with the provided values
export const register = (values) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    // Send a registration request to the server
    const { data } = await axios.post(
      "/auth/register",
      values
    );

    // Dispatch a success action with the registration data
    dispatch(registerSuccess(data));
    localStorage.setItem("username", data.username);

    // Show a success toast notification
    toast.success("Register Successful", {
      position: "bottom-left",
      autoClose: 2000,
    });
  } catch (error) {
    // Dispatch a failure action and show an error toast notification
    dispatch(registerFailure(error.response.data));
    console.error(error);
    toast.error(error.response.data);
  }
};

// Login Action: Log in a user with the provided credentials
export const login = (values) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    // Send a login request to the server
    const { data } = await axios.post(
      "/auth/login",
      values
    );

    // Dispatch a success action with the login data
    dispatch(loginSuccess(data));

    // Fetch stories related to the logged-in user
    dispatch(getStoriesByUser(data.userId));

    // Store the username in local storage
    localStorage.setItem("username", data.username);

    // Show a success toast notification
    toast.success("Login Successful", {
      position: "bottom-right",
      autoClose: 2000,
    });
  } catch (error) {
    // Dispatch a failure action and show an error toast notification
    dispatch(loginFailure());
    toast.error(error.response.data);
  }
};

// Logout Action: Log out the current user
export const logout = () => async (dispatch) => {
  try {
    dispatch(logoutRequest());

    // Send a logout request to the server
    await axios.post("/auth/logout");

    // Dispatch a success action
    dispatch(logoutSuccess());

    // Remove the username from local storage
    localStorage.removeItem("username");

    // Show a success toast notification
    toast.success("Logout Successful", {
      position: "bottom-center",
      autoClose: 1000,
    });
  } catch (error) {
    // Dispatch a failure action and show an error toast notification
    dispatch(logoutFailure());
    toast.error(error.response.data);
  }
};
