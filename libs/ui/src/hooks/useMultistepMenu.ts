'use client';
import { useState } from 'react';

export interface MenuStep {
  id: string;
  meta?: {
    name?: string;
    description?: string;
  };
  content: (controls: MultistepMenuControls) => React.ReactNode;
  transient?: boolean;
};

export interface MultistepMenuControls {
  currentIndex: number;
  currentStep: MenuStep | null;
  history: string[];
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  navigationDisabled: boolean;
  setCanGoNext: (value: boolean) => void;
  goNext: () => Promise<void>;
  goBack: () => void;
  jumpTo: (index: number) => Promise<void>;
  reset: () => void;
  disableNavigation: () => void;
  enableNavigation: () => void;
  steps: MenuStep[];
  addStep: (step: MenuStep, position?: number) => void;
  addStepsAfter: (id: string, steps: MenuStep[]) => void;
  removeStep: (index: number) => void;
}

export const useMultistepMenu = (initialSteps: MenuStep[]): MultistepMenuControls => {
  const [steps, setSteps] = useState<MenuStep[]>(initialSteps);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);
  const [navigationDisabled, setNavigationDisabled] = useState<boolean>(false);

  const currentStep = steps[currentIndex] || null;

  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;
  const canGoNext = !currentStep?.transient;

  const setCanGoNext = (value: boolean) => {
    if (currentStep) {
      setSteps((prev) =>
        prev.map((step) =>
          step.id === currentStep.id ? { ...step, transient: !value } : step
        )
      );
    }
  };

  const goNext = async () => {
    if (canGoNext) {
      setHistory((prev) => [...prev, currentStep?.id || '']);
      setCurrentIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const goBack = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const jumpTo = async (index: number) => {
    setCurrentIndex(index);
  };

  const reset = () => {
    setCurrentIndex(0);
    setHistory([]);
  };

  const disableNavigation = () => {
    setNavigationDisabled(true);
  };

  const enableNavigation = () => {
    setNavigationDisabled(false);
  };

  const addStep = (step: MenuStep, position?: number) => {
    setSteps((prev) => {
      const newSteps = [...prev];
      if (position !== undefined) {
        newSteps.splice(position, 0, step);
      } else {
        newSteps.push(step);
      }
      return newSteps;
    });
  };

  const addStepsAfter = (id: string, steps: MenuStep[]) => {
    setSteps((prev) => {
      const index = prev.findIndex((step) => step.id === id);
      if (index === -1) return prev;
      const newSteps = [...prev];
      newSteps.splice(index + 1, 0, ...steps);
      return newSteps;
    });
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    currentIndex,
    currentStep,
    history,
    isFirstStep,
    isLastStep,
    canGoNext,
    navigationDisabled,
    setCanGoNext,
    goNext,
    goBack,
    jumpTo,
    reset,
    disableNavigation,
    enableNavigation,
    steps,
    addStep,
    addStepsAfter,
    removeStep,
  };
};
