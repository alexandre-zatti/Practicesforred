'use client'

import { Button, Step, StepButton, StepLabel, Stepper, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import styles from './steps.module.css';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setEtapa } from "@/store/EtapasSlice";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ArrowBack } from "@mui/icons-material";

const steps = [
  {label: 'Análise', route: '/analise'},
  {label: 'Cenário Atual', route: '/cenario-atual'},
  {label: 'Gaps', route: '/gaps'},
  {label: 'Práticas', route: '/praticas'},
];

const Steps = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const activeStep = useSelector((state: RootState) => state.etapas.etapa)

  const handleStepClick = (index: number) => {
    dispatch(setEtapa(index))
    router.push(steps[index].route);
  }

  const handleBack = () => {
    if (activeStep > 0) {
      handleStepClick(activeStep - 1);
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      handleStepClick(activeStep + 1);
    }
  };

  return (
    <div className={styles.container}>
      <Button
        className={styles.buttonBack}
        disabled={activeStep === 0}
        onClick={handleBack}
        size={'large'}
        variant={'outlined'}
      >
        <ArrowBack/>
        Voltar
      </Button>

      <Stepper activeStep={activeStep} className={styles.stepper}>
        {steps.map((step, index) => (
          <Step key={step.label} onClick={() => handleStepClick(index)}>
            <StepButton sx={{
              '& .MuiStepIcon-root': {
                fontSize: '2.5rem'
              }
            }}>
              <StepLabel>
                <Typography variant={'h4'}>{step.label}</Typography>
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <Button
        className={styles.buttonNext}
        disabled={activeStep === steps.length - 1}
        onClick={handleNext}
        size={'large'}
        variant={'outlined'}
      >
        Avançar
        <ArrowForwardIcon/>
      </Button>
    </div>
  );
};

export default Steps;
