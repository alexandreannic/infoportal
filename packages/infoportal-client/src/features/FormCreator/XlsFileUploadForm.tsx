import {Controller, useForm} from 'react-hook-form'
import {DragDropFileInput} from '@/shared/DragDropFileInput'
import React, {useMemo, useState} from 'react'
import {IpBtn} from '@/shared'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {useI18n} from '@/core/i18n'
import {Kobo} from 'kobo-sdk'
import {UUID} from 'infoportal-common'
import {IpInput} from '@/shared/Input/Input'
import {Alert, AlertTitle, CircularProgress} from '@mui/material'
import {DiffView} from '@/features/FormCreator/DiffView'
import * as xlsx from 'xlsx'
import {SchemaParser} from '@/features/FormCreator/SchemaParser'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {Ip} from 'infoportal-api-sdk'

type Form = {
  message?: string
  xlsFile: File
}

export const XlsFileUploadForm = ({
  onSubmit,
  lastSchema,
  workspaceId,
  formId,
}: {
  lastSchema?: object
  onSubmit: (f: Form) => void
  workspaceId: UUID
  formId: Kobo.FormId
}) => {
  const {m} = useI18n()
  const form = useForm<Form>()
  const querySchema = useQueryVersion({workspaceId, formId})
  const [validation, setValidation] = useState<Ip.Form.Schema.Validation>()

  const watched = {
    xlsFile: form.watch('xlsFile'),
  }

  const schemaJson = useMemo(() => {
    if (!watched.xlsFile || (validation?.code && validation.code >= 200)) return
    return watched.xlsFile.arrayBuffer().then(data => {
      SchemaParser.xlsToJson(xlsx.read(data, {type: 'array'}))
    })
  }, [watched.xlsFile])

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Panel>
        <PanelHead
          action={
            <IpBtn
              icon="add"
              disabled={!form.formState.isValid}
              variant="contained"
              type="submit"
              loading={querySchema.upload.isPending}
            >
              {m.import}
            </IpBtn>
          }
        >
          {m.importXlsFile}
        </PanelHead>
        <PanelBody>
          <Controller
            name="message"
            control={form.control}
            render={({field, fieldState}) => (
              <IpInput
                sx={{mt: 1}}
                label={`${m.message} (${m.optional})`}
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="xlsFile"
            control={form.control}
            rules={{
              required: true,
            }}
            render={({field, fieldState}) => (
              <DragDropFileInput
                error={fieldState.error?.message}
                onClear={() => {
                  form.unregister('xlsFile')
                }}
                onFilesSelected={async _ => {
                  const file = _.item(0)
                  if (!file) return
                  field.onChange({target: {value: file}})
                  // form.setValue('xlsFile', file)
                  querySchema.validateXls.mutateAsync(file).then(setValidation)
                }}
                sx={{mb: 1}}
              />
            )}
          />
          {watched.xlsFile &&
            (querySchema.validateXls.isPending ? (
              <Alert severity="info" icon={<CircularProgress size={20} color="inherit" />}>
                Validation...
              </Alert>
            ) : (
              validation && (
                <Alert severity={validation.code === 100 ? 'success' : validation.warnings ? 'warning' : 'error'}>
                  <AlertTitle>{validation.message}</AlertTitle>
                  {validation.warnings && (
                    <ul style={{paddingLeft: 0, marginLeft: 0, listStylePosition: 'outside'}}>
                      {validation.warnings.map((_, i) => (
                        <li key={i}>{_}</li>
                      ))}
                    </ul>
                  )}
                </Alert>
              )
            ))}
          {schemaJson && <DiffView oldJson={lastSchema} newJson={schemaJson} sx={{mt: 1}} />}
        </PanelBody>
      </Panel>
    </form>
  )
}
