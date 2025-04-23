import {IpBtn, IpBtnProps} from '@/shared/Btn'
import {useState} from 'react'
import {useI18n} from '@/core/i18n'

export type BtnConfirmProps = IpBtnProps

export const BtnConfirm = ({onClick, size, ...props}: BtnConfirmProps) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const {m} = useI18n()
  return (
    <>
      {!showConfirm ? (
        <IpBtn
          {...props}
          size={size}
          onClick={() => {
            setShowConfirm(true)
          }}
        />
      ) : (
        <>
          <IpBtn
            size={size}
            icon="check"
            color="success"
            children={m.confirm}
            onClick={(e) => {
              if (onClick) onClick(e)
              setShowConfirm(false)
            }}
          />
          <IpBtn size={size} icon="close" color="error" onClick={() => setShowConfirm(false)} children={m.cancel} />
        </>
      )}
    </>
  )
}
