'use client'

import Steps from "@/components/steps/Steps";
import styles from './page.module.css';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Checkbox, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { hideLoading, showLoading } from "@/store/LoadingSlice";
import { showToast } from "@/store/ToastSlice";
import { setConsequencias } from "@/store/ConsequenciasSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Causa } from "@/types/Causa";
import { addCausa, removeCausa } from "@/store/CausasSlice";
import { Consequencia } from "@/types/Consequencia";
import DescriptionRender from "@/components/DescriptionRender";

const Gaps = () => {
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
    <div className={styles.container}>
      <Steps/>

      <Typography className={styles.pageTitle} variant={'h4'}>
        Informe a(s) possível(eis) causa(s) atrelada(s) a(s) consequência(s) informada(s)
      </Typography>

      {consequenciasSelecionadas.map((consequencia) => {
        return (
          <Accordion key={consequencia.nome} className={styles.accordionContainer}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={styles.accordionIcon}/>}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className={`${styles.accordionContent}`}
            >
              <Typography variant={'h6'}>
                Causas que ocasionam - <span style={{fontWeight: 600}}>{consequencia.nome}</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {consequencia.causas && consequencia.causas!.map((causa, index) => {
                const causaSelected = isCausaSelected(causa.uri, consequencia.uri)

                return (
                  <Card key={causa.uri + consequencia.uri} className={styles.card}>
                    <CardContent>
                      <div className={styles.cardActions}>

                        <Checkbox onChange={(event) => {
                          handleCausaCheckboxChange(event.target.checked, causa, consequencia)
                        }} checked={!!causaSelected}/>

                        <Typography variant={'h6'} className={styles.nome}>{causa.nome}</Typography>

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
  );
}

export default Gaps;