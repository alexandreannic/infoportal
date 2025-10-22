import {Core} from '@/shared'
import React from 'react'

export function WidgetLabel({sx, ...props}: Core.TxtProps) {
  return <Core.Txt color="hint" size="small" sx={{...sx}} block {...props} />
}
