import {Icon} from '@mui/material'
import {Btn, BtnProps} from '../Btn'
import {useI18n} from '@infoportal/client-i18n'
import {useStepperContext} from './Stepper'

export interface StepperBtnNextProps extends BtnProps {}

export const StepperBtnNext = ({sx, ...props}: StepperBtnNextProps) => {
  const context = useStepperContext()
  const {m} = useI18n()
  return (
    <Btn
      className="StepperBtnNext"
      color="primary"
      endIcon={<Icon>keyboard_arrow_right</Icon>}
      children={m.next}
      onClick={context.next}
      sx={{visibility: context.isDone ? 'hidden' : undefined, ...sx}}
      {...props}
    />
  )
}
