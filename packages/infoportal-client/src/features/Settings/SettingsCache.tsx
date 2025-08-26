import {Page} from '@/shared/Page'
import {useAppSettings} from '@/core/context/ConfigContext'
import React, {useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {useFetcher} from '../../../../infoportal-client-core/src/hook/useFetcher'
import {map} from '@axanc/ts-utils'
import {JSONTree} from 'react-json-tree'
import {Panel, PanelBody, PanelHead} from '../../../../infoportal-client-core/src/Panel'
import {Box, useTheme} from '@mui/material'
import {addMilliseconds} from 'date-fns'
import {IpBtn} from '../../../../infoportal-client-core/src/Btn.js'
import {Txt} from '../../../../infoportal-client-core/src/Txt.js'
import {useAsync} from '../../../../infoportal-client-core/src/hook/useAsync'
import {IpIconBtn} from '../../../../infoportal-client-core/src/IconBtn.js'
import {settingsRoute} from '@/features/Settings/Settings'
import {createRoute} from '@tanstack/react-router'

export const settingsCacheRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: 'cache',
  component: SettingsCache,
})

function SettingsCache() {
  const {api} = useAppSettings()
  const {m, formatDate, dateFromNow, formatDateTime} = useI18n()
  const t = useTheme()
  const fetcherCache = useFetcher(api.cache.get)
  const asyncClear = useAsync(
    (k: string, sk?: string) => api.cache.clear(k, sk).then(() => fetcherCache.fetch({force: true, clean: false})),
    {
      requestKey: _ => _[0] + (_[1] ?? ''),
    },
  )
  useEffect(() => {
    fetcherCache.fetch()
  }, [])

  return (
    <Page width="md" loading={fetcherCache.loading}>
      {map(fetcherCache.get, cache =>
        Object.entries(cache).map(([key, info]) => {
          return (
            <Panel key={key}>
              <PanelHead
                action={
                  <IpBtn
                    loading={asyncClear.loading[key]}
                    size="small"
                    variant="outlined"
                    icon="delete"
                    onClick={() => asyncClear.call(key)}
                  >
                    {m.clearAll}
                  </IpBtn>
                }
              >
                {key}
              </PanelHead>
              <PanelBody>
                <Txt block color="hint" sx={{mb: 1, mt: -1}}>
                  Refreshed {dateFromNow(info.lastUpdate)}, expire{' '}
                  {dateFromNow(addMilliseconds(info.lastUpdate, info.expiration ?? 0))}
                </Txt>
                <Box sx={{}}>
                  {Object.entries(info.value).map(([subKey, value]) => (
                    <Box key={key + subKey}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-between',
                          alignItems: 'center',
                          px: 1,
                          borderTopLeftRadius: t.vars.shape.borderRadius,
                          borderTopRightRadius: t.vars.shape.borderRadius,
                          background: t.vars.palette.background.default,
                          mt: 1,
                        }}
                      >
                        <Txt block bold sx={{width: '100%'}}>
                          {subKey}
                        </Txt>
                        <IpIconBtn
                          color="primary"
                          size="small"
                          children="delete"
                          loading={asyncClear.loading[key + subKey]}
                          onClick={() => asyncClear.call(key, subKey)}
                        />
                      </Box>
                      <Box
                        sx={{
                          overflow: 'hidden',
                          '& > ul': {
                            margin: '0 !important',
                            padding: `0 ${t.vars.spacing} ${t.vars.spacing} ${t.vars.spacing} !important`,
                            borderBottomLeftRadius: t.vars.shape.borderRadius,
                            borderBottomRightRadius: t.vars.shape.borderRadius,
                          },
                        }}
                      >
                        <JSONTree data={value} shouldExpandNodeInitially={() => false} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </PanelBody>
            </Panel>
          )
        }),
      )}
    </Page>
  )
}
