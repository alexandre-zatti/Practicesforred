import { configureStore } from '@reduxjs/toolkit'
import { FaseEngenhariaSlice } from "@/store/FaseEngenhariaSlice";
import { LoadingSlice } from "@/store/LoadingSlice";
import { ToastSlice } from "@/store/ToastSlice";

export const store = configureStore({
  reducer: {
    faseEngenharia: FaseEngenhariaSlice.reducer,
    loading: LoadingSlice.reducer,
    toast: ToastSlice.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch