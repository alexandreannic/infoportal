import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@/core/i18n'
import {KoboMappedAnswer} from '@/core/sdk/server/kobo/KoboMapper'
import {useSession} from '@/core/Session/SessionContext'
import {useIpToast} from '@/core/useToast'
import {columnBySchemaGenerator} from '@/features/Form/Database/columns/columnBySchema'
import {getColumnsBase} from '@/features/Form/Database/columns/columnsBase'
import {useCustomSelectedHeader} from '@/features/Form/Database/customization/useCustomSelectedHeader'
import {DatabaseImportBtn} from '@/features/Form/Database/DatabaseImportBtn'
import {useDatabaseKoboTableContext} from '@/features/Form/Database/DatabaseContext'
import {DatabaseKoboSyncBtn} from '@/features/Form/Database/DatabaseKoboSyncBtn'
import {DatabaseTableProps} from '@/features/Form/Database/DatabaseTable'
import {generateEmptyXlsTemplate} from '@/features/Form/Database/generateEmptyXlsFile'
import {databaseKoboDisplayBuilder} from '@/features/Form/Database/groupDisplay/DatabaseKoboDisplay'
import {DatabaseViewInput} from '@/features/Form/Database/view/DatabaseViewInput'
import {getColumnsForRepeatGroup} from '@/features/Form/RepeatGroup/DatabaseKoboRepeatGroup'
import {useKoboDialogs, useLangIndex} from '@/core/store/useLangIndex'
import {Datatable} from '@/shared/Datatable/Datatable'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {DatatableXlsGenerator} from '@/shared/Datatable/util/generateXLSFile'
import {useAsync} from '@/shared/hook/useAsync'
import {IpIconBtn} from '@/shared/IconBtn'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {Alert, AlertProps, Icon, useTheme} from '@mui/material'
import {KoboFlattenRepeatedGroup} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useMemo, useState} from 'react'
import {DatabaseGroupDisplayInput} from './groupDisplay/DatabaseGroupDisplayInput'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {useNavigate} from '@tanstack/react-router'

export const ArchiveAlert = ({sx, ...props}: AlertProps) => {
  const t = useTheme()
  const {m} = useI18n()
  return (
    <Alert
      color="info"
      icon={<Icon sx={{mr: -1}}>archive</Icon>}
      sx={{pr: t.spacing(1), pl: t.spacing(0.5), pt: 0, pb: 0, ...sx}}
      {...props}
    >
      {m._koboDatabase.isArchived}
    </Alert>
  )
}

