import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  Typography
} from "@mui/material";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { Pratica } from "@/types/Pratica";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from './praticaDialog.module.css';
import DescriptionRender from "@/components/DescriptionRender";
import NotesIcon from '@mui/icons-material/Notes';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Image from 'next/image';
import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "@/store/LoadingSlice";
import { useDispatch } from "react-redux";
import { ApresentacaoPratica } from "@/components/apresentacao-pratica/ApresentacaoPratica";
import { PraticaTermo } from "@/types/PraticaTermo";
import { TipoPraticaTermo } from "@/enums/TipoPraticaTermo";
import { CausasConsequenciasPratica } from "@/types/CausasConsequenciasPratica";
import { TermoAtividadePratica } from "@/components/termo-atividade-pratica/TermoAtividadePratica";
import { TermoAlphaPratica } from "@/components/termo-alpha-pratica/TermoAlphaPratica";
import { TermoProdutoPratica } from "@/components/termo-produto-pratica/TermoAlphaPratica";
import { TermoEspacoAtividadePratica } from "@/components/termo-espaco-atividade-pratica/TermoEspacoAtividadePratica";

interface PraticaPageProps {
  isPraticaModalOpen: boolean;
  setIsPraticaModalOpen: (isPraticaModalOpen: boolean) => void;
  praticaSelecionada: Pratica | null;
  setPraticaSelecionada: (praticaSelecionada: Pratica | null) => void;
}

