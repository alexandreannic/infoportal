import {useI18n} from '@infoportal/client-i18n'
import {Controller, useForm} from 'react-hook-form'
import {Regexp} from 'infoportal-common'
import {map, Obj} from '@axanc/ts-utils'
import {useEffect, useState} from 'react'
import {useFetcher} from '@axanc/react-hooks'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Box, CardActions, CircularProgress, Dialog, DialogContent, DialogTitle, Icon, useTheme} from '@mui/material'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {DialogProps} from '@toolpad/core'
import {useQueryServers} from '@/core/query/useQueryServers'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {Ip} from '@infoportal/api-sdk'
import {Core} from '@/shared'

const servers = {
  EU: {v1: 'https://kc-eu.kobotoolbox.org', v2: 'https://eu.kobotoolbox.org'},
  Global: {v1: 'https://kc.kobotoolbox.org', v2: 'https://kf.kobotoolbox.org'},
  DRC: {v1: 'https://kc-kobo.drc.ngo', v2: 'https://kobo.drc.ngo'},
}

const ConnectionChecker = ({status, err}: {err?: string; status: 'loading' | 'error' | 'success'}) => {
  const t = useTheme()
  const {m} = useI18n()
  switch (status) {
    case 'loading':
      return (
        <Box sx={{display: 'flex', alignItems: 'center', color: t.vars.palette.info.main}}>
          <CircularProgress sx={{mr: 1}} size={22} color="info" />
          <Box>{m.loading}...</Box>
        </Box>
      )
    case 'error':
      return (
        <Box sx={{display: 'flex', alignItems: 'center', color: t.vars.palette.error.main}}>
          <Icon sx={{mr: 1}}>check_circle</Icon>
          <Box>{err}</Box>
        </Box>
      )
    case 'success':
      return (
        <Box sx={{display: 'flex', alignItems: 'center', color: t.vars.palette.success.main}}>
          <Icon sx={{mr: 1}}>error</Icon>
          <Box sx={{lineHeight: 1}}>{m.connectionSuccessful ?? m.error}</Box>
        </Box>
      )
  }
}

export const KoboServerForm = ({
  loading,
  onSubmit,
  onCancel,
}: {
  loading?: boolean
  onCancel: () => void
  onSubmit: (f: Ip.Server.Payload.Create) => void
}) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const form = useForm<Omit<Ip.Server, 'id'>>({mode: 'onChange'})
  const [server, setServer] = useState<undefined | 'custom' | keyof typeof servers>('custom')

  const fetcherTest = useFetcher(() => {
    const {token, url} = form.getValues()
    return api
      .proxyRequest('GET', url + '/me', {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(_ => true)
      .catch((_: ApiError) => _.message)
  })

  useEffect(() => {
    if (server && server !== 'custom') {
      form.setValue('urlV1', servers[server].v1)
      form.setValue('url', servers[server].v2)
    } else {
      form.setValue('urlV1', '')
      form.setValue('url', '')
    }
  }, [server])

  return (
    <>
      <AccessFormSection icon="language" label={m.server} sxContent={{pb: 0}}>
        <Core.RadioGroup dense value={server} onChange={setServer} sx={{mb: 3}}>
          {Obj.keys(servers).map(name => (
            <Core.RadioGroupItem key={name} value={name} title={name} />
          ))}
          <Core.RadioGroupItem icon="edit" value="custom" title={m.custom} />
        </Core.RadioGroup>
        <Controller
          control={form.control}
          name="urlV1"
          disabled={server !== 'custom'}
          rules={{
            required: true,
            pattern: Regexp.get.url,
          }}
          render={({field, fieldState}) => (
            <Core.Input {...field} required label={m.serverUrlV1} error={fieldState.invalid} />
          )}
        />
        <Controller
          control={form.control}
          name="url"
          disabled={server !== 'custom'}
          rules={{
            required: true,
            pattern: Regexp.get.url,
          }}
          render={({field, fieldState}) => (
            <Core.Input
              required
              {...field}
              label={m.serverUrlV2}
              error={fieldState.invalid}
            />
          )}
        />
      </AccessFormSection>
      <AccessFormSection icon="key" label={m.access} sxContent={{pb: 0}}>
        <Core.Txt block color="hint" size="small" gutterBottom>
          <div>Can be found in your account settings.</div>
          {map(form.watch('url'), url => {
            if (url === '') return
            const link = url.replace(/\/+$/, '') + '/#/account/security'
            return (
              <a target="_blank" href={link} className="link">
                {link}
              </a>
            )
          })}
        </Core.Txt>
        <Controller
          control={form.control}
          name="token"
          rules={{
            required: true,
            pattern: new RegExp(/^[0-9a-z]+$/),
          }}
          render={({field, fieldState}) => (
            <Core.Input
              // endAdornment={<Icon>key</Icon>}
              required
              label={m.apiToken}
              error={fieldState.invalid}
              {...field}
            />
          )}
        />
      </AccessFormSection>
      <AccessFormSection icon="info" label={m.name} sxContent={{pb: 0}}>
        <Controller
          control={form.control}
          name="name"
          rules={{
            required: true,
          }}
          render={({field, fieldState}) => (
            <Core.Input required {...field} label={m.accountName} error={fieldState.invalid} />
          )}
        />
      </AccessFormSection>
      <Box sx={{display: 'flex'}}>
        <Core.Btn
          variant="outlined"
          disabled={!form.formState.isValid}
          icon="network_check"
          onClick={() => fetcherTest.fetch()}
          sx={{mr: 1, whiteSpace: 'nowrap'}}
        >
          {m.testConnection}
        </Core.Btn>
        <ConnectionChecker
          status={fetcherTest.loading ? 'loading' : fetcherTest.get === true ? 'success' : 'error'}
          err={fetcherTest.get as any}
        />
      </Box>
      <CardActions sx={{justifyContent: 'flex-end'}}>
        <Core.Btn color="primary" onClick={onCancel}>
          {m.close}
        </Core.Btn>
        <Core.Btn
          loading={loading}
          variant="contained"
          color="primary"
          onClick={() => onSubmit(form.getValues())}
          disabled={!form.formState.isValid}
        >
          {m.save}
        </Core.Btn>
      </CardActions>
    </>
  )
}

export const KoboServerFormDialog = ({
  open,
  onClose,
  payload,
}: DialogProps<{
  workspaceId: Ip.WorkspaceId
}>) => {
  const {m} = useI18n()
  const queryCreate = useQueryServers(payload.workspaceId).create
  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>{m.addNewKoboAccount}</DialogTitle>
      <DialogContent>
        {queryCreate.error && <Core.Alert color="error" content={queryCreate.error.message} />}
        <KoboServerForm
          loading={queryCreate.isPending}
          onCancel={onClose}
          onSubmit={_ => {
            queryCreate.mutateAsync(_).then(() => onClose())
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
