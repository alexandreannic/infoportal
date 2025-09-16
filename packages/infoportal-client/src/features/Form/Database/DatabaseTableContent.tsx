import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@/core/i18n'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {useIpToast} from '@/core/useToast'
import {DatabaseSelectedRowsAction} from '@/features/Form/Database/DatabaseSelectedRowsAction'
import {DatabaseImportBtn} from '@/features/Form/Database/DatabaseImportBtn'
import {useDatabaseKoboTableContext} from '@/features/Form/Database/DatabaseContext'
import {DatabaseKoboSyncBtn} from '@/features/Form/Database/DatabaseKoboSyncBtn'
import {DatabaseTableProps} from '@/features/Form/Database/DatabaseTable'
import {generateEmptyXlsTemplate} from '@/features/Form/Database/generateEmptyXlsFile'
import {databaseKoboDisplayBuilder} from '@/features/Form/Database/groupDisplay/DatabaseKoboDisplay'
import {DatabaseViewBtn, DatabaseViewEditor} from '@/features/Form/Database/view/DatabaseView'
import {useKoboDialogs, useLangIndex} from '@/core/store/useLangIndex'
import {Alert, AlertProps, Box, Icon, useTheme} from '@mui/material'
import {KoboFlattenRepeatedGroup} from 'infoportal-common'
import {useMemo, useState} from 'react'
import {DatabaseGroupDisplayInput} from './groupDisplay/DatabaseGroupDisplayInput'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {Link, useNavigate} from '@tanstack/react-router'
import {buildDatabaseColumns} from '@/features/Form/Database/columns/databaseColumnBuilder'
import {Ip} from 'infoportal-api-sdk'
import {AppAvatar, Core, Datatable} from '@/shared'
import {useFormSocket} from '@/features/Form/useFormSocket'
import {appConfig} from '@/conf/AppConfig.js'
import {DatabaseToolbarContainer} from '@/features/Form/Database/DatabaseToolbarContainer.js'
import {useAsync} from '@axanc/react-hooks'

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

const getRowKey = (_: any) => _.id + ((_ as any) /** TODO Make it typesafe?*/._index ?? '')

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
  const dialogs = useKoboDialogs({workspaceId, formId: ctx.form.id})
  const connectedUsers = useFormSocket({workspaceId, formId: ctx.form.id})
  const [viewEditorOpen, setViewEditorOpen] = useState(false)

  const queryUpdate = useQueryAnswerUpdate()

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
      workspaceId: workspaceId,
      isReadonly: !ctx.canEdit,
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
      t,
      m,
    })
    return databaseKoboDisplayBuilder({
      workspaceId,
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
  }, [ctx.data, ctx.schema.schema, langIndex, ctx.groupDisplay.get, ctx.externalFilesIndex, t])

  const columns: Datatable.Column.Props<any>[] = useMemo(() => {
    const base = buildDatabaseColumns.meta.all({
      queryUpdate: queryUpdate,
      workspaceId,
      formId: ctx.form.id,
      isReadonly: !ctx.canEdit,
      koboEditEnketoUrl: ctx.koboEditEnketoUrl,
      m,
      dialogs,
    })
    const colOriginId: Datatable.Column.Props<Ip.Submission>[] = []
    if (ctx.form.type === 'kobo' || ctx.form.type === 'smart') {
      colOriginId.push({
        id: 'originId',
        head: ctx.form.type === 'kobo' ? m.koboId : m.originId,
        type: 'string',
        renderQuick: _ => _.originId,
      })
    }
    return [...base, ...colOriginId, ...schemaColumns].map(_ => ({
      ..._,
      width: ctx.view.colsById[_.id]?.width ?? _.width ?? 90,
    }))
  }, [schemaColumns, ctx.view.currentView])

  const {api} = useAppSettings()
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
    <Box sx={{display: 'flex'}}>
      <DatabaseToolbarContainer width={340} open={viewEditorOpen}>
        {viewEditorOpen && (
          <Core.Panel sx={{mr: 1}}>
            <DatabaseViewEditor view={ctx.view} />
          </Core.Panel>
        )}
      </DatabaseToolbarContainer>
      <Core.Panel sx={{width: '100%'}}>
        <Datatable.Component
          onEvent={_ => {
            switch (_.type) {
              case 'RESIZE': {
                ctx.view.onResizeColumn(_.col, _.width)
                break
              }
              case 'SET_HIDDEN_COLUMNS': {
                ctx.view.setHiddenColumns(_.hiddenColumns)
                break
              }
              case 'FILTER': {
                onFiltersChange?.(_.value)
                break
              }
            }
            // onDataChange({})
          }}
          module={{
            columnsResize: {
              enabled: true,
            },
            cellSelection: {
              enabled: true,
              mode: 'free',
              renderComponentOnRowSelected: _ => (
                <DatabaseSelectedRowsAction
                  canDelete={ctx.canEdit && ctx.permission.answers_canDelete}
                  selectedIds={_.rowIds as Ip.SubmissionId[]}
                  workspaceId={workspaceId}
                  formId={ctx.form.id}
                />
              ),
            },
            columnsToggle: {
              enabled: true,
              disableAutoSave: true,
              hidden: ctx.view.hiddenColumns,
            },
          }}
          loading={ctx.loading}
          contentProps={{sx: {maxHeight: 'calc(100vh - 156px)'}}}
          // showExportBtn
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
          getRowKey={getRowKey}
          columns={columns}
          showRowIndex
          data={flatData}
          header={params => (
            <>
              <DatabaseViewBtn sx={{mr: 1}} view={ctx.view} onClick={() => setViewEditorOpen(_ => !_)} />
              <Core.SelectSingle<number>
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
                  <Core.IconBtn
                    disabled={!ctx.form.kobo.enketoUrl || ctx.form.deploymentStatus === 'archived'}
                    href={ctx.form.kobo.enketoUrl ?? ''}
                    target="_blank"
                    children={appConfig.icons.openFormLink}
                    tooltip={m._koboDatabase.openForm}
                  />
                ) : (
                  <Link to="/collect/$workspaceId/$formId" target="_blank" params={{workspaceId, formId: ctx.form.id}}>
                    <Core.IconBtn
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

                {ctx.form.type !== 'smart' && ctx.permission.answers_import && (
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
      </Core.Panel>
    </Box>
  )
}
