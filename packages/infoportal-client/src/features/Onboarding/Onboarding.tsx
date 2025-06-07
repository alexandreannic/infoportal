import {CenteredContent, IpBtn, IpIconBtn, Page, PageTitle} from '@/shared'
import {useI18n} from '@/core/i18n'
import {IpInput} from '@/shared/Input/Input'
import {Box, Button, CircularProgress, useTheme} from '@mui/material'
import {useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffectFn} from '@axanc/react-hooks'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {Controller, useForm} from 'react-hook-form'
import {useFetcher} from '@/shared/hook/useFetcher'
import {useAsync} from '@/shared/hook/useAsync'
import {useSession} from '@/core/Session/SessionContext'
import {produce} from 'immer'

type Form = {
  slug: string
  name: string
  sector: string
}

export const Onboarding = () => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const {setSession} = useSession()
  const t = useTheme()

  const form = useForm<Form>()
  const [disableSlug, setDisableSlug] = useState(true)

  const fetchCheckSlug = useFetcher(api.workspace.checkSlug)
  const asyncCreate = useAsync(api.workspace.create)

  useEffectFn(form.watch('name'), name => {
    if (name === '') {
      form.setValue('slug', '')
      return
    }
    fetchCheckSlug.fetch({force: true, clean: false}, name).then(res => {
      form.setValue('slug', res.suggestedSlug)
    })
  })

  useEffectFn(form.watch('slug'), slug => {
    if (disableSlug) return
    fetchCheckSlug.fetch({force: true, clean: true}, slug).then(res => {
      if (res.isFree) form.clearErrors('slug')
      else
        form.setError('slug', {
          type: 'validate',
          message: 'Already exists!',
        })
    })
  })

  const submit = async () => {
    const created = await asyncCreate.call(form.getValues())
    setSession(prev =>
      produce(prev, draft => {
        draft?.workspaces.push(created)
      }),
    )
  }

  return (
    <CenteredContent>
      <Page width="xxs">
        <PageTitle>{m.onboardingTitle}</PageTitle>
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
                  {fetchCheckSlug.loading && <CircularProgress size={24} />}
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
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <IpBtn variant="contained" size="large" loading={asyncCreate.loading} onClick={submit}>
            {m.create}
          </IpBtn>
        </Box>
      </Page>
    </CenteredContent>
  )
}
