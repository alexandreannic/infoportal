import React, {ReactNode} from 'react'
import {useSession} from '@/core/Session/SessionContext'
import {Box, BoxProps, Icon, Popover} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {Txt} from '@/shared/Txt'
import {IpBtn} from '@/shared/Btn'
import {AppAvatar} from '@/shared/AppAvatar'

const Row = ({icon, children}: {icon: string; children: ReactNode}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 0.5,
      }}
    >
      <Icon sx={{mr: 1, my: 0.25, color: t => t.palette.text.secondary}}>{icon}</Icon>
      <Txt block color="hint">
        {children}
      </Txt>
    </Box>
  )
}

export const AppHeaderMenu = ({sx, ...props}: Partial<BoxProps>) => {
  const {user, logout} = useSession()
  const me = user
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
            <Row icon="badge">{me.drcJob}</Row>
            {me.admin && <Row icon="shield">{m.admin}</Row>}
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
