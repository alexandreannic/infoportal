import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {Box, DialogActions} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {Obj} from '@axanc/ts-utils'
import {WidgetCreateBtn} from '@/features/Dashboard/Widget/WidgetCreateBtn.js'
import {Controller, useForm, UseFormReturn} from 'react-hook-form'
import React, {RefObject, useRef} from 'react'
import {SelectFormInput} from '@/shared/SelectFormInput'
import {UseQueryForm} from '@/core/query/useQueryForm'
import {useQuerySchema} from '@/core/query/useQuerySchema'

export type Form = {
  type: Ip.Dashboard.Widget.Type
  source: Ip.FormId
}

type Context = {
  form: UseFormReturn<Form>
  stepperRef: RefObject<Core.StepperHandle | null>
  onClose: () => void
  dashboard: Ip.Dashboard
  workspaceId: Ip.WorkspaceId
}

const Context = React.createContext<Context>({} as Context)
const useContext = () => React.useContext(Context)

export const WidgetCreateForm = ({
  workspaceId,
  dashboard,
  onClose,
}: {
  dashboard: Ip.Dashboard
  workspaceId: Ip.WorkspaceId
  onClose: () => void
}) => {
  const form = useForm<Form>()
  const stepperRef = useRef<Core.StepperHandle>(null)

  const {m} = useI18n()
  return (
    <Context.Provider
      value={{
        dashboard,
        onClose,
        form,
        stepperRef,
        workspaceId,
      }}
    >
      <Box sx={{width: 500}}>
        <Core.Stepper
          ref={stepperRef}
          steps={[
            {
              name: 'type',
              label: m.type,
              component: () => <SelectType />,
            },
            // {
            //   name: 'source',
            //   label: m.source,
            //   component: () => <SelectSource />,
            // },
          ]}
        />
      </Box>
    </Context.Provider>
  )
}

function SelectType() {
  const {form, stepperRef} = useContext()
  return (
    <Box>
      <Controller
        name="type"
        control={form.control}
        render={({field}) => (
          <Core.RadioGroup
            inline
            {...field}
            onChange={_ => {
              field.onChange({target: _})
              stepperRef.current?.goTo(1)
            }}
          >
            {Obj.keys(Ip.Dashboard.Widget.Type).map(_ => (
              <Core.RadioGroupItem key={_} hideRadio value={_}>
                <WidgetCreateBtn type={_} />
              </Core.RadioGroupItem>
            ))}
          </Core.RadioGroup>
        )}
      />
      <StepperActions />
    </Box>
  )
}

function SelectQuestion() {
  const {dashboard, workspaceId} = useContext()
  const querySchema = useQuerySchema({workspaceId, formId: dashboard.sourceFormId})
  return <Box>
    {querySchema.data?.schema.survey.map()}
  </Box>
}

function StepperActions({disableNext}: {disableNext?: boolean}) {
  const {m} = useI18n()
  const {onClose} = useContext()
  return (
    <DialogActions sx={{mt: 1, pb: 0}}>
      <Core.Btn sx={{marginRight: 'auto'}} onClick={onClose}>
        {m.close}
      </Core.Btn>
      <Core.StepperBtnPrevious sx={{m: 0}} />
      <Core.StepperBtnNext disabled={disableNext} sx={{m: 0}} />
    </DialogActions>
  )
}
