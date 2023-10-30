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
import { useEffect } from "react";
import { hideLoading, showLoading } from "@/store/LoadingSlice";
import { useDispatch } from "react-redux";
import { ApresentacaoPratica } from "@/components/apresentacao-pratica/apresentacaoPratica";


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
          response.json().then((data) => {
            console.log(data)
            console.log('praticaSelecionada', praticaSelecionada)
          })
        }
      })

    dispatch(hideLoading())
  }, [])


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


            <Accordion className={'accordionContainer'}>
              <AccordionSummary
                className={'accordionSummary'}
                expandIcon={<ExpandMoreIcon className={'accordionExpandIcon'}/>}
              >
                <div className={'accordionSummaryContent'}>
                  <Image src="/ReferenciasApoio.png" alt="Icon Description" width={32} height={32}/>
                  <Typography variant={'h5'}>
                    <span className={'accordionSummaryTitle'}>Referências de apoio</span>
                  </Typography>
                </div>

              </AccordionSummary>
              <AccordionDetails className={'accordionDetails'}>
                <DescriptionRender description={praticaSelecionada?.descricao ?? ''}/>
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
                <DescriptionRender description={praticaSelecionada?.descricao ?? ''}/>
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
                <DescriptionRender description={praticaSelecionada?.descricao ?? ''}/>
              </AccordionDetails>
            </Accordion>

          </DialogBody>
        </Dialog>
      )}
    </>
  )
}

export default PraticaDialog;