import {useAppSettings} from '@/core/context/ConfigContext'
import {Box, BoxProps, Icon} from '@mui/material'
import {makeStyles} from 'tss-react/mui'

const useStyles = makeStyles<{url?: string; size: number; tooltipSize?: number}>()((t, {url, size, tooltipSize}) => ({
  root: {
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
  ...props
  // hideTooltip,
}: {
  email?: string
  size: number
  // hideTooltip?: boolean
} & BoxProps) => {
  const {api} = useAppSettings()
  const {classes} = useStyles({
    url: email ? api.user.avatarUrl(email) : undefined,
    size,
  })
  return (
    <Box title={email} className={classes.root} {...props}>
      {!email && <Icon sx={{color: 'white', fontSize: size - 2}}>person</Icon>}
    </Box>
  )
}
