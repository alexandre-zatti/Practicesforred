'use client'

import styles from './page.module.css';
import Steps from '@/components/steps/Steps';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { hideLoading, showLoading } from "@/store/LoadingSlice";
import { Causa } from "@/types/Causa";
import { showToast } from "@/store/ToastSlice";
import { setAreasGestaoPraticas } from "@/store/AreasGestaoPraticasSlice";
import { AreaGestaoPratica } from "@/types/AreaGestaoPratica";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PraticaGeral } from "@/types/PraticaGeral";
import { Pratica } from "@/types/Pratica";
import { GrauRelevancia } from "@/enums/GrauRelevancia";

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

  const getGrauRelevanciaNomeStyle = (grauRelevancia: number): string => {
    // @ts-ignore
    switch (GrauRelevancia[grauRelevancia as string]) {
      case GrauRelevancia.BAIXO:
        return styles.grauRelevanciaNomeBaixo
      case GrauRelevancia.MEDIO:
        return styles.grauRelevanciaNomeMedio
      case GrauRelevancia.ALTO:
        return styles.grauRelevanciaNomeAlto
      default:
        return ''
    }
  }

  return (
    <div className={styles.container}>
      <Steps/>
      <Typography className={styles.pageTitle} variant={'h4'}>
        Praticas
      </Typography>

      {areasGestaoPraticas.map((areaGestaoPraticas: AreaGestaoPratica) => {
        return (
          <Accordion key={areaGestaoPraticas.areaGestao.uri} className={styles.accordionContainer}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={styles.accordionIcon}/>}
              className={styles.accordionAreaGestao}
            >
              <Typography variant={'h6'} style={{fontWeight: 600}}>{areaGestaoPraticas.areaGestao.nome}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {areaGestaoPraticas.praticasGerais.map((praticaGeral: PraticaGeral) => {
                return (
                  <Accordion key={praticaGeral.praticaGeral.uri} className={styles.accordionContainer}>
                    <AccordionSummary
                      className={styles.accordionAreaGestao}
                      expandIcon={<ExpandMoreIcon className={styles.accordionIcon}/>}
                    >
                      <Typography variant={'h6'} style={{fontWeight: 600}}>{praticaGeral.praticaGeral.nome}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      {praticaGeral.praticas.map((praticaEspecifica: Pratica) => {
                        return (
                          <Card key={praticaEspecifica.uri} className={styles.cardConsequencia}>
                            <CardContent>
                              <div className={styles.cardConsequenciaActions}>

                                <Typography variant={'h6'} className={styles.consequenciaNome}>
                                  {praticaEspecifica.nome}
                                </Typography>

                                <div
                                  className={`${styles.grauRelevanciaContainer}`}>
                                  <Typography>Grau de Relevância</Typography>
                                  <Typography
                                    variant={'h6'}
                                    className={getGrauRelevanciaNomeStyle(praticaEspecifica.grauRelevancia!)}
                                  >
                                    {praticaEspecifica.grauRelevancia! === GrauRelevancia.MEDIO ? 'MÉDIO' : praticaEspecifica.grauRelevancia!}
                                  </Typography>
                                </div>

                              </div>
                              <p className={styles.consequenciaDescricao}>
                                {praticaEspecifica.descricao}
                              </p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </AccordionDetails>

          </Accordion>
        )
      })}

    </div>
  );
}

export default Praticas;