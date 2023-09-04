import { configureStore } from '@reduxjs/toolkit'
import { FasesEngenhariaSlice } from "@/store/FasesEngenhariaSlice";
import { LoadingSlice } from "@/store/LoadingSlice";
import { ToastSlice } from "@/store/ToastSlice";
import { ConsequenciasSlice } from "@/store/ConsequenciasSlice";
import { EtapasSlice } from "@/store/EtapasSlice";

export const store = configureStore({
  reducer: {
    fasesEngenharia: FasesEngenhariaSlice.reducer,
    consequencias: ConsequenciasSlice.reducer,
    etapas: EtapasSlice.reducer,
    loading: LoadingSlice.reducer,
    toast: ToastSlice.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch