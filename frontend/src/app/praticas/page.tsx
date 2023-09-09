'use client'

import styles from './page.module.css';
import Steps from '@/components/steps/Steps';
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { hideLoading, showLoading } from "@/store/LoadingSlice";
import { Causa } from "@/types/Causa";
import { showToast } from "@/store/ToastSlice";
import { setAreasGestaoPraticas } from "@/store/AreasGestaoPraticasSlice";

const Praticas = () => {
  const areasGestaoPraticas = useSelector((state: any) => state.areasGestaoPraticas.areasGestaoPraticas)
  const causasSelecionadas = useSelector((state: any) => state.causas.causas)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(showLoading())

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ontology/causa/praticas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(causasSelecionadas.map((causa: Causa) => {
        return {
          causaPraticaUri: '<' + causa.uri + '>',
          causaPraticaNome: causa.nome,
          grauRelevancia: causa.grauRelevancia,
        }
      }))
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            dispatch(setAreasGestaoPraticas(data))
          })
        } else {
          dispatch(showToast({
            type: 'error',
            message: 'Erro ao buscar dados da ontologia!'
          }))
        }
      })
      .finally(() => {
        dispatch(hideLoading())
      })
  }, []);

  return (
    <div className={styles.container}>
      <Steps/>
      <Typography className={styles.pageTitle} variant={'h4'}>
        Praticas
      </Typography>


    </div>
  );
}

export default Praticas;