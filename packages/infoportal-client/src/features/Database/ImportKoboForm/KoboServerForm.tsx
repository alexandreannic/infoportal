import {IpInput} from '@/shared/Input/Input'
import {useI18n} from '@/core/i18n'
import {Controller, useForm} from 'react-hook-form'
import {Regexp} from 'infoportal-common'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Obj} from '@axanc/ts-utils'
import {useEffect, useState} from 'react'
import {UseAsyncSimple, useFetcher} from '@axanc/react-hooks'
import {useAppSettings} from '@/core/context/ConfigContext'
import {IpAlert, IpBtn} from '@/shared'
import {Box, CardActions, CircularProgress, Dialog, DialogContent, DialogTitle, Icon, useTheme} from '@mui/material'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {KoboServer, KoboServerCreate} from '@/core/sdk/server/kobo/KoboMapper'
import {DialogProps} from '@toolpad/core'

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
        <Box sx={{display: 'flex', alignItems: 'center', color: t.palette.info.main}}>
          <CircularProgress sx={{mr: 1}} size={22} color="info" />
          <Box>{m.loading}...</Box>
        </Box>
      )
    case 'error':
      return (
        <Box sx={{display: 'flex', alignItems: 'center', color: t.palette.error.main}}>
          <Icon sx={{mr: 1}}>check_circle</Icon>
          <Box>{err}</Box>
        </Box>
      )
    case 'success':
      return (
        <Box sx={{display: 'flex', alignItems: 'center', color: t.palette.success.main}}>
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
  onSubmit: (f: KoboServerCreate) => void
}) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const form = useForm<Omit<KoboServer, 'id'>>()
  const [server, setServer] = useState<undefined | 'custom' | keyof typeof servers>()

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
      <ScRadioGroup dense value={server} onChange={setServer} sx={{mb: 3}}>
        {Obj.keys(servers).map(name => (
          <ScRadioGroupItem key={name} value={name} title={name} />
        ))}
        <ScRadioGroupItem icon="edit" value="custom" title={m.custom} />
      </ScRadioGroup>
      <Controller
        control={form.control}
        name="name"
        rules={{
          required: true,
        }}
        render={({field, fieldState}) => <IpInput {...field} label={m.name} error={fieldState.invalid} />}
      />
      <Controller
        control={form.control}
        name="urlV1"
        disabled={server !== 'custom'}
        rules={{
          required: true,
          pattern: Regexp.get.url,
        }}
        render={({field, fieldState}) => (
          <IpInput
            InputLabelProps={{
              shrink: !!field.value,
            }}
            {...field}
            notched={!!field.value}
            label={m.serverUrlV1}
            error={fieldState.invalid}
          />
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
          <IpInput
            InputLabelProps={{
              shrink: !!field.value,
            }}
            {...field}
            notched={!!field.value}
            label={m.serverUrlV2}
            error={fieldState.invalid}
          />
        )}
      />
      <Controller
        control={form.control}
        name="token"
        rules={{
          required: true,
          pattern: new RegExp(/^[0-9a-z]+$/),
        }}
        render={({field, fieldState}) => <IpInput label={m.apiToken} error={fieldState.invalid} {...field} />}
      />
      <Box sx={{display: 'flex'}}>
        <IpBtn
          variant="outlined"
          disabled={!form.formState.isValid}
          icon="network_check"
          onClick={() => fetcherTest.fetch()}
          sx={{mr: 1, whiteSpace: 'nowrap'}}
        >
          {m.testConnection}
        </IpBtn>
        <ConnectionChecker
          status={fetcherTest.loading ? 'loading' : fetcherTest.get === true ? 'success' : 'error'}
          err={fetcherTest.get as any}
        />
      </Box>
      <CardActions sx={{justifyContent: 'flex-end'}}>
        <IpBtn color="primary" onClick={onCancel}>
          {m.close}
        </IpBtn>
        <IpBtn
          loading={loading}
          variant="contained"
          color="primary"
          onClick={() => onSubmit(form.getValues())}
          disabled={!form.formState.isValid}
        >
          {m.save}
        </IpBtn>
      </CardActions>
    </>
  )
}

export const KoboServerFormDialog = ({
  open,
  onClose,
  payload,
}: DialogProps<UseAsyncSimple<(_: KoboServerCreate) => Promise<KoboServer>>, void | KoboServer>) => {
  const {m} = useI18n()
  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>{m.addNewKoboAccount}</DialogTitle>
      <DialogContent>
        {payload.error && <IpAlert color="error" content={payload.error} />}
        <KoboServerForm
          loading={payload.loading}
          onCancel={onClose}
          onSubmit={_ => {
            payload.call(_).then(onClose)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
