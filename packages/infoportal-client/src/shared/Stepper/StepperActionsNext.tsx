import {IpBtn, IpBtnProps} from '../Btn'
import {useI18n} from '@/core/i18n'

interface Props extends IpBtnProps {}

export const StepperActionsNext = ({children, icon, ...props}: Props) => {
  const {m} = useI18n()
  return (
    <IpBtn id="btn-submit" color="primary" variant="contained" iconAfter={icon ?? 'keyboard_arrow_right'} {...props}>
      {children ?? m.next}
    </IpBtn>
  )
}
