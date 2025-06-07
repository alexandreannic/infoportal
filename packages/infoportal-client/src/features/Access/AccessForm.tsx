import {Controller, UseFormReturn} from 'react-hook-form'
import {UUID} from 'infoportal-common'
import {AccessLevel, accessLevelIcon} from '@/core/sdk/server/access/Access'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Autocomplete, autocompleteClasses, Box, SxProps, Theme} from '@mui/material'
import {fnSwitch, map, Obj, seq} from '@axanc/ts-utils'
import {IpInput} from '@/shared/Input/Input'
import React, {useEffect, useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {DrcJobInputMultiple} from '@/shared/customInput/DrcJobInput'
import {useFetcher} from '@/shared/hook/useFetcher'
import {Datatable} from '@/shared/Datatable/Datatable'

export interface IAccessForm {
  selectBy?: 'email' | 'job' | 'group' | null
  email?: string | null
  groupId?: UUID | null
  drcOffice?: string | null
  drcJob?: string[] | null
  level: AccessLevel
}

export const AccessForm = ({form}: {form: UseFormReturn<IAccessForm>}) => {
  const {m} = useI18n()
  const watchSelectBy = form.watch('selectBy')
  const watch = form.watch()

  useEffect(() => {
    if (form.watch('selectBy') !== 'group') form.setValue('groupId', undefined)
  }, [watchSelectBy])

  useEffect(() => {
    const values = form.getValues()
    if (values.selectBy) return
    if (values.drcJob) form.setValue('selectBy', 'job')
    else if (values.email) form.setValue('selectBy', 'email')
    else if (values.groupId) form.setValue('selectBy', 'group')
  }, [watch])

  return (
    <>
      <AccessFormSection icon="person" label={m.Access.giveAccessBy}>
        <Controller
          name="selectBy"
          rules={{required: {value: true, message: m.required}}}
          control={form.control}
          render={({field}) => (
            <ScRadioGroup
              sx={{mb: 2}}
              dense
              error={!!form.formState.errors.selectBy}
              {...field}
              onChange={e => {
                form.setValue('drcJob', null)
                form.setValue('drcOffice', null)
                form.setValue('email', null)
                form.trigger()
                field.onChange(e)
              }}
            >
              <ScRadioGroupItem value="email" title={m.email} />
              <ScRadioGroupItem value="job" title={m.Access.jobAndOffice} />
              <ScRadioGroupItem value="group" title={m.group} />
            </ScRadioGroup>
          )}
        />
        {fnSwitch(
          watchSelectBy!,
          {
            group: (
              <>
                <AccessFormInputGroup form={form} />
              </>
            ),
            job: (
              <>
                <AccessFormInputDrcJob form={form} sx={{mb: 2}} />
                <AccessFormInputDrcOffice form={form} />
              </>
            ),
            email: <AccessFormInputEmail form={form} />,
          },
          () => (
            <></>
          ),
        )}
      </AccessFormSection>
      {watchSelectBy !== 'group' && (
        <AccessFormSection icon="lock" label={m.accessLevel}>
          <AccessFormInputAccessLevel form={form} />
        </AccessFormSection>
      )}
    </>
  )
}

export const AccessFormInputEmail = ({form}: {form: UseFormReturn<IAccessForm>}) => {
  const {m} = useI18n()
  const required = form.watch('selectBy') === 'email'
  return (
    <IpInput
      label={m.email}
      error={!!form.formState.errors.email}
      helperText={form.formState.errors.email?.message as string}
      required={required}
      {...form.register('email', {
        required: {value: required, message: m.required},
        pattern: {value: /(@drc.ngo$|\s)/, message: m.invalidEmail},
      })}
    />
  )
}

export const AccessFormInputDrcOffice = ({form}: {form: UseFormReturn<IAccessForm>}) => {
  const {m} = useI18n()
  return (
    <Controller
      name="drcOffice"
      control={form.control}
      render={({field: {onChange, ...field}}) => (
        <IpSelectSingle<string> {...field} label={m.location} onChange={_ => onChange(_)} options={[]} />
      )}
    />
  )
}

export const AccessFormInputAccessLevel = ({form}: {form: UseFormReturn<IAccessForm>}) => {
  return (
    <Controller
      name="level"
      defaultValue={AccessLevel.Read}
      control={form.control}
      render={({field}) => (
        <ScRadioGroup<AccessLevel>
          error={!!form.formState.errors.level}
          dense
          {...field}
          // onChange={_ => field.onChange({target: {value: _}} as any)}
        >
          {Obj.values(AccessLevel).map(level => (
            <ScRadioGroupItem icon={accessLevelIcon[level]} value={level} key={level} title={level} />
          ))}
        </ScRadioGroup>
      )}
    />
  )
}

export const AccessFormInputDrcJob = ({form, sx}: {form: UseFormReturn<IAccessForm>; sx?: SxProps<Theme>}) => {
  const {m} = useI18n()
  const required = form.watch('selectBy') === 'job'
  return (
    <Controller
      control={form.control}
      name="drcJob"
      rules={{required: {value: required, message: m.required}}}
      render={({field: {onChange, ...field}}) => (
        <DrcJobInputMultiple {...field} sx={sx} value={field.value ?? []} onChange={(e: any, _) => _ && onChange(_)} />
      )}
    />
  )
}

export const AccessFormInputGroup = ({form}: {form: UseFormReturn<IAccessForm>}) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const fetcherGroups = useFetcher(api.group.search)
  const groupIndex = useMemo(() => {
    return seq(fetcherGroups.get).groupByFirst(_ => _.id)
  }, [fetcherGroups.get])

  useEffect(() => {
    fetcherGroups.fetch()
  }, [])

  return (
    <>
      <Controller
        name="groupId"
        rules={{required: {value: true, message: m.required}}}
        control={form.control}
        render={({field: {onChange, ...field}}) => (
          <Autocomplete
            {...field}
            value={groupIndex[field.value!]}
            onChange={(e: any, _) => _ && onChange(_.id ?? undefined)}
            loading={fetcherGroups.loading}
            getOptionLabel={_ => _.name}
            // renderTags={_ => }
            options={fetcherGroups.get ?? []}
            renderOption={(props, option, state, ownerState) => (
              <Box
                sx={{
                  borderRadius: '8px',
                  margin: '5px',
                  [`&.${autocompleteClasses.option}`]: {
                    padding: '8px',
                  },
                }}
                component="li"
                {...props}
              >
                {option.name}
              </Box>
            )}
            renderInput={({InputProps, ...props}) => (
              <IpInput helperText={null} label={m.group} {...InputProps} {...props} />
            )}
          />
        )}
      />
      {map(form.watch('groupId'), groupId => (
        <>
          <Datatable
            sx={{
              mt: 2,
              border: t => `1px solid ${t.palette.divider}`,
              overflow: 'hidden',
              borderRadius: t => t.shape.borderRadius + 'px',
            }}
            id="access"
            defaultLimit={5}
            data={groupIndex[groupId!]?.items}
            columns={[
              {
                id: 'email',
                head: m.email,
                type: 'string',
                renderQuick: _ => _.email,
              },
              {
                id: 'drcJob',
                head: m.drcJob,
                type: 'select_one',
                renderQuick: _ => _.drcJob,
              },
              {
                id: 'drcOffice',
                head: m.location,
                type: 'select_one',
                renderQuick: _ => _.drcOffice,
              },
              {
                id: 'level',
                head: m.accessLevel,
                type: 'select_one',
                renderQuick: _ => _.level,
              },
            ]}
          />
        </>
      ))}
    </>
  )
}
