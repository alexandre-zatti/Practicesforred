import { createSlice } from "@reduxjs/toolkit";

interface LoadingState {
  loading: boolean
}

const initialState: LoadingState = {
  loading: false
}

export const LoadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading = true
    },
    hideLoading: (state) => {
      state.loading = false
    }
  }
})

export const {showLoading, hideLoading} = LoadingSlice.actions