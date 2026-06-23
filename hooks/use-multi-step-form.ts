import { useState } from "react";

export function useMultiStepForm(totalSteps: number, initialStep = 0) {
  const safeInitial =
    initialStep >= 0 && initialStep < totalSteps ? initialStep : 0;
  const [currentStep, setCurrentStep] = useState(safeInitial);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const next = () => {
    if (!isLastStep) setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    if (!isFirstStep) setCurrentStep(currentStep - 1);
  };

  const goTo = (step: number) => {
    if (step >= 0 && step < totalSteps) setCurrentStep(step);
  };

  const reset = () => {
    setCurrentStep(0);
  };

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    next,
    prev,
    goTo,
    reset,
  };
}
