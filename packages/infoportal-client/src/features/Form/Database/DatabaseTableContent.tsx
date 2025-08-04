import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@/core/i18n'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {useIpToast} from '@/core/useToast'
import {useCustomSelectedHeader} from '@/features/Form/Database/customization/useCustomSelectedHeader'
import {DatabaseImportBtn} from '@/features/Form/Database/DatabaseImportBtn'
import {useDatabaseKoboTableContext} from '@/features/Form/Database/DatabaseContext'
import {DatabaseKoboSyncBtn} from '@/features/Form/Database/DatabaseKoboSyncBtn'
import {DatabaseTableProps} from '@/features/Form/Database/DatabaseTable'
import {generateEmptyXlsTemplate} from '@/features/Form/Database/generateEmptyXlsFile'
import {databaseKoboDisplayBuilder} from '@/features/Form/Database/groupDisplay/DatabaseKoboDisplay'
import {DatabaseViewInput} from '@/features/Form/Database/view/DatabaseViewInput'
import {useKoboDialogs, useLangIndex} from '@/core/store/useLangIndex'
import {useAsync} from '@/shared/hook/useAsync'
import {IpIconBtn} from '@/shared/IconBtn'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {Alert, AlertProps, Icon, useTheme} from '@mui/material'
import {KoboFlattenRepeatedGroup} from 'infoportal-common'
import {useEffect, useMemo, useState} from 'react'
import {DatabaseGroupDisplayInput} from './groupDisplay/DatabaseGroupDisplayInput'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {Link, useNavigate} from '@tanstack/react-router'
import {buildDatabaseColumns} from '@/features/Form/Database/columns/databaseColumnBuilder'
import {Ip} from 'infoportal-api-sdk'
import {AppAvatar} from '@/shared'
import {useFormSocket} from '@/features/Form/useFormSocket'
import {appConfig} from '@/conf/AppConfig.js'
import {Datatable3} from '@/shared/Datatable3/Datatable3.js'
import {Datatable} from '@/shared/Datatable3/types'

export const ArchiveAlert = ({sx, ...props}: AlertProps) => {
  const t = useTheme()
  const {m} = useI18n()
  return (
    <Alert
      color="info"
      icon={<Icon sx={{mr: -1}}>archive</Icon>}
      sx={{pr: t.vars.spacing, pl: `calc(${t.vars.spacing} * 0.5)`, pt: 0, pb: 0, ...sx}}
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
  const ctx = useDatabaseKoboTableContext()
  const dialogs = useKoboDialogs()
  const connectedUsers = useFormSocket({workspaceId, formId: ctx.form.id})

  const queryUpdate = useQueryAnswerUpdate()

  const [selectedIds, setSelectedIds] = useState<Ip.SubmissionId[]>([])

  const flatData: Submission[] | undefined = useMemo(() => {
    if (ctx.groupDisplay.get.repeatAs !== 'rows' || ctx.groupDisplay.get.repeatGroupName === undefined) return ctx.data
    return KoboFlattenRepeatedGroup.run({
      data: ctx.data,
      path: [ctx.groupDisplay.get.repeatGroupName],
      replicateParentData: true,
    }) as (KoboFlattenRepeatedGroup.Cursor & Submission)[]
  }, [ctx.data, ctx.groupDisplay.get])

  const schemaColumns = useMemo(() => {
    const schemaColumns = buildDatabaseColumns.type.bySchema({
      getRow: (_: Submission) => _.answers,
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
    })
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

  const columns: Datatable.Column.Props<any>[] = useMemo(() => {
    const base = buildDatabaseColumns.meta.all({
      selectedIds,
      queryUpdate: queryUpdate,
      workspaceId,
      formId: ctx.form.id,
      canEdit: ctx.permission.answers_canUpdate,
      koboEditEnketoUrl: ctx.koboEditEnketoUrl,
      m,
      dialogs,
    })
    return [...base, ...schemaColumns].map(_ => ({
      ..._,
      width: ctx.view.colsById[_.id]?.width ?? _.width ?? 90,
    }))
  }, [schemaColumns, ctx.view.currentView])

  const {api} = useAppSettings()
  const selectedHeader = useCustomSelectedHeader({
    workspaceId,
    permission: ctx.permission,
    formId: ctx.form.id,
    selectedIds,
  })
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
  useEffect(() => {
    console.log('PARENT recompile flatData', flatData?.length)
  }, [flatData])

  return (
    <>
      <Datatable3
        onEvent={console.log}
        // onResizeColumn={ctx.view.onResizeColumn}
        loading={ctx.loading}
        // columnsToggle={{
        //   disableAutoSave: true,
        //   hidden: ctx.view.hiddenColumns,
        //   onHide: ctx.view.setHiddenColumns,
        // }}
        contentProps={{sx: {maxHeight: 'calc(100vh - 216px)'}}}
        // showExportBtn
        rowsPerPageOptions={[20, 50, 100, 200]}
        // onFiltersChange={onFiltersChange}
        // onDataChange={onDataChange}
        // select={
        //   ctx.permission.answers_canUpdate
        //     ? {
        //         onSelect: (_: string[]) => setSelectedIds(_ as Ip.SubmissionId[]),
        //         selectActions: selectedHeader,
        //         getId: _ => _.id,
        //       }
        //     : undefined
        // }
        // exportAdditionalSheets={data => {
        //   return ctx.schema.helper.group.search().map(group => {
        //     const cols = getColumnsForRepeatGroup({
        //       formId: ctx.form.id,
        //       t,
        //       m,
        //       schema: ctx.schema,
        //       groupName: group.name,
        //     })
        //     return {
        //       sheetName: group.name as string,
        //       data: KoboFlattenRepeatedGroup.run({data, path: group.pathArr}),
        //       schema: cols.map(DatatableXlsGenerator.columnsToParams),
        //     }
        //   })
        // }}
        title={ctx.form.name}
        id={ctx.form.id}
        getRowKey={_ => _.id + ((_ as any) /** TODO Make it typesafe?*/._index ?? '')}
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

            <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center'}}>
              {connectedUsers.length > 1 &&
                connectedUsers.map(_ => (
                  <AppAvatar size={36} email={_} overlap borderColor={t.vars.palette.primary.main} key={_} />
                ))}
              {ctx.form.kobo ? (
                <IpIconBtn
                  disabled={!ctx.form.kobo.enketoUrl || ctx.form.deploymentStatus === 'archived'}
                  href={ctx.form.kobo.enketoUrl ?? ''}
                  target="_blank"
                  children={appConfig.icons.openFormLink}
                  tooltip={m._koboDatabase.openForm}
                />
              ) : (
                <Link to="/collect/$workspaceId/$formId" params={{workspaceId, formId: ctx.form.id}}>
                  <IpIconBtn
                    disabled={ctx.form.deploymentStatus === 'archived'}
                    target="_blank"
                    children={appConfig.icons.openFormLink}
                    tooltip={m._koboDatabase.openForm}
                  />
                </Link>
              )}
              {ctx.form.kobo && (
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

              {ctx.permission.answers_import && (
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
