"use client";

import { useState } from "react";
import { Box, Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import {
  bodyContainerStyles,
  bodyContentStyles,
  bodyInnerStyles,
} from "../components/styles/bodyStyles";
import JourneyBasicInfo from "./components/JourneyBasicInfo";
import JourneyFlowBuilder from "./components/JourneyFlowBuilder";
import JourneyEngagements from "./components/JourneyEngagements";
import JourneyReview from "./components/JourneyReview";

const steps = [
  "Build Flow",
  "Basic Information",
  "Configure Engagements",
  "Review & Publish",
];

export default function CreateJourneyPage() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <JourneyFlowBuilder />;
      case 1:
        return <JourneyBasicInfo onNext={handleNext} />;
      case 2:
        return <JourneyEngagements onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <JourneyReview onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={bodyContainerStyles}>
      <Box sx={bodyContentStyles}>
        <Box sx={bodyInnerStyles}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Create New Journey
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
            {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>

          <Box sx={{ height: activeStep === 0 ? "calc(100vh - 280px)" : "auto", minHeight: "600px" }}>
            {renderStepContent(activeStep)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
