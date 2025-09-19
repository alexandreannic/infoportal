import {Controller, UseFormReturn} from 'react-hook-form'
import React from 'react'
import {Core} from '@/shared'
import {useI18n} from '@/core/i18n/index.js'

export interface GroupCreateForm {
  name: string
  desc?: string
}

export const SettingsGroupCreateForm = ({
  defaultValue = {},
  form,
}: {
  defaultValue?: Partial<GroupCreateForm>
  form: UseFormReturn<GroupCreateForm>
}) => {
  const {m} = useI18n()
  return (
    <>
      <Controller
        name="name"
        control={form.control}
        rules={{required: true}}
        defaultValue={defaultValue.name}
        render={({field, fieldState}) => (
          <Core.Input error={!!fieldState.error} sx={{mt: 2}} label={m.name} autoFocus {...field} />
        )}
      />
      <Controller
        name="desc"
        defaultValue={defaultValue.desc}
        control={form.control}
        render={({field}) => <Core.Input multiline minRows={3} maxRows={6} label={m.desc} {...field} />}
      />
    </>
  )
}
