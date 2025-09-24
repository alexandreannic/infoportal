import {Ip} from 'infoportal-api-sdk'
import {Obj} from '@axanc/ts-utils'
import {WidgetCreateBtn} from '@/features/Dashboard/Widget/WidgetCreateBtn'
import React from 'react'
import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {Controller, useForm} from 'react-hook-form'

export type WidgetCreateForm = {
  type: Ip.Dashboard.Widget.Type
  questionName: string
}

export function WidgetCreate({
  loading,
  close,
  onSubmit,
}: {
  loading?: boolean
  onSubmit: (_: WidgetCreateForm) => void
  close: () => void
}) {
  const {m} = useI18n()
  const form = useForm<WidgetCreateForm>({mode: 'onChange'})
  const {schema} = useDashboardCreatorContext()

  return (
    <form onSubmit={_ => form.handleSubmit(onSubmit)(_).then(close)}>
      <Controller
        name="type"
        control={form.control}
        render={({field}) => (
          <Core.RadioGroup<Ip.Dashboard.Widget.Type> {...field} inline sx={{mb: 2}}>
            {Obj.keys(Ip.Dashboard.Widget.Type).map(_ => (
              <Core.RadioGroupItem key={_} hideRadio value={_}>
                <WidgetCreateBtn type={_} />
              </Core.RadioGroupItem>
            ))}
          </Core.RadioGroup>
        )}
      />
      <Controller
        name="questionName"
        control={form.control}
        rules={{
          required: true,
        }}
        render={({field, fieldState}) => (
          <SelectQuestionInput
            {...field}
            onChange={(e, _) => field.onChange(_)}
            schema={schema.schema}
            questionTypeFilter={['select_multiple', 'select_one']}
            InputProps={{
              label: m.question,
              error: !!fieldState.error,
              helperText: fieldState.error && m.required,
            }}
          />
        )}
      />
      <Core.Btn onClick={close}>{m.close}</Core.Btn>
      <Core.Btn type="submit" loading={loading} disabled={!form.formState.isValid}>
        {m.submit}
      </Core.Btn>
    </form>
  )
}
