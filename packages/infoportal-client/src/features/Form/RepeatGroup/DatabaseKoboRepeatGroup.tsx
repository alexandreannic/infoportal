import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useI18n} from '@/core/i18n'
import {useQueryAnswer} from '@/core/query/useQueryAnswer'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {columnBySchemaGenerator, ColumnBySchemaGeneratorProps} from '@/features/Form/Database/columns/columnBySchema'
import {IpBtn, Page} from '@/shared'
import {Datatable} from '@/shared/Datatable/Datatable'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {Panel} from '@/shared/Panel'
import {map} from '@axanc/ts-utils'
import {useTheme} from '@mui/material'
import {KoboFlattenRepeatedGroup, KoboSchemaHelper} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useMemo} from 'react'
import {Ip} from 'infoportal-api-sdk'
import {appRoutes} from '@/Router'
import {useNavigate, Link, useSearch} from '@tanstack/react-router'

export const DatabaseKoboRepeatRoute = () => {
  const {workspaceId, formId, group} = appRoutes.workspace.forms.byId.group.useParams()
  const querySchema = useQuerySchema({workspaceId, formId})

  return (
    <Page
      width="full"
      sx={{p: 0, pb: 0, mb: 0}}
      animation="translateLeft"
      animationDeps={[formId]}
      loading={querySchema.isLoading}
    >
      {map(querySchema.data, schema => (
        <Panel sx={{mb: 0}}>
          <DatabaseKoboRepeat schema={schema} group={group} formId={formId} workspaceId={workspaceId} />
        </Panel>
      ))}
    </Page>
  )
}

export const getColumnsForRepeatGroup = ({
  groupName,
  formId,
  schema,
  onRepeatGroupClick,
  m,
  t,
}: {
  groupName: string
  formId: Kobo.FormId
  schema: KoboSchemaHelper.Bundle
  onRepeatGroupClick?: ColumnBySchemaGeneratorProps['onRepeatGroupClick']
  m: ColumnBySchemaGeneratorProps['m']
  t: ColumnBySchemaGeneratorProps['t']
}) => {
  const groupInfo = schema.helper.group.getByName(groupName)!
  const res: DatatableColumn.Props<KoboFlattenRepeatedGroup.Data>[] = []
  const schemaGenerator = columnBySchemaGenerator({
    onRepeatGroupClick,
    formId,
    schema,
    t,
    m,
  })
  if (groupInfo.depth > 1) {
    res.push(
      {
        type: 'select_one',
        id: '_parent_table_name',
        head: '_parent_table_name',
        renderQuick: (_: KoboFlattenRepeatedGroup.Data) => _._parent_table_name,
      },
      {
        type: 'string',
        id: '_parent_index',
        head: '_parent_index',
        renderQuick: (_: KoboFlattenRepeatedGroup.Data) => '' + _._parent_index,
      },
    )
  }
  res.push(
    {
      type: 'string',
      id: '_index',
      head: '_index',
      renderQuick: _ => '' + _._index,
    },
    schemaGenerator.getId(),
    schemaGenerator.getSubmissionTime(),
    ...schemaGenerator.getByQuestions(groupInfo.questions),
  )
  return res
}

const DatabaseKoboRepeat = ({
  schema,
  workspaceId,
  group,
  formId,
}: {
  workspaceId: Ip.Uuid
  formId: Ip.FormId
  group: string
  schema: KoboSchemaHelper.Bundle
}) => {
  const t = useTheme()
  const {m} = useI18n()
  const qs = useSearch({from: appRoutes.workspace.forms.byId.group.fullPath})

  const navigate = useNavigate()

  const queryAnswers = useQueryAnswer({workspaceId, formId})
  const data = queryAnswers.data?.data
  const groupInfo = schema.helper.group.getByName(group)!
  const paths = groupInfo.pathArr

  const {columns, filters} = useMemo(() => {
    const res = getColumnsForRepeatGroup({
      formId,
      schema,
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
        id: qs.id,
        ...(qs.index ? {_parent_index: {value: qs.index}} : {}),
      },
    }
  }, [formId, group, schema, data])

  const flat = useMemo(() => {
    return KoboFlattenRepeatedGroup.run({data: data ?? [], path: paths})
  }, [data, groupInfo])

  return (
    <Datatable
      defaultFilters={{}}
      header={
        groupInfo.depth > 1 ? (
          <Link
            params={{workspaceId, formId, group: paths[paths.length - 2]}}
            to="/$workspaceId/form/$formId/group/$group"
            search={{
              id: qs.id,
            }}
          >
            <IpBtn variant="contained" icon="arrow_back">
              {m.back}
            </IpBtn>
          </Link>
        ) : (
          <Link params={{workspaceId, formId}} to="/$workspaceId/form/$formId/answers">
            <IpBtn variant="contained" icon="arrow_back">
              {m.back}
            </IpBtn>
          </Link>
        )
      }
      id={`db${formId}-g${group}`}
      columns={columns}
      data={flat}
    />
  )
}
