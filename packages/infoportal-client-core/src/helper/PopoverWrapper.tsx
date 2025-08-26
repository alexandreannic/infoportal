import React, {ReactElement, ReactNode, useMemo, useState} from 'react'
import {Popover, PopoverProps} from '@mui/material'

export const PopoverWrapper = ({
  content,
  children,
  popoverProps,
  ...props
}: {
  children: ReactElement<any>
  content: (close: () => void) => ReactNode
  popoverProps?: Omit<PopoverProps, 'children' | 'anchorEl' | 'open' | 'onClose'>
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  const resovledContent = useMemo(() => {
    if (open) return content(handleClose)
  }, [content, open])

  return (
    <>
      {React.cloneElement(children, {
        onClick: (event: any) => {
          if (children.props.onClick) children.props.onClick(event)
          handleClick(event)
        },
      })}
      <Popover {...popoverProps} children={resovledContent} open={open} anchorEl={anchorEl} onClose={handleClose} />
    </>
  )
}
