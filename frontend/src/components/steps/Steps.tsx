'use client'

import {
  Button,
  MobileStepper,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useRouter } from "next/navigation";
import styles from './steps.module.css';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setEtapa } from "@/store/EtapasSlice";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ArrowBack } from "@mui/icons-material";
import { useEffect } from "react";

const steps = [
  {label: 'Problemas', route: '/analise'},
  {label: 'Cenário Atual', route: '/cenario-atual'},
  {label: 'Causas', route: '/gaps'},
  {label: 'Práticas', route: '/praticas'},
];

const Steps = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const router = useRouter()
  const dispatch = useDispatch()


  const activeStep = useSelector((state: RootState) => state.etapas.etapa)

  useEffect(() => {
    router.push(steps[activeStep].route);
  }, []);

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
      {isSmallScreen ? (
        <MobileStepper
          variant="dots"
          steps={steps.length}
          position="static"
          activeStep={activeStep}
          className={styles.mobileStepper}
          nextButton={
            <Button
              size="large"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              Avançar
              <ArrowForwardIcon/>
            </Button>
          }
          backButton={
            <Button
              size="large"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <ArrowBack/>
              Voltar
            </Button>
          }
        />
      ) : (
        <>
          {/* ... your regular Stepper and related components for larger screens ... */}
          <Button
            className={`${styles.button} ${styles.buttonBack}`}
            disabled={activeStep === 0}
            onClick={handleBack}
            size={'large'}
            variant={'text'}
          >
            <ArrowBack/>
            Voltar
          </Button>

          <Stepper activeStep={activeStep} className={styles.stepper}>
            {steps.map((step, index) => (
              <Step key={step.label} onClick={() => handleStepClick(index)}>
                <StepButton sx={{
                  '& .MuiStepIcon-root': {
                    fontSize: '2.5rem',
                  }
                }}>
                  <StepLabel>
                    <Typography variant={'h4'} className={styles.stepperLabel}>{step.label}</Typography>
                  </StepLabel>
                </StepButton>
              </Step>
            ))}
          </Stepper>

          <Button
            className={`${styles.buttonNext}`}
            disabled={activeStep === steps.length - 1}
            onClick={handleNext}
            size={'large'}
            variant={'text'}
          >
            <span>Avançar</span>
            <ArrowForwardIcon/>
          </Button>
        </>
      )}
    </div>
  );
};

export default Steps;
