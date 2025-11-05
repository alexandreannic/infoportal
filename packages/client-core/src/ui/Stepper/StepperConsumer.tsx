import {Box, BoxProps} from '@mui/material'
import {ReactNode} from 'react'
import {StepperContext, useStepperContext} from './Stepper.js'
export type StepperConsumerProps = Omit<BoxProps, 'children'> & {
  children: (_: StepperContext) => ReactNode
}

export const StepperConsumer = ({children, ...props}: StepperConsumerProps) => {
  const context = useStepperContext()

  return <Box {...props}>{children(context)}</Box>
}
