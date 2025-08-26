import {Box} from '@mui/material'
import {ViewMoreText} from '@/shared/ViewMoreText'
import {Seq} from '@axanc/ts-utils'
import React, {memo, ReactNode, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {Core} from '@/shared'

export interface CommentsPanelProps {
  pageSize?: number
  height?: number
  data: Seq<{
    id: number | string
    title?: ReactNode
    date?: Date
    desc?: string
    children?: ReactNode
  }>
}

export const CommentsPanel = memo(({data, height = 650, pageSize = 5}: CommentsPanelProps) => {
  const [limit, setLimit] = useState(pageSize)
  const {m, formatDateTime} = useI18n()
  return (
    <Box sx={{maxHeight: height, overflowY: 'auto'}}>
      {data.slice(0, limit).map(row => (
        <Box
          key={row.id}
          sx={{
            pb: 2,
            pr: 1,
            '&:not(:last-of-type)': {
              mb: 2,
              borderBottom: t => `1px solid ${t.vars.palette.divider}`,
            },
          }}
        >
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Core.Txt block bold size="big">
              {row.title}
            </Core.Txt>
            <Core.Txt color="hint">{formatDateTime(row.date)}</Core.Txt>
          </Box>
          {row.desc && (
            <Core.Txt block color="hint" sx={{mb: 1}}>
              <ViewMoreText limit={210} children={row.desc} />
            </Core.Txt>
          )}
          {row.children}
        </Box>
      ))}
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {limit > pageSize && (
          <Core.Btn
            icon="remove"
            variant="outlined"
            sx={{mr: 1}}
            color="primary"
            onClick={() => setLimit(_ => _ - pageSize)}
          >
            {m.viewNMore(pageSize)}
          </Core.Btn>
        )}
        {limit < data.length && (
          <Core.Btn icon="add" variant="outlined" color="primary" onClick={() => setLimit(_ => _ + pageSize)}>
            {m.viewNMore(pageSize)}
          </Core.Btn>
        )}
      </Box>
    </Box>
  )
})
