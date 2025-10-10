import {IconBtn, styleUtils} from '@infoportal/client-core'
import {styled, useTheme} from '@mui/material'
import {Obj, seq} from '@axanc/ts-utils'
import {memo, useMemo} from 'react'
import {Column} from '../core/types.js'

export const primaryColors = [
  '#2196F3',
  '#FF9800',
  '#673AB7',
  '#009688',
  '#F44336',
  '#00BCD4',
  '#FFEE58',
  '#9C27B0',
  '#CDDC39',
  '#E91E63',
]

const Th = styled('div', {label: 'DatatableHeadSection-th', slot: 'TH'})(({theme}) => ({
  height: 6,
  transition: theme.transitions.create('all'),
  minHeight: '100%',
  padding: '0 !important',
  display: 'flex',
  alignItems: 'center',
  position: 'sticky',
  left: 0,
  ...styleUtils(theme).truncate,
}))

const Content = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  transition: theme.transitions.create('all'),
  opacity: 0,
}))

const BtnHide = styled(IconBtn)(({theme}) => ({
  minWidth: 30,
}))

const Tr = styled('div')(({theme}) => ({
  display: 'contents',
  cursor: 'pointer',
  fontSize: styleUtils(theme).fontSize.small,
  '&:hover .DtHeadSectionCell-Th': {
    height: 32,
  },

  '&:hover .DtHeadSectionCell-Content': {
    opacity: 1,
  },
}))

export const DatatableHeadSections = memo(DatatableHeadSections_)

function DatatableHeadSections_({
  columns,
  onHideColumns,
}: {
  columns: Column.InnerProps<any>[]
  onHideColumns: (_: string[]) => void
}) {
  const t = useTheme()

  const {groups, groupSpans} = useMemo(() => {
    const groups = Obj.entries(seq(columns).groupBy(_ => _.group?.label ?? ''))
    const groupSpans: string[] = []
    let offset = 1
    groups.forEach(([g, cols], i) => {
      groupSpans[i] = `${offset} / span ${cols.length}`
      offset += cols.length
    })
    return {groups, groupSpans}
  }, [columns])

  return (
    <Tr>
      {groups.length > 1 &&
        groups.map(([group, cols], i) => {
          const color = cols[0]?.group?.color ?? primaryColors[i % primaryColors.length]
          return (
            <Th
              className="DtHeadSectionCell-Th"
              key={group}
              style={{
                gridColumn: groupSpans[i],
                // i !== groups.length - 1 ? `${prevSpan ? prevSpan + 1 : 1} / span ${cols.length}` : undefined,
                color: t.palette.getContrastText(color),
                background: color,
              }}
            >
              <Content title={group} className="DtHeadSectionCell-Content">
                <BtnHide
                  sx={{
                    mr: 0.5,
                    color: t.palette.getContrastText(primaryColors[i % primaryColors.length]),
                  }}
                  size="small"
                  color="primary"
                  onClick={() => onHideColumns(cols.map(_ => _.id))}
                >
                  visibility_off
                </BtnHide>
                {group}
              </Content>
            </Th>
          )
        })}
    </Tr>
  )
}
