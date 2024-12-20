import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Kobo} from 'kobo-sdk'
import {UUID} from 'infoportal-common'
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {IpBtn, IpBtnProps} from '@/shared/Btn'
import React, {useState} from 'react'

export const KoboFormListButton = ({children, variant = 'contained', ...props}: Omit<IpBtnProps, 'onChange'> & KoboFormListProps) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <IpBtn onClick={() => setOpen(_ => !_)} children={children} variant={variant}/>
      <KoboFormListDialog open={open} onClose={() => setOpen(false)} {...props}/>
    </>
  )
}
export const KoboFormListDialog = ({
  open,
  onClose,
  value,
  onChange,
  forms,
}: {
  onClose: () => void
  open?: boolean
} & KoboFormListProps) => {
  const {m} = useI18n()
  return (
    <Dialog open={!!open}>
      <DialogTitle>{m.selectForm}</DialogTitle>
      <DialogContent>
        <KoboFormList
          value={value}
          onChange={e => {
            onChange?.(e)
            setTimeout(onClose, 100)
          }}
          forms={forms}
        />
      </DialogContent>
      <DialogActions>
        <IpBtn color="primary" onClick={onClose}>
          {m.close}
        </IpBtn>
      </DialogActions>
    </Dialog>
  )
}

interface KoboFormListProps {
  value?: UUID,
  onChange?: (e: UUID) => void
  forms: Kobo.Form[]
}

export const KoboFormList = ({
  value,
  onChange,
  forms
}: KoboFormListProps) => {
  const {formatDateTime} = useI18n()
  return (
    <ScRadioGroup value={value} onChange={onChange}>
      {forms.map(form =>
        <ScRadioGroupItem
          dense
          key={form.uid}
          value={form.uid}
          title={form.name}
          description={<>
            {formatDateTime(form.date_created)}
          </>
          }/>
      )}
    </ScRadioGroup>
  )
}