'use client'

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from "react-redux";
import { setFaseEngenharia } from "@/store/FasesEngenhariaSlice";
import { RootState } from "@/store/store";
import { hideLoading, showLoading } from "@/store/LoadingSlice";
import { showToast } from "@/store/ToastSlice";
import { Frequencia } from "@/enums/Frequencia";
import { Impacto } from "@/enums/Impacto";
import { addConsequencia, changeFrequencia, changeImpacto, removeConsequencia } from "@/store/ConsequenciasSlice";
import { Consequencia } from "@/types/Consequencia";
import DescriptionRender from "@/components/DescriptionRender";
// @ts-ignore
import styles from "./page.module.css";

const Analise = () => {
  const [entered, setEntered] = useState(false);
  const faseEngenhariaConsequencias = useSelector((state: RootState) => state.fasesEngenharia.fasesEngenharia)
  const consequenciasSelecionadas = useSelector((state: RootState) => state.consequencias.consequencias)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(showLoading())
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ontology/fase-engenharia/consequencia`)
      .then((response) => {
        if (response.ok) {
          const timer = setTimeout(() => setEntered(true), 100);
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
  }, [dispatch])

  const isConsequenciaSelected = (consequenciaUri: string): Consequencia | undefined => {
    return consequenciasSelecionadas.find((consequencia) => {
      return consequencia.uri === consequenciaUri
    })
  }

  const handleConsequenciaCheckboxChange = (checked: boolean, consequencia: Consequencia) => {
    if (checked) {
      dispatch(addConsequencia(consequencia))
      dispatch(changeFrequencia({consequencia, frequencia: Frequencia.EVENTUALMENTE}))
      dispatch(changeImpacto({consequencia, impacto: Impacto.LEVE}))
    } else {
      dispatch(removeConsequencia(consequencia))
    }
  }

  const handleConsequenciaFrequenciaChange = (consequencia: Consequencia, frequencia: Frequencia) => {
    dispatch(changeFrequencia({consequencia, frequencia}))
  }

  const handleConsequenciaImpactoChange = (consequencia: Consequencia, impacto: Impacto) => {
    dispatch(changeImpacto({consequencia, impacto}))
  }

  return (
    <div className={`pageContainer`}>
      <div className={`contentContainer ${entered ? 'entered' : ''}`}>

        <Typography className={'pageTitle'} variant={'h4'}>
          Informe o(s) problema(s) gap(s) que ocorre(m) no produto de software da organização ágil na qual atua
        </Typography>

        {faseEngenhariaConsequencias.map((faseEngenharia) => {
          return (
            <Accordion key={faseEngenharia.faseEngenhariaUri} className={'accordionContainer'}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
                aria-controls={`analise-${faseEngenharia.faseEngenhariaUri}-content`}
                id={`analise-${faseEngenharia.faseEngenhariaUri}-header`}
                className={'accordionSummary'}
              >
                <Typography
                  variant={'h5'}
                  className={'accordionSummaryTitle'}
                >
                  {faseEngenharia.faseEngenhariaNome}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={'accordionDetails'}>
                {faseEngenharia.faseEngenhariaConsequencias.map((consequencia, index) => {
                  const consequenciaSelected = isConsequenciaSelected(consequencia.uri)

                  return (
                    <Card key={consequencia.uri} className={'cardContainer'}>
                      <CardContent>
                        <div className={styles.cardContent}>
                          <div className={styles.cardContentSelectTitle}>
                            <Checkbox onChange={(event) => {
                              handleConsequenciaCheckboxChange(event.target.checked, consequencia)
                            }} checked={!!consequenciaSelected}/>

                            <Typography variant={'h6'} className={'cardTitle'}>{consequencia.nome}</Typography>
                          </div>


                          <FormControl>
                            <InputLabel id={`${consequencia.uri}_frequencia_label`}>Frequência</InputLabel>
                            <Select
                              labelId={`${consequencia.uri}_frequencia_label`}
                              id={`${consequencia.uri}_frequencia`}
                              value={consequenciaSelected?.frequencia ?? Frequencia.EVENTUALMENTE}
                              label={'Frequencia'}
                              onChange={(event) => {
                                handleConsequenciaFrequenciaChange(consequencia, event.target.value as Frequencia)
                              }}
                              disabled={!consequenciaSelected}
                            >
                              <MenuItem value={Frequencia.EVENTUALMENTE}>Eventual</MenuItem>
                              <MenuItem value={Frequencia.PARCIALMENTE}>Parcial</MenuItem>
                              <MenuItem value={Frequencia.FREQUENTEMENTE}>Frequente</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl>
                            <InputLabel id={`${consequencia.uri}_impacto_label`}>Impacto</InputLabel>
                            <Select
                              labelId={`${consequencia.uri}_impacto_label`}
                              id={`${consequencia.uri}_impacto`}
                              value={consequenciaSelected?.impacto ?? Impacto.LEVE}
                              label={'Impacto'}
                              onChange={(event) => {
                                handleConsequenciaImpactoChange(consequencia, event.target.value as Impacto)
                              }}
                              disabled={!consequenciaSelected}
                            >
                              <MenuItem value={Impacto.LEVE}>Leve</MenuItem>
                              <MenuItem value={Impacto.MODERADO}>Moderado</MenuItem>
                              <MenuItem value={Impacto.CRITICO}>Crítico</MenuItem>
                            </Select>
                          </FormControl>
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

export default Analise