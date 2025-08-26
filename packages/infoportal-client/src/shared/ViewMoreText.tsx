import {Box} from '@mui/material'
import React, {useEffect, useRef, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {Txt} from '../../../infoportal-client-core/src/Txt.js'
import {IpIconBtn} from '../../../infoportal-client-core/src/IconBtn.js'
import {IpBtn} from '../../../infoportal-client-core/src/Btn.js'

export const ViewMoreText = ({
  children,
  limit = 240,
  initialOpen,
}: {
  initialOpen?: boolean
  children: string
  limit?: number
}) => {
  const [open, setOpen] = useState(initialOpen)
  const {m} = useI18n()

  return (
    <Box>
      {open || children.length <= limit ? children : <>{children.substring(0, limit)}...</>}
      {children.length > limit && (
        <Txt sx={{cursor: 'pointer'}} link bold onClick={() => setOpen(_ => !_)}>
          &nbsp;{open ? m.viewLess : m.viewMore}
        </Txt>
      )}
    </Box>
  )
}

interface ExpandableDivProps {
  initialHeight?: number
  step?: number
  children: React.ReactNode
}

export const ViewMoreDiv: React.FC<ExpandableDivProps> = ({initialHeight = 300, step = 200, children}) => {
  const {m} = useI18n()
  const innerRef = useRef<HTMLDivElement>(null)
  const [expandedHeight, setExpandedHeight] = useState(initialHeight)
  const [contentHeight, setContentHeight] = useState(initialHeight)

  useEffect(() => {
    if (innerRef.current) {
      setContentHeight(innerRef.current.scrollHeight)
      setExpandedHeight(Math.min(initialHeight, innerRef.current.scrollHeight))
    }
  }, [children, initialHeight])

  const handleShowMore = () => {
    setExpandedHeight(prev => {
      const remaining = contentHeight - prev
      if (remaining <= step) return contentHeight
      return Math.min(prev + step, contentHeight)
    })
  }

  return (
    <div>
      <div
        style={{
          height: expandedHeight,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div ref={innerRef}>{children}</div>
      </div>
      {expandedHeight < contentHeight && (
        <Box display="flex" justifyContent="center">
          <CoreBtn icon="expand" size="small" variant="outlined" onClick={handleShowMore}>
            {m.viewMore}
          </CoreBtn>
          {/*<Core.IconBtn onClick={handleShowMore} sx={{mt: 1}}>*/}
          {/*  expand*/}
          {/*</Core.IconBtn>*/}
        </Box>
      )}
    </div>
  )
}
