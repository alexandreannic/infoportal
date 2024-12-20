import {IpBtn, Page} from '@/shared'
import {Panel} from '@/shared/Panel'
import {NavLink, useNavigate, useParams, useSearchParams} from 'react-router-dom'
import {map} from '@alexandreannic/ts-utils'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {Kobo} from 'kobo-sdk'
import {KoboFlattenRepeat, KoboFlattenRepeatData, KoboSchemaHelper} from 'infoportal-common'
import * as yup from 'yup'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {useEffect, useMemo} from 'react'
import {useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {Datatable} from '@/shared/Datatable/Datatable'
import {databaseIndex} from '@/features/Database/databaseIndex'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {columnBySchemaGenerator, ColumnBySchemaGeneratorProps} from '@/features/Database/KoboTable/columns/columnBySchema'

const databaseUrlParamsValidation = yup.object({
  formId: yup.string().required(),
  group: yup.string().required(),
})

export const DatabaseKoboRepeatRoute = () => {
  const ctxSchema = useKoboSchemaContext()
  const {formId, group} = databaseUrlParamsValidation.validateSync(useParams())
  const schemaLoader = ctxSchema.byId[formId]
  return (
    <Page width="full" sx={{p: 0, pb: 0, mb: 0,}} animation="translateLeft" animationDeps={[formId]} loading={schemaLoader?.loading}>
      {map(schemaLoader?.get, schema =>
        <Panel sx={{mb: 0}}>
          <DatabaseKoboRepeat
            schema={schema}
            group={group}
            formId={formId}
          />
        </Panel>
      )}
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
  const res: DatatableColumn.Props<KoboFlattenRepeatData>[] = []
  const schemaGenerator = columnBySchemaGenerator({
    onRepeatGroupClick,
    formId,
    schema,
    t,
    m,
  })
  if (groupInfo.depth > 1) {
    res.push({
      type: 'select_one',
      id: '_parent_table_name',
      head: '_parent_table_name',
      renderQuick: (_: KoboFlattenRepeatData) => _._parent_table_name,
    }, {
      type: 'string',
      id: '_parent_index',
      head: '_parent_index',
      renderQuick: (_: KoboFlattenRepeatData) => '' + _._parent_index,
    })
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
    ...schemaGenerator.getByQuestions(groupInfo.questions)
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
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const qs = {
    id: searchParams.get('id') ?? undefined,
    index: searchParams.get('index') ?? undefined,
  }
  const fetcherAnswers = useKoboAnswersContext().byId(formId)
  const data = fetcherAnswers.get?.data
  const t = useTheme()
  const {m} = useI18n()
  const groupInfo = schema.helper.group.getByName(group)!
  const paths = groupInfo.pathArr

  useEffect(() => {
    fetcherAnswers.fetch({force: false, clean: false})
  }, [formId])

  const {columns, filters} = useMemo(() => {
    const res = getColumnsForRepeatGroup({
      formId,
      schema,
      t,
      m,
      onRepeatGroupClick: _ => navigate(databaseIndex.siteMap.group.absolute(formId, _.name, _.row.id, _.row._index)),
      groupName: groupInfo.name,
    })
    return {
      columns: res,
      filters: {
        id: qs.id,
        ...qs.index ? {_parent_index: {value: qs.index}} : {},
      }
    }
  }, [formId, group, schema, data])

  const flat = useMemo(() => {
    return KoboFlattenRepeat.run(fetcherAnswers.get?.data ?? [], paths)
  }, [fetcherAnswers.get?.data, groupInfo])

  return (
    <Datatable
      defaultFilters={filters}
      header={
        <NavLink to={groupInfo.depth > 1
          ? databaseIndex.siteMap.group.absolute(formId, paths[paths.length - 2], qs.id)
          : databaseIndex.siteMap.database.absolute(formId)
        }>
          <IpBtn variant="contained" icon="arrow_back">{m.back}</IpBtn>
        </NavLink>
      }
      id={`db${formId}-g${group}`}
      columns={columns}
      data={flat}
    />
  )
}
