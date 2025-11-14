import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@infoportal/client-i18n'
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
import {Alert, AlertProps, Box, Icon, useTheme} from '@mui/material'
import {KoboFlattenRepeatedGroup} from '@infoportal/kobo-helper'
import {useMemo, useState} from 'react'
import {DatabaseGroupDisplayInput} from './groupDisplay/DatabaseGroupDisplayInput'
import {Link, useNavigate} from '@tanstack/react-router'
import {Ip} from '@infoportal/api-sdk'
import {AppAvatar, Core, Datatable} from '@/shared'
import {useFormSocket} from '@/features/Form/useFormSocket'
import {appConfig} from '@/conf/AppConfig.js'
import {DatabaseToolbarContainer} from '@/features/Form/Database/DatabaseToolbarContainer.js'
import {useAsync} from '@axanc/react-hooks'
import {buildDbColumns, OnRepeatGroupClick} from '@infoportal/database-column'
import {getKoboAttachmentUrl} from '@/core/KoboAttachmentUrl.js'
import {useKoboDialogs} from '@/features/Form/Database/useKoboDialogs'
import {useFormContext} from '@/features/Form/Form'
import {SelectLangIndex} from '@/shared/customInput/SelectLangIndex'
import {UseQuerySubmission} from '@/core/query/useQuerySubmission'

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
  const navigate = useNavigate()
  const {schema, langIndex, setLangIndex} = useFormContext()
  const ctx = useDatabaseKoboTableContext()
  const dialog = useKoboDialogs({workspaceId, formId: ctx.form.id})
  const connectedUsers = useFormSocket({workspaceId, formId: ctx.form.id})
  const [viewEditorOpen, setViewEditorOpen] = useState(false)

  const queryUpdate = UseQuerySubmission.update()
  const queryUpdateValidation = UseQuerySubmission.updateValidation()

  const flatData: Submission[] | undefined = useMemo(() => {
    if (ctx.groupDisplay.get.repeatAs !== 'rows' || ctx.groupDisplay.get.repeatGroupName === undefined) return ctx.data
    return KoboFlattenRepeatedGroup.run({
      data: ctx.data,
      path: [ctx.groupDisplay.get.repeatGroupName],
      replicateParentData: true,
    }) as (KoboFlattenRepeatedGroup.Cursor & Submission)[]
  }, [ctx.data, ctx.groupDisplay.get])

  const schemaColumns = useMemo(() => {
    const onRepeatGroupClick = (_: Parameters<OnRepeatGroupClick>[0]) =>
      navigate({
        to: '/$workspaceId/form/$formId/group/$group',
        params: {workspaceId, formId: ctx.form.id, group: _.name},
        search: {
          id: _.row.id,
          index: _.row._index,
        },
      })
    const schemaColumns = buildDbColumns.question.bySchema({
      queryUpdateAnswer: queryUpdate,
      getFileUrl: getKoboAttachmentUrl,
      workspaceId: workspaceId,
      isReadonly: !ctx.canEdit,
      getRow: (_: Submission) => _.answers,
      formId: ctx.form.id,
      schema,
      externalFilesIndex: ctx.externalFilesIndex,
      onRepeatGroupClick,
      t,
      m,
    })
    return databaseKoboDisplayBuilder({
      queryUpdateAnswer: queryUpdate,
      getFileUrl: getKoboAttachmentUrl,
      workspaceId,
      data: ctx.data ?? [],
      formId: ctx.form.id,
      schema: schema,
      onRepeatGroupClick,
      display: ctx.groupDisplay.get,
      m,
      t,
    }).transformColumns(schemaColumns)
  }, [ctx.data, queryUpdate, schema.schema, langIndex, ctx.groupDisplay.get, ctx.externalFilesIndex, t])

  const columns: Datatable.Column.Props<any>[] = useMemo(() => {
    const base = buildDbColumns.meta.all({
      formType: ctx.form.type,
      queryUpdateValidation: queryUpdateValidation,
      workspaceId,
      formId: ctx.form.id,
      isReadonly: !ctx.canEdit,
      koboEditEnketoUrl: ctx.koboEditEnketoUrl,
      m,
      dialog,
    })
    const colOriginId: Datatable.Column.Props<Ip.Submission>[] = []
    if (ctx.form.type === 'kobo' || ctx.form.type === 'smart') {
      colOriginId.push({
        id: 'originId',
        head: ctx.form.type === 'kobo' ? m.koboId : m.originId,
        type: 'id',
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
    if (schema && ctx.form) {
      await generateEmptyXlsTemplate(schema, ctx.form.name + '_Template')
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
      <Core.Panel sx={{width: '100%', mb: 0}}>
        <Datatable.Component
          sx={{
            maxHeight: 'calc(100vh - 102px)',
            mb: 0,
          }}
          rowHeight={34}
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
            rowsDragging: {enabled: true},
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
          //   return schema.schema.group.search().map(group => {
          //     const cols = getColumnsForRepeatGroup({
          //       formId: ctx.form.id,
          //       t,
          //       m,
          //       schema: schema,
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
              <SelectLangIndex schema={schema} sx={{maxWidth: 128, mr: 1}} value={langIndex} onChange={setLangIndex} />
              {schema.helper.group.size > 0 && <DatabaseGroupDisplayInput sx={{mr: 1}} />}
              {ctx.form.deploymentStatus === 'archived' && <ArchiveAlert />}

              <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center'}}>
                {connectedUsers.length > 1 &&
                  connectedUsers.map((_, i) => (
                    <AppAvatar size={36} email={_} tooltip overlap borderColor={Datatable.primaryColors[i]} key={_} />
                  ))}
                {Ip.Form.isKobo(ctx.form) ? (
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
                {Ip.Form.isConnectedToKobo(ctx.form) && (
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
