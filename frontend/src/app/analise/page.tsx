'use client'

import styles from './page.module.css';
import { useEffect } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFaseEngenharia } from "@/store/FaseEngenhariaSlice";
import { RootState } from "@/store/store";

const Analise = () => {
  const {faseEngenharia} = useSelector((state: RootState) => state.faseEngenharia)
  const dispatch = useDispatch()

  useEffect(() => {
    fetch('http://localhost:8080/api/ontology/fase-engenharia/consequencia').then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          dispatch(setFaseEngenharia(data))
        })
      }
    })
  }, [])

  return (
    <div className={styles.container}>
      <Typography className={styles.pageTitle} variant={'h5'}>
        Informe o(s) problema(s) que ocorre(m) no cenário atual voltado ao processo de requisitos
      </Typography>
      {faseEngenharia.map((consequencia) => {
        return (
          <Accordion key={consequencia.faseEngenhariaUri}>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{consequencia.faseEngenhariaNome}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {consequencia.faseEngenhariaConsequencias.map((consequencia) => {
                return (
                  <Accordion key={consequencia.nome}>
                    <AccordionSummary
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{consequencia.nome}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{consequencia.descricao}</Typography>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}

export default Analise