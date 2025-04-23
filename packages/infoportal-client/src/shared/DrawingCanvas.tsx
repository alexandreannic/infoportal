import React, {useEffect, useRef, useState} from 'react'
import {Box, BoxProps, useTheme} from '@mui/material'
import {IpIconBtn} from '@/shared/IconBtn'

interface DrawingProps extends Pick<BoxProps, 'sx'> {
  width: number
  height: number
}

export const DrawingCanvas = ({width, height, sx}: DrawingProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const t = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const startDrawing = (event: MouseEvent) => {
      const {offsetX, offsetY} = event
      context.beginPath()
      context.moveTo(offsetX, offsetY)
      setIsDrawing(true)
    }

    const draw = (event: MouseEvent) => {
      if (!isDrawing) return

      const {offsetX, offsetY} = event
      context.lineTo(offsetX, offsetY)
      context.lineCap = 'round'
      context.lineWidth = 2
      context.stroke()
    }

    const stopDrawing = () => {
      context.closePath()
      setIsDrawing(false)
    }

    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mouseout', stopDrawing)

    return () => {
      canvas.removeEventListener('mousedown', startDrawing)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDrawing)
      canvas.removeEventListener('mouseout', stopDrawing)
    }
  }, [isDrawing])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <Box
      sx={{
        width: width,
        height: height,
        position: 'relative',
        '&:hover>.drawing-canvas-clear': {
          display: 'block',
        },
        ...sx,
      }}
    >
      <canvas
        style={{border: '1px solid ' + t.palette.divider, borderRadius: t.shape.borderRadius + 'px'}}
        ref={canvasRef}
        width={width}
        height={height}
      />
      <IpIconBtn
        size="small"
        className="drawing-canvas-clear"
        sx={{
          display: 'none',
          position: 'absolute',
          top: 0,
          right: -26,
        }}
        onClick={clearCanvas}
      >
        clear
      </IpIconBtn>
    </Box>
  )
}
