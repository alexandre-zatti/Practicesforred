import { Accordion, AccordionDetails, AccordionSummary, Dialog, DialogTitle, Typography } from "@mui/material";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { Pratica } from "@/types/Pratica";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import styles from './praticaDialog.module.css';
import DescriptionRender from "@/components/DescriptionRender";
import NotesIcon from '@mui/icons-material/Notes';

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
  return (
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
        <Image src="/diagrama_caso_de_uso.png" alt="Icon Description" width={32} height={32}/>
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
            <DescriptionRender description={praticaSelecionada?.descricao ?? ''}/>
          </AccordionDetails>
        </Accordion>

      </DialogBody>
    </Dialog>
  )
}

export default PraticaDialog;