import React, {ReactNode, useMemo} from 'react'
import {useSession} from '@/core/Session/SessionContext'
import {Box, BoxProps, Chip, Icon, Popover, SxProps} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '@/shared'
import {AppAvatar} from '@/shared/AppAvatar'
import {Api} from '@infoportal/api-sdk'
import {UseQueryWorkspace} from '@/core/query/workspace/useQueryWorkspace.js'

const Row = ({
  icon,
  sxIcon,
  sxText,
  children,
  sx,
}: {
  icon: string
  sxText?: SxProps
  sxIcon?: SxProps
  sx?: SxProps
  children: ReactNode
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 1.5,
        ...sx,
      }}
    >
      <Icon sx={{mr: 1, color: t => t.vars.palette.text.secondary, ...sxIcon}}>{icon}</Icon>
      <Core.Txt block color="hint" sx={sxText}>
        {children}
      </Core.Txt>
    </Box>
  )
}

export const accessLevelIcon: Record<Api.AccessLevel, string> = {
  Admin: 'shield_person',
  Read: 'visibility',
  Write: 'edit',
}

export const AccessBadge = ({accessLevel}: {accessLevel: Api.AccessLevel}) => {
  return (
    <Chip
      sx={{ml: 1}}
      color="info"
      icon={<Icon>{accessLevelIcon[accessLevel]}</Icon>}
      variant="filled"
      size="small"
      label={accessLevel}
    />
  )
}

export const AccessLevelRow = ({accessLevel, sx}: {sx?: SxProps; accessLevel: Api.AccessLevel}) => {
  const {m} = useI18n()
  return (
    <Row icon="badge" sx={sx}>
      {m.access}
      <AccessBadge accessLevel={accessLevel} />
    </Row>
  )
}

export const AppHeaderMenu = ({
  workspaceId,
  sx,
  ...props
}: {workspaceId?: Api.WorkspaceId} & Partial<Omit<BoxProps, 'borderColor'>>) => {
  const {user, logout} = useSession()
  const me = user
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const open = !!anchorEl
  const queryWorkspace = UseQueryWorkspace.get()

  const currentWorkspace = useMemo(() => {
    return queryWorkspace.data?.find(_ => _.id === workspaceId)
  }, [queryWorkspace.data])

  const {m} = useI18n()
  if (!me) {
    return <></>
  }
  return (
    <>
      <AppAvatar size={32} email={me.email} onClick={e => setAnchorEl(e.currentTarget)} {...props} />
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
            <Core.Txt bold block size="big" mb={1}>
              {me.name}
            </Core.Txt>
            <Row icon="email">{me.email}</Row>
            {me.job && <Row icon="work">{me.job}</Row>}
            {currentWorkspace?.level && <AccessLevelRow accessLevel={currentWorkspace?.level} />}
          </Box>
          <Box sx={{px: 2}}>
            <Core.Btn icon="logout" variant="outlined" onClick={logout} sx={{mb: 2}}>
              {m.logout}
            </Core.Btn>
          </Box>
        </Box>
      </Popover>
    </>
  )
}
