import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@/core/i18n'
import {alpha, Box, BoxProps, Chip, Icon, styled, Tooltip, useTheme} from '@mui/material'
import {AppAvatar, IpIconBtn, Txt} from '@/shared'
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
          background: version.status === 'draft' ? undefined : t.palette.divider,
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

export const VersionRowRoot = ({createdAt}: {createdAt: Date}) => {
  const dotSize = 10
  const {m, formatDateTime, dateFromNow} = useI18n()
  const t = useTheme()
  return (
    <VersionRowContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: avatarSize,
          '&:before': {
            content: '" "',
            marginLeft: avatarSize / 2 - 1 + 'px',
            height: 10,
            width: borderWidth,
            marginBottom: 0,
            background: t.palette.divider,
          },
        }}
      >
        <Box
          sx={{
            marginLeft: avatarSize / 2 - dotSize / 2 + 'px',
            borderRadius: '100px',
            background: t.palette.divider,
            height: dotSize,
            width: dotSize,
            mb: 1,
          }}
        />
      </Box>
      <Box sx={{ml: 1.5}}>{m.creation}</Box>
      <Box sx={{width: '100%', ml: 1, display: 'flex', justifyContent: 'flex-end'}}>
        <Txt color="hint">{dateFromNow(createdAt)}</Txt>
      </Box>
    </VersionRowContainer>
  )
}

const VersionRowContainer = styled('div')(({theme: t}) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: t.shape.borderRadius + 'px',
  paddingRight: t.spacing(1),
  paddingLeft: t.spacing(1),
  '&:hover': {
    background: alpha(t.palette.primary.light, 0.15),
  },
}))

export const VersionRowShowMore = (props: BoxProps) => {
  const t = useTheme()
  const {m} = useI18n()
  return (
    <VersionRowContainer style={{cursor: 'pointer'}} onClick={props.onClick}>
      <Box
        sx={{
          height: 32,
          marginLeft: avatarSize / 2 - 1 + 'px',
          borderLeft: borderWidth + 'px dashed',
          borderColor: t.palette.divider,
          width: avatarSize,
        }}
      />
      <Box sx={{ml: 1, display: 'flex', alignItems: 'center'}}>
        <Icon sx={{color: t.palette.text.disabled, mr: 1}}>expand</Icon>
        {m.showMore}...
      </Box>
    </VersionRowContainer>
  )
}

export const VersionRow = ({version}: {version: Ip.Form.Version}) => {
  const {m, formatDateTime, dateFromNow} = useI18n()
  return (
    <VersionRowContainer>
      <Logo version={version} />
      <Box sx={{display: 'flex', width: '100%', justifyContent: 'flex-start', minWidth: 0}}>
        <Txt bold sx={{flexShrink: 0, ml: 1, mr: 1, width: 26, textAlign: 'left'}}>
          v{version.version}
        </Txt>
        <Txt color="hint" truncate sx={{minWidth: 0}}>
          {version.message}
        </Txt>
        <div style={{marginLeft: 'auto', whiteSpace: 'nowrap', flexShrink: 0, paddingLeft: 1}}>
          {fnSwitch(
            version.status,
            {
              draft: <Chip icon={<Icon>architecture</Icon>} variant="filled" size="small" label={m.draft} />,
              active: <Chip icon={<Icon>adjust</Icon>} variant="filled" color="primary" size="small" label={m.live} />,
            },
            () => undefined,
          )}
          <Tooltip title={formatDateTime(version.createdAt)}>
            <Txt color="hint" sx={{ml: 1}}>
              {capitalize(dateFromNow(version.createdAt))}
            </Txt>
          </Tooltip>
        </div>
      </Box>
    </VersionRowContainer>
  )
}
