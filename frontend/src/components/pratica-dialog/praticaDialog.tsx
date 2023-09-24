import { Accordion, AccordionDetails, AccordionSummary, Dialog, DialogTitle, Typography } from "@mui/material";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { Pratica } from "@/types/Pratica";
import styles from "@/components/pratica-dialog/praticaDialog.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";

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
      <DialogTitle>
        <Typography variant={'h4'}>
          {praticaSelecionada?.nome}
        </Typography>
      </DialogTitle>
      <DialogBody>
        <Accordion className={styles.accordionContainer}>
          <AccordionSummary
            className={styles.accordionSummary}
            expandIcon={<ExpandMoreIcon className={styles.accordionIcon}/>}
          >
            <div className={styles.accordionSummaryContent}>
              <Image src="/diagrama_caso_de_uso.png" alt="Icon Description" width={24} height={24}/>

              <Typography variant={'h6'}>
                <span style={{fontWeight: 600}}>{praticaSelecionada?.nome}</span>
              </Typography>
            </div>

          </AccordionSummary>
          <AccordionDetails>
            Teste
          </AccordionDetails>
        </Accordion>

      </DialogBody>
    </Dialog>
  )
}

export default PraticaDialog;