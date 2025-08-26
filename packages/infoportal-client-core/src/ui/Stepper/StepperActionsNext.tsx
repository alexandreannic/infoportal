import {Icon} from '@mui/material'
import {Btn, BtnProps} from '../Btn'
import {useI18n} from '../../core/Translation'

interface Props extends BtnProps {}

export const StepperActionsNext = ({children, icon, ...props}: Props) => {
  const {m} = useI18n()
  return (
    <Btn id="btn-submit" color="primary" endIcon={<Icon>{icon ?? 'keyboard_arrow_right'}</Icon>} {...props}>
      {children ?? m.stepper_next}
    </Btn>
  )
}
