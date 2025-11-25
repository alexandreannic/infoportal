import {Box, ButtonBase, ButtonBaseProps, Icon, useTheme} from '@mui/material'
import {AppAvatar, Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {Link} from '@tanstack/react-router'
import {Ip} from '@infoportal/api-sdk'
import {UseQueryWorkspaceInvitation} from '@/core/query/workspace/useQueryWorkspaceInvitation.js'
import {appConfig} from '@/conf/AppConfig.js'
import {AccessLevelRow} from '@/core/layout/AppHeaderMenu.js'
import {CardAdd} from '@/shared/CardAdd'

export const WorkspaceCard = ({workspace}: {workspace: Ip.Workspace}) => {
  const {m, formatDate} = useI18n()
  const t = useTheme()

  return (
    <Link to="/$workspaceId/overview" params={{workspaceId: workspace.id}}>
      <Core.Panel
        sx={{
          mb: 0,
          minHeight: 200,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          transition: t.transitions.create(''),
          '&:hover': {
            boxShadow: t.vars.shadows[2],
          },
        }}
      >
        <Core.Txt size="title" bold block>
          {workspace.name}
        </Core.Txt>
        <Core.Txt color="hint" sx={{fontFamily: 'monospace'}} block>
          {workspace.slug}
        </Core.Txt>
        <Core.Txt truncate block>
          {workspace.sector}
        </Core.Txt>
        <AccessLevelRow accessLevel={workspace.level!} sx={{mt: 2}} />
        <Core.Txt color="hint" textAlign="right" block sx={{mt: 'auto'}}>
          {formatDate(workspace.createdAt)}
        </Core.Txt>
      </Core.Panel>
    </Link>
  )
}

export const WorkspaceCardInvitation = ({
  invitation,
  sx,
  ...props
}: Core.PanelProps & {
  invitation: Ip.Workspace.InvitationW_workspace
}) => {
  const t = useTheme()
  const {m, formatDateTime} = useI18n()
  const accept = UseQueryWorkspaceInvitation.accept()
  return (
    <Core.Panel
      loading={accept.isPending}
      {...props}
      sx={{
        border: '2px solid',
        borderColor: t.vars.palette.primary.main,
        // ...styleUtils(t).color.backgroundActive,
        display: 'flex',
        flexDirection: 'column',
        mb: 0,
        minHeight: 200,
        ...sx,
      }}
    >
      <Core.PanelBody sx={{flex: 1}}>
        <Box sx={{textAlign: 'center'}}>
          <AppAvatar size={40} email={invitation.createdBy} />
          {invitation.createdBy}
          <Core.Txt block size="small" color="hint" sx={{my: 0.5}}>
            Invited you to join
          </Core.Txt>
          {/*{formatDateTime(invitation.createdAt)}*/}
          <Core.Txt block bold size="big">
            {invitation.workspace.name}
          </Core.Txt>
        </Box>
      </Core.PanelBody>
      <Core.PanelFoot sx={{justifyContent: 'space-between'}}>
        <Core.Modal
          disabled={accept.isPending}
          title={m.refuse + ' ?'}
          confirmLabel={m.refuse}
          onConfirm={(e, close) => accept.mutateAsync({id: invitation.id, accept: false}).then(close)}
        >
          <Core.Btn color="error">{m.refuse}</Core.Btn>
        </Core.Modal>
        <Core.Btn
          disabled={accept.isPending}
          onClick={() => accept.mutateAsync({id: invitation.id, accept: true})}
          color="success"
          endIcon={<Icon>login</Icon>}
        >
          {m.accept}
        </Core.Btn>
      </Core.PanelFoot>
    </Core.Panel>
  )
}
