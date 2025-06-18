import {IpBtn, IpIconBtn} from '@/shared'
import {useI18n} from '@/core/i18n'
import {IpInput} from '@/shared/Input/Input'
import {Box, CardActions, CircularProgress} from '@mui/material'
import {useEffect, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {Controller, useForm} from 'react-hook-form'
import {useFetcher} from '@/shared/hook/useFetcher'
import {useIpToast} from '@/core/useToast'
import {useQueryWorkspace} from '@/core/query/useQueryWorkspace'

type Form = {
  slug: string
  name: string
  sector: string
}

export const WorkspaceCreate = ({onClose}: {onClose?: () => void}) => {
  const {api} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const {m} = useI18n()

  const queryWorkspaces = useQueryWorkspace()

  const form = useForm<Form>()
  const [disableSlug, setDisableSlug] = useState(true)

  const fetchCheckSlug = useFetcher(api.workspace.checkSlug)

  const watch = {
    name: form.watch('name'),
    slug: form.watch('slug'),
  }

  useEffect(() => {
    if (watch.name === '') {
      form.setValue('slug', '')
      return
    }
    const handler = setTimeout(() => {
      fetchCheckSlug.fetch({force: true, clean: false}, watch.name).then(res => {
        form.setValue('slug', res.suggestedSlug)
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

  const submit = async () => {
    try {
      await queryWorkspaces.create.mutate(form.getValues())
      form.reset({
        name: '',
        slug: '',
        sector: '',
      })
      onClose?.()
    } catch (e) {
      toastHttpError(e)
    }
  }

  return (
    <>
      <Controller
        control={form.control}
        rules={{
          required: true,
        }}
        name="name"
        render={({field}) => <IpInput sx={{mt: 2}} required label={m.enterProjectName} size="medium" {...field} />}
      />
      <Controller
        control={form.control}
        name="slug"
        rules={{
          required: true,
        }}
        render={({field, fieldState}) => (
          <IpInput
            sx={{mt: 2}}
            label={m.workspaceId}
            disabled={disableSlug}
            size="small"
            required
            error={!!fieldState.error?.message}
            helperText={fieldState.error?.message}
            InputLabelProps={{
              shrink: !!field.value,
            }}
            endAdornment={
              <Box display="flex" justifyContent="center" alignItems="center" height={40}>
                <CircularProgress sx={{visibility: fetchCheckSlug.loading ? 'visible' : 'hidden'}} size={24} />
                <IpIconBtn onClick={() => setDisableSlug(_ => !_)}>edit</IpIconBtn>
              </Box>
            }
            {...field}
          />
        )}
      />
      <Controller
        control={form.control}
        name="sector"
        render={({field}) => (
          <IpSelectSingle
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
          <IpBtn size="large" onClick={onClose}>
            {m.close}
          </IpBtn>
        )}
        <IpBtn variant="contained" size="large" loading={queryWorkspaces.create.isPending} onClick={submit}>
          {m.create}
        </IpBtn>
      </CardActions>
    </>
  )
}