export const DatabaseTableContent = ({
  workspaceId,
  onFiltersChange,
  onDataChange,
}: Pick<DatabaseTableProps, 'workspaceId' | 'onFiltersChange' | 'onDataChange'>) => {
  const {m} = useI18n()
  const t = useTheme()
  const langIndex = useLangIndex(_ => _.langIndex)
  const setLangIndex = useLangIndex(_ => _.setLangIndex)
  const navigate = useNavigate()
  const session = useSession()
  const ctx = useDatabaseKoboTableContext()
  const dialogs = useKoboDialogs()

  const queryUpdate = useQueryAnswerUpdate()

  const [selectedIds, setSelectedIds] = useState<Kobo.SubmissionId[]>([])

  const flatData: KoboMappedAnswer[] | undefined = useMemo(() => {
    if (ctx.groupDisplay.get.repeatAs !== 'rows' || ctx.groupDisplay.get.repeatGroupName === undefined) return ctx.data
    return KoboFlattenRepeatedGroup.run({
      data: ctx.data,
      path: [ctx.groupDisplay.get.repeatGroupName],
      replicateParentData: true,
    }) as (KoboFlattenRepeatedGroup.Cursor & KoboMappedAnswer)[]
  }, [ctx.data, ctx.groupDisplay.get])

  const schemaColumns = useMemo(() => {
    const schemaColumns = columnBySchemaGenerator({
      formId: ctx.form.id,
      schema: ctx.schema,
      externalFilesIndex: ctx.externalFilesIndex,
      onRepeatGroupClick: _ =>
        navigate({
          to: '/$workspaceId/form/$formId/group/$group',
          params: {workspaceId, formId: ctx.form.id, group: _.name},
          search: {
            id: _.row.id,
            index: _.row._index,
          },
        }),
      onEdit:
        selectedIds.length > 0
          ? questionName =>
              dialogs.openBulkEditAnswers({
                workspaceId,
                formId: ctx.form.id,
                question: questionName,
                answerIds: selectedIds,
              })
          : undefined,
      m,
      t,
    }).getAll()
    return databaseKoboDisplayBuilder({
      data: ctx.data ?? [],
      formId: ctx.form.id,
      schema: ctx.schema,
      onRepeatGroupClick: _ =>
        navigate({
          to: '/$workspaceId/form/$formId/group/$group',
          params: {workspaceId, formId: ctx.form.id, group: _.name},
          search: {
            id: _.row.id,
            index: _.row._index,
          },
        }),
      display: ctx.groupDisplay.get,
      m,
      t,
    }).transformColumns(schemaColumns)
  }, [ctx.data, ctx.schema.schema, langIndex, selectedIds, ctx.groupDisplay.get, ctx.externalFilesIndex, t])

  const columns: DatatableColumn.Props<any>[] = useMemo(() => {
    const base = getColumnsBase({
      selectedIds,
      queryUpdate: queryUpdate,
      workspaceId,
      formId: ctx.form.id,
      canEdit: ctx.access.write,
      m,
      dialogs,
    })
    return [...base, ...schemaColumns].map(_ => ({
      ..._,
      width: ctx.view.colsById[_.id]?.width ?? _.width ?? 90,
    }))
  }, [schemaColumns, ctx.view.currentView])

  const {api} = useAppSettings()
  const selectedHeader = useCustomSelectedHeader({workspaceId, access: ctx.access, formId: ctx.form.id, selectedIds})
  const _importFromXLS = useAsync(api.importData.importFromXLSFile)
  const {toastHttpError} = useIpToast()

  const handleImportData = async (file: File, action: 'create' | 'update') => {
    await _importFromXLS.call(ctx.form.id, file, action).catch(toastHttpError)
  }

  const handleGenerateTemplate = async () => {
    if (ctx.schema && ctx.form) {
      await generateEmptyXlsTemplate(ctx.schema, ctx.form.name + '_Template')
    }
  }

  return (
    <>
      <Datatable
        onResizeColumn={ctx.view.onResizeColumn}
        loading={ctx.loading}
        columnsToggle={{
          disableAutoSave: true,
          hidden: ctx.view.hiddenColumns,
          onHide: ctx.view.setHiddenColumns,
        }}
        contentProps={{sx: {maxHeight: 'calc(100vh - 216px)'}}}
        showExportBtn
        rowsPerPageOptions={[20, 50, 100, 200]}
        onFiltersChange={onFiltersChange}
        onDataChange={onDataChange}
        select={
          ctx.access.write
            ? {
                onSelect: setSelectedIds,
                selectActions: selectedHeader,
                getId: _ => _.id,
              }
            : undefined
        }
        exportAdditionalSheets={data => {
          return ctx.schema.helper.group.search().map(group => {
            const cols = getColumnsForRepeatGroup({
              formId: ctx.form.id,
              t,
              m,
              schema: ctx.schema,
              groupName: group.name,
            })
            return {
              sheetName: group.name as string,
              data: KoboFlattenRepeatedGroup.run({data, path: group.pathArr}),
              schema: cols.map(DatatableXlsGenerator.columnsToParams),
            }
          })
        }}
        title={ctx.form.name}
        id={ctx.form.id}
        getRenderRowKey={_ => _.id + (_._index ?? '')}
        columns={columns}
        data={flatData}
        header={params => (
          <>
            <DatabaseViewInput sx={{mr: 1}} view={ctx.view} />
            <IpSelectSingle<number>
              hideNullOption
              sx={{maxWidth: 128, mr: 1}}
              value={langIndex}
              onChange={setLangIndex}
              options={[
                {children: 'XML', value: -1},
                ...ctx.schema.schemaSanitized.translations.map((_, i) => ({children: _, value: i})),
              ]}
            />
            {ctx.schema.helper.group.size > 0 && <DatabaseGroupDisplayInput sx={{mr: 1}} />}
            {ctx.form.deploymentStatus === 'archived' && <ArchiveAlert />}

            <div style={{marginLeft: 'auto'}}>
              {ctx.form.source === 'kobo' && (
                <IpIconBtn
                  disabled={!ctx.form.enketoUrl || ctx.form.deploymentStatus === 'archived'}
                  href={ctx.form.enketoUrl ?? ''}
                  target="_blank"
                  children="file_open"
                  tooltip={m._koboDatabase.openKoboForm}
                />
              )}
              {ctx.form.source === 'kobo' && (
                <DatabaseKoboSyncBtn
                  loading={ctx.asyncRefresh.loading}
                  tooltip={
                    ctx.form.updatedAt && (
                      <div dangerouslySetInnerHTML={{__html: m._koboDatabase.pullDataAt(ctx.form.updatedAt)}} />
                    )
                  }
                  onClick={ctx.asyncRefresh.call}
                />
              )}

              {session.user.admin && (
                <DatabaseImportBtn
                  onUploadNewData={file => handleImportData(file, 'create')}
                  onUpdateExistingData={file => handleImportData(file, 'update')}
                  onGenerateTemplate={handleGenerateTemplate}
                />
              )}
            </div>
          </>
        )}
      />
    </>
  )
}
