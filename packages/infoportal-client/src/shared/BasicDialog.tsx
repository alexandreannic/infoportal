import {Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, LinearProgress, PaperProps} from '@mui/material'
import {IpBtn} from '@/shared/Btn'
import {EventHandler, ReactNode, SyntheticEvent} from 'react'
import {Txt} from '@/shared/Txt'

export type BasicDialogProps = Omit<DialogProps, 'children' | 'onClick'> & {
  disabled?: boolean
  title?: string
  confirmLabel?: string
  cancelLabel?: string
  children?: ReactNode
  onOpen?: () => void
  onClose?: () => void
  onConfirm?: (event: SyntheticEvent<any>) => void
  confirmDisabled?: boolean
  onClick?: EventHandler<SyntheticEvent<any>>
  PaperProps?: Partial<PaperProps>
  loading?: boolean
  overrideActions?: ReactNode
}

export const BasicDialog = ({
  overrideActions,
  children,
  title,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClick,
  onOpen,
  onClose,
  confirmDisabled,
  loading,
  PaperProps,
  ...props
}: BasicDialogProps) => {
  return (
    <Dialog {...props} PaperProps={PaperProps}>
      {loading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
          }}
        />
      )}
      <DialogTitle>
        <Txt truncate>{title}</Txt>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {overrideActions ? (
          overrideActions
        ) : (
          <>
            <IpBtn color="primary" onClick={onClose}>
              {cancelLabel || 'Cancel'}
            </IpBtn>
            {onConfirm && (
              <IpBtn color="primary" onClick={onConfirm} disabled={confirmDisabled}>
                {confirmLabel || 'Confirm'}
              </IpBtn>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
