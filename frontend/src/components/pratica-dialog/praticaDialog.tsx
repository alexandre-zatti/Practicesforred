import { Accordion, AccordionDetails, AccordionSummary, Dialog, DialogTitle, Typography } from "@mui/material";
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
import { ApresentacaoPratica } from "@/components/apresentacao-pratica/apresentacaoPratica";
import { PraticaTermo } from "@/types/PraticaTermo";
import { TipoPraticaTermo } from "@/enums/TipoPraticaTermo";


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
  const [praticaTermos, setPraticaTermos] = useState<PraticaTermo[]>([])

  useEffect(() => {
    dispatch(showLoading())

    const queryParams = new URLSearchParams({praticaUri: `<${praticaSelecionada?.uri}>` ?? ''}).toString()

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ontology/pratica/termos?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data: PraticaTermo[]) => {
            setPraticaTermos(data.sort((a, b) => a.termoPraticaOrdem - b.termoPraticaOrdem))
          })
        }
      })

    dispatch(hideLoading())
  }, [])

  const getIconTermoPratica = (praticaTermo: PraticaTermo) => {
    switch (praticaTermo.termoPraticaTipo) {
      case TipoPraticaTermo.PRODUTO_TRABALHO_PRATICA:
        return <Image src="/ProdutoTrabalhoPratica.png" alt="Icon Description" width={28} height={28}/>
      case TipoPraticaTermo.ALPHA:
        return <Image src="/Alpha.png" alt="Icon Description" width={28} height={28}/>
      case TipoPraticaTermo.ATIVIDADE_PRODUTO_TRABALHO:
        return <Image src="/AtividadeProdutoTrabalho.png" alt="Icon Description" width={28} height={28}/>
    }
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
            <Accordion className={'accordionContainer'}>
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

            {praticaTermos.map((praticaTermo: PraticaTermo) => {
              return (
                <Accordion className={'accordionContainer'}>
                  <AccordionSummary
                    className={'accordionSummary'}
                    expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
                  >
                    <div className={'accordionSummaryContent'}>
                      {getIconTermoPratica(praticaTermo)}
                      <Typography variant={'h5'}>
                        <span className={'accordionSummaryTitle'}><DescriptionRender
                          description={praticaTermo.termoPraticaNome}/></span>
                      </Typography>
                    </div>

                  </AccordionSummary>
                  <AccordionDetails className={'accordionDetails'}>
                    <Typography variant={'h6'}>Em desenvolvimento!</Typography>
                  </AccordionDetails>
                </Accordion>
              )
            })}

            <Accordion className={'accordionContainer'}>
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
                <Typography variant={'h6'}>Em desenvolvimento!</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion className={'accordionContainer'}>
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
                <Typography variant={'h6'}>Em desenvolvimento!</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion className={'accordionContainer'}>
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