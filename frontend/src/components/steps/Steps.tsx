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
import { reset, RootState } from "@/store/store";
import { setEtapa } from "@/store/EtapasSlice";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ArrowBack, Home } from "@mui/icons-material";
import { useEffect, useRef } from "react";

const steps = [
  {label: 'Problemas', route: '/analise'},
  {label: 'Cenário Atual', route: '/cenario-atual'},
  {label: 'Causas', route: '/causas'},
  {label: 'Práticas', route: '/praticas'},
];

const Steps = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const containerRef = useRef<HTMLDivElement>(null);

  const router = useRouter()
  const dispatch = useDispatch()

  const activeStep = useSelector((state: RootState) => state.etapas.etapa)
  const consequencias = useSelector((state: RootState) => state.consequencias.consequencias)
  const fasesEngenharia = useSelector((state: RootState) => state.fasesEngenharia.fasesEngenharia)
  const causas = useSelector((state: RootState) => state.causas.causas)

  const canAdvance = () => {
    switch (activeStep) {
      case 0:
        return consequencias.length > 0;
      case 1:
        return fasesEngenharia.length > 0;
      case 2:
        return causas.length > 0;
      default:
        return true;
    }
  }

  useEffect(() => {
    router.push(steps[activeStep].route);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (containerRef.current) {
          containerRef.current.classList.toggle(styles.stuck, e.intersectionRatio < 1);
        }
      },
      { threshold: [1] }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleStepClick = (index: number) => {
    if (index <= activeStep || (index === activeStep + 1 && canAdvance())) {
      dispatch(setEtapa(index))
      router.push(steps[index].route);
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      handleStepClick(activeStep - 1);
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1 && canAdvance()) {
      handleStepClick(activeStep + 1);
    }
  };

  const handleReset = () => {
    dispatch(reset())
    router.push('/');
  }

  return (

    <div ref={containerRef} className={styles.container}>
      <Typography variant={'h3'} className={styles.titlePrimary}>
        PracticesforReD
      </Typography>

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
              disabled={activeStep === steps.length - 1 || !canAdvance()}
            >
              Avançar
              <ArrowForwardIcon/>
            </Button>
          }
          backButton={
            <div className={styles.mobileButtonContainer}>
              <Button
                size="large"
                onClick={handleReset}
              >
                <Home/>
              </Button>
              <Button
                size="large"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                <ArrowBack/>
                Voltar
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <div className={styles.desktopContainer}>
            <div className={styles.buttonContainer}>
              <Button
                className={`${styles.button} ${styles.buttonHome}`}
                onClick={handleReset}
                size={'large'}
                variant={'text'}
              >
                <Home/>
                <span>Início</span>
              </Button>
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
            </div>

            <Stepper activeStep={activeStep} className={styles.stepper}>
              {steps.map((step, index) => (
                <Step key={step.label} onClick={() => handleStepClick(index)} disabled={index > activeStep + 1 || (index === activeStep + 1 && !canAdvance())}>
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
              disabled={activeStep === steps.length - 1 || !canAdvance()}
              onClick={handleNext}
              size={'large'}
              variant={'text'}
            >
              <span>Avançar</span>
              <ArrowForwardIcon/>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Steps;