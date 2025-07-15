import {useI18n} from '@/core/i18n'
import React, {useEffect} from 'react'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {Controller, UseFormReturn} from 'react-hook-form'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {fnSwitch} from '@axanc/ts-utils'
import {
  AccessFormInputAccessLevel,
  AccessFormInputEmail,
  AccessFormInputJob,
  AccessFormInputLocation,
  IAccessForm,
} from '@/features/Access/AccessForm'
import {Ip} from 'infoportal-api-sdk'

export const SettingsGroupAccessForm = ({workspaceId, form}: {workspaceId: Ip.Uuid; form: UseFormReturn<IAccessForm>}) => {
  const {m} = useI18n()
  const watchSelectBy = form.watch('selectBy')
  const watch = form.watch()

  const setSelectByAccordingToValue = () => {
    const values = form.getValues()
    if (values.selectBy) return
    if (values.job) form.setValue('selectBy', 'job')
    else if (values.email) form.setValue('selectBy', 'email')
    else if (values.groupId) form.setValue('selectBy', 'group')
  }
  useEffect(setSelectByAccordingToValue, [watch])

  return (
    <>
      <AccessFormSection icon="person" label={m.Access.giveAccessBy}>
        <Controller
          name="selectBy"
          rules={{required: {value: true, message: m.required}}}
          control={form.control}
          render={({field}) => (
            <ScRadioGroup
              sx={{mb: 2.5}}
              dense
              error={!!form.formState.errors.selectBy}
              {...field}
              onChange={e => {
                setTimeout(() => {
                  form.setValue('job', null)
                  form.setValue('location', null)
                  form.setValue('email', null)
                })
                field.onChange(e)
              }}
            >
              <ScRadioGroupItem value="email" title={m.email} />
              <ScRadioGroupItem value="job" title={m.Access.jobAndOffice} />
            </ScRadioGroup>
          )}
        />
        {fnSwitch(
          watchSelectBy!,
          {
            job: (
              <>
                <AccessFormInputJob workspaceId={workspaceId} form={form} sx={{mb: 2}} />
                <AccessFormInputLocation form={form} />
              </>
            ),
            email: <AccessFormInputEmail form={form} />,
          },
          () => (
            <></>
          ),
        )}
      </AccessFormSection>
      <AccessFormSection icon="lock" label={m.accessLevel}>
        <AccessFormInputAccessLevel form={form} />
      </AccessFormSection>
    </>
  )
}
