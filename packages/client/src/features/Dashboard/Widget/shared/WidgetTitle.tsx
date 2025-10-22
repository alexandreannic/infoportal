import {Core} from '@/shared'
import React from 'react'

export const WidgetTitle = ({sx, ...props}: Core.TxtProps) => {
  return <Core.Txt title={props.children as string} block size="big" bold sx={{mb: 1, ...sx}} {...props} />
}
