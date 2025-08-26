import {IpIconBtn} from '@/shared/index.js'
import {useTheme} from '@mui/material'
import {makeStyles} from 'tss-react/mui'
import {styleUtils} from '@/core/theme.js'
import {Obj, seq} from '@axanc/ts-utils'
import {Datatable} from '@/shared/Datatable3/state/types.js'
import {memo, useMemo} from 'react'
import {useDatatable3Context} from '@/shared/Datatable3/state/DatatableContext.js'

const colors = [
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

const useStyles = makeStyles()(t => ({
  tr: {
    width: 'max-content',
    display: 'grid',
    transition: t.transitions.create('all'),
    cursor: 'pointer',
    fontSize: styleUtils(t).fontSize.small,
    height: 6,
    '&:hover ': {
      height: 32,
    },
    '&:hover .TableHeadSectionCell-content': {
      opacity: 1,
    },
  },
  th: {
    minHeight: '100%',
    padding: '0 !important',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
    left: 0,
    ...styleUtils(t).truncate,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    transition: t.transitions.create('all'),
    opacity: 0,
  },
  btn: {
    minWidth: 30,
  },
}))
export const DatatableHeadSections = memo(DatatableHeadSections_)

function DatatableHeadSections_({
  columns,
  onHideColumns,
}: {
  columns: Datatable.Column.InnerProps<any>[]
  onHideColumns: (_: string[]) => void
}) {
  const colWidths = useDatatable3Context(_ => _.columns.widths)
  const t = useTheme()
  const {classes, cx} = useStyles()

  const {groups, cssGridTemplate} = useMemo(() => {
    const groups = Obj.entries(seq(columns).groupBy(_ => _.group?.label ?? ''))
    const cssGridTemplate =
      groups
        .map(([group, cols]) => {
          return seq(cols)
            .map(_ => colWidths[_.id] ?? _.width ?? 120)
            .sum(_ => _)
        })
        .join('px ') + 'px'
    return {groups, cssGridTemplate}
  }, [columns, colWidths])

  return (
    <div className={classes.tr} style={{gridTemplateColumns: cssGridTemplate}}>
      {groups.length > 1 &&
        groups.map(([group, cols], i) => {
          return (
            <div
              key={group}
              style={{
                color: t.palette.getContrastText(colors[i % colors.length]),
                background: colors[i % colors.length],
              }}
              className={classes.th}
            >
              <div title={group} className={cx(classes.content, 'TableHeadSectionCell-content')}>
                <Core.IconBtn
                  sx={{
                    mr: 0.5,
                    color: t.palette.getContrastText(colors[i % colors.length]),
                  }}
                  className={classes.btn}
                  size="small"
                  color="primary"
                  onClick={() => onHideColumns(cols.map(_ => _.id))}
                >
                  visibility_off
                </Core.IconBtn>
                {group}
              </div>
            </div>
          )
        })}
    </div>
  )
}
