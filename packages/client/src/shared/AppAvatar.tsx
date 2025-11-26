import {useAppSettings} from '@/core/context/ConfigContext'
import {Box, BoxProps, Icon, Tooltip, useTheme} from '@mui/material'
import {Api} from '@infoportal/api-sdk'

type Props = BoxProps & {
  icon?: string
  borderColor?: string
  overlap?: boolean
  email?: Api.User.Email
  size: number
  url?: string
  tooltip?: boolean
  // hideTooltip?: boolean
}

export const AppAvatar = ({
  email,
  size,
  overlap,
  icon = 'person',
  borderColor,
  url,
  sx,
  tooltip,
  ...props
  // hideTooltip,
}: Props) => {
  const t = useTheme()
  const {apiv2} = useAppSettings()
  if (email && !url) url = apiv2.user.getAvatarUrl({email})

  const content = (
    <Box
      title={email}
      sx={{
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
        ...sx,
      }}
      {...props}
    >
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
    </Box>
  )

  if (tooltip) return <Tooltip title={email}>{content}</Tooltip>
  return content
}
