import {Access, AccessLevel} from '@/core/sdk/server/access/Access'
import React, {ReactNode, useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {UUID} from 'infoportal-common'
import {useAsync, UseAsyncMultiple} from '@/shared/hook/useAsync'
import {Obj, seq} from '@axanc/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {TableIconBtn} from '@/shared/TableIcon'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {UseFetcher, useFetcher} from '@/shared/hook/useFetcher'
import {Txt} from '@/shared/Txt'
import {Datatable} from '@/shared/Datatable/Datatable'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useQueryAccess} from '@/core/query/useQueryAccess'

export const AccessTable = ({
  isAdmin,
  header,
  onRemoved,
  renderParams = _ => JSON.stringify(_),
}: {
  isAdmin?: boolean
  renderParams?: (_: any) => ReactNode
  onRemoved?: (_: UUID) => void
  header?: ReactNode
}) => {
  const {workspaceId} = useWorkspaceRouter()
  const {m, formatDate} = useI18n()
  const {api} = useAppSettings()
  const drcJobs = useFetcher(api.user.fetchDrcJobs)
  const queryAccess = useQueryAccess(workspaceId)

  useEffect(() => {
    drcJobs.fetch({}, {workspaceId})
  }, [])

  return (
    <Datatable<Access>
      defaultLimit={100}
      id="access"
      getRenderRowKey={_ => _.id}
      loading={queryAccess.getAll.isLoading}
      header={header}
      data={queryAccess.getAll.data}
      columns={[
        {
          width: 80,
          id: 'createdAt',
          type: 'date',
          head: m.createdAt,
          render: _ => {
            return {
              label: <Txt color="hint">{formatDate(_.createdAt)}</Txt>,
              value: _.createdAt,
            }
          },
        },
        {
          id: 'drcJob',
          head: m.drcJob,
          renderQuick: _ => _.drcJob,
          type: 'select_one',
          options: () => drcJobs.get?.map(job => ({value: job, label: job})) || [],
        },
        {
          id: 'drcOffice',
          head: m.location,
          renderQuick: _ => _.drcOffice,
          type: 'select_one',
          options: () =>
            seq(queryAccess.getAll.data?.map(_ => _.drcOffice))
              .distinct(_ => _)
              .compact()
              .map(_ => ({value: _, label: _})),
        },
        {
          id: 'email',
          head: m.email,
          renderQuick: _ => _.email,
        },
        {
          id: 'group',
          type: 'select_one',
          head: m.group,
          renderQuick: _ => _.groupName ?? DatatableUtils.blank,
        },
        {
          width: 90,
          id: 'level',
          head: m.accessLevel,
          type: 'select_one',
          options: () => Obj.keys(AccessLevel).map(_ => ({value: _, label: _})),
          render: row => {
            if (!!row.groupName) return {value: undefined, label: ''}
            if (isAdmin)
              return {
                value: row.level,
                label: (
                  <IpSelectSingle<AccessLevel>
                    value={row.level}
                    placeholder=""
                    onChange={_ => queryAccess.update.mutate({id: row.id, level: _ as AccessLevel})}
                    hideNullOption
                    disabled={!!row.groupName}
                    options={Obj.keys(AccessLevel)}
                  />
                ),
              }
            return {value: row.level, label: row.level}
          },
        },
        {
          id: 'params',
          head: m.filter,
          render: _ => {
            return {
              label: renderParams(_.params),
              value: _.params,
            }
          },
        },
        ...(isAdmin
          ? [
              {
                id: 'actions',
                width: 0,
                head: '',
                align: 'right',
                renderQuick: (_: Access) => {
                  return (
                    <TableIconBtn
                      loading={queryAccess.remove.isPending}
                      onClick={() => queryAccess.remove.mutateAsync({id: _.id}).then(() => onRemoved?.(_.id))}
                      children="delete"
                    />
                  )
                },
              } as const,
            ]
          : []),
      ]}
    />
  )
}
