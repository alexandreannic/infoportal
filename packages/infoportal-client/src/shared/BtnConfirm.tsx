import {useState} from 'react'
import {useI18n} from '@/core/i18n'
import {Core} from '@/shared'

export type BtnConfirmProps = Core.BtnProps

export const BtnConfirm = ({onClick, size, ...props}: BtnConfirmProps) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const {m} = useI18n()
  return (
    <>
      {!showConfirm ? (
        <Core.Btn
          {...props}
          size={size}
          onClick={() => {
            setShowConfirm(true)
          }}
        />
      ) : (
        <>
          <Core.Btn
            size={size}
            icon="check"
            color="success"
            children={m.confirm}
            onClick={e => {
              if (onClick) onClick(e)
              setShowConfirm(false)
            }}
          />
          <Core.Btn size={size} icon="close" color="error" onClick={() => setShowConfirm(false)} children={m.cancel} />
        </>
      )}
    </>
  )
}
