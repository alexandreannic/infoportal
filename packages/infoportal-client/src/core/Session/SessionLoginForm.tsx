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
import {ButtonProps} from '@mui/material/Button'

const BtnLogin = ({
  title,
  desc,
  sx,
  icon,
  ...props
}: ButtonProps & {
  icon: string
  title: string
  desc?: string
}) => {
  return (
    <ButtonBase
      sx={{
        ...sx,
        boxShadow: (t: Theme) => t.shadows[2],
        display: 'flex',
        alignItems: 'center',
        // margin: 'auto',
        textAlign: 'left',
        // height: 80,
        minWidth: 300,
        borderRadius: '8px',
        justifyContent: 'flex-start',
        py: 1,
        px: 2,
      }}
      {...props}
    >
      <Icon sx={{mr: 2}}>{icon}</Icon>
      <Box>
        <Txt block size="big" bold>
          {title}
        </Txt>
        <Txt block color="hint">
          {desc}
        </Txt>
      </Box>
    </ButtonBase>
  )
}

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
      .then(res => {
        _saveSession.call({
          accessToken: res.accessToken,
          name: res.account?.name ?? '',
          username: res.account!.username,
          provider: 'microsoft',
        })
      })
      .catch(err => toastError(err.message))
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
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
          border: t => `1px solid ${t.palette.divider}`,
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

        <BtnLogin title={m.signInMicrosoft} desc={m.signInMicrosoftDesc} icon="login" onClick={loginWithMicrosoft} />
        <BtnLogin
          title={m.signInGoogle}
          desc={m.signInGoogleDesc}
          icon="android"
          onClick={() => googleLogin()}
          sx={{mt: 1}}
        />
      </Box>
    </CenteredContent>
  )
}
