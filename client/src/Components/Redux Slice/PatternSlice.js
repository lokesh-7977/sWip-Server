import { createSlice } from '@reduxjs/toolkit';

// Initial state for the pattern slice
const initialState = {
  isSmallScreen: false,   // Default value for small screen
  isMediumScreen: false,  // No medium screen in the initial state
  isLargeScreen: false,   // Default value for large screen
};

const PatternSlice = createSlice({
  name: 'pattern',         
  initialState,            
  reducers: {
    // Reducer function to set screen size based on payload
    setScreenSize(state, action) {
      // Destructure payload to get isSmallScreen and isLargeScreen values
      const { isSmallScreen, isLargeScreen } = action.payload;

      // Update the state with the new screen size values
      state.isSmallScreen = isSmallScreen;
      state.isLargeScreen = isLargeScreen;
    },
  },
});

// Export the setScreenSize action from the slice
export const { setScreenSize } = PatternSlice.actions;

export default PatternSlice.reducer;
