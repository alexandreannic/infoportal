import React, {forwardRef, ReactNode, useContext, useEffect, useImperativeHandle, useMemo, useState} from 'react'
import {StepperHeader} from './StepperHeader.js'

export interface StepProps {
  name: string
  label?: string
  component: () => ReactNode
}

interface StepperProps {
  renderDone?: ReactNode
  steps: StepProps[]
  initialStep?: number
  onStepChange?: (props: StepProps, index: number) => void
  onComplete?: (props: StepProps, index: number) => void
}

interface StepperContext {
  currentStep: number
  goTo: (i: number) => void
  next: () => void
  prev: () => void
}

export const StepperContext = React.createContext<StepperContext>({
  currentStep: 0,
} as StepperContext)

export interface StepperHandle {
  next: () => void
  prev: () => void
  goTo: (i: number) => void
}

export const Stepper = forwardRef<StepperHandle, StepperProps>(
  ({steps, initialStep, renderDone, onStepChange, onComplete}, ref) => {
    const [currentStep, setCurrentStep] = useState(initialStep ?? 0)
    const maxStep = useMemo(() => steps.length + (renderDone ? 1 : 0), [steps, renderDone])
    const isDone = currentStep >= steps.length

    const scrollTop = () => window.scrollTo(0, 0)

    useEffect(() => {
      onStepChange?.(steps[currentStep], currentStep)
      if (currentStep === steps.length) onComplete?.(steps[currentStep], currentStep)
    }, [currentStep])

    const goTo = (i: number) => {
      setCurrentStep(_ => Math.max(Math.min(i, maxStep), 0))
      scrollTop()
    }

    const next = () => {
      if (isDone) return
      setCurrentStep(_ => Math.min(_ + 1, maxStep))
      scrollTop()
    }

    const prev = () => {
      setCurrentStep(_ => Math.max(_ - 1, 0))
      scrollTop()
    }

    useImperativeHandle(ref, () => ({next, prev, goTo}), [currentStep])

    return (
      <StepperContext.Provider
        value={{
          currentStep,
          goTo,
          next,
          prev,
        }}
      >
        <StepperHeader steps={steps.map(_ => _.label)} currentStep={currentStep} goTo={setCurrentStep} />
        {isDone ? renderDone : steps[currentStep].component()}
      </StepperContext.Provider>
    )
  },
)

export const useStepperContext = () => {
  return useContext<StepperContext>(StepperContext)
}
