import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@/core/i18n'
import {alpha, Box, Tooltip, useTheme} from '@mui/material'
import {AppAvatar, Txt} from '@/shared'
import {fnSwitch} from '@axanc/ts-utils'
import {capitalize} from 'infoportal-common'
import React from 'react'

const borderWidth = 2.5
const avatarSize = 26

const Logo = ({version}: {version: Ip.Form.Version}) => {
  const t = useTheme()
  const border = fnSwitch(version.status, {
    draft: {style: 'dashed', color: t.palette.primary.main},
    inactive: {style: 'solid', color: t.palette.divider},
    active: {style: 'solid', color: t.palette.primary.main},
  })
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        '&:before': {
          content: '" "',
          marginLeft: avatarSize / 2 - 1 + 'px',
          height: 5,
          width: borderWidth,
          marginBottom: borderWidth + 'px',
          background: t.palette.divider,
        },
        '&:after': {
          content: '" "',
          marginLeft: avatarSize / 2 - 1 + 'px',
          height: 5,
          width: borderWidth,
          marginTop: borderWidth + 'px',
          background: t.palette.divider,
        },
      }}
    >
      <AppAvatar
        size={avatarSize}
        sx={{
          verticalAlign: 'middle',
          mr: 0.5,
          outline: `${borderWidth}px ${border.style} ${border.color}`,
        }}
        email={version.uploadedBy}
      />
    </Box>
  )
}

export const VersionRow = ({version}: {version: Ip.Form.Version}) => {
  const {m, formatDateTime, dateFromNow} = useI18n()
  const t = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: t.shape.borderRadius + 'px',
        px: 1,
        '&:hover': {
          background: alpha(t.palette.primary.light, 0.15),
        },
      }}
    >
      <Logo version={version} />
      <Box sx={{display: 'flex'}}>
        <Txt bold sx={{ml: 1, mr: 1, width: 26, textAlign: 'right'}}>
          v{version.version}
        </Txt>
        <Txt color="hint" truncate sx={{width: 200}}>
          {version.message}
        </Txt>
        <Tooltip title={formatDateTime(version.createdAt)}>
          <Txt color="hint" style={{marginLeft: 'auto'}}>
            {capitalize(dateFromNow(version.createdAt))}
          </Txt>
        </Tooltip>
      </Box>
    </Box>
  )
}
