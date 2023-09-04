'use client'

import Steps from "@/components/steps/Steps";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Frequencia } from "@/enums/Frequencia";
import { Impacto } from "@/enums/Impacto";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "@/store/LoadingSlice";
import { FaseEngenharia } from "@/types/FaseEngenharia";
import { setFaseEngenharia } from "@/store/FasesEngenhariaSlice";
import { showToast } from "@/store/ToastSlice";

const CenarioAtual = () => {

  const faseEngenhariaConsequencias = useSelector((state: RootState) => state.fasesEngenharia.fasesEngenharia)
  const consequenciasSelecionadas = useSelector((state: RootState) => state.consequencias.consequencias)
  const dispatch = useDispatch()

  const [fasesEngenhariaWithConsequenciasSelecionadas, setFasesEngenhariaWithConsequenciasSelecionadas] = useState<FaseEngenharia[]>([])

  useEffect(() => {
    dispatch(showLoading())
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ontology/fase-engenharia/consequencia`)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            dispatch(setFaseEngenharia(data))
          })
        } else {
          dispatch(showToast({
            type: 'error',
            message: 'Erro ao buscar dados da ontologia!'
          }))
        }
      }).finally(() => {
      dispatch(hideLoading())
    })

    setFasesEngenhariaWithConsequenciasSelecionadas(
      filterOnlyConsequenciasSelecionadas(
        filterFasesEngenhariaWithConsequenciasSelecionadas(faseEngenhariaConsequencias)
      )
    )

  }, []);

  const filterFasesEngenhariaWithConsequenciasSelecionadas = (fasesEngenharia: FaseEngenharia[]): FaseEngenharia[] => {
    return fasesEngenharia.filter((faseEngenharia) => {
      return faseEngenharia.faseEngenhariaConsequencias.some((consequencia) => {
        return consequenciasSelecionadas.some((consequenciaSelecionada) => {
          return consequenciaSelecionada.uri === consequencia.uri
        })
      })
    })
  }

  const filterOnlyConsequenciasSelecionadas = (fasesEngenharia: FaseEngenharia[]): FaseEngenharia[] => {

    return fasesEngenharia.map((faseEngenharia) => {
      const consequenciasFiltradas = faseEngenharia.faseEngenhariaConsequencias.filter((consequencia) => {
        return consequenciasSelecionadas.some((consequenciaSelecionada) => {
          return consequenciaSelecionada.uri === consequencia.uri
        })
      })

      return {
        ...faseEngenharia,
        faseEngenhariaConsequencias: consequenciasFiltradas.map((consequencia) => {
          return consequenciasSelecionadas.find((consequenciaSelecionada) => {
            return consequenciaSelecionada.uri === consequencia.uri
          })!
        })
      }
    })
  }

  return (
    <div className={styles.container}>
      <Steps/>

      <Typography className={styles.pageTitle} variant={'h4'}>
        Informe o(s) problema(s) que ocorre(m) no cenário atual voltado ao processo de requisitos
      </Typography>
      {fasesEngenhariaWithConsequenciasSelecionadas.map((faseEngenharia) => {
        return (
          <Accordion key={faseEngenharia.faseEngenhariaUri} className={styles.accordionContainer}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={styles.accordionIcon}/>}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className={styles.accordionAreaGestao}
            >
              <Typography variant={'h6'}>{faseEngenharia.faseEngenhariaNome}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {faseEngenharia.faseEngenhariaConsequencias.map((consequencia, index) => {

                return (
                  <Card key={consequencia.uri} className={styles.cardConsequencia}>
                    <CardContent>
                      <div className={styles.cardConsequenciaActions}>

                        <Typography variant={'h6'} className={styles.consequenciaNome}>{consequencia.nome}</Typography>

                        <FormControl>
                          <InputLabel id={`${consequencia.uri}_frequencia_label`}>Frequência</InputLabel>
                          <Select
                            labelId={`${consequencia.uri}_frequencia_label`}
                            id={`${consequencia.uri}_frequencia`}
                            value={consequencia.frequencia}
                            label={'Frequencia'}
                            disabled={true}
                          >
                            <MenuItem value={Frequencia.EVENTUALMENTE}>Eventual</MenuItem>
                            <MenuItem value={Frequencia.PARCIALMENTE}>Parcial</MenuItem>
                            <MenuItem value={Frequencia.FREQUENTEMENTE}>Frequente</MenuItem>
                          </Select>
                        </FormControl>

                        <Typography variant={'h6'}>X</Typography>

                        <FormControl>
                          <InputLabel id={`${consequencia.uri}_impacto_label`}>Impacto</InputLabel>
                          <Select
                            labelId={`${consequencia.uri}_impacto_label`}
                            id={`${consequencia.uri}_impacto`}
                            value={consequencia.impacto}
                            label={'Impacto'}
                            disabled={true}
                          >
                            <MenuItem value={Impacto.LEVE}>Leve</MenuItem>
                            <MenuItem value={Impacto.MODERADO}>Moderado</MenuItem>
                            <MenuItem value={Impacto.CRITICO}>Crítico</MenuItem>
                          </Select>
                        </FormControl>

                        <Typography variant={'h6'}>=</Typography>
                      </div>
                      <p className={styles.consequenciaDescricao}>
                        {consequencia.descricao}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}

export default CenarioAtual

