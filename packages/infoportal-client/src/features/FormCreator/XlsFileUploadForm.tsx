import {Controller, useForm} from 'react-hook-form'
import {DragDropFileInput} from '@/shared/DragDropFileInput'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {IpBtn} from '@/shared'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {useI18n} from '@/core/i18n'
import {Kobo} from 'kobo-sdk'
import {UUID} from 'infoportal-common'
import {IpInput} from '@/shared/Input/Input'
import {Alert, AlertTitle, CircularProgress, Skeleton} from '@mui/material'
import {DiffView} from '@/features/FormCreator/DiffView'
import * as xlsx from 'xlsx'
import {SchemaParser} from '@/features/FormCreator/SchemaParser'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {Ip} from 'infoportal-api-sdk'
import {Stepper, StepperHandle} from '@/shared/Stepper/Stepper'
import {StepperActions} from '@/shared/Stepper/StepperActions'
import {useQuery} from '@tanstack/react-query'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {map, Obj} from '@axanc/ts-utils'
import {Utils} from '@/utils/utils'

type Form = {
  message?: string
  xlsFile: File
}

const schemaToString = (schema?: Ip.Form.Schema): string => {
  if (!schema) return '{}'
  return JSON.stringify(Utils.sortObjectKeysDeep(schema), null, 2)
}

export const XlsFileUploadForm = ({
  onSubmit,
  lastSchema,
  workspaceId,
  formId,
}: {
  lastSchema?: Ip.Form.Version
  onSubmit?: (f: Form) => Promise<any>
  workspaceId: UUID
  formId: Kobo.FormId
}) => {
  const {m} = useI18n()
  const {
    formState: {isValid},
    ...form
  } = useForm<Form>({defaultValues: {message: ''}, mode: 'onChange'})
  const queryVersion = useQueryVersion({workspaceId, formId})
  const [validation, setValidation] = useState<Ip.Form.Schema.Validation>()
  const stepperRef = useRef<StepperHandle>(null)
  const [schemaHasChanges, setSchemaHasChanges] = useState<boolean>(false)

  const querySchema = useQuerySchema({formId, workspaceId, versionId: lastSchema?.id}).get

  const watched = {
    xlsFile: form.watch('xlsFile'),
  }

  const schemaJsonQuery = useQuery({
    queryKey: ['schemaJson', map(watched.xlsFile, _ => _.name + _.size + _.lastModified)],
    queryFn: async () => {
      const data = await watched.xlsFile.arrayBuffer()
      return SchemaParser.xlsToJson(xlsx.read(data, {type: 'array'}))
    },
    enabled: !!watched.xlsFile && (!validation?.code || validation.code < 200),
  })

  const importButton = (label = m.skipAndSubmit) => (
    <IpBtn
      icon="send"
      sx={{mr: 1, marginLeft: 'auto'}}
      disabled={!isValid || !validation || validation.status === 'error' || !schemaHasChanges}
      variant="contained"
      type="submit"
      loading={queryVersion.upload.isPending}
    >
      {label}
    </IpBtn>
  )

  const submit = async (values: Form) => {
    try {
      onSubmit?.(values)
      await queryVersion.upload.mutateAsync(values)
      form.reset()
      stepperRef.current?.goTo(0)
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <Panel>
        <PanelHead>{m.importXlsFile}</PanelHead>
        <PanelBody>
          <Stepper
            ref={stepperRef}
            steps={[
              {
                name: 'select',
                label: m.selectXlsForm,
                component: () => (
                  <>
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
                            stepperRef.current?.next()
                            // form.setValue('xlsFile', file)
                            queryVersion.validateXls.mutateAsync(file).then(setValidation)
                          }}
                          sx={{mb: 1}}
                        />
                      )}
                    />
                    <StepperActions disableNext={!watched.xlsFile} />
                  </>
                ),
              },
              {
                name: 'validate',
                label: m.validate,
                component: () =>
                  watched.xlsFile &&
                  (queryVersion.validateXls.isPending ? (
                    <Alert severity="info" icon={<CircularProgress size={20} color="inherit" />}>
                      {m.validation}...
                    </Alert>
                  ) : (
                    validation && (
                      <>
                        <Alert
                          severity={validation.code === 100 ? 'success' : validation.code < 200 ? 'warning' : 'error'}
                        >
                          <AlertTitle>
                            {validation.code === 100 ? m.success : validation.code < 200 ? m.warning : m.error}
                          </AlertTitle>
                          {validation.message}
                          {validation.warnings && (
                            <ul style={{paddingLeft: 0, marginLeft: 0, listStylePosition: 'outside'}}>
                              {validation.warnings.map((_, i) => (
                                <li key={i}>{_}</li>
                              ))}
                            </ul>
                          )}
                        </Alert>
                        <StepperActions disableNext={validation.status === 'error'} />
                      </>
                    )
                  )),
              },
              {
                name: 'check',
                label: m.checkDiff,
                component: () => {
                  const action = <StepperActions>{importButton(m.skipAndSubmit)}</StepperActions>
                  if (querySchema.isPending || schemaJsonQuery.isPending) {
                    return (
                      <>
                        {action}
                        <Skeleton height={200} />
                      </>
                    )
                  }
                  return (
                    <>
                      {!schemaHasChanges && (
                        <Alert color="error">
                          <AlertTitle>{m.xlsFormNoChangeTitle}</AlertTitle>
                          {m.xlsFormNoChangeDesc}
                        </Alert>
                      )}
                      <DiffView
                        oldStr={schemaToString(querySchema.data)}
                        newStr={schemaToString(schemaJsonQuery.data)}
                        hasChanges={setSchemaHasChanges}
                        sx={{mt: 1}}
                      />
                      <StepperActions disableNext={!schemaHasChanges}>{importButton(m.skipAndSubmit)}</StepperActions>
                    </>
                  )
                },
              },
              {
                name: 'submit',
                label: m.submit,
                component: () => (
                  <>
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
                    <StepperActions hideNext>{importButton(m.import)}</StepperActions>
                  </>
                ),
              },
            ]}
          ></Stepper>
        </PanelBody>
      </Panel>
    </form>
  )
}
