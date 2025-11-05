import * as React from 'react'
import {cloneElement, useRef, useState, ReactElement, useEffect, ReactNode} from 'react'
import {Box, useTheme, SxProps, Modal} from '@mui/material'
import html2canvas from 'html2canvas'
import {IconBtn} from '../IconBtn.js'
import {openCanvasInNewTab} from '../../core/utils.js'
export interface PanelFeaturesProps {
  sx?: SxProps
  expendable?: boolean
  savableAsImg?: boolean
  children: ReactElement<{ref?: any; children?: ReactNode; className?: string; sx?: SxProps}>
}

/**
 * A wrapper that adds "expand fullscreen" and "save as image" features
 * to any component supporting the `sx` prop.
 * It adds no extra DOM layer—modifies only style + overlays toolbar inside.
 */
export const PanelFeatures = ({children, expendable, savableAsImg, sx}: PanelFeaturesProps) => {
  const t = useTheme()
  const [expanded, setExpanded] = useState(false)
  const contentRef = useRef<HTMLElement>(null)

  const saveAsImg = async () => {
    if (!contentRef.current) return
    const canvas = await html2canvas(contentRef.current, {
      useCORS: true,
      backgroundColor: t.palette.background.paper,
    })
    openCanvasInNewTab(canvas, 'panel-snapshot')
  }

  useEffect(() => {
    if (!expanded) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setExpanded(false)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [expanded])

  const toolbar = (
    <Box
      className="panel-features"
      sx={{
        p: 0.5,
        position: 'absolute',
        display: 'none',
        top: 0,
        right: 0,
        background: t.palette.background.paper,
        borderBottomLeftRadius: 4,
        ...sx,
        '.panel-root:hover &': {display: 'flex'},
      }}
    >
      {expendable && (
        <IconBtn size="small" sx={{p: 0, color: t.palette.text.secondary}} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'fullscreen_exit' : 'fullscreen'}
        </IconBtn>
      )}
      {savableAsImg && (
        <IconBtn size="small" sx={{ml: 1, p: 0, color: t.palette.text.secondary}} onClick={saveAsImg}>
          download
        </IconBtn>
      )}
    </Box>
  )

  const base = cloneElement(children, {
    ref: contentRef,
    className: `panel-root ${children.props.className ?? ''}`,
    sx: {
      ...children.props.sx,
      position: 'relative',
      '&:hover .panel-features': {display: 'flex'},
    },
    children: (
      <>
        {children.props.children}
        {(!expanded && (expendable || savableAsImg)) && toolbar}
      </>
    ),
  })

  return (
    <>
      {base}
      {expendable && (
        <Modal open={expanded} onClose={() => setExpanded(false)} closeAfterTransition sx={{zIndex: 9999, p: 2}}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'auto',
              bgcolor: t.palette.background.default,
              display: 'flex',
              flexDirection: 'column',
              p: 2,
            }}
          >
            {cloneElement(base, {
              sx: {
                ...base.props.sx,
                m: 0,
                flex: 1,
                boxShadow: 'none',
              },
              children: (
                <>
                  {base.props.children}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <IconBtn size="small" sx={{color: t.palette.text.disabled}} onClick={() => setExpanded(false)}>
                      fullscreen_exit
                    </IconBtn>
                    {savableAsImg && (
                      <IconBtn size="small" sx={{color: t.palette.text.disabled}} onClick={saveAsImg}>
                        download
                      </IconBtn>
                    )}
                  </Box>
                </>
              ),
            })}
          </Box>
        </Modal>
      )}
    </>
  )
}
