import {Messages, useI18n} from '@infoportal/client-i18n'
import {UseQuerySubmission} from '@/core/query/useQuerySubmission'
import {useQuerySchemaBundle} from '@/core/query/useQuerySchema'
import {Core, Datatable} from '@/shared'
import {map} from '@axanc/ts-utils'
import {Theme, useTheme} from '@mui/material'
import {KoboFlattenRepeatedGroup, KoboSchemaHelper} from '@infoportal/kobo-helper'
import {useMemo} from 'react'
import {Ip} from '@infoportal/api-sdk'
import {createRoute, Link, useNavigate} from '@tanstack/react-router'
import {z} from 'zod'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {TabContent} from '@/shared/Tab/TabContent.js'
import {buildDbColumns, defaultColWidth, OnRepeatGroupClick} from '@infoportal/database-column'
import {getKoboAttachmentUrl} from '@/core/KoboAttachmentUrl.js'

export const databaseKoboRepeatRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'group/$group',
  component: DatabaseKoboRepeatContainer,
  validateSearch: z.object({
    id: z.string().optional(),
    index: z.number().optional(),
  }),
})

function DatabaseKoboRepeatContainer() {
  const {workspaceId, formId, group} = databaseKoboRepeatRoute.useParams() as {
    workspaceId: Ip.WorkspaceId
    formId: Ip.FormId
    group: string
  }
  const {id, index} = databaseKoboRepeatRoute.useSearch()
  const {langIndex} = useFormContext()

  const querySchema = useQuerySchemaBundle({workspaceId, formId, langIndex})

  return (
    <TabContent width="full" sx={{p: 0, pb: 0, mb: 0}} animationDeps={[formId]} loading={querySchema.isLoading}>
      {map(querySchema.data, schema => (
        <Core.Panel sx={{mb: 0}}>
          <DatabaseKoboRepeat
            id={id}
            index={index}
            schema={schema}
            group={group}
            formId={formId}
            workspaceId={workspaceId}
          />
        </Core.Panel>
      ))}
    </TabContent>
  )
}

const DatabaseKoboRepeat = ({
  schema,
  id,
  index,
  workspaceId,
  group,
  formId,
}: {
  id?: string
  index?: number
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  group: string
  schema: KoboSchemaHelper.Bundle
}) => {
  const t = useTheme()
  const {m} = useI18n()

  const navigate = useNavigate()

  const queryAnswers = UseQuerySubmission.search({workspaceId, formId})
  const queryUpdate = UseQuerySubmission.update()
  const data = queryAnswers.data?.data
  const groupInfo = schema.helper.group.getByName(group)!
  const paths = groupInfo?.pathArr

  const {columns, filters} = useMemo(() => {
    const res = getColumnsForRepeatGroup({
      queryUpdateAnswer: queryUpdate,
      formId,
      schema,
      workspaceId,
      t,
      m,
      onRepeatGroupClick: _ =>
        navigate({
          to: '/$workspaceId/form/$formId/group/$group',
          params: {group: _.name, workspaceId, formId},
          search: {
            id: _.row.id,
            index: _.row._index,
          },
        }),
      groupName: groupInfo.name,
    })
    return {
      columns: res,
      filters: {
        id: id,
        ...(index ? {_parent_index: {value: index}} : {}),
      },
    }
  }, [formId, group, schema, data])

  const flat = useMemo(() => {
    return KoboFlattenRepeatedGroup.run({
      data: data?.map(_ => ({id: _.id, submissionTime: _.submissionTime, ..._.answers})) ?? [],
      path: paths,
    })
  }, [data, groupInfo])

  const defaultFilters = useMemo(() => {
    return {id}
  }, [id])

  return (
    <Datatable.Component
      getRowKey={_ => _.id + '-' + (_._parent_index ?? '') + '-' + _._index}
      defaultFilters={defaultFilters}
      showRowIndex
      module={{
        cellSelection: {
          mode: 'free',
          enabled: true,
        },
        columnsResize: {
          enabled: true,
        },
        export: {
          enabled: true,
        },
      }}
      header={
        groupInfo.depth > 1 ? (
          <Link
            params={{workspaceId, formId, group: paths[paths.length - 2]}}
            to="/$workspaceId/form/$formId/group/$group"
            search={{
              id,
            }}
          >
            <Core.Btn variant="contained" icon="arrow_back">
              {m.back}
            </Core.Btn>
          </Link>
        ) : (
          <Link params={{workspaceId, formId}} to="/$workspaceId/form/$formId/answers">
            <Core.Btn variant="contained" icon="arrow_back">
              {m.back}
            </Core.Btn>
          </Link>
        )
      }
      id={`db${formId}-g${group}`}
      columns={columns}
      data={flat}
    />
  )
}

export function getColumnsForRepeatGroup({
  groupName,
  formId,
  schema,
  workspaceId,
  onRepeatGroupClick,
  queryUpdateAnswer,
  m,
  t,
}: {
  workspaceId: Ip.WorkspaceId
  groupName: string
  formId: Ip.FormId
  schema: KoboSchemaHelper.Bundle
  onRepeatGroupClick?: OnRepeatGroupClick
  queryUpdateAnswer: Parameters<typeof buildDbColumns.question.byQuestions>[0]['queryUpdateAnswer']
  m: Messages
  t: Theme
}) {
  const groupInfo = schema.helper.group.getByName(groupName)!
  const res: Datatable.Column.Props<KoboFlattenRepeatedGroup.Data>[] = []
  if (groupInfo.depth > 1) {
    res.push({
      width: defaultColWidth,
      type: 'select_one',
      id: '_parent_table_name',
      head: '_parent_table_name',
      renderQuick: (_: KoboFlattenRepeatedGroup.Data) => _._parent_table_name,
    })
  }
  res.push(
    {
      type: 'string',
      align: 'center',
      width: 50,
      id: '_parent_index',
      head: '_parent_index',
      renderQuick: (_: KoboFlattenRepeatedGroup.Data) => '' + _._parent_index,
    },
    buildDbColumns.meta.id(),
    buildDbColumns.meta.submissionTime({m}),
    ...buildDbColumns.question.byQuestions({
      getFileUrl: getKoboAttachmentUrl,
      queryUpdateAnswer,
      workspaceId,
      formId,
      questions: groupInfo.questions,
      onRepeatGroupClick,
      schema,
      t,
      m,
    }),
  )
  return res
}
