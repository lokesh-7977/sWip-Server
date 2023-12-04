import { createSlice } from "@reduxjs/toolkit";

// Initial state for the authentication slice
const initialState = {
  loading: false,
  isAuthenticated: false,
  username: null,
  token: null,
  userId: null,
};

const authSlice = createSlice({
  name: "login", 
  initialState, 
  reducers: {
    // Reducer for handling loading user request
    loadUserRequest: (state) => {
      state.loading = true;
    },
    // Reducer for handling successful user loading
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.userId = action.payload.user._id;
      state.user = action.payload.user;
    },
    // Reducer for handling user loading failure
    loadUserFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.username = null;
      state.token = null;
    },

    // Reducer for handling registration request
    registerRequest: (state) => {
      state.loading = true;
    },
    // Reducer for handling successful registration
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.userId = action.payload.user._id;
      state.user = action.payload.user;
    },
    // Reducer for handling registration failure
    registerFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.username = null;
      state.token = null;
      state.userId = null;
    },

    // Reducer for handling login request
    loginRequest: (state) => {
      state.loading = true;
    },
    // Reducer for handling successful login
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userId = action.payload.user._id;
    },
    // Reducer for handling login failure
    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.username = null;
      state.token = null;
      state.userId = null;
    },

    // Reducer for handling logout request
    logoutRequest: (state) => {
      state.loading = true;
    },
    // Reducer for handling successful logout
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.username = null;
      state.token = null;
      state.userId = null;
    },
    // Reducer for handling logout failure
    logoutFailure: (state) => {
      state.loading = false;
    },
  },
});

// Exporting action creators and the reducer from the slice
export const {
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
  loadUserFailure,
  loadUserRequest,
} = authSlice.actions;

export default authSlice.reducer;
