import {Box, BoxProps} from '@mui/material'
import {ReactElement} from 'react'
import {StepperContext, useStepperContext} from './Stepper.js'
import {StepperBtnNext, StepperBtnNextProps} from './StepperBtnNext.js'
import {StepperBtnPrevious, StepperBtnPreviousProps} from './StepperBtnPrevious.js'
export type StepperActionsProps = BoxProps & {
  children?: (_: {
    context: StepperContext
    btnPrevious: ReactElement<StepperBtnPreviousProps>
    btnNext: ReactElement<StepperBtnNextProps>
  }) => any
  nextBtnProps?: StepperBtnNextProps
  prevBtnProps?: StepperBtnPreviousProps
}

export const StepperActions = ({nextBtnProps, prevBtnProps, children, sx, ...props}: StepperActionsProps) => {
  const context = useStepperContext()
  const btnPrevious = <StepperBtnPrevious {...prevBtnProps} />
  const btnNext = <StepperBtnNext {...nextBtnProps} />

  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 3, ...sx}} {...props}>
      {children ? (
        children({context, btnNext, btnPrevious})
      ) : (
        <>
          {btnNext}
          {btnPrevious}
        </>
      )}
    </Box>
  )
}
