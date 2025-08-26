import {Controller, useForm} from 'react-hook-form'
import {DragDropFileInput} from '@/shared/DragDropFileInput'
import React, {useRef, useState} from 'react'
import {Core, Fender} from '@/shared'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {useI18n} from '@/core/i18n'
import {Alert, AlertTitle, CircularProgress, Icon, Skeleton} from '@mui/material'
import {DiffView} from '@/features/Form/Builder/DiffView'
import {Panel, PanelBody, PanelHead} from '../../../../../infoportal-client-core/src/Panel'
import {Ip} from 'infoportal-api-sdk'
import {Stepper, StepperHandle} from '../../../../../infoportal-client-core/src/Stepper/Stepper'
import {StepperActions} from '../../../../../infoportal-client-core/src/Stepper/StepperActions'
import {useQuerySchemaByVersion} from '@/core/query/useQuerySchemaByVersion'
import {Utils} from '@infoportal/client-core/src/core/utils.js'

type Form = {
  message?: string
  xlsFile: File
}

const schemaToString = (schema?: Ip.Form.Schema): string => {
  if (!schema) return '{}'
  return JSON.stringify(Core.sortObjectKeysDeep(schema), null, 2)
}

export const XlsFileUploadForm = ({
  onSubmit,
  lastSchema,
  workspaceId,
  formId,
}: {
  lastSchema?: Ip.Form.Version
  onSubmit?: (f: Form) => Promise<any>
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
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

  const querySchema = useQuerySchemaByVersion({formId, workspaceId, versionId: lastSchema?.id})

  const watched = {
    xlsFile: form.watch('xlsFile'),
  }

  const importButton = (label = m.submit) => (
    <Core.Btn
      endIcon={<Icon>keyboard_double_arrow_right</Icon>}
      sx={{mr: 1, marginLeft: 'auto'}}
      disabled={!isValid || !validation || validation.status === 'error' || (lastSchema && !schemaHasChanges)}
      variant="outlined"
      type="submit"
      loading={queryVersion.upload.isPending}
    >
      {label}
    </Core.Btn>
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
      <Core.Panel>
        <Core.PanelHead>{m.importXlsFile}</Core.PanelHead>
        <Core.PanelBody>
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
              ...(lastSchema
                ? [
                    {
                      name: 'check',
                      label: m.checkDiff,
                      component: () => {
                        const action = <StepperActions disableNext={!schemaHasChanges}>{importButton()}</StepperActions>
                        if (querySchema.isLoading) {
                          return (
                            <>
                              {action}
                              <Skeleton height={200} />
                            </>
                          )
                        }
                        if (!validation) {
                          return <Fender type="error" title={m.error} />
                        }
                        return (
                          <>
                            {action}
                            {!schemaHasChanges && (
                              <Alert color="error" sx={{mt: 1}}>
                                <AlertTitle>{m.xlsFormNoChangeTitle}</AlertTitle>
                                {m.xlsFormNoChangeDesc}
                              </Alert>
                            )}
                            <DiffView
                              oldStr={schemaToString(querySchema.data)}
                              newStr={schemaToString(validation.schema)}
                              hasChanges={setSchemaHasChanges}
                              sx={{mt: 1}}
                            />
                            {action}
                          </>
                        )
                      },
                    },
                  ]
                : []),
              {
                name: 'submit',
                label: m.submit,
                component: () => (
                  <>
                    <Controller
                      name="message"
                      control={form.control}
                      render={({field, fieldState}) => (
                        <Core.Input
                          sx={{mt: 1}}
                          label={`${m.message} (${m.optional})`}
                          {...field}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                    <StepperActions hideNext>{importButton()}</StepperActions>
                  </>
                ),
              },
            ]}
          ></Stepper>
        </Core.PanelBody>
      </Core.Panel>
    </form>
  )
}