const PraticaDialog = ({
                         isPraticaModalOpen,
                         setIsPraticaModalOpen,
                         praticaSelecionada,
                         setPraticaSelecionada
                       }: PraticaPageProps) => {

  const dispatch = useDispatch()
  const [openAccordion, setOpenAccordion] = useState<string>('')
  const [openEspacoAtividadeAccordion, setOpenEspacoAtividadeAccordion] = useState<string>('')
  const [praticaTermos, setPraticaTermos] = useState<PraticaTermo[]>([])
  const [praticaCausasConsequencias, setPraticaCausasConsequencias] = useState<CausasConsequenciasPratica[]>([])

  useEffect(() => {
    dispatch(showLoading());
    Promise.all([
      getTermosPratica(),
      getContextoReDPratica()
    ]).then(() => dispatch(hideLoading()))

  }, [])

  const getContextoReDPratica = async () => {

    const queryParams = new URLSearchParams({praticaUri: `<${praticaSelecionada?.uri}>` ?? ''}).toString()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ontology/pratica/causas-consequencias?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (response.ok) {
      const data = await response.json()
      setPraticaCausasConsequencias(data);
    }
  }

  const getTermosPratica = async () => {
    const queryParams = new URLSearchParams({praticaUri: `<${praticaSelecionada?.uri}>` ?? ''}).toString()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ontology/pratica/termos?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (response.ok) {
      const data = await response.json()
      setPraticaTermos(data.toSorted((a: { termoPraticaOrdem: number; }, b: {
        termoPraticaOrdem: number;
      }) => a.termoPraticaOrdem - b.termoPraticaOrdem));
    }
  }

  const getIconTermoPratica = (praticaTermo: PraticaTermo, size?: number) => {
    switch (praticaTermo.termoPraticaTipo) {
      case TipoPraticaTermo.PRODUTO_TRABALHO_PRATICA:
        return <Image src="/ProdutoTrabalhoPratica.png" alt="Icon Description" width={size ?? 28} height={size ?? 28}/>
      case TipoPraticaTermo.ALPHA:
        return <Image src="/Alpha.png" alt="Icon Description" width={size ?? 28} height={size ?? 28}/>
      case TipoPraticaTermo.ATIVIDADE_PRODUTO_TRABALHO:
        return <Image src="/AtividadeProdutoTrabalho.png" alt="Icon Description" width={size ?? 28}
                      height={size ?? 28}/>
      case TipoPraticaTermo.ESPACO_ATIVIDADE:
        return <Image src="/EspacoAtividade.png" alt="Icon Description" width={size ?? 28}
                      height={size ?? 28}/>
    }
  }

  const handleAccordionChange = (panel: string) => {
    const isExpanded = openAccordion === panel;
    setOpenAccordion(isExpanded ? '' : panel);
  }

  const handleEspacoAtividadeAccordionChange = (panel: string) => {
    const isExpanded = openEspacoAtividadeAccordion === panel;
    setOpenEspacoAtividadeAccordion(isExpanded ? '' : panel);
  }

  return (
    <>
      {praticaSelecionada && (
        <Dialog
          open={isPraticaModalOpen}
          onClose={() => {
            setIsPraticaModalOpen(false)
            setPraticaSelecionada(null)
          }}
          fullWidth={true}
          maxWidth={'lg'}
          scroll={'paper'}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >

          <DialogTitle variant={'h4'} className={styles.dialogTitle}>
            {praticaSelecionada?.nome}
          </DialogTitle>

          <DialogBody className={styles.dialogBody}>
            <Accordion className={'accordionContainer'}
                       expanded={openAccordion === 'apresentacao'}
                       onChange={() => handleAccordionChange('apresentacao')}>
              <AccordionSummary
                className={'accordionSummary'}
                expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
              >
                <div className={'accordionSummaryContent'}>
                  <NotesIcon/>
                  <Typography variant={'h5'}>
                    <span className={'accordionSummaryTitle'}>Apresentação</span>
                  </Typography>
                </div>

              </AccordionSummary>
              <AccordionDetails className={'accordionDetails'}>
                <ApresentacaoPratica pratica={praticaSelecionada}/>
              </AccordionDetails>
            </Accordion>

            {praticaTermos
              .filter((p) => p.termoPraticaTipo !== TipoPraticaTermo.ESPACO_ATIVIDADE)
              .map((praticaTermo: PraticaTermo) => {
                return (
                  <Accordion className={'accordionContainer'} key={praticaTermo.termoPraticaUri}
                             expanded={openAccordion === praticaTermo.termoPraticaUri}
                             onChange={() => handleAccordionChange(praticaTermo.termoPraticaUri)}>
                    <AccordionSummary
                      className={'accordionSummary'}
                      expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
                    >
                      <div className={'accordionSummaryContent'}>
                        {getIconTermoPratica(praticaTermo)}
                        <Typography variant={'h5'}>
                        <span className={'accordionSummaryTitle'}>
                          <DescriptionRender description={praticaTermo.termoPraticaNome}/>
                        </span>
                        </Typography>
                      </div>

                    </AccordionSummary>
                    <AccordionDetails className={'accordionDetails'}>
                      {praticaTermo.termoPraticaTipo === TipoPraticaTermo.ATIVIDADE_PRODUTO_TRABALHO && (
                        <TermoAtividadePratica praticaTermo={praticaTermo}
                                               praticaTermos={praticaTermos}
                                               getIconTermoPratica={getIconTermoPratica}
                                               setOpenAccordion={setOpenAccordion}/>
                      )}

                      {praticaTermo.termoPraticaTipo === TipoPraticaTermo.ALPHA && (
                        <TermoAlphaPratica praticaTermo={praticaTermo}
                                           getIconTermoPratica={getIconTermoPratica}
                                           setOpenAccordion={setOpenAccordion}/>
                      )}

                      {praticaTermo.termoPraticaTipo === TipoPraticaTermo.PRODUTO_TRABALHO_PRATICA && (
                        <TermoProdutoPratica praticaTermo={praticaTermo}
                                             getIconTermoPratica={getIconTermoPratica}
                                             setOpenAccordion={setOpenAccordion}/>
                      )}
                    </AccordionDetails>
                  </Accordion>
                )
              })}


            <Accordion className={'accordionContainer'}
                       expanded={openAccordion === 'espacoAtividade'}
                       onChange={() => handleAccordionChange('espacoAtividade')}>
              <AccordionSummary
                className={'accordionSummary'}
                expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
              >
                <div className={'accordionSummaryContent'}>
                  <Image src="/EspacoAtividade.png" alt="Icon Description" width={28}
                         height={28}/>
                  <Typography variant={'h5'}>
                    <span className={'accordionSummaryTitle'}>Espaço Atividade</span>
                  </Typography>
                </div>

              </AccordionSummary>
              <AccordionDetails className={'accordionDetails'}>
                {praticaTermos
                  .filter((p) => p.termoPraticaTipo === TipoPraticaTermo.ESPACO_ATIVIDADE)
                  .map((praticaTermo) => {
                    return (
                      <Accordion className={'accordionContainer'} key={praticaTermo.termoPraticaUri}
                                 expanded={openEspacoAtividadeAccordion === praticaTermo.termoPraticaUri}
                                 onChange={() => handleEspacoAtividadeAccordionChange(praticaTermo.termoPraticaUri)}>
                        <AccordionSummary
                          className={'accordionSummary'}
                          expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
                        >
                          <div className={'accordionSummaryContent'}>
                            {getIconTermoPratica(praticaTermo)}
                            <Typography variant={'h5'}>
                              <span className={'accordionSummaryTitle'}>
                                <DescriptionRender description={praticaTermo.termoPraticaNome}/>
                              </span>
                            </Typography>
                          </div>

                        </AccordionSummary>
                        <AccordionDetails className={'accordionDetails'}>
                          <TermoEspacoAtividadePratica praticaTermo={praticaTermo}
                                                       getIconTermoPratica={getIconTermoPratica}
                                                       setOpenAccordion={setOpenAccordion}/>

                        </AccordionDetails>
                      </Accordion>
                    )
                  })
                }

              </AccordionDetails>
            </Accordion>

            <Accordion className={'accordionContainer'}
                       expanded={openAccordion === 'referencias'}
                       onChange={() => handleAccordionChange('referencias')}>
              <AccordionSummary
                className={'accordionSummary'}
                expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
              >
                <div className={'accordionSummaryContent'}>
                  <Image src="/ReferenciasApoio.png" alt="Icon Description" width={28} height={28}/>
                  <Typography variant={'h5'}>
                    <span className={'accordionSummaryTitle'}>Referências de apoio</span>
                  </Typography>
                </div>

              </AccordionSummary>
              <AccordionDetails className={'accordionDetails'}>
                <div style={{padding: "1rem"}}>
                  <DescriptionRender description={praticaSelecionada?.referencias ?? ''}/>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion className={'accordionContainer'}
                       expanded={openAccordion === 'contexto'}
                       onChange={() => handleAccordionChange('contexto')}>
              <AccordionSummary
                className={'accordionSummary'}
                expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
              >
                <div className={'accordionSummaryContent'}>
                  <InfoOutlinedIcon/>
                  <Typography variant={'h5'}>
                    <span className={'accordionSummaryTitle'}>Contexto da ReD</span>
                  </Typography>
                </div>

              </AccordionSummary>
              <AccordionDetails className={'accordionDetails'}>
                <Typography variant={'h6'} style={{fontWeight: "bold", textAlign: "center"}}>Problemas e Causas
                  associadas a
                  prática</Typography>

                {praticaCausasConsequencias.map((consequencia) => {
                  return (
                    <Accordion key={consequencia.consequenciaUri} className={'accordionContainer'}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        className={'accordionSummary'}
                      >
                        <Typography variant={'h5'}>
                          <span className={'accordionSummaryPreTitle'}>Problema - </span>
                          <span className={'accordionSummaryTitle'}>{consequencia.consequenciaNome}</span>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails className={'accordionDetails'}>
                        {consequencia.causas && consequencia.causas!.map((causa, index) => {
                          return (
                            <Card key={causa.uri + consequencia.consequenciaUri} className={'cardContainer'}>
                              <CardContent>
                                <div className={styles.cardContent}>
                                  <Typography variant={'h6'} className={'cardTitle'}>
                                    <span className={'accordionSummaryPreTitle'}>Causa - </span>
                                    {causa.uri}
                                  </Typography>
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
              </AccordionDetails>
            </Accordion>

            <Accordion className={'accordionContainer'}
                       expanded={openAccordion === 'glosario'}
                       onChange={() => handleAccordionChange('glosario')}>
              <AccordionSummary
                className={'accordionSummary'}
                expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
              >
                <div className={'accordionSummaryContent'}>
                  <LibraryBooksOutlinedIcon/>
                  <Typography variant={'h5'}>
                    <span className={'accordionSummaryTitle'}>Glossário</span>
                  </Typography>
                </div>

              </AccordionSummary>
              <AccordionDetails className={'accordionDetails'}>
                <Typography variant={'h6'}>Em desenvolvimento!</Typography>
              </AccordionDetails>
            </Accordion>

          </DialogBody>
        </Dialog>
      )}
    </>
  )
}

export default PraticaDialog;