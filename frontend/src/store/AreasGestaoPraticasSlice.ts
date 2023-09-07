import { createSlice } from "@reduxjs/toolkit";
import { AreaGestaoPratica } from "@/types/AreaGestaoPratica";

interface AreasGestaoPraticasState {
  areasGestaoPraticas: AreaGestaoPratica[];
}

const initialState: AreasGestaoPraticasState = {
  areasGestaoPraticas: [],
}

export const AreasGestaoPraticasSlice = createSlice({
  name: 'areasGestaoPraticas',
  initialState,
  reducers: {
    setAreasGestaoPraticas: (state, action) => {
      state.areasGestaoPraticas = action.payload;
    }
  }
});

export const {setAreasGestaoPraticas} = AreasGestaoPraticasSlice.actions;