// import * as React from 'react'
import {cloneElement, EventHandler, ReactElement, ReactNode, SyntheticEvent, useState} from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  LinearProgress,
  PaperProps,
} from '@mui/material'
import {ButtonProps} from '@mui/material/Button'

export interface ModalProps
  extends Omit<DialogProps, 'title' | 'onClose' | 'children' | 'onClick' | 'open' | 'content'> {
  disabled?: boolean
  title?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  content?: ((content: () => void) => ReactNode) | ReactNode | string
  children: ReactElement<any>
  onOpen?: () => void
  onClose?: null | (() => void)
  onConfirm?: (event: SyntheticEvent<any>, close: () => void) => void
  confirmDisabled?: boolean
  onClick?: EventHandler<SyntheticEvent<any>>
  PaperProps?: Partial<PaperProps>
  loading?: boolean
  overrideActions?:
    | null
    | ((_: {
        defaultCloseBtn: ReactElement<ButtonProps>
        defaultConfirmBtn: ReactElement<ButtonProps>
        onConfirm: (event: SyntheticEvent<any>, close: () => void) => void
        onClose: () => void
      }) => ReactNode)
}

const enterKeyCode = 13

export const Modal = ({
  overrideActions,
  children,
  title,
  content,
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
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const open = () => {
    onOpen?.()
    setIsOpen(true)
  }

  const close = () => {
    onClose?.()
    setIsOpen(false)
  }

  const confirm = (event: SyntheticEvent<any>) => {
    if (onConfirm) onConfirm(event, close)
  }

  const handleKeypress = (e: any) => {
    if (e.keyCode === enterKeyCode) {
      confirm(e)
    }
  }

  const btnClose = (
    <Button color="primary" onClick={close}>
      {cancelLabel || 'Cancel'}
    </Button>
  )

  const btnConfirm = (
    <Button color="primary" onClick={confirm} disabled={confirmDisabled}>
      {confirmLabel || 'Confirm'}
    </Button>
  )

  return (
    <>
      {cloneElement(children, {
        onClick: (event: any) => {
          if (children.props.onClick) children.props.onClick(event)
          if (onClick) onClick(event)
          open()
        },
      })}
      <Dialog open={isOpen} {...props} PaperProps={PaperProps}>
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
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{typeof content === 'function' ? content(close) : content}</DialogContent>
        {overrideActions !== null && (onClose !== null || onConfirm || overrideActions) && (
          <DialogActions>
            {overrideActions ? (
              overrideActions({
                defaultCloseBtn: btnClose,
                defaultConfirmBtn: btnConfirm,
                onClose: close,
                onConfirm: confirm,
              })
            ) : (
              <>
                {onClose !== null && btnClose}
                {onConfirm && btnConfirm}
              </>
            )}
          </DialogActions>
        )}
      </Dialog>
    </>
  )
}
