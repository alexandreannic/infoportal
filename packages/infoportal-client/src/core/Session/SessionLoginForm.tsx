import {Box, ButtonBase, Icon, useTheme} from '@mui/material'
import {DRCLogo} from '@/shared/logo/logo'
import {Txt} from '@/shared/Txt'
import React, {ReactNode} from 'react'
import {useMsal} from '@azure/msal-react'
import {useEffectFn} from '@axanc/react-hooks'
import {useI18n} from '@/core/i18n'
import {useIpToast} from '@/core/useToast'
import {mapPromise} from '@axanc/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {CenteredContent} from '@/shared/CenteredContent'
import {useAsync} from '@/shared/hook/useAsync'
import {useGoogleLogin} from '@react-oauth/google'
import {ButtonProps} from '@mui/material/Button'
import {User} from '@/core/sdk/server/user/User'
import {Panel} from '@/shared/Panel'

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
        background: t.palette.background.default,
        // border: '1px solid',
        borderColor: t.palette.divider,
        // boxShadow: t.shadows[2],
        display: 'flex',
        alignItems: 'center',
        // margin: 'auto',
        textAlign: 'left',
        // height: 80,
        minWidth: 300,
        height: 50,
        borderRadius: parseInt('' + t.shape.borderRadius) - 2 + 'px',
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
        <Txt block size="big" bold>
          {title}
        </Txt>
        {/*<Txt block color="hint">*/}
        {/*  {desc}*/}
        {/*</Txt>*/}
      </Box>
    </ButtonBase>
  )
}

export const SessionLoginForm = ({setSession}: {setSession: (_: User) => void}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const {toastError} = useIpToast()
  const msal = useMsal()

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
      <Panel
        sx={{
          padding: 4,
        }}
      >
        <DRCLogo sx={{margin: 'auto', display: 'block', mb: 2}} height={60}/>
        <Txt sx={{textAlign: 'center'}} size="big" color="hint" block>
          {m.subTitle}
        </Txt>
        <Txt sx={{textAlign: 'center', mb: 4, fontSize: 40}} block>
          {m.title}
        </Txt>

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
      </Panel>
    </CenteredContent>
  )
}
