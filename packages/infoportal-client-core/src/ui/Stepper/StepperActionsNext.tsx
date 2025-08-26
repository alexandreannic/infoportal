import {IpBtn, IpBtnProps} from 'packages/infoportal-client-core/src/Btn.js'
import {useI18n} from 'infoportal-client/src/core/i18n/index.js'
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
