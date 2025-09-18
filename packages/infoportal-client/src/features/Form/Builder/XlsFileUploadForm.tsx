import {Controller, useForm} from 'react-hook-form'
import {DragDropFileInput} from '@/shared/DragDropFileInput'
import React, {useRef, useState} from 'react'
import {Core} from '@/shared'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {useI18n} from '@/core/i18n'
import {Alert, AlertTitle, Box, CircularProgress, Icon, Skeleton} from '@mui/material'
import {DiffView} from '@/features/Form/Builder/DiffView'
import {Ip} from 'infoportal-api-sdk'
import {useQuerySchemaByVersion} from '@/core/query/useQuerySchemaByVersion'

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
  const stepperRef = useRef<Core.StepperHandle>(null)
  const [schemaHasChanges, setSchemaHasChanges] = useState<boolean | null>(null)

  const querySchema = useQuerySchemaByVersion({formId, workspaceId, versionId: lastSchema?.id})

  const watched = {
    xlsFile: form.watch('xlsFile'),
  }

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

  const Actions = ({hideNext, disabledNext}: {hideNext?: boolean; disabledNext?: boolean}) => {
    return (
      <Box sx={{mt: 2, display: 'flex'}}>
        <Core.StepperBtnPrevious />
        <ImportBtn
          loading={queryVersion.upload.isPending}
          disabled={!isValid || !validation || validation.status === 'error' || (lastSchema && !schemaHasChanges)}
          sx={{mr: 1, alignSelf: 'flex-end'}}
        >
          {m.submit}
        </ImportBtn>
        {!hideNext && <Core.StepperBtnNext disabled={disabledNext} sx={{alignSelf: 'flex-end'}} />}
      </Box>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <Core.Panel>
        <Core.PanelHead>{m.importXlsFile}</Core.PanelHead>
        <Core.PanelBody>
          <Core.Stepper
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
                    <Actions disabledNext={!watched.xlsFile} />
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
                        <Actions disabledNext={validation.status === 'error'} />
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
                        const actions = <Actions disabledNext={!schemaHasChanges} />
                        if (querySchema.isLoading) {
                          return (
                            <>
                              {actions}
                              <Skeleton height={200} />
                            </>
                          )
                        }
                        if (!validation) {
                          return <Core.Fender type="error" title={m.error} />
                        }
                        return (
                          <>
                            {actions}
                            {schemaHasChanges === false && (
                              <Alert color="error" sx={{mt: 1}}>
                                <AlertTitle>{m.xlsFormNoChangeTitle}</AlertTitle>
                                {m.xlsFormNoChangeDesc}
                              </Alert>
                            )}
                            <DiffView
                              stepperRef={stepperRef}
                              oldStr={schemaToString(querySchema.data)}
                              newStr={schemaToString(validation.schema)}
                              hasChanges={setSchemaHasChanges}
                              sx={{mt: 1}}
                            />
                            {actions}
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
                    <Actions hideNext={true} />
                  </>
                ),
              },
            ]}
          ></Core.Stepper>
        </Core.PanelBody>
      </Core.Panel>
    </form>
  )
}

function ImportBtn(props: Core.BtnProps) {
  return <Core.Btn endIcon={<Icon>keyboard_double_arrow_right</Icon>} variant="outlined" type="submit" {...props} />
}
