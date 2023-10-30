'use client'

import styles from './page.module.css';
import Steps from '@/components/steps/Steps';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "@/store/LoadingSlice";
import { Causa } from "@/types/Causa";
import { showToast } from "@/store/ToastSlice";
import { setAreasGestaoPraticas } from "@/store/AreasGestaoPraticasSlice";
import { AreaGestaoPratica } from "@/types/AreaGestaoPratica";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PraticaGeral } from "@/types/PraticaGeral";
import { Pratica } from "@/types/Pratica";
import GrauRelevancia from "@/components/grau-relevancia/GrauRelevancia";
import { GrauRelevancia as GrauRelevanciaEnum } from "@/enums/GrauRelevancia";
import PraticaDialog from '@/components/pratica-dialog/praticaDialog';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Praticas = () => {
  const [entered, setEntered] = useState(false);
  const [isPraticaModalOpen, setIsPraticaModalOpen] = useState(false)
  const [praticaSelecionada, setPraticaSelecionada] = useState<Pratica | null>(null)

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
          const timer = setTimeout(() => setEntered(true), 100);
          response.json().then((data: AreaGestaoPratica[]) => {
            dispatch(setAreasGestaoPraticas(data.map((areaGestaoPraticas: AreaGestaoPratica) => {
              return {
                areaGestao: areaGestaoPraticas.areaGestao,
                praticasGerais: areaGestaoPraticas.praticasGerais.map((praticaGeral: PraticaGeral) => {
                  return {
                    praticaGeral: praticaGeral.praticaGeral,
                    praticas: praticaGeral.praticas.map((pratica: Pratica) => {
                      return {
                        uri: pratica.uri,
                        nome: pratica.nome,
                        descricao: pratica.descricao,
                        introducao: pratica.introducao,
                        fluxoAtividades: pratica.fluxoAtividades,
                        apresentacao: pratica.apresentacao,
                        quandoAplicar: pratica.quandoAplicar,
                        grauRelevancia: GrauRelevanciaEnum[pratica.grauRelevancia!]
                      }
                    })
                  }
                })
              }
            })))
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
    <>
      <div className={'pageContainer'}>
        <Steps/>

        <div className={`contentContainer ${entered ? 'entered' : ''}`}>

          <Typography className={'pageTitle'} variant={'h4'}>
            Práticas gerais e específicas para mitigar as causas das dívidas de requisitos e suas consequências
          </Typography>

          {areasGestaoPraticas.map((areaGestaoPraticas: AreaGestaoPratica) => {
            return (
              <Accordion key={areaGestaoPraticas.areaGestao.uri} className={'accordionContainer'}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
                  className={'accordionSummary'}
                >
                  <Typography variant={'h5'}>
                    <span className={'accordionSummaryPreTitle'}>Área da gestão da dívida - </span>
                    <span className={'accordionSummaryTitle'}>{areaGestaoPraticas.areaGestao.nome}</span>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className={'accordionDetails'}>
                  {areaGestaoPraticas.praticasGerais.map((praticaGeral: PraticaGeral) => {
                    return (
                      <Accordion key={praticaGeral.praticaGeral.uri} className={'accordionContainer'}>
                        <AccordionSummary
                          className={'accordionSummary'}
                          expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
                        >
                          <Typography variant={'h5'}>
                            <span className={'accordionSummaryPreTitle'}>Prática - </span>
                            <span className={'accordionSummaryTitle'}>{praticaGeral.praticaGeral.nome}</span>
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails className={'accordionDetails'}>
                          {praticaGeral.praticas.map((praticaEspecifica: Pratica) => {
                            return (
                              <Card key={praticaEspecifica.uri} className={'cardContainer'}>
                                <CardContent>
                                  <div className={styles.cardContent}>

                                    <Typography variant={'h6'} className={styles.praticaNome} onClick={() => {
                                      setIsPraticaModalOpen(true)
                                      setPraticaSelecionada(praticaEspecifica)
                                    }}>
                                      <AutoStoriesIcon/>
                                      <span>
                                        {praticaEspecifica.nome}
                                      </span>
                                    </Typography>

                                    <div
                                      className={styles.grauRelevanciaContainer}>
                                      <Typography className={styles.grauRelevanciaTitle}>Grau de Relevância</Typography>
                                      <div className={styles.grauRelevanciaChipContainer}>
                                        <GrauRelevancia
                                          grauRelevancia={praticaEspecifica.grauRelevancia!}
                                        />
                                      </div>

                                    </div>

                                  </div>
                                  {/*<DescriptionRender description={praticaEspecifica.descricao}/>*/}
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
      </div>
      {isPraticaModalOpen && (
        <PraticaDialog
        praticaSelecionada={praticaSelecionada}
        setPraticaSelecionada={setPraticaSelecionada}
        setIsPraticaModalOpen={setIsPraticaModalOpen}
        isPraticaModalOpen={isPraticaModalOpen}
      />
      )}
    </>

  );
}

export default Praticas;