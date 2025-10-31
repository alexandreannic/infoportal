import {Core} from '@/shared'
import {removeHtml} from 'infoportal-common'
import {useMemo} from 'react'

export const WidgetTitle = ({sx, children, ...props}: Omit<Core.TxtProps, 'children'> & {children: string}) => {
  const title = useMemo(() => removeHtml(children), [children])
  return (
    <Core.Txt title={title} block size="big" bold sx={{mb: 1, ...sx}} {...props}>
      {removeHtml(title)}
    </Core.Txt>
  )
}
