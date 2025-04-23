import {Badge, Chip, Icon, IconButton, IconButtonProps, Switch, Tooltip} from '@mui/material'
import React, {useEffect, useMemo} from 'react'
import {PopoverWrapper, Txt} from '@/shared'
import {useI18n} from '@/core/i18n'
import {Datatable} from '@/shared/Datatable/Datatable'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {IpBtn} from '@/shared/Btn'
import {useSetState} from '@alexandreannic/react-hooks-lib'
import {IpAlert} from '@/shared/Alert'
import {DatatableHeadTypeIconByKoboType} from '@/features/Database/KoboTable/columns/columnBySchema'
import {DatatableHeadIconByType} from '@/shared/Datatable/DatatableHead'

interface DatatableColumnToggleProps
  extends Pick<
    DatatableColumn.Props<any>,
    'group' | 'groupLabel' | 'id' | 'typeLabel' | 'typeIcon' | 'type' | 'head'
  > {}

interface Props extends Omit<IconButtonProps, 'onChange'> {
  // Hack because there is no way to make TS understand that the key of an object can
  // only be a string ({[key: string]: string} does not work...)
  columns: DatatableColumnToggleProps[]
  hiddenColumns: string[]
  onChange: (_: string[]) => void
  title?: string
}

export const DatatableColumnToggle = ({
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
  const hasGroup = useMemo(() => !!columns.find((_) => _.group), [columns])

  useEffect(() => {
    set.reset(hiddenColumns)
  }, [hiddenColumns])

  return (
    <PopoverWrapper
      content={() => (
        <>
          <IpAlert deletable="permanent" id="datatable-alert-cols-toggle" color="info">
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
          </IpAlert>
          <Datatable
            hidePagination
            header={(_) => (
              <>
                <Chip
                  sx={{mr: 1, fontWeight: 'bold'}}
                  icon={<Icon>check_circle</Icon>}
                  variant="outlined"
                  color="success"
                  label={m.add + ' ' + _.filteredData.filter((_) => set.has(_.id)).length}
                  onClick={() => set.delete(_.filteredData.map((_) => _.id))}
                />
                <Chip
                  sx={{mr: 1}}
                  icon={<Icon>remove_circle</Icon>}
                  variant="outlined"
                  color="error"
                  onClick={() => set.add(_.filteredData.filter((_) => !set.has(_.id)).map((_) => _.id))}
                  label={m.remove + ' ' + _.filteredData.length}
                />
                <Txt bold>
                  <Txt size="big" sx={{fontWeight: 600}}>
                    {columns.length - set.size}
                  </Txt>{' '}
                  / {columns.length} {m._koboDatabase.currentlyDisplayed}
                </Txt>
                <IpBtn variant="contained" sx={{marginLeft: 'auto'}} onClick={() => onChange(set.toArray)}>
                  {m.save}
                </IpBtn>
              </>
            )}
            contentProps={{sx: {maxHeight: 500}}}
            defaultLimit={500}
            id="datatable-column-toggle"
            hideColumnsToggle
            data={columns}
            columns={[
              {
                id: 'action',
                type: 'select_one',
                head: '',
                width: 0,
                render: (_) => {
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
                width: 0,
                type: 'select_one',
                head: m.type,
                render: (_) => {
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
                          value: _.group,
                          label: _.groupLabel,
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
                render: (_) => {
                  return {
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
    </PopoverWrapper>
  )
}
