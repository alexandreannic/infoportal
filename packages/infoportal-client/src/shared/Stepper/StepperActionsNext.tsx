import {IpBtn, IpBtnProps} from '../Btn'
import {useI18n} from '@/core/i18n'
import {Icon} from '@mui/material'

interface Props extends IpBtnProps {}

export const StepperActionsNext = ({children, icon, ...props}: Props) => {
  const {m} = useI18n()
  return (
    <IpBtn id="btn-submit" color="primary" endIcon={<Icon>{icon ?? 'keyboard_arrow_right'}</Icon>} {...props}>
      {children ?? m.next}
    </IpBtn>
  )
}
