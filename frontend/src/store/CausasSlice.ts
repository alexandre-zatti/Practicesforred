import { createSlice } from "@reduxjs/toolkit";
import { Consequencia } from "@/types/Consequencia";
import { Causa } from "@/types/Causa";

interface CausasState {
  causas: Consequencia[]
}

const initialState: CausasState = {
  causas: []
}

export const CausasSlice = createSlice({
  name: 'causas',
  initialState,
  reducers: {
    setCausas: (state, action: { payload: Causa [] }) => {
      state.causas = action.payload
    },
    addCausa: (state, action: { payload: Causa }) => {
      const alreadyExists = state.causas.some(causa => causa.uri === action.payload.uri);
      if (!alreadyExists) {
        state.causas.push(action.payload);
      }
    },
    removeCausa: (state, action: { payload: Causa }) => {
      state.causas = state.causas.filter(causa => causa.uri !== action.payload.uri)
    }
  }
});

export const {
  setCausas,
  addCausa,
  removeCausa
} = CausasSlice.actions;