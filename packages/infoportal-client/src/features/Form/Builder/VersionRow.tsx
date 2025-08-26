import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@/core/i18n'
import {Box, BoxProps, Chip, Icon, styled, Tooltip, useTheme} from '@mui/material'
import {AppAvatar} from '@/shared'
import {fnSwitch} from '@axanc/ts-utils'
import {capitalize} from 'infoportal-common'
import React from 'react'
import {Core} from '@/shared'

const borderWidth = 2.5
const avatarSize = 26

const Logo = ({version, index}: {index?: number; version: Ip.Form.Version}) => {
  const t = useTheme()
  const border = fnSwitch(version.status, {
    draft: {style: 'dashed', color: t.vars.palette.primary.main},
    inactive: {style: 'solid', color: t.vars.palette.divider},
    active: {style: 'solid', color: t.vars.palette.primary.main},
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
          background: index === 0 ? undefined : t.vars.palette.divider,
        },
        '&:after': {
          content: '" "',
          marginLeft: avatarSize / 2 - 1 + 'px',
          height: 5,
          width: borderWidth,
          marginTop: borderWidth + 'px',
          background: t.vars.palette.divider,
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
            background: t.vars.palette.divider,
          },
        }}
      >
        <Box
          sx={{
            marginLeft: avatarSize / 2 - dotSize / 2 + 'px',
            borderRadius: '100px',
            background: t.vars.palette.divider,
            height: dotSize,
            width: dotSize,
            mb: 1,
          }}
        />
      </Box>
      <Box sx={{ml: 1.5}}>{m.creation}</Box>
      <Box sx={{width: '100%', ml: 1, display: 'flex', justifyContent: 'flex-end'}}>
        <Core.Txt color="hint">{dateFromNow(createdAt)}</Core.Txt>
      </Box>
    </VersionRowContainer>
  )
}

const VersionRowContainer = styled('div')(({theme: t}) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: t.vars.shape.borderRadius,
  paddingRight: t.vars.spacing,
  paddingLeft: t.vars.spacing,
  '&:hover': {
    background: Core.alphaVar(t.vars.palette.primary.light, 0.15),
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
          borderColor: t.vars.palette.divider,
          width: avatarSize,
        }}
      />
      <Box sx={{ml: 1, display: 'flex', alignItems: 'center'}}>
        <Icon sx={{color: t.vars.palette.text.disabled, mr: 1}}>expand</Icon>
        {m.showMore}...
      </Box>
    </VersionRowContainer>
  )
}

export const VersionRow = ({version, index}: {index?: number; version: Ip.Form.Version}) => {
  const {m, formatDateTime, dateFromNow} = useI18n()
  return (
    <VersionRowContainer>
      <Logo version={version} index={index} />
      <Box sx={{display: 'flex', width: '100%', justifyContent: 'flex-start', minWidth: 0}}>
        <Core.Txt bold sx={{flexShrink: 0, ml: 1, mr: 1, width: 26, textAlign: 'left'}}>
          v{version.version}
        </Core.Txt>
        <Core.Txt color="hint" truncate sx={{minWidth: 0}}>
          {version.message}
        </Core.Txt>
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
            <Core.Txt color="hint" sx={{ml: 1}}>
              {capitalize(dateFromNow(version.createdAt))}
            </Core.Txt>
          </Tooltip>
        </div>
      </Box>
    </VersionRowContainer>
  )
}
