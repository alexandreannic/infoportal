import {useAppSettings} from '@/core/context/ConfigContext'
import {Box, BoxProps, Icon} from '@mui/material'
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
    border: '2px solid',
    borderColor: borderColor ?? 'transparent',
    marginLeft: overlap ? t.spacing(-1) : undefined,
    height: size,
    width: size,
    minWidth: size,
    backgroundSize: 'cover',
    borderRadius: 5000,
    backgroundImage: `url(${url})`,
    backgroundColor: t.palette.grey['400'],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export const AppAvatar = ({
  email,
  size,
  overlap,
  borderColor,
  ...props
  // hideTooltip,
}: {
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
  return (
    <Box title={email} className={classes.root} {...props}>
      {!email && <Icon sx={{color: 'white', fontSize: size - 2}}>person</Icon>}
    </Box>
  )
}
