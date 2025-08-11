import {useAppSettings} from '@/core/context/ConfigContext'
import {Box, BoxProps, Icon, styled, useTheme} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'

type Props = BoxProps & {
  icon?: string
  borderColor?: string
  overlap?: boolean
  email?: Ip.User.Email
  size: number
  url?: string
  // hideTooltip?: boolean
}
const propToSkip: Set<keyof Props> = new Set(['borderColor', 'size', 'url', 'overlap'])

const Root = styled(Box, {
  shouldForwardProp: prop => !propToSkip.has(prop as any),
})<Pick<Props, 'size' | 'overlap' | 'borderColor' | 'url'>>(({theme: t, borderColor, url, size, overlap}) => ({
  verticalAlign: 'middle',
  border: '2px solid',
  borderColor: borderColor ?? 'transparent',
  marginLeft: overlap ? `calc(${t.vars.spacing} * -1)` : undefined,
  height: size,
  width: size,
  minWidth: size,
  backgroundSize: 'cover',
  borderRadius: 5000,
  backgroundImage: `url(${url})`,
  backgroundColor: t.vars.palette.grey['300'],
  ...t.applyStyles('dark', {
    backgroundColor: t.vars.palette.grey['800'],
  }),
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const AppAvatar = ({
  email,
  size,
  overlap,
  icon = 'person',
  borderColor,
  url,
  ...props
  // hideTooltip,
}: Props) => {
  const t = useTheme()
  const {apiv2} = useAppSettings()
  if (email && !url) url = apiv2.user.getAvatarUrl({email})

  return (
    <Root title={email} url={url} size={size} {...props}>
      {!email && (
        <Icon
          sx={{
            color: t.vars.palette.grey['600'],
            fontSize: size - 2,
            ...t.applyStyles('dark', {
              color: t.vars.palette.grey['400'],
            }),
          }}
        >
          {icon}
        </Icon>
      )}
    </Root>
  )
}
