import React, {ReactNode} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Obj, seq} from '@axanc/ts-utils'
import {Core, Datatable} from '@/shared'
import {UseQueryFormAccess} from '@/core/query/useQueryFormAccess'
import {Ip} from '@infoportal/api-sdk'
import {useSession} from '@/core/Session/SessionContext'
import {UseQueryUser} from '@/core/query/useQueryUser.js'
import {useQuerySchemaBundle} from '@/core/query/useQuerySchema'
import {useFormContext} from '@/features/Form/Form'

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
  const {langIndex} = useFormContext()
  const queryJobs = UseQueryUser.getJobs(workspaceId)
  const queryAccess = UseQueryFormAccess.getByFormId({workspaceId, formId})
  const queryAccessUpdate = UseQueryFormAccess.update({workspaceId, formId})
  const queryAccessRemove = UseQueryFormAccess.remove({workspaceId, formId})
  const querySchema = useQuerySchemaBundle({workspaceId, formId, langIndex})
  return (
    <Datatable.Component<Ip.Access>
      id="access"
      getRowKey={_ => _.id}
      loading={queryAccess.isLoading || queryAccessUpdate.isPending}
      header={header}
      data={queryAccess.data}
      columns={[
        {
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
          id: 'location',
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
        {
          id: 'filter_question',
          type: 'select_one',
          head: m.question,
          renderQuick: _ => querySchema.data?.translate.question(_.filters ? Obj.keys(_.filters)[0] : ''),
        },
        {
          id: 'filter_choices',
          type: 'select_multiple',
          options: () => [],
          head: m.choices,
          render: _ => {
            const question = Obj.keys(_.filters ?? {})[0]
            const choices =
              _.filters?.[question]
                .map(_ => _)
                .map(_ => (querySchema.data ? querySchema.data?.translate.choice(question, _) : _)) ?? []
            return {
              value: choices,
              label: choices.join(', '),
            }
          },
        },
        ...(isAdmin
          ? [
              {
                id: 'actions',
                head: '',
                width: 40,
                align: 'right',
                renderQuick: (_: Ip.Access) => {
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
