import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    // Name of the slice
    name: "modal",
    // Initial state of the slice
    initialState: {
        modal: false,          
        modalContent: null,    
    },
    // Reducers, which define how the state can be modified
    reducers: {
        // Action to open the modal with specific content
        openModal: (state, action) => {
            state.modal = true;                    
            state.modalContent = action.payload;   
        },
        // Action to close the modal
        closeModal: (state) => {
            state.modal = false;     
            state.modalContent = null; 
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
