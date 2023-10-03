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
import React, { useEffect, useState } from "react";
import { hideLoading, showLoading } from "@/store/LoadingSlice";
import { FaseEngenharia } from "@/types/FaseEngenharia";
import { showToast } from "@/store/ToastSlice";
import { setConsequencias } from "@/store/ConsequenciasSlice";
import { GrauRelevancia as GrauRelevanciaEnum } from "@/enums/GrauRelevancia";
import GrauRelevancia from "@/components/grau-relevancia/GrauRelevancia";
import DescriptionRender from "@/components/DescriptionRender";
import styles from './page.module.css'

const CenarioAtual = () => {
  const [entered, setEntered] = useState(false);
  const faseEngenhariaConsequencias = useSelector((state: RootState) => state.fasesEngenharia.fasesEngenharia)
  const consequenciasSelecionadas = useSelector((state: RootState) => state.consequencias.consequencias)
  const dispatch = useDispatch()

  const [fasesEngenhariaWithConsequenciasSelecionadas, setFasesEngenhariaWithConsequenciasSelecionadas] = useState<FaseEngenharia[]>([])

  useEffect(() => {
    dispatch(showLoading())

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ontology/consequencia/relevancia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(consequenciasSelecionadas.map((consequencia) => {
        return {
          consequenciaUri: consequencia.uri,
          consequenciaNome: consequencia.nome,
          consequenciaDescricao: consequencia.descricao,
          frequencia: Frequencia[consequencia.frequencia!],
          impacto: Impacto[consequencia.impacto!]
        }
      })),
    })
      .then((response) => {
        if (response.ok) {
          const timer = setTimeout(() => setEntered(true), 100);
          response.json().then((data) => {
            const consequenciasWithGrauRelevancia = data.map((consequencia: any) => {
              return {
                nome: consequencia.consequenciaNome,
                descricao: consequencia.consequenciaDescricao,
                uri: consequencia.consequenciaUri,
                frequencia: Frequencia[consequencia.frequencia],
                impacto: Impacto[consequencia.impacto],
                grauRelevancia: GrauRelevanciaEnum[consequencia.grauRelevancia]
              }
            })

            dispatch(setConsequencias(consequenciasWithGrauRelevancia))
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

  }, []);

  useEffect(() => {
    setFasesEngenhariaWithConsequenciasSelecionadas(
      filterOnlyConsequenciasSelecionadas(
        filterFasesEngenhariaWithConsequenciasSelecionadas(faseEngenhariaConsequencias)
      )
    )
  }, [consequenciasSelecionadas]);

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
    <div className={`pageContainer`}>
      <Steps/>

      <div className={`contentContainer ${entered ? 'entered' : ''}`}>

        <Typography className={'pageTitle'} variant={'h4'}>
          Cenário atual da(s) consequência(s) associada(s) as dívidas de requisitos e seus respectivos graus de
          relevância
        </Typography>

        {fasesEngenhariaWithConsequenciasSelecionadas.map((faseEngenharia) => {
          return (
            <Accordion key={faseEngenharia.faseEngenhariaUri} className={'accordionContainer'}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className={'accordionSummary'}
              >
                <Typography
                  variant={'h6'}
                  className={'accordionSummaryTitle'}
                >
                  {faseEngenharia.faseEngenhariaNome}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {faseEngenharia.faseEngenhariaConsequencias.map((consequencia, index) => {

                  return (
                    <Card key={consequencia.uri} className={'cardContainer'}>
                      <CardContent>
                        <div className={styles.cardContent}>

                          <Typography variant={'h6'} className={'cardTitle'}>{consequencia.nome}</Typography>

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

                          <div
                            className={'grauRelevanciaContainer'}>
                            <Typography>Grau de Relevância</Typography>
                            <GrauRelevancia grauRelevancia={consequencia.grauRelevancia!}/>
                          </div>

                        </div>
                        <DescriptionRender description={consequencia.descricao ?? ''}/>
                      </CardContent>
                    </Card>
                  )
                })}
              </AccordionDetails>
            </Accordion>
          )
        })}
      </div>

    </div>
  )
}

export default CenarioAtual

