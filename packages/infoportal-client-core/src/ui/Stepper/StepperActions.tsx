import {Box} from '@mui/material'
import {useStepperContext} from './Stepper.js'
import {StepperActionsNext} from './StepperActionsNext.js'
import {ReactNode} from 'react'
import {IpBtn} from '../Btn.js'
import {useI18n} from '../../core/Translation.js'

interface Props {
  hideNext?: boolean
  hidePrev?: boolean
  loadingNext?: boolean
  disableNext?: boolean
  loadingPrev?: boolean
  previousButtonLabel?: string
  nextButtonLabel?: string
  nextIcon?: string
  next?: (next: () => void) => void
  prev?: (prev: () => void) => void
  children?: ReactNode
}

export const StepperActions = ({
  disableNext,
  nextButtonLabel,
  previousButtonLabel,
  nextIcon,
  hidePrev,
  children,
  hideNext,
  loadingNext,
  loadingPrev,
  next,
  prev,
}: Props) => {
  const _stepper = useStepperContext()
  const {m} = useI18n()
  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 3}}>
      {_stepper.currentStep > 0 && !hidePrev && (
        <IpBtn
          loading={loadingPrev}
          sx={{marginRight: 'auto'}}
          onClick={prev ? () => prev(_stepper.prev) : _stepper.prev}
          color="primary"
          icon="keyboard_arrow_left"
        >
          {previousButtonLabel ?? m.stepper_previous}
        </IpBtn>
      )}
      {children}
      {!hideNext && (
        <StepperActionsNext
          disabled={disableNext}
          icon={nextIcon}
          loading={loadingNext}
          onClick={next ? () => next(_stepper.next) : _stepper.next}
          children={nextButtonLabel ?? m.stepper_next}
        />
      )}
    </Box>
  )
}
