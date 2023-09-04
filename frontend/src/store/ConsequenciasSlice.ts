import { createSlice } from "@reduxjs/toolkit";
import { Consequencia } from "@/types/Consequencia";
import { Frequencia } from "@/enums/Frequencia";
import { Impacto } from "@/enums/Impacto";

interface ConsequenciasState {
  consequencias: Consequencia[]
}

const initialState: ConsequenciasState = {
  consequencias: []
}

export const ConsequenciasSlice = createSlice({
  name: 'consequencias',
  initialState,
  reducers: {
    setConsequencias: (state, action: { payload: Consequencia [] }) => {
      state.consequencias = action.payload
    },
    addConsequencia: (state, action: { payload: Consequencia }) => {
      state.consequencias.push(action.payload)
    },
    removeConsequencia: (state, action: { payload: Consequencia }) => {
      state.consequencias = state.consequencias.filter(consequencia => consequencia.uri !== action.payload.uri)
    },
    changeFrequencia: (state, action: {
      payload: { consequencia: Consequencia, frequencia: Frequencia | undefined }
    }) => {
      state.consequencias = state.consequencias.map(consequencia => {
        if (consequencia.uri === action.payload.consequencia.uri) {
          consequencia.frequencia = action.payload.frequencia
        }
        return consequencia
      })
    },
    changeImpacto: (state, action: {
      payload: { consequencia: Consequencia, impacto: Impacto | undefined }
    }) => {
      state.consequencias = state.consequencias.map(consequencia => {
        if (consequencia.uri === action.payload.consequencia.uri) {
          consequencia.impacto = action.payload.impacto
        }
        return consequencia
      })
    }
  }
});

export const {
  setConsequencias,
  addConsequencia,
  removeConsequencia,
  changeImpacto,
  changeFrequencia
} = ConsequenciasSlice.actions;