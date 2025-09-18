import {Controller, UseFormReturn} from 'react-hook-form'
import {Autocomplete, autocompleteClasses, Box, SxProps, Theme} from '@mui/material'
import {fnSwitch, map, Obj, seq} from '@axanc/ts-utils'
import React, {useEffect, useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {DrcJobInputMultiple} from '@/shared/customInput/DrcJobInput'
import {Core, Datatable} from '@/shared'
import {useQueryGroup} from '@/core/query/useQueryGroup'
import {Ip} from 'infoportal-api-sdk'
import {Regexp} from 'infoportal-common'
import {UseQueryUser} from '@/core/query/useQueryUser.js'

export interface IAccessForm {
  selectBy?: 'email' | 'job' | 'group' | null
  email?: string | null
  groupId?: Ip.GroupId | null
  location?: string | null
  job?: string[] | null
  level: Ip.AccessLevel
}

export const accessLevelIcon: Record<Ip.AccessLevel, string> = {
  Read: 'visibility',
  Write: 'edit',
  Admin: 'gavel',
}

export const AccessForm = ({workspaceId, form}: {workspaceId: Ip.WorkspaceId; form: UseFormReturn<IAccessForm>}) => {
  const {m} = useI18n()
  const watchSelectBy = form.watch('selectBy')
  const watch = form.watch()

  useEffect(() => {
    if (form.watch('selectBy') !== 'group') form.setValue('groupId', undefined)
  }, [watchSelectBy])

  useEffect(() => {
    const values = form.getValues()
    if (values.selectBy) return
    if (values.job) form.setValue('selectBy', 'job')
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
            <Core.RadioGroup
              sx={{mb: 2}}
              dense
              error={!!form.formState.errors.selectBy}
              {...field}
              onChange={e => {
                form.setValue('job', null)
                form.setValue('location', null)
                form.setValue('email', null)
                form.trigger()
                field.onChange(e)
              }}
            >
              <Core.RadioGroupItem value="email" title={m.email} />
              <Core.RadioGroupItem value="job" title={m.Access.jobAndOffice} />
              <Core.RadioGroupItem value="group" title={m.group} />
            </Core.RadioGroup>
          )}
        />
        {fnSwitch(
          watchSelectBy!,
          {
            group: (
              <>
                <AccessFormInputGroup workspaceId={workspaceId} form={form} />
              </>
            ),
            job: (
              <>
                <AccessFormInputJob workspaceId={workspaceId} form={form} sx={{mb: 2}} />
                <AccessFormInputLocation form={form} />
              </>
            ),
            email: <AccessFormInputEmail workspaceId={workspaceId} form={form} />,
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

export const AccessFormInputEmail = ({
  workspaceId,
  form,
}: {
  workspaceId: Ip.WorkspaceId
  form: UseFormReturn<IAccessForm>
}) => {
  const {m} = useI18n()
  const required = form.watch('selectBy') === 'email'
  const queryUserGet = UseQueryUser.getAll(workspaceId)
  const emails = useMemo(() => queryUserGet.data?.map(_ => _.email), [queryUserGet.data])
  return (
    <Controller
      control={form.control}
      name="email"
      rules={{
        required: {value: required, message: m.required},
        pattern: {value: Regexp.get.email, message: m.invalidEmail},
      }}
      render={({field, fieldState}) => (
        <Autocomplete
          {...field}
          value={field.value}
          onChange={(e, value) => field.onChange(value)}
          onInputChange={(_, value) => field.onChange(value)}
          loading={queryUserGet.isLoading}
          options={emails ?? []}
          renderInput={params => (
            <Core.Input
              {...params}
              label={m.email}
              disableBrowserAutocomplete
              error={!!fieldState.error}
              ref={params.InputProps.ref}
              helperText={fieldState.error?.message}
              required={required}
            />
          )}
        />
      )}
    />
  )
}

export const AccessFormInputLocation = ({form}: {form: UseFormReturn<IAccessForm>}) => {
  const {m} = useI18n()
  return (
    <Controller
      name="location"
      control={form.control}
      render={({field: {onChange, ...field}}) => (
        <Core.SelectSingle<string> {...field} label={m.location} onChange={_ => onChange(_)} options={[]} />
      )}
    />
  )
}

export const AccessFormInputAccessLevel = ({form}: {form: UseFormReturn<IAccessForm>}) => {
  return (
    <Controller
      name="level"
      defaultValue={Ip.AccessLevel.Read}
      control={form.control}
      render={({field}) => (
        <Core.RadioGroup<Ip.AccessLevel>
          error={!!form.formState.errors.level}
          dense
          {...field}
          // onChange={_ => field.onChange({target: {value: _}} as any)}
        >
          {Obj.values(Ip.AccessLevel).map(level => (
            <Core.RadioGroupItem icon={accessLevelIcon[level]} value={level} key={level} title={level} />
          ))}
        </Core.RadioGroup>
      )}
    />
  )
}

export const AccessFormInputJob = ({
  workspaceId,
  form,
  sx,
}: {
  workspaceId: Ip.WorkspaceId
  form: UseFormReturn<IAccessForm>
  sx?: SxProps<Theme>
}) => {
  const {m} = useI18n()
  const required = form.watch('selectBy') === 'job'
  return (
    <Controller
      control={form.control}
      name="job"
      rules={{required: {value: required, message: m.required}}}
      render={({field: {onChange, ...field}}) => (
        <DrcJobInputMultiple
          {...field}
          sx={sx}
          workspaceId={workspaceId}
          value={field.value ?? []}
          onChange={(e: any, _) => _ && onChange(_)}
        />
      )}
    />
  )
}

export const AccessFormInputGroup = ({
  workspaceId,
  form,
}: {
  workspaceId: Ip.WorkspaceId
  form: UseFormReturn<IAccessForm>
}) => {
  const {m} = useI18n()
  const queryGroup = useQueryGroup(workspaceId)

  const groupIndex = useMemo(() => {
    return seq(queryGroup.getAll.data).groupByFirst(_ => _.id)
  }, [queryGroup.getAll.data])

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
            loading={queryGroup.getAll.isLoading}
            getOptionLabel={_ => _.name}
            // renderTags={_ => }
            options={queryGroup.getAll.data ?? []}
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
              <Core.Input helperText={null} label={m.group} {...InputProps} {...props} />
            )}
          />
        )}
      />
      {map(form.watch('groupId'), groupId => (
        <>
          <Datatable.Component
            getRowKey={_ => _.id}
            sx={{
              mt: 2,
              border: t => `1px solid ${t.vars.palette.divider}`,
              overflow: 'hidden',
              borderRadius: t => t.vars.shape.borderRadius,
            }}
            id="access"
            data={groupIndex[groupId!]?.items}
            columns={[
              {
                id: 'email',
                head: m.email,
                type: 'string',
                renderQuick: _ => _.email,
              },
              {
                id: 'job',
                head: m.job,
                type: 'select_one',
                renderQuick: _ => _.job,
              },
              {
                id: 'location',
                head: m.location,
                type: 'select_one',
                renderQuick: _ => _.location,
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
