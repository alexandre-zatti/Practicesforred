import { configureStore } from '@reduxjs/toolkit'
import { FaseEngenhariaSlice } from "@/store/FaseEngenhariaSlice";

export const store = configureStore({
  reducer: {
    faseEngenharia: FaseEngenhariaSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch