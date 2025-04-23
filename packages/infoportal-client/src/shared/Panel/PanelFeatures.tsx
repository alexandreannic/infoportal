import * as React from 'react'
import {ReactNode, useRef, useState} from 'react'
import {Box, useTheme} from '@mui/material'
import html2canvas from 'html2canvas'
import {Utils} from '@/utils/utils'
import {IpIconBtn} from '@/shared/IconBtn'

export const PanelFeatures = ({
  children,
  expendable,
  savableAsImg,
}: {
  expendable?: boolean
  savableAsImg?: boolean
  children: ReactNode
}) => {
  const [expended, setExpended] = useState(false)
  const content = useRef<HTMLDivElement>(null)
  const t = useTheme()
  const saveAsImg = () => {
    html2canvas(content.current!, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: 'transparent',
      // backgroundColor: t.palette.background.default,
    }).then((_) => Utils.openCanvasInNewTab(_, 'imaa-tools-static'))
  }

  return (
    <Box
      sx={{
        ...(expended
          ? {
              zIndex: 9990,
              position: 'fixed',
              fontSize: 17,
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }
          : {}),
        position: 'relative',
        '&:hover .panel-features': {
          display: 'block',
        },
      }}
    >
      <Box ref={content}>{children}</Box>
      <Box
        className="panel-features"
        sx={{
          p: 0.5,
          position: 'absolute',
          display: 'none',
          background: (t) => t.palette.background.paper,
          top: 0,
          right: 0,
        }}
      >
        {expendable && (
          <IpIconBtn
            size="small"
            sx={{marginLeft: 'auto', p: 0, color: (t) => t.palette.text.disabled}}
            onClick={() => setExpended((_) => !_)}
          >
            {expended ? 'fullscreen_exit' : 'fullscreen'}
          </IpIconBtn>
        )}
        {savableAsImg && (
          <IpIconBtn size="small" sx={{ml: 1, p: 0, color: (t) => t.palette.text.disabled}} onClick={saveAsImg}>
            download
          </IpIconBtn>
        )}
      </Box>
    </Box>
  )
}
