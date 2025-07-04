import {Box} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {IpBtn} from '../Btn'
import {useStepperContext} from './Stepper'
import {StepperActionsNext} from './StepperActionsNext'
import {ReactNode} from 'react'

interface Props {
  hideNext?: boolean
  hidePrev?: boolean
  loadingNext?: boolean
  disableNext?: boolean
  loadingPrev?: boolean
  nextButtonLabel?: string
  nextIcon?: string
  next?: (next: () => void) => void
  prev?: (prev: () => void) => void
  children?: ReactNode
}

export const StepperActions = ({
  disableNext,
  nextButtonLabel,
  nextIcon,
  hidePrev,
  children,
  hideNext,
  loadingNext,
  loadingPrev,
  next,
  prev,
}: Props) => {
  const {m} = useI18n()
  const _stepper = useStepperContext()
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
          {m.previous}
        </IpBtn>
      )}
      {children}
      {!hideNext && (
        <StepperActionsNext
          disabled={disableNext}
          icon={nextIcon}
          loading={loadingNext}
          onClick={next ? () => next(_stepper.next) : _stepper.next}
          children={nextButtonLabel}
        />
      )}
    </Box>
  )
}
