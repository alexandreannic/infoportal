import {Ip} from 'infoportal-api-sdk'
import {fnSwitch, Obj} from '@axanc/ts-utils'
import {WidgetTypeIcon} from '@/features/Dashboard/Widget/WidgetTypeIcon'
import React, {useMemo} from 'react'
import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {Controller, useForm} from 'react-hook-form'
import {Kobo} from 'kobo-sdk'

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

  const type = form.watch('type')
  const questionTypeFilters: Kobo.Form.QuestionType[] = useMemo(() => {
    switch (type) {
      case 'BarChart': {
        return ['select_multiple', 'select_one']
      }
      case 'PieChart': {
        return ['select_one', 'integer', 'decimal']
      }
      default: {
        return []
      }
    }
  }, [type])

  return (
    <form onSubmit={_ => form.handleSubmit(onSubmit)(_).then(close)}>
      <Controller
        name="type"
        control={form.control}
        render={({field}) => (
          <Core.RadioGroup<Ip.Dashboard.Widget.Type> {...field} inline sx={{mb: 2}}>
            {Obj.keys(Ip.Dashboard.Widget.Type).map(_ => (
              <Core.RadioGroupItem key={_} hideRadio value={_}>
                <WidgetTypeIcon type={_} sx={{my: 1, fontSize: '3em'}} />
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
            questionTypeFilter={questionTypeFilters}
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
