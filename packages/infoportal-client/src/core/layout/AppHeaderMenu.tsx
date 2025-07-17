import React, {ReactNode} from 'react'
import {useSession} from '@/core/Session/SessionContext'
import {Box, BoxProps, Chip, Icon, Popover, SxProps, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {Txt} from '@/shared/Txt'
import {IpBtn} from '@/shared/Btn'
import {AppAvatar} from '@/shared/AppAvatar'
import {fnSwitch} from '@axanc/ts-utils'
import {Ip} from 'infoportal-api-sdk'

const Row = ({
  icon,
  sxIcon,
  sxText,
  children,
}: {
  icon: string
  sxText?: SxProps
  sxIcon?: SxProps
  children: ReactNode
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 1.5,
      }}
    >
      <Icon sx={{mr: 1, color: t => t.palette.text.secondary, ...sxIcon}}>{icon}</Icon>
      <Txt block color="hint" sx={sxText}>
        {children}
      </Txt>
    </Box>
  )
}

export const accessLevelIcon: Record<Ip.AccessLevel, string> = {
  Admin: 'shield_person',
  Read: 'edit',
  Write: 'visibility',
}

export const AppHeaderMenu = ({sx, ...props}: Partial<BoxProps>) => {
  const {user, logout} = useSession()
  const me = user
  const t = useTheme()
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const open = !!anchorEl
  const {m} = useI18n()
  if (!me) {
    return <></>
  }
  return (
    <>
      <AppAvatar size={36} email={me.email} onClick={e => setAnchorEl(e.currentTarget)} {...props} />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setAnchorEl(null)}
        open={open}
      >
        <Box>
          <Box sx={{p: 2}}>
            <Txt bold block size="big" mb={1}>
              {me.name}
            </Txt>
            <Row icon="email">{me.email}</Row>
            <Row icon="work">{me.drcJob}</Row>
            <Row icon="badge">
              {m.access}
              <Chip
                sx={{ml: 1}}
                color="info"
                icon={<Icon>{accessLevelIcon[me.accessLevel]}</Icon>}
                variant="filled"
                size="small"
                label={me.accessLevel}
              />
            </Row>
          </Box>
          <Box sx={{px: 2}}>
            <IpBtn icon="logout" variant="outlined" onClick={logout} sx={{mb: 2}}>
              {m.logout}
            </IpBtn>
          </Box>
        </Box>
      </Popover>
    </>
  )
}
