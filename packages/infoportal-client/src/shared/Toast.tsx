// import * as React from 'react'
import {createContext, ReactNode, useContext, useState} from 'react'
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  SnackbarProps,
  useTheme,
} from '@mui/material'

const ToastContext = createContext<WithToast>({} as any)

type ToastType = 'error' | 'loading' | 'warning' | 'success' | 'info' | undefined

export interface ToastOptions extends Pick<SnackbarProps, 'autoHideDuration' | 'action'> {
  onClose?: (event: any) => void
  keepOpenOnClickAway?: boolean
}

export interface ToastRef {
  setOpen: (_: boolean) => void
  setType: (_: ToastType | undefined) => void
  setMessage: (_: string | undefined) => void
  setOptions: (_: ToastOptions | undefined) => void
}

export interface WithToast {
  toastError: (m: string, options?: ToastOptions) => ToastRef
  toastSuccess: (m: string, options?: ToastOptions) => ToastRef
  toastWarning: (m: string, options?: ToastOptions) => ToastRef
  toastInfo: (m: string, options?: ToastOptions) => ToastRef
  toastLoading: (m: string, options?: ToastOptions) => ToastRef
}

export interface ToastProviderProps {
  children: ReactNode
  vertical?: 'top' | 'bottom'
  horizontal?: 'left' | 'center' | 'right'
}

export const ToastProvider = ({children, vertical = 'bottom', horizontal = 'left'}: ToastProviderProps) => {
  const t = useTheme()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<ToastType | undefined>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [options, setOptions] = useState<ToastOptions | undefined>()

  const pop = (type: ToastType) => (message: string, options?: ToastOptions) => {
    setOpen(true)
    setType(type)
    setMessage(message)
    setOptions(options)
    return {setOpen, setType, setMessage, setOptions}
  }

  const renderIcon = (type: ToastType) => {
    switch (type!) {
      case 'error':
        return <Icon sx={{color: t.palette.error.main}}>error</Icon>
      case 'success':
        return <Icon sx={{color: t.palette.success.main}}>check_circle</Icon>
      case 'warning':
        return <Icon sx={{color: t.palette.warning.main}}>warning</Icon>
      case 'info':
        return <Icon sx={{color: t.palette.info.main}}>info</Icon>
      case 'loading':
        return <CircularProgress size={24} thickness={5} />
      default:
        return <></>
    }
  }

  const handleClose = (event: any, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway' && options?.keepOpenOnClickAway) {
    } else {
      setOpen(false)
    }
    options?.onClose?.(event)
  }

  return (
    <ToastContext.Provider
      value={{
        toastError: pop('error'),
        toastSuccess: pop('success'),
        toastWarning: pop('warning'),
        toastInfo: pop('info'),
        toastLoading: pop('loading'),
      }}
    >
      {children}
      <Snackbar
        anchorOrigin={{vertical, horizontal}}
        open={open}
        autoHideDuration={
          options?.autoHideDuration === undefined ? (type === 'error' ? null : 6000) : options.autoHideDuration
        }
        onClose={handleClose}
        message={
          <div style={{display: 'flex', alignItems: 'center'}}>
            {renderIcon(type)}
            <Box component="span" sx={{ml: 2}}>
              {message}
            </Box>
          </div>
        }
        action={
          <>
            {options?.action}
            <IconButton onClick={handleClose} color="inherit" size="large" sx={options?.action ? {ml: 1} : {}}>
              <Icon>close</Icon>
            </IconButton>
          </>
        }
      />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

export const withToast = (Component: any) => (props: any) => (
  <ToastContext.Consumer>{(other: WithToast) => <Component {...props} {...other} />}</ToastContext.Consumer>
)
