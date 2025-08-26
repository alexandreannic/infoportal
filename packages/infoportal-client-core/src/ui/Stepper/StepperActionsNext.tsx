import {Icon} from '@mui/material'
import {IpBtn, IpBtnProps} from '../Btn.js'
import {useI18n} from '../../core/Translation.js'

interface Props extends IpBtnProps {}

export const StepperActionsNext = ({children, icon, ...props}: Props) => {
  const {m} = useI18n()
  return (
    <IpBtn id="btn-submit" color="primary" endIcon={<Icon>{icon ?? 'keyboard_arrow_right'}</Icon>} {...props}>
      {children ?? m.stepper_next}
    </IpBtn>
  )
}
