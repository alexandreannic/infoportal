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
      sx={{marginRight: 'auto', ...sx}}
      hidden={context.currentStep === 0}
      onClick={context.prev}
      color="primary"
      icon="keyboard_arrow_left"
      children={m.stepper_previous}
      {...props}
    />
  )
}
