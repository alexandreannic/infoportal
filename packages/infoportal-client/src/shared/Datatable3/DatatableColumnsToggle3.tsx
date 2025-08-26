import {Badge, Chip, Icon, IconButton, IconButtonProps, Switch, Tooltip} from '@mui/material'
import React, {useEffect, useMemo} from 'react'
import {Core} from '@/shared'
import {useI18n} from '@/core/i18n'
import {useSetState} from '@axanc/react-hooks'
import {DatatableHeadIconByType} from '@/shared/Datatable/DatatableHead'
import {DatatableHeadTypeIconByKoboType} from '@/features/Form/Database/columns/DatatableHeadTypeIconByFormType'
import {Datatable3} from '@/shared/Datatable3/Datatable3.js'
import {Datatable} from './state/types'

type DatatableColumnToggleProps = Pick<
  Datatable.Column.InnerProps<any>,
  'group' | 'id' | 'typeLabel' | 'typeIcon' | 'type' | 'head'
>

interface Props extends Omit<IconButtonProps, 'onChange'> {
  columns: DatatableColumnToggleProps[]
  hiddenColumns: string[]
  onChange: (hidden: string[]) => void
  title?: string
}

export const DatatableColumnToggle3 = ({
  className,
  title,
  columns,
  hiddenColumns,
  onChange,
  children,
  ...props
}: Props) => {
  const {m} = useI18n()
  const set = useSetState(hiddenColumns)
  const hasGroup = useMemo(() => !!columns.find(_ => _.group), [columns])

  useEffect(() => {
    set.reset(hiddenColumns)
  }, [hiddenColumns])

  // columns.map(_ => _.)
  return (
    <Core.PopoverWrapper
      content={() => (
        <>
          <Core.Alert deletable="permanent" id="datatable-alert-cols-toggle" color="info">
            Use table filters to quickly toggle bunch of columns. For example, to hide all the <br />
            <code>calculate</code> columns (<DatatableHeadTypeIconByKoboType children="calculate" />
            ), select them from column <b>{m.type}</b> and click on&nbsp;
            <Chip
              sx={{mr: 1, fontWeight: 'bold'}}
              icon={<Icon>remove_circle</Icon>}
              variant="outlined"
              color="error"
              label={m.remove + ' n'}
              disabled={true}
            />
          </Core.Alert>
          <Datatable3<DatatableColumnToggleProps>
            onEvent={console.log}
            header={_ => (
              <>
                <Chip
                  sx={{mr: 1, fontWeight: 'bold'}}
                  icon={<Icon>check_circle</Icon>}
                  variant="outlined"
                  color="success"
                  label={m.add + ' ' + _.filteredAndSortedData.filter(_ => set.has(_.id)).length}
                  onClick={() => set.delete(_.filteredAndSortedData.map(_ => _.id))}
                />
                <Chip
                  sx={{mr: 1}}
                  icon={<Icon>remove_circle</Icon>}
                  variant="outlined"
                  color="error"
                  onClick={() => set.add(_.filteredAndSortedData.filter(_ => !set.has(_.id)).map(_ => _.id))}
                  label={m.remove + ' ' + _.filteredAndSortedData.length}
                />
                <Core.Txt bold>
                  <Core.Txt size="big" sx={{fontWeight: 600}}>
                    {columns.length - set.size}
                  </Core.Txt>{' '}
                  / {columns.length} {m._koboDatabase.currentlyDisplayed}
                </Core.Txt>
                <Core.Btn variant="contained" sx={{marginLeft: 'auto'}} onClick={() => onChange(set.toArray)}>
                  {m.save}
                </Core.Btn>
              </>
            )}
            contentProps={{sx: {maxHeight: 500}}}
            defaultLimit={500}
            id="datatable-column-toggle"
            getRowKey={_ => _.id}
            data={columns}
            columns={[
              {
                id: 'action',
                type: 'select_one',
                head: '',
                width: 60,
                render: _ => {
                  return {
                    label: (
                      <Switch
                        size="small"
                        checked={!set.has(_.id)}
                        onChange={() => {
                          set.toggle(_.id)
                        }}
                      />
                    ),
                    option: <Switch size="small" checked={!set.has(_.id)} disabled />,
                    value: !set.has(_.id) ? m.visible : m.hidden,
                  }
                },
              },
              {
                id: 'type',
                width: 60,
                align: 'center',
                type: 'select_one',
                head: m.type,
                render: _ => {
                  return {
                    option: (
                      <>
                        {_.typeIcon} {_.typeLabel ?? _.type}
                      </>
                    ),
                    label: _.typeIcon ?? <DatatableHeadIconByType type={_.type} />,
                    value: _.typeLabel ?? _.type ?? '',
                  }
                },
              },
              ...(hasGroup
                ? [
                    {
                      type: 'select_one',
                      head: m.group,
                      id: 'group',
                      width: 150,
                      render: (_: DatatableColumnToggleProps) => {
                        return {
                          value: _.group?.id,
                          label: _.group?.label,
                        }
                      },
                    } as const,
                  ]
                : []),
              {
                id: 'question',
                width: 400,
                type: 'select_one',
                head: m.question,
                render: _ => {
                  return {
                    option: _.head,
                    value: _.id,
                    label: _.head,
                    tooltip: _.head,
                  }
                },
              },
            ]}
          />
        </>
      )}
    >
      <Tooltip title={title ?? ''}>
        <IconButton {...props}>
          <Badge
            color={'primary'}
            badgeContent={columns.length === hiddenColumns.length ? '!' : columns.length - hiddenColumns.length}
            invisible={hiddenColumns.length === 0}
          >
            {children ?? <Icon>table_chart</Icon>}
          </Badge>
        </IconButton>
      </Tooltip>
    </Core.PopoverWrapper>
  )
}
