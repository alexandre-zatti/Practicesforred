import { useState } from "react";
import { Box, Button, Step, StepButton, StepContent, Stepper, Typography } from "@mui/material";

type VerticalStepperProps = {
  steps: {
    label: string,
    description: JSX.Element
  }[]
}

export const VerticalStepper = ({steps}: VerticalStepperProps) => {
  const [activeStep, setActiveStep] = useState(0);


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton onClick={() => setActiveStep(index)}>
              {step.label}
            </StepButton>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{mt: 3}}
                    disabled={index === steps.length - 1}
                  >
                    Avançar
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{mt: 3}}
                  >
                    Voltar
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}