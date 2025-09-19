import {useI18n} from '@infoportal/client-i18n'
import {Box, CardActions, CircularProgress} from '@mui/material'
import {useEffect, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Controller, useForm} from 'react-hook-form'
import {useIpToast} from '@/core/useToast'
import {UseQueryWorkspace} from '@/core/query/useQueryWorkspace'
import {useFetcher} from '@axanc/react-hooks'
import {Core} from '@/shared'

type Form = {
  slug: string
  name: string
  sector: string
}

export const WorkspaceCreate = ({onClose}: {onClose?: () => void}) => {
  const {apiv2} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const {m} = useI18n()

  const queryWorkspaceCreate = UseQueryWorkspace.create()

  const form = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      sector: '',
    },
  })
  const [disableSlug, setDisableSlug] = useState(true)

  const fetchCheckSlug = useFetcher(apiv2.workspace.checkSlug)

  const watch = {
    name: form.watch('name'),
    slug: form.watch('slug'),
  }

  useEffect(() => {
    if (watch.name === '') {
      form.setValue('slug', '', {shouldValidate: true, shouldTouch: true, shouldDirty: true})
      return
    }
    const handler = setTimeout(() => {
      fetchCheckSlug.fetch({force: true, clean: false}, watch.name).then(res => {
        form.setValue('slug', res.suggestedSlug, {shouldValidate: true, shouldTouch: true, shouldDirty: true})
      })
    }, 400)

    return () => {
      clearTimeout(handler)
    }
  }, [watch.name])

  useEffect(() => {
    if (disableSlug || watch.slug === '') return
    fetchCheckSlug.fetch({force: true, clean: true}, watch.slug).then(res => {
      if (res.isFree) form.clearErrors('slug')
      else
        form.setError('slug', {
          type: 'validate',
          message: 'Already exists!',
        })
    })
  }, [watch.slug])

  const submit = async (values: Form) => {
    try {
      await queryWorkspaceCreate.mutate(values)
      form.reset()
      onClose?.()
    } catch (e) {
      toastHttpError(e)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <Controller
        control={form.control}
        rules={{
          required: true,
        }}
        name="name"
        render={({field}) => <Core.Input sx={{mt: 2}} required label={m.enterProjectName} size="medium" {...field} />}
      />
      <Controller
        control={form.control}
        name="slug"
        rules={{
          required: true,
        }}
        render={({field, fieldState}) => (
          <Core.Input
            sx={{mt: 2}}
            notched={!!watch.name}
            InputLabelProps={{shrink: !!watch.name}}
            label={m.workspaceId}
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
      <Controller
        control={form.control}
        name="sector"
        rules={{
          required: false,
        }}
        render={({field}) => (
          <Core.SelectSingle
            sx={{mt: 2}}
            label={m.sector}
            options={[
              `Humanitarian`,
              `Public Administration`,
              `Arts, Entertainment, and Recreation`,
              `Educational Services / Higher Education`,
              `Health Services / Public Health`,
              `Finance and Insurance`,
              `Information / Media`,
              `Economic / Social Development`,
              `Security / Police / Peacekeeping`,
              `Disarmament & Demobilization`,
              `Environment`,
              `Private sector`,
              `Other`,
            ]}
            {...field}
          />
        )}
      />
      <CardActions sx={{mt: 3, justifyContent: 'flex-end', pr: 0}}>
        {onClose && (
          <Core.Btn size="large" onClick={onClose}>
            {m.close}
          </Core.Btn>
        )}
        <Core.Btn
          disabled={!form.formState.isValid}
          variant="contained"
          size="large"
          loading={queryWorkspaceCreate.isPending}
          type="submit"
        >
          {m.create}
        </Core.Btn>
      </CardActions>
    </form>
  )
}
