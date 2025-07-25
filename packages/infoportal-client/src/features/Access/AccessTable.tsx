import React, {ReactNode, useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {Obj, seq} from '@axanc/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {TableIconBtn} from '@/shared/TableIcon'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {useFetcher} from '@/shared/hook/useFetcher'
import {Txt} from '@/shared/Txt'
import {Datatable} from '@/shared/Datatable/Datatable'
import {useQueryFormAccess} from '@/core/query/useQueryFormAccess'
import {Ip} from 'infoportal-api-sdk'
import {useSession} from '@/core/Session/SessionContext'

export const AccessTable = ({
  isAdmin,
  header,
  workspaceId,
  formId,
}: {
  formId: Ip.FormId
  workspaceId: Ip.WorkspaceId
  isAdmin?: boolean
  header?: ReactNode
}) => {
  const {m, formatDate} = useI18n()
  const {user} = useSession()
  const {api} = useAppSettings()
  const drcJobs = useFetcher(api.user.fetchJobs)
  const queryAccess = useQueryFormAccess.getByFormId({workspaceId, formId})
  const queryAccessUpdate = useQueryFormAccess.update({workspaceId, formId})
  const queryAccessRemove = useQueryFormAccess.remove({workspaceId, formId})

  useEffect(() => {
    drcJobs.fetch({}, {workspaceId})
  }, [])

  return (
    <Datatable<Ip.Form.Access>
      defaultLimit={100}
      id="access"
      getRenderRowKey={_ => _.id}
      loading={queryAccess.isLoading}
      header={header}
      data={queryAccess.data}
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
            seq(queryAccess.data?.map(_ => _.location))
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
          options: () => Obj.keys(Ip.AccessLevel).map(_ => ({value: _, label: _})),
          render: row => {
            if (!!row.groupName) return {value: undefined, label: ''}
            if (isAdmin)
              return {
                value: row.level,
                label: (
                  <IpSelectSingle<keyof typeof Ip.AccessLevel>
                    value={row.level}
                    placeholder=""
                    onChange={_ => queryAccessUpdate.mutate({id: row.id, level: _})}
                    hideNullOption
                    disabled={!!row.groupName}
                    options={Obj.keys(Ip.AccessLevel)}
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
                      disabled={_.email === user.email}
                      loading={queryAccessRemove.isPending}
                      onClick={() => queryAccessRemove.mutateAsync({id: _.id})}
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
