import {Icon, useTheme} from '@mui/material'
import {makeStyles} from 'tss-react/mui'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {map, Obj, seq} from '@axanc/ts-utils'
import {Core} from '@/shared'

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
    cursor: 'pointer',
    fontSize: Core.styleUtils(t).fontSize.small,
    '&:hover .TableHeadSectionCell-content': {
      opacity: 1,
      height: 32,
    },
  },
  th: {
    padding: '0 !important',
    height: '6px !important',
    maxWidth: 0,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: t.transitions.create('all'),
    opacity: 0,
    height: 0,
  },
  btn: {
    minWidth: 30,
  },
  tooltip: {
    display: 'flex',
    alignItems: 'center',
  },
}))

export const TableHeadSectionCell = ({
  columns,
  hasCheckboxColumn,
  onHideColumns,
}: {
  hasCheckboxColumn: boolean
  columns: DatatableColumn.InnerProps<any>[]
  onHideColumns: (_: string[]) => void
}) => {
  const t = useTheme()
  const {classes, cx} = useStyles()
  return (
    <tr className={cx('tr', classes.tr)}>
      {map(
        Obj.entries(seq(columns).groupBy(_ => _.groupLabel ?? '')),
        groups =>
          groups.length > 1 &&
          groups.map(([group, cols], i) => (
            <th
              key={group}
              style={{
                color: t.palette.getContrastText(colors[i % colors.length]),
                background: colors[i % colors.length],
              }}
              colSpan={i === 0 ? cols.length + (hasCheckboxColumn ? 1 : 0) : cols.length}
              className={classes.th}
            >
              <div className={cx(classes.content, 'TableHeadSectionCell-content')}>
                {group}&nbsp;
                <Core.Btn
                  className={classes.btn}
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => onHideColumns(cols.map(_ => _.id))}
                >
                  <Icon fontSize="small">visibility_off</Icon>
                </Core.Btn>
              </div>
            </th>
          )),
      )}
    </tr>
  )
}
