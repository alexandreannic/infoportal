import React, {useEffect, useRef, useState} from 'react'
import {BoxProps} from '@mui/material'
import {makeStyles} from 'tss-react/mui'
import debounce from 'lodash.debounce'

const useStyles = makeStyles()((t) => ({
  root: {
    resize: 'horizontal',
    overflow: 'hidden',
    position: 'relative',
    minWidth: '100%',
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    '&:after': {
      borderRadius: 2,
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease, top 0.3s ease, bottom 0.3s ease' as any,
      content: '" "',
      width: 3,
      display: 'block',
      position: 'absolute',
      top: 4,
      bottom: 4,
      right: 0,
      background: 'transparent',
    },
    '&:hover:after': {
      top: 0,
      bottom: 0,
      background: t.palette.primary.main,
      // boxShadow: `0 0px 3px 1px ${t.palette.primary.main}`,
    },
  },
}))

export const ResizableDiv = ({
  initialWidth,
  id,
  style,
  debounceTime = 1200,
  onResize,
  ...props
}: Pick<BoxProps, 'style' | 'children'> & {
  id: string
  debounceTime?: number
  initialWidth?: number
  onResize?: (id: string, newWidth: number) => void
}) => {
  const {classes} = useStyles()
  const divRef = useRef<HTMLDivElement | null>(null)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    if (!onResize) return

    const handleMouseUp = debounce(() => {
      if (isResizing && divRef.current) {
        onResize(id, divRef.current.offsetWidth)
      }
      setIsResizing(false)
    }, debounceTime)

    const handleMouseDown = () => {
      setIsResizing(true)
    }

    document.addEventListener('mouseup', handleMouseUp)
    const currentDiv = divRef.current
    if (currentDiv) {
      currentDiv.addEventListener('mousedown', handleMouseDown)
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      if (currentDiv) {
        currentDiv.removeEventListener('mousedown', handleMouseDown)
      }
      handleMouseUp.cancel()
    }
  }, [id, debounceTime, onResize, isResizing])

  return (
    <div
      ref={divRef}
      style={{
        width: initialWidth,
        ...style,
      }}
      className={classes.root}
      {...props}
    />
  )
}
