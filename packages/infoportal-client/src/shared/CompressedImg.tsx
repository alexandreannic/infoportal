import {Box, BoxProps, useTheme} from '@mui/material'
import {useEffect, useMemo} from 'react'

const handleImage = ({
  url,
  height = 500,
  quality,
  id,
}: Param & {
  id: string
}) => {
  const imgElement = new Image()
  imgElement.crossOrigin = 'Anonymous'
  imgElement.src = url
  imgElement.onload = function () {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const targetWidth = height
    const targetHeight = (imgElement.height * height) / imgElement.width
    canvas.width = targetWidth
    canvas.height = targetHeight

    ctx.drawImage(imgElement, 0, 0, height, targetHeight)
    const resizedImageDataUrl = canvas.toDataURL('image/jpeg', quality)

    const el = document.getElementById(id)
    if (el) {
      el.style.backgroundImage = `url(${resizedImageDataUrl})`
    }
  }
}

interface Param {
  height?: number
  quality?: number
  url: string
}

export const CompressedImg = ({url, height, quality, sx, ...props}: BoxProps & Param) => {
  const t = useTheme()
  const id = useMemo(() => props.id ?? '' + Math.random(), [props.id])

  useEffect(() => {
    handleImage({
      id,
      url,
      height,
      quality,
    })
  }, [url, height, quality, props.id])

  return (
    <Box
      id={id}
      {...props}
      sx={{
        m: 0.5,
        borderRadius: t.shape.borderRadius + 'px',
        backgroundColor: t.palette.divider,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: 'auto',
        '&:before': {
          paddingTop: '100%',
          content: '" "',
          display: 'block',
        },
        ...sx,
      }}
    />
  )
}
