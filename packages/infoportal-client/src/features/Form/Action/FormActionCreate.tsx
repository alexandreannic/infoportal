import {Ip} from 'infoportal-api-sdk'
import {UseQueryFromAction} from '@/core/query/useQueryFromAction.js'
import {formActionsRoute} from '@/features/Form/Action/FormActions.js'
import {Controller, useForm, UseFormReturn} from 'react-hook-form'
import {UseQueryForm} from '@/core/query/useQueryForm.js'
import {AppSidebarFilters} from '@/core/layout/AppSidebarFilters.js'
import React, {RefObject, useMemo, useRef, useState} from 'react'
import {Asset} from '@/shared/Asset.js'
import {Box, CircularProgress, DialogActions} from '@mui/material'
import {DeploymentStatus} from '@/shared/DeploymentStatus.js'
import {Core} from '@/shared/index.js'
import {useI18n} from '@/core/i18n/index.js'
import {Obj} from '@axanc/ts-utils'

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
      <Box sx={{width: 500, pt: 1}}>
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
  const {workspaceId, formId, form, stepperRef} = useContext()
  const queryForms = UseQueryForm.getAccessibles(workspaceId)
  const assets = useMemo(() => {
    if (!queryForms.data) return []
    return queryForms.data
      .filter(_ => _.id !== formId)
      .map(_ => ({..._, type: _.kobo ? Asset.Type.kobo : Asset.Type.internal}))
  }, [queryForms.data])

  const [filteredAsset, setFilteredAsset] = useState<Asset[]>(assets)

  const targetFormId = form.watch('targetFormId')

  return (
    <>
      {assets.length > 10 && <AppSidebarFilters assets={assets} onFilterChanges={setFilteredAsset} sx={{mb: 1}} />}
      <Controller
        control={form.control}
        name="targetFormId"
        render={({field}) => (
          <Core.RadioGroup<Ip.FormId>
            dense
            sx={{height: 300, overflowY: 'scroll'}}
            {...field}
            onChange={_ => {
              stepperRef.current?.goTo(2)
              field.onChange(_)
            }}
          >
            {filteredAsset.map(_ => (
              <Core.RadioGroupItem
                hideRadio
                value={_.id}
                key={_.id}
                sx={{display: 'flex', alignItems: 'center'}}
                icon={<Asset.Icon type={_.type} />}
                endContent={
                  _.deploymentStatus &&
                  _.deploymentStatus !== 'deployed' && <DeploymentStatus.Icon status={_.deploymentStatus} />
                }
              >
                {_.name}
              </Core.RadioGroupItem>
            ))}
          </Core.RadioGroup>
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
