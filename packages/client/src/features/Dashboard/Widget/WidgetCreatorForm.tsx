import {useQuerySchema} from '@/core/query/useQuerySchema'
import {WidgetCreateBtn} from '@/features/Dashboard/Widget/WidgetCreateBtn.js'
import {Core} from '@/shared'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {Obj} from '@axanc/ts-utils'
import {useI18n} from '@infoportal/client-i18n'
import {Box, DialogActions} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import React, {RefObject, useRef} from 'react'
import {Controller, useForm, UseFormReturn} from 'react-hook-form'

export type WidgetCreateForm = Ip.Dashboard.Widget.Payload.Create

type Context = {
  form: UseFormReturn<WidgetCreateForm>
  stepperRef: RefObject<Core.StepperHandle | null>
  onClose: () => void
  dashboard: Ip.Dashboard
  workspaceId: Ip.WorkspaceId
}

const Context = React.createContext<Context>({} as Context)
const useContext = () => React.useContext(Context)

export const WidgetCreatorForm = ({
  workspaceId,
  dashboard,
  onClose,
}: {
  dashboard: Ip.Dashboard
  workspaceId: Ip.WorkspaceId
  onClose: () => void
}) => {
  const form = useForm<WidgetCreateForm>()
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
            {
              name: 'source',
              label: m.source,
              component: () => <SelectQuestion />,
            },
          ]}
        />
      </Box>
    </Context.Provider>
  )
}

function SelectType({form}: {form: UseFormReturn<WidgetCreateForm>}) {
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
  const {m} = useI18n()
  const {dashboard, workspaceId, form} = useContext()
  const querySchema = useQuerySchema({workspaceId, formId: dashboard.sourceFormId})
  const questionName = form.watch('questionName')
  const question = querySchema.data?.helper.questionIndex[questionName]
  const choices = querySchema.data?.helper.choicesIndex[question?.select_from_list_name!]
  return (
    <Box>
      <Controller
        name="questionName"
        control={form.control}
        render={({field, formState}) => (
          <SelectQuestionInput
            {...field}
            schema={querySchema.data?.schema}
            loading={querySchema.isPending}
            InputProps={{
              error: !!form.formState.errors.questionName,
              helperText: form.formState.errors.questionName && m.required,
            }}
            questionTypeFilter={['select_multiple', 'select_one']}
          />
        )}
      />
      {choices && (
        <Box>
          {choices.map(choice => (
            <Box>{choice.name}</Box>
          ))}
        </Box>
      )}
    </Box>
  )
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
