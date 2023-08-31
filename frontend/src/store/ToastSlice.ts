// toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

interface ToastState {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const initialState: ToastState = {
  isOpen: false,
  message: '',
  type: 'success',
}

export const ToastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.type = action.payload.type || 'success'; // if type is not provided, default to 'success'
    },
    hideToast: (state) => {
      state.isOpen = false;
      state.message = '';
      state.type = 'success';
    },
  },
});

export const {showToast, hideToast} = ToastSlice.actions;
