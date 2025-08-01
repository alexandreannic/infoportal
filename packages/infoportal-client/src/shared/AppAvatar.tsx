import {useAppSettings} from '@/core/context/ConfigContext'
import {Box, BoxProps, Icon, useTheme} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {makeStyles} from 'tss-react/mui'

const useStyles = makeStyles<{
  borderColor?: string
  overlap?: boolean
  url?: string
  size: number
  tooltipSize?: number
}>()((t, {url, size, overlap, borderColor, tooltipSize}) => ({
  root: {
    verticalAlign: 'middle',
    border: '2px solid',
    borderColor: borderColor ?? 'transparent',
    marginLeft: overlap ? t.spacing(-1) : undefined,
    height: size,
    width: size,
    minWidth: size,
    backgroundSize: 'cover',
    borderRadius: 5000,
    backgroundImage: `url(${url})`,
    backgroundColor: t.palette.mode === 'light' ? t.palette.grey['300'] : t.palette.grey['800'],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export const AppAvatar = ({
  email,
  size,
  overlap,
  icon = 'person',
  borderColor,
  ...props
  // hideTooltip,
}: {
  icon?: string
  borderColor?: string
  overlap?: boolean
  email?: Ip.User.Email
  size: number
  // hideTooltip?: boolean
} & BoxProps) => {
  const {api} = useAppSettings()
  const {classes} = useStyles({
    overlap,
    borderColor,
    url: email ? api.user.avatarUrl({email}) : undefined,
    size,
  })
  const t = useTheme()
  return (
    <Box title={email} className={classes.root} {...props}>
      {!email && (
        <Icon
          sx={{
            color: t.palette.mode === 'light' ? t.palette.grey['600'] : t.palette.grey['400'],
            fontSize: size - 2,
          }}
        >
          {icon}
        </Icon>
      )}
    </Box>
  )
}
