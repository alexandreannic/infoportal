import React, {ReactNode, useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {UUID} from 'infoportal-common'
import {Obj, seq} from '@axanc/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {TableIconBtn} from '@/shared/TableIcon'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {useFetcher} from '@/shared/hook/useFetcher'
import {Txt} from '@/shared/Txt'
import {Datatable} from '@/shared/Datatable/Datatable'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useQueryAccess} from '@/core/query/useQueryAccess'
import {Ip} from 'infoportal-api-sdk'

export const AccessTable = ({
  isAdmin,
  header,
  onRemoved,
}: {
  isAdmin?: boolean
  onRemoved?: (_: UUID) => void
  header?: ReactNode
}) => {
  const {workspaceId} = useWorkspaceRouter()
  const {m, formatDate} = useI18n()
  const {api} = useAppSettings()
  const drcJobs = useFetcher(api.user.fetchJobs)
  const queryAccess = useQueryAccess(workspaceId)

  useEffect(() => {
    drcJobs.fetch({}, {workspaceId})
  }, [])

  return (
    <Datatable<Ip.Form.Access>
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
          id: 'job',
          head: m.job,
          renderQuick: _ => _.job,
          type: 'select_one',
          options: () => drcJobs.get?.map(job => ({value: job, label: job})) || [],
        },
        {
          id: 'drcOffice',
          head: m.location,
          renderQuick: _ => _.location,
          type: 'select_one',
          options: () =>
            seq(queryAccess.getAll.data?.map(_ => _.location))
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
          options: () => Obj.keys(Ip.Form.Access.Level).map(_ => ({value: _, label: _})),
          render: row => {
            if (!!row.groupName) return {value: undefined, label: ''}
            if (isAdmin)
              return {
                value: row.level,
                label: (
                  <IpSelectSingle<Ip.Form.Access.Level>
                    value={row.level}
                    placeholder=""
                    onChange={_ => queryAccess.update.mutate({id: row.id, level: _})}
                    hideNullOption
                    disabled={!!row.groupName}
                    options={Obj.keys(Ip.Form.Access.Level)}
                  />
                ),
              }
            return {value: row.level, label: row.level}
          },
        },
        ...(isAdmin
          ? [
              {
                id: 'actions',
                width: 0,
                head: '',
                align: 'right',
                renderQuick: (_: Ip.Form.Access) => {
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
