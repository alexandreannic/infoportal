import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useI18n} from '@/core/i18n'
import {useQueryAnswer} from '@/core/query/useQueryAnswer'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {
  columnBySchemaGenerator,
  ColumnBySchemaGeneratorProps,
} from '@/features/Database/KoboTable/columns/columnBySchema'
import {IpBtn, Page} from '@/shared'
import {Datatable} from '@/shared/Datatable/Datatable'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {Panel} from '@/shared/Panel'
import {map} from '@axanc/ts-utils'
import {useTheme} from '@mui/material'
import {KoboFlattenRepeatedGroup, KoboSchemaHelper} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useMemo} from 'react'
import {NavLink, useNavigate, useParams, useSearchParams} from 'react-router-dom'
import * as yup from 'yup'

const databaseUrlParamsValidation = yup.object({
  formId: yup.string().required(),
  group: yup.string().required(),
})

export const DatabaseKoboRepeatRoute = () => {
  const {formId, group} = databaseUrlParamsValidation.validateSync(useParams())
  const querySchema = useQuerySchema(formId)

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
          <DatabaseKoboRepeat schema={schema} group={group} formId={formId} />
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
  group,
  formId,
}: {
  formId: Kobo.FormId
  group: string
  schema: KoboSchemaHelper.Bundle
}) => {
  const t = useTheme()
  const {m} = useI18n()
  const {router} = useWorkspaceRouter()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const qs = {
    id: searchParams.get('id') ?? undefined,
    index: searchParams.get('index') ?? undefined,
  }

  const queryAnswers = useQueryAnswer(formId)
  const data = queryAnswers.data?.data
  const groupInfo = schema.helper.group.getByName(group)!
  const paths = groupInfo.pathArr

  const {columns, filters} = useMemo(() => {
    const res = getColumnsForRepeatGroup({
      formId,
      schema,
      t,
      m,
      onRepeatGroupClick: _ => navigate(router.database.form(formId).group(_.name, _.row.id, _.row._index)),
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
      defaultFilters={filters}
      header={
        <NavLink
          to={
            groupInfo.depth > 1
              ? router.database.form(formId).group(paths[paths.length - 2], qs.id)
              : router.database.form(formId).answers
          }
        >
          <IpBtn variant="contained" icon="arrow_back">
            {m.back}
          </IpBtn>
        </NavLink>
      }
      id={`db${formId}-g${group}`}
      columns={columns}
      data={flat}
    />
  )
}
