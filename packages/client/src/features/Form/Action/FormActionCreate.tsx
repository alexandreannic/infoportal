import {Ip} from 'infoportal-api-sdk'
import {UseQueryFromAction} from '@/core/query/useQueryFromAction.js'
import {formActionsRoute} from '@/features/Form/Action/FormActions.js'
import {Controller, useForm, UseFormReturn} from 'react-hook-form'
import React, {RefObject, useRef} from 'react'
import {Box, CircularProgress, DialogActions} from '@mui/material'
import {Core} from '@/shared/index.js'
import {useI18n} from '@infoportal/client-i18n'
import {Obj} from '@axanc/ts-utils'
import {SelectFormInput} from '@/shared/SelectFormInput'

type Form = Omit<Ip.Form.Action.Payload.Create, 'body' | 'workspaceId' | 'formId'>

type Context = {
  formId: Ip.FormId
  onClose: () => void
  workspaceId: Ip.WorkspaceId
  stepperRef: RefObject<Core.StepperHandle | null>
  form: UseFormReturn<Form>
  loading?: boolean
}
const Context = React.createContext<Context>({} as Context)
const useContext = () => React.useContext(Context)

export const FormActionCreate = ({onClose}: {onClose: () => void}) => {
  const stepperRef = useRef<Core.StepperHandle>(null)

  const params = formActionsRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const formId = params.formId as Ip.FormId
  const queryAction = UseQueryFromAction.create(workspaceId, formId)
  const {m} = useI18n()

  const form = useForm<Form>()

  return (
    <Context.Provider
      value={{
        formId,
        stepperRef,
        workspaceId,
        loading: queryAction.isPending,
        form,
        onClose,
      }}
    >
      <Box sx={{width: 500}}>
        <Core.Stepper
          onComplete={() => {
            queryAction
              .mutateAsync({
                ...form.getValues(),
              })
              .then(onClose)
          }}
          renderDone={
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1}}>
              {queryAction.isPending ? (
                <>
                  <CircularProgress />
                  {m.creating}...
                </>
              ) : (
                queryAction.error && (
                  <>
                    <Core.Alert severity="error" sx={{width: '100%'}}>
                      {m.anErrorOccurred}
                    </Core.Alert>
                    <Core.StepperBtnPrevious />
                  </>
                )
              )}
            </Box>
          }
          ref={stepperRef}
          steps={[
            {
              name: 'type',
              label: m.action,
              component: () => <SelectType />,
            },
            {
              name: 'selectForm',
              label: m.selectForm,
              component: () => <SelectForm />,
            },
            {
              name: 'info',
              label: m.information,
              component: () => <FormDetails />,
            },
          ]}
        />
      </Box>
    </Context.Provider>
  )
}

function StepperActions({disableNext}: {disableNext?: boolean}) {
  const {m} = useI18n()
  const {loading, onClose} = useContext()
  return (
    <DialogActions sx={{mt: 1, pb: 0}}>
      <Core.Btn sx={{marginRight: 'auto'}} onClick={onClose}>
        {m.close}
      </Core.Btn>
      <Core.StepperBtnPrevious sx={{m: 0}} />
      <Core.StepperBtnNext loading={loading} disabled={disableNext} sx={{m: 0}} />
    </DialogActions>
  )
}

function SelectType() {
  const {stepperRef, form} = useContext()
  const {m} = useI18n()
  const icon = {
    [Ip.Form.Action.Type.insert]: 'splitscreen_add',
    [Ip.Form.Action.Type.mutate]: 'splitscreen_bottom',
  }
  const type = form.watch('type')
  return (
    <>
      <Controller
        control={form.control}
        name="type"
        render={({field: {onChange, ...field}}) => (
          <Core.RadioGroup
            {...field}
            onChange={_ => {
              onChange(_)
              stepperRef.current?.goTo(1)
            }}
          >
            {Obj.values(Ip.Form.Action.Type).map(_ => (
              <Core.RadioGroupItem
                hideRadio
                value={_}
                icon={icon[_]}
                title={m._formAction._actionTypeLabel[_]}
                description={m._formAction._actionTypeDesc[_]}
              />
            ))}
          </Core.RadioGroup>
        )}
      />
      <StepperActions disableNext={!type} />
    </>
  )
}

function SelectForm() {
  const {workspaceId, form, stepperRef} = useContext()
  const targetFormId = form.watch('targetFormId')

  return (
    <>
      <Controller
        control={form.control}
        name="targetFormId"
        render={({field: {onChange, ...field}}) => (
          <SelectFormInput
            {...field}
            onChange={_ => {
              onChange(_)
              stepperRef.current?.goTo(2)
            }}
            workspaceId={workspaceId}
          />
        )}
      />
      <StepperActions disableNext={!targetFormId} />
    </>
  )
}

function FormDetails() {
  const {m} = useI18n()
  const {form} = useContext()
  const name = form.watch('name')

  return (
    <>
      <Controller
        control={form.control}
        name="name"
        render={({field}) => <Core.Input label={m._formAction.actionSummary} {...field} />}
      />
      <Controller
        control={form.control}
        name="description"
        render={({field}) => <Core.Input multiline={true} minRows={3} label={m.description} {...field} />}
      />
      <StepperActions disableNext={!name} />
    </>
  )
}
