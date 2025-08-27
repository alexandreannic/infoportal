import React, {ReactNode} from 'react'
import {useI18n} from '@/core/i18n'
import {Obj, seq} from '@axanc/ts-utils'
import {Core, Datatable} from '@/shared'
import {useQueryFormAccess} from '@/core/query/useQueryFormAccess'
import {Ip} from 'infoportal-api-sdk'
import {useSession} from '@/core/Session/SessionContext'
import {useQueryUser} from '@/core/query/useQueryUser.js'

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
  const queryJobs = useQueryUser.getJobs(workspaceId)
  const queryAccess = useQueryFormAccess.getByFormId({workspaceId, formId})
  const queryAccessUpdate = useQueryFormAccess.update({workspaceId, formId})
  const queryAccessRemove = useQueryFormAccess.remove({workspaceId, formId})

  return (
    <Datatable.Component<Ip.Form.Access>
      defaultLimit={100}
      id="access"
      getRowKey={_ => _.id}
      loading={queryAccess.isLoading || queryAccessUpdate.isPending}
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
              label: <Core.Txt color="hint">{formatDate(_.createdAt)}</Core.Txt>,
              value: _.createdAt,
            }
          },
        },
        {
          id: 'job',
          head: m.job,
          renderQuick: _ => _.job,
          type: 'select_one',
          options: () => queryJobs.data?.map(job => ({value: job, label: job})) || [],
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
          renderQuick: _ => _.groupName ?? Datatable.Utils.blank,
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
                  <Core.SelectSingle<keyof typeof Ip.AccessLevel>
                    value={row.level}
                    placeholder=""
                    onChange={_ => queryAccessUpdate.mutate({id: row.id, formId, level: _})}
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
                    <Datatable.IconBtn
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
