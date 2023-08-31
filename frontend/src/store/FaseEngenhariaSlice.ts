import { createSlice } from "@reduxjs/toolkit";
import { FaseEngenharia } from "@/types/FaseEngenharia";

interface FaseEngenhariaState {
  faseEngenharia: FaseEngenharia[]
}

const initialState: FaseEngenhariaState = {
  faseEngenharia: []
}

export const FaseEngenhariaSlice = createSlice({
  name: 'faseEngenharia',
  initialState,
  reducers: {
    setFaseEngenharia: (state, action) => {
      state.faseEngenharia = action.payload
    }
  }
})

export const {setFaseEngenharia} = FaseEngenhariaSlice.actions