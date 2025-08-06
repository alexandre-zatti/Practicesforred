'use client'

import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Checkbox, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "@/store/LoadingSlice";
import { showToast } from "@/store/ToastSlice";
import { setConsequencias } from "@/store/ConsequenciasSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Causa } from "@/types/Causa";
import { addCausa, removeCausa } from "@/store/CausasSlice";
import { Consequencia } from "@/types/Consequencia";
import DescriptionRender from "@/components/DescriptionRender";
import styles from './page.module.css';

const Gaps = () => {
  const [entered, setEntered] = useState(false);
  const causasSelecionadas = useSelector((state: RootState) => state.causas.causas)
  const consequenciasSelecionadas = useSelector((state: RootState) => state.consequencias.consequencias)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(showLoading())

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ontology/consequencia/causas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(consequenciasSelecionadas.map((consequencia) => {
        return {
          consequenciaUri: '<' + consequencia.uri + '>',
          consequenciaNome: consequencia.nome,
        }
      }))
    })
      .then((response) => {
        if (response.ok) {
          const timer = setTimeout(() => setEntered(true), 100);
          response.json().then((data) => {
            const causaConsequencias = data.map((causa: any) => {
              const consequencia = consequenciasSelecionadas.find((consequencia) => {
                return consequencia.uri === causa.consequenciaUri.replace(/[<>]/g, '')
              })

              causa.causas.forEach((causa: Causa) => {
                dispatch(addCausa({
                  ...causa,
                  grauRelevancia: consequencia?.grauRelevancia,
                  uriConsequencia: consequencia?.uri
                }))
              })

              return {
                ...consequencia,
                causas: causa.causas
              }
            })

            dispatch(setConsequencias(causaConsequencias))
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

  const isCausaSelected = (causaUri: string, consequenciaUri: string): Causa | undefined => {
    return causasSelecionadas.find((causa: Causa) => {
      return causa.uri === causaUri && causa.uriConsequencia === consequenciaUri
    })
  }

  const handleCausaCheckboxChange = (checked: boolean, causa: Causa, consequencia: Consequencia) => {
    if (checked) {
      dispatch(addCausa({
        ...causa,
        grauRelevancia: consequencia.grauRelevancia,
        uriConsequencia: consequencia.uri
      }))
    } else {
      dispatch(removeCausa({
        ...causa,
        grauRelevancia: consequencia.grauRelevancia,
        uriConsequencia: consequencia.uri
      }))
    }
  }

  return (
    <div className={'pageContainer'}>

      <div className={`contentContainer ${entered ? 'entered' : ''}`}>

        <Typography className={'pageTitle'} variant={'h4'}>
          Causas das dívidas de requisitos
        </Typography>

        {consequenciasSelecionadas.map((consequencia) => {
          return (
            <Accordion key={consequencia.nome} className={'accordionContainer'}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className={'accordionSummary'}
              >
                <Typography variant={'h5'}>
                  <span className={'accordionSummaryPreTitle'}>Causas que ocasionam - </span>
                  <span className={'accordionSummaryTitle'}>{consequencia.nome}</span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={'accordionDetails'}>
                {consequencia.causas && consequencia.causas!.map((causa, index) => {
                  const causaSelected = isCausaSelected(causa.uri, consequencia.uri)

                  return (
                    <Card key={causa.uri + consequencia.uri} className={'cardContainer'}>
                      <CardContent>
                        <div className={styles.cardContent}>

                          <Checkbox onChange={(event) => {
                            handleCausaCheckboxChange(event.target.checked, causa, consequencia)
                          }} checked={!!causaSelected}/>

                          <Typography variant={'h6'} className={'cardTitle'}>{causa.nome}</Typography>

                        </div>
                        <DescriptionRender description={causa.descricao ?? ''}/>
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
  );
}

export default Gaps;