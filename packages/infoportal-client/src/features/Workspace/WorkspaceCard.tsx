import {Workspace} from '@/core/sdk/server/workspace/Workspace'
import {Box, BoxProps, ButtonBase, ButtonBaseProps, Icon, useTheme} from '@mui/material'
import {Txt} from '@/shared'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {Link} from 'react-router-dom'
import {router} from '@/Router'

export const WorkspaceCardAdd = ({sx, ...props}: ButtonBaseProps) => {
  const t = useTheme()
  const {m} = useI18n()
  return (
    <ButtonBase
      {...props}
      sx={{
        borderRadius: t.shape.borderRadius + 'px',
        minHeight: 200,
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'none',
        border: `1px dashed ${t.palette.divider}`,
        // transition: t.transitions.create(''),
        // '&:hover': {
        //   boxShadow: t.shadows[2],
        // },
        ...sx,
      }}
    >
      <Icon sx={{mb: 1, fontSize: 60, color: t.palette.text.secondary}}>add</Icon>
      <Box>{m.createWorkspace}</Box>
    </ButtonBase>
  )
}

export const WorkspaceCard = ({workspace}: {workspace: Workspace}) => {
  const {m, formatDate} = useI18n()
  const t = useTheme()

  return (
    <Link to={router.ws(workspace.slug).root}>
      <Panel
        sx={{
          minHeight: 200,
          p: 2,
          transition: t.transitions.create(''),
          '&:hover': {
            boxShadow: t.shadows[2],
          },
        }}
      >
        <Txt size="title" bold block>
          {workspace.name}
        </Txt>
        <Txt size="big" color="hint" block>
          {workspace.slug}
        </Txt>
        <Txt color="hint" block sx={{mt: 1}}>
          {formatDate(workspace.createdAt)}
        </Txt>
      </Panel>
    </Link>
  )
}
