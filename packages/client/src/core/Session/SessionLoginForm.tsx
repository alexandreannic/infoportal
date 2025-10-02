import {Box, ButtonBase, useTheme} from '@mui/material'
import {IpLogo} from '@/shared/logo/logo'
import {Core} from '@/shared'
import React, {ReactNode} from 'react'
import {useMsal} from '@azure/msal-react'
import {useAsync, useEffectFn} from '@axanc/react-hooks'
import {useI18n} from '@infoportal/client-i18n'
import {useIpToast} from '@/core/useToast'
import {mapPromise} from '@axanc/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {CenteredContent} from '@/shared/CenteredContent'
import {useGoogleLogin} from '@react-oauth/google'
import {ButtonProps} from '@mui/material/Button'
import {Ip} from 'infoportal-api-sdk'
import {styleUtils} from '@infoportal/client-core'

const BtnLogin = ({
  title,
  desc,
  sx,
  icon,
  ...props
}: ButtonProps & {
  icon: ReactNode
  title: string
  desc?: string
}) => {
  const t = useTheme()
  return (
    <ButtonBase
      sx={{
        ...sx,
        background: t.vars.palette.background.default,
        // border: '1px solid',
        // borderColor: t.vars.palette.divider,
        boxShadow: t.vars.shadows[1],
        display: 'flex',
        alignItems: 'center',
        // margin: 'auto',
        textAlign: 'left',
        // height: 80,
        minWidth: 300,
        height: 50,
        borderRadius: `calc(${t.vars.shape.borderRadius} - 2px)`,
        justifyContent: 'flex-start',
        py: 1,
        px: 2,
      }}
      {...props}
    >
      <Box sx={{ml: -0.5, mr: 1, width: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {icon}
      </Box>
      <Box>
        <Core.Txt block size="big" bold>
          {title}
        </Core.Txt>
        {/*<Core.Txt block color="hint">*/}
        {/*  {desc}*/}
        {/*</Core.Txt>*/}
      </Box>
    </ButtonBase>
  )
}

export const SessionLoginForm = ({setSession}: {setSession: (_: Ip.User) => void}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const {toastError} = useIpToast()
  const msal = useMsal()
  const t = useTheme()
  const _saveSession = useAsync(
    mapPromise({
      promise: api.session.login,
      mapThen: _ => setSession(_.user),
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
      <Core.Panel
        sx={{
          padding: 4,
        }}
      >
        <IpLogo sx={{margin: 'auto', display: 'block', mb: 1}} height={60} />
        <Core.AnimatedText
          sx={{
            display: 'block',
            color: t.vars.palette.primary.dark,
            letterSpacing: 3,
            fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: styleUtils(t).fontSize.big,
          }}
          hideCursorOnComplete={false}
          text={m.appSubTitle}
        />
        <Core.Txt sx={{textAlign: 'center', mt: 1, mb: 2, fontSize: 40}} block>
          {m.appTitle}
        </Core.Txt>

        <BtnLogin
          title={m.signInMicrosoft}
          desc={m.signInMicrosoftDesc}
          icon={<img src="/microsoft.svg" alt="Logo" style={{width: '40px', height: 'auto'}} />}
          onClick={loginWithMicrosoft}
        />
        <BtnLogin
          icon={<img src="/google.svg" alt="Logo" style={{width: '30px', height: 'auto'}} />}
          title={m.signInGoogle}
          desc={m.signInGoogleDesc}
          onClick={() => googleLogin()}
          sx={{mt: 1}}
        />
      </Core.Panel>
    </CenteredContent>
  )
}
