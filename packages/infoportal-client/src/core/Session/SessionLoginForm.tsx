import {Box, ButtonBase, Icon} from '@mui/material'
import {DRCLogo} from '@/shared/logo/logo'
import {Txt} from '@/shared/Txt'
import React from 'react'
import {useMsal} from '@azure/msal-react'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {useI18n} from '@/core/i18n'
import {useIpToast} from '@/core/useToast'
import {mapPromise} from '@axanc/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UserSession} from '@/core/sdk/server/session/Session'
import {CenteredContent} from '@/shared/CenteredContent'
import {useAsync} from '@/shared/hook/useAsync'

export const SessionLoginForm = ({setSession}: {setSession: (_: UserSession) => void}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const {toastError} = useIpToast()
  const msal = useMsal()

  const _login = useAsync(() =>
    msal.instance.loginPopup({
      scopes: ['User.Read'],
    }),
  )
  // useEffectFn(_login.error, _ => _ && toastError(m.youDontHaveAccess))

  const _saveSession = useAsync(
    mapPromise({
      promise: api.session.login,
      mapThen: setSession,
    }),
  )
  useEffectFn(_saveSession.error, () => toastError(m.youDontHaveAccess))

  return (
    <CenteredContent>
      <Box
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
          padding: 4,
          borderRadius: '8px',
        }}
      >
        <DRCLogo sx={{margin: 'auto', display: 'block', mb: 2}} />
        <Txt sx={{textAlign: 'center'}} size="title" block>
          {m.title}
        </Txt>
        <Txt sx={{textAlign: 'center', mb: 4}} size="big" color="hint" block>
          {m.subTitle}
        </Txt>
        <ButtonBase
          sx={{
            boxShadow: (t) => t.shadows[2],
            display: 'flex',
            alignItems: 'center',
            margin: 'auto',
            textAlign: 'left',
            height: 80,
            minWidth: 300,
            borderRadius: '8px',
          }}
          onClick={() =>
            msal.instance
              .loginPopup({
                scopes: ['User.Read'],
              })
              .then((_) => {
                _saveSession.call({
                  accessToken: _.accessToken,
                  name: _.account?.name ?? '',
                  username: _.account!.username,
                })
                return _
              })
          }
        >
          <Icon sx={{mr: 2}}>login</Icon>
          <Box>
            <Txt block size="big" bold>
              {m.signIn}
            </Txt>
            <Txt block color="hint">
              {m.signInDesc}
            </Txt>
          </Box>
        </ButtonBase>
      </Box>
    </CenteredContent>
  )
}
