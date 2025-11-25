import {useI18n} from '@infoportal/client-i18n'
import {Box, CircularProgress, DialogActions} from '@mui/material'
import React, {RefObject, useEffect, useRef, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Controller, useForm, UseFormReturn} from 'react-hook-form'
import {useIpToast} from '@/core/useToast'
import {UseQueryDashboard} from '@/core/query/dashboard/useQueryDashboard'
import {useFetcher} from '@axanc/react-hooks'
import {Core} from '@/shared'
import {Ip} from '@infoportal/api-sdk'
import {UseQueryWorkspace} from '@/core/query/workspace/useQueryWorkspace'
import {SwitchBox} from '@/shared/customInput/SwitchBox'
import {SelectFormInput} from '@/shared/customInput/SelectFormInput'

type Form = {
  slug: string
  name: string
  sourceFormId: Ip.FormId
  isPublic: boolean
}

type Context = {
  form: UseFormReturn<Form>
  stepperRef: RefObject<Core.StepperHandle | null>
  onClose: () => void
  workspaceId: Ip.WorkspaceId
}

const Context = React.createContext<Context>({} as Context)
const useContext = () => React.useContext(Context)

export const DashboardCreate = ({workspaceId, onClose}: {workspaceId: Ip.WorkspaceId; onClose: () => void}) => {
  const {toastHttpError} = useIpToast()
  const {m} = useI18n()

  const queryDashboardCreate = UseQueryDashboard.create({workspaceId})

  const stepperRef = useRef<Core.StepperHandle>(null)
  const form = useForm<Form>({
    mode: 'onChange',
  })

  const submit = async (values: Form) => {
    try {
      await queryDashboardCreate.mutate(values)
      form.reset()
      onClose?.()
    } catch (e) {
      toastHttpError(e)
    }
  }

  return (
    <Context.Provider
      value={{
        onClose,
        form,
        stepperRef,
        workspaceId,
      }}
    >
      <Box sx={{width: 500}}>
        <Core.Stepper
          ref={stepperRef}
          onComplete={() => submit(form.getValues())}
          steps={[
            {
              name: 'info',
              label: m.details,
              component: () => <SelectInfoInfo />,
            },
            {
              name: 'source',
              label: m.dataSource,
              component: () => <SelectSource />,
            },
          ]}
        />
      </Box>
    </Context.Provider>
  )
}

function SelectInfoInfo() {
  const {apiv2} = useAppSettings()
  const {m} = useI18n()
  const {form, workspaceId} = useContext()
  const {conf} = useAppSettings()
  const queryWorkspace = UseQueryWorkspace.getById(workspaceId)
  const watch = {
    name: form.watch('name'),
    slug: form.watch('slug'),
  }
  const [disableSlug, setDisableSlug] = useState(true)

  const fetchCheckSlug = useFetcher(apiv2.dashboard.checkSlug)

  useEffect(() => {
    if (disableSlug || watch.slug === '') return
    fetchCheckSlug.fetch({force: true, clean: true}, {workspaceId, slug: watch.slug}).then(res => {
      if (res.isFree) form.clearErrors('slug')
      else
        form.setError('slug', {
          type: 'validate',
          message: 'Already exists!',
        })
    })
  }, [watch.slug])

  useEffect(() => {
    if (watch.name === '') {
      form.setValue('slug', '', {shouldValidate: true, shouldTouch: true, shouldDirty: true})
      return
    }
    const handler = setTimeout(() => {
      fetchCheckSlug.fetch({force: true, clean: false}, {workspaceId, slug: watch.name}).then(res => {
        form.setValue('slug', res.suggestedSlug, {shouldValidate: true, shouldTouch: true, shouldDirty: true})
      })
    }, 400)

    return () => {
      clearTimeout(handler)
    }
  }, [watch.name])

  const fields: Array<keyof Form> = ['name', 'slug']
  const isValid = fields.every(name => !form.getFieldState(name).invalid)

  return (
    <>
      <Controller
        control={form.control}
        rules={{
          required: true,
        }}
        name="name"
        render={({field}) => <Core.Input sx={{mt: 2}} required label={m.name} {...field} />}
      />
      <Controller
        control={form.control}
        name="slug"
        rules={{
          required: true,
        }}
        render={({field, fieldState}) => (
          <Core.Input
            notched={!!watch.name}
            InputLabelProps={{shrink: !!watch.name}}
            label={m.dashboardId}
            disabled={disableSlug}
            size="small"
            required
            error={!!fieldState.error?.message}
            helperText={fieldState.error?.message}
            endAdornment={
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress sx={{visibility: fetchCheckSlug.loading ? 'visible' : 'hidden'}} size={24} />
                <Core.IconBtn onClick={() => setDisableSlug(_ => !_)}>edit</Core.IconBtn>
              </Box>
            }
            {...field}
          />
        )}
      />
      {queryWorkspace.data && watch.slug && (
        <Core.Input
          disabled
          // slotProps={{notchedOutline: {sx: {border: 'none', borderRadius: '0', borderBottom: '1px dashed t.'}}}}
          label={m.dashboardLink}
          value={new URL(Ip.Dashboard.buildPath(queryWorkspace.data, watch), conf.baseURL).toString()}
        />
      )}
      <SwitchBox {...form.register('isPublic')} size="small" label={m.public} icon="public" />
      <StepperActions disableNext={!isValid} />
    </>
  )
}

function SelectSource() {
  const {workspaceId, form} = useContext()
  return (
    <>
      <Controller
        name="sourceFormId"
        control={form.control}
        rules={{
          required: true,
        }}
        render={({field}) => <SelectFormInput {...field} workspaceId={workspaceId} />}
      />
      <StepperActions disableNext={!form.watch('sourceFormId')} />
    </>
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
