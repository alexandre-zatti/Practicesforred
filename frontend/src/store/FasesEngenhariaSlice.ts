import { createSlice } from "@reduxjs/toolkit";
import { FaseEngenharia } from "@/types/FaseEngenharia";

interface FaseEngenhariaState {
  fasesEngenharia: FaseEngenharia[]
}

const initialState: FaseEngenhariaState = {
  fasesEngenharia: []
}

export const FasesEngenhariaSlice = createSlice({
  name: 'fasesEngenharia',
  initialState,
  reducers: {
    setFaseEngenharia: (state, action: { payload: FaseEngenharia [] }) => {
      state.fasesEngenharia = action.payload
    }
  }
})

export const {setFaseEngenharia} = FasesEngenhariaSlice.actions;