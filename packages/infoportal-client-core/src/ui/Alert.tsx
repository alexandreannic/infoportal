import * as React from 'react'
import {forwardRef, ReactNode, useState} from 'react'
import {Alert as MuiAlert, AlertProps} from '@mui/material'
import {usePersistentState} from '@axanc/react-hooks'

export type IpAlertProps = Omit<AlertProps, 'id'> & {
  hidden?: boolean
  action?: ReactNode
} & (
    | {
        id: string
        deletable: 'permanent'
      }
    | {
        id?: string
        deletable?: undefined | 'transient'
      }
  )

export const Alert = forwardRef(({content, hidden, deletable, sx, onClose, ...props}: IpAlertProps, ref) => {
  const [isPersistentVisible, setPersistentIsVisible] = usePersistentState<boolean>(true, {
    storageKey: props.id!,
  })
  const [isVisible, setIsVisible] = useState<boolean>(true)

  return (
    <MuiAlert
      {...props}
      ref={ref as any}
      sx={{
        ...sx,
        ...((hidden || !isVisible || (deletable === 'permanent' && !isPersistentVisible)) && {
          minHeight: '0 !important',
          height: '0 !important',
          opacity: '0 !important',
          padding: '0 !important',
          margin: '0 !important',
        }),
      }}
      onClose={
        deletable
          ? (e: any) => {
              setIsVisible(false)
              onClose?.(e)
              if (deletable === 'permanent') setPersistentIsVisible(false)
            }
          : onClose
      }
    />
  )
})
