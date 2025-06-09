import {Workspace} from '@/core/sdk/server/workspace/Workspace'
import {Card, useTheme} from '@mui/material'
import {Txt} from '@/shared'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {Link} from 'react-router-dom'
import {router} from '@/Router'

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
