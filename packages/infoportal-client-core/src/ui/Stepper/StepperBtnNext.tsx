import {Icon} from '@mui/material'
import {Btn, BtnProps} from '../Btn'
import {useI18n} from '../../core/Translation'
import {useStepperContext} from './Stepper'

export interface StepperBtnNextProps extends BtnProps {}

export const StepperBtnNext = ({...props}: StepperBtnNextProps) => {
  const context = useStepperContext()
  const {m} = useI18n()
  return (
    <Btn
      className="StepperBtnNext"
      color="primary"
      endIcon={<Icon>keyboard_arrow_right</Icon>}
      children={m.stepper_next}
      onClick={context.next}
      hidden={context.isDone}
      {...props}
    />
  )
}
