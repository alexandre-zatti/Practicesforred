import { createSlice } from "@reduxjs/toolkit";

interface EtapasState {
  etapa: number
}

const initialState: EtapasState = {
  etapa: 0
}

export const EtapasSlice = createSlice({
  name: 'etapas',
  initialState,
  reducers: {
    setEtapa: (state, action: { payload: number }) => {
      state.etapa = action.payload
    }
  }
})

export const {setEtapa} = EtapasSlice.actions