import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {useAppSettings} from '@/core/context/ConfigContext'
import {ReactElement, useEffect, useState} from 'react'
import {Modal, Txt} from '@/shared'
import {useI18n} from '@/core/i18n'
import {Box} from '@mui/material'
import {useFetchers} from '@/shared/hook/useFetchers'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {KoboFormCreate} from '@/core/sdk/server/kobo/KoboFormSdk'
import {useIpToast} from '@/core/useToast'
import {useFetcher} from '@/shared/hook/useFetcher'
import {useAsync} from '@/shared/hook/useAsync'

export const DatabaseNew = ({children, onAdded}: {onAdded?: () => void; children: ReactElement<any>}) => {
  const {api} = useAppSettings()
  const _server = useFetcher(api.kobo.server.getAll)
  const _form = useFetchers(api.koboApi.searchSchemas, {requestKey: ([_]) => _.serverId})
  const _add = useAsync(api.kobo.form.add)
  const {m, formatDate} = useI18n()
  const [selectedForm, setSelectedForm] = useState<KoboFormCreate | undefined>()
  const {toastHttpError} = useIpToast()

  useEffectFn(_server.error, toastHttpError)
  // useEffectFn(_form.error, toastHttpError)
  useEffectFn(_add.error, toastHttpError)

  useEffect(() => {
    _server.fetch()
  }, [])

  useEffect(() => {
    if (_server.get) {
      _server.get.forEach((_) => _form.fetch({}, {serverId: _.id}))
    }
  }, [_server.get])

  return (
    <Modal
      loading={_server.loading || _form.anyLoading || _add.loading}
      title={m._koboDatabase.registerNewForm}
      confirmLabel={m.register}
      onConfirm={(event, close) => {
        if (selectedForm) {
          _add.call(selectedForm).then(onAdded)
          setSelectedForm(undefined)
        }
      }}
      content={
        <>
          {_server.get?.map((server) => (
            <Box
              key={server.id}
              sx={{
                '&:not(:last-of-type)': {
                  mb: 2,
                },
              }}
            >
              <Txt size="big" bold sx={{mb: 0.5}}>
                {server.url.replace('https://', '')}
              </Txt>
              <ScRadioGroup dense value={selectedForm?.uid}>
                {_form.get[server.id]
                  ?.filter((_) => _.has_deployment)
                  .map((form) => (
                    <ScRadioGroupItem
                      dense
                      key={form.uid}
                      value={form.uid}
                      onClick={() =>
                        setSelectedForm({
                          uid: form.uid,
                          serverId: server.id,
                        })
                      }
                      title={form.name}
                      description={
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                          <Box>{form.deployment__submission_count}</Box>
                          {formatDate(form.date_created)}
                        </Box>
                      }
                    />
                  ))}
              </ScRadioGroup>
            </Box>
          ))}
        </>
      }
    >
      {children}
    </Modal>
  )
}
