import {Box, ButtonBase, Icon, Theme} from '@mui/material'
import {DRCLogo} from '@/shared/logo/logo'
import {Txt} from '@/shared/Txt'
import React from 'react'
import {useMsal} from '@azure/msal-react'
import {useEffectFn} from '@axanc/react-hooks'
import {useI18n} from '@/core/i18n'
import {useIpToast} from '@/core/useToast'
import {mapPromise} from '@axanc/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UserSession} from '@/core/sdk/server/session/Session'
import {CenteredContent} from '@/shared/CenteredContent'
import {useAsync} from '@/shared/hook/useAsync'
import {useGoogleLogin} from '@react-oauth/google'

export const SessionLoginForm = ({setSession}: {setSession: (_: UserSession) => void}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const {toastError} = useIpToast()
  const msal = useMsal()

  const _saveSession = useAsync(
    mapPromise({
      promise: api.session.login,
      mapThen: setSession,
    }),
  )
  useEffectFn(_saveSession.error, () => toastError(m.youDontHaveAccess))

  const loginWithMicrosoft = () => {
    msal.instance
      .loginPopup({scopes: ['User.Read']})
      .then((res) => {
        _saveSession.call({
          accessToken: res.accessToken,
          name: res.account?.name ?? '',
          username: res.account!.username,
          provider: 'microsoft',
        })
      })
      .catch((err) => toastError(err.message))
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        })

        const profile = await res.json()
        _saveSession.call({
          accessToken: tokenResponse.access_token,
          name: profile.name ?? '',
          username: profile.email,
          provider: 'google',
        })
      } catch (e) {
        toastError('Failed to retrieve Google profile')
      }
    },
    onError: () => toastError('Google login failed'),
    flow: 'implicit',
  })

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

        {/* Microsoft Login */}
        <ButtonBase sx={btnStyle} onClick={loginWithMicrosoft}>
          <Icon sx={{mr: 2}}>login</Icon>
          <Box>
            <Txt block size="big" bold>
              {m.signInMicrosoft}
            </Txt>
            <Txt block color="hint">
              {m.signInMicrosoftDesc}
            </Txt>
          </Box>
        </ButtonBase>

        {/* Google Login */}
        <ButtonBase sx={{...btnStyle, mt: 2}} onClick={() => googleLogin()}>
          <Icon sx={{mr: 2}}>google</Icon>
          <Box>
            <Txt block size="big" bold>
              {m.signInGoogle}
            </Txt>
            <Txt block color="hint">
              {m.signInGoogleDesc}
            </Txt>
          </Box>
        </ButtonBase>
      </Box>
    </CenteredContent>
  )
}

const btnStyle = {
  boxShadow: (t: Theme) => t.shadows[2],
  display: 'flex',
  alignItems: 'center',
  margin: 'auto',
  textAlign: 'left',
  height: 80,
  minWidth: 300,
  borderRadius: '8px',
}
