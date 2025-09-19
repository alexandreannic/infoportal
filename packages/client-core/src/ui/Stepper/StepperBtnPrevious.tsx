import {Btn, BtnProps} from '../Btn'
import {useI18n} from '../../core/Translation'
import {useStepperContext} from './Stepper'

export interface StepperBtnPreviousProps extends BtnProps {}

export const StepperBtnPrevious = ({sx, ...props}: StepperBtnPreviousProps) => {
  const context = useStepperContext()
  const {m} = useI18n()
  return (
    <Btn
      className="StepperBtnPrevious"
      sx={{visibility: context.currentStep === 0 ? 'hidden' : undefined, marginRight: 'auto', ...sx}}
      onClick={context.prev}
      color="primary"
      icon="keyboard_arrow_left"
      children={m.stepper_previous}
      {...props}
    />
  )
}
