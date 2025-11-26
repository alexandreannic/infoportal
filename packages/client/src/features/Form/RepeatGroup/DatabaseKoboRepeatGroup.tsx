import {Messages, useI18n} from '@infoportal/client-i18n'
import {UseQuerySubmission} from '@/core/query/form/useQuerySubmission'
import {Core, Datatable} from '@/shared'
import {map} from '@axanc/ts-utils'
import {Theme, useTheme} from '@mui/material'
import {FormDataFlattenRepeatGroup, SchemaInspector} from '@infoportal/kobo-helper'
import {useMemo} from 'react'
import {Ip} from '@infoportal/api-sdk'
import {createRoute, Link, useNavigate} from '@tanstack/react-router'
import {z} from 'zod'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {TabContent} from '@/shared/Tab/TabContent.js'
import {buildDbColumns, defaultColWidth, OnRepeatGroupClick} from '@infoportal/database-column'
import {getKoboAttachmentUrl} from '@/core/KoboAttachmentUrl.js'
import {UseQuerySchema} from '@/core/query/form/useQuerySchema'

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
  const langIndex = useFormContext(_ => _.langIndex)

  const querySchema = UseQuerySchema.getInspector({workspaceId, formId, langIndex})

  return (
    <TabContent width="full" sx={{p: 0, pb: 0, mb: 0}} animationDeps={[formId]} loading={querySchema.isLoading}>
      {map(querySchema.data, schema => (
        <Core.Panel sx={{mb: 0}}>
          <DatabaseKoboRepeat
            id={id}
            index={index}
            inspector={schema}
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
  inspector,
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
  inspector: SchemaInspector
}) => {
  const t = useTheme()
  const {m} = useI18n()

  const navigate = useNavigate()

  const queryAnswers = UseQuerySubmission.search({workspaceId, formId})
  const data = queryAnswers.data?.data
  const groupInfo = inspector.lookup.group.getByName(group)!
  const paths = groupInfo?.pathArr

  const {columns, filters} = useMemo(() => {
    const res = getColumnsForRepeatGroup({
      formId,
      inspector: inspector,
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
  }, [formId, group, inspector])

  const flat = useMemo(() => {
    return FormDataFlattenRepeatGroup.run({
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
  inspector,
  onRepeatGroupClick,
  m,
  t,
}: {
  groupName: string
  formId: Ip.FormId
  inspector: SchemaInspector
  onRepeatGroupClick?: OnRepeatGroupClick
  m: Messages
  t: Theme
}) {
  const groupInfo = inspector.lookup.group.getByName(groupName)!
  const res: Datatable.Column.Props<FormDataFlattenRepeatGroup.Data>[] = []
  if (groupInfo.depth > 1) {
    res.push({
      width: defaultColWidth,
      type: 'select_one',
      id: '_parent_table_name',
      head: '_parent_table_name',
      renderQuick: (_: FormDataFlattenRepeatGroup.Data) => _._parent_table_name,
    })
  }
  res.push(
    {
      type: 'string',
      align: 'center',
      width: 50,
      id: '_parent_index',
      head: '_parent_index',
      renderQuick: (_: FormDataFlattenRepeatGroup.Data) => '' + _._parent_index,
    },
    buildDbColumns.meta.id(),
    buildDbColumns.meta.submissionTime({m}),
    ...buildDbColumns.question.byQuestions({
      getFileUrl: getKoboAttachmentUrl,
      formId,
      questions: groupInfo.questions,
      onRepeatGroupClick,
      inspector: inspector,
      t,
      m,
    }),
  )
  return res
}
