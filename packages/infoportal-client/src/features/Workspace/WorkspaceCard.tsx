import {Box, BoxProps, ButtonBase, ButtonBaseProps, Icon, useTheme} from '@mui/material'
import {AppAvatar, IpBtn, Modal, Txt} from '@/shared'
import {useI18n} from '@/core/i18n'
import {Panel, PanelBody} from '@/shared/Panel'
import {Link} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'
import {PanelProps} from '@/shared/Panel/Panel.js'
import {PanelFoot} from '@/shared/Panel/PanelFoot.js'
import {styleUtils} from '@/core/theme.js'
import {useQueryWorkspaceInvitation} from '@/core/query/useQueryWorkspaceInvitation.js'

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

export const WorkspaceCard = ({workspace}: {workspace: Ip.Workspace}) => {
  const {m, formatDate} = useI18n()
  const t = useTheme()

  return (
    <Link to="/$workspaceId" params={{workspaceId: workspace.id}}>
      <Panel
        sx={{
          mb: 0,
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

export const WorkspaceCardInvitation = ({
  invitation,
  sx,
  ...props
}: PanelProps & {
  invitation: Ip.Workspace.InvitationW_workspace
}) => {
  const t = useTheme()
  const {m, formatDateTime} = useI18n()
  const accept = useQueryWorkspaceInvitation.accept()
  return (
    <Panel
      loading={accept.isPending}
      {...props}
      sx={{
        border: '2px solid',
        borderColor: t.palette.primary.main,
        // ...styleUtils(t).color.backgroundActive,
        display: 'flex',
        flexDirection: 'column',
        mb: 0,
        minHeight: 200,
        ...sx,
      }}
    >
      <PanelBody sx={{flex: 1}}>
        <Box sx={{textAlign: 'center'}}>
          <AppAvatar size={40} email={invitation.createdBy} />
          {invitation.createdBy}
          <Txt block size="small" color="hint" sx={{my: 0.5}}>
            Invited you to join
          </Txt>
          {/*{formatDateTime(invitation.createdAt)}*/}
          <Txt block bold size="big">
            {invitation.workspace.name}
          </Txt>
        </Box>
      </PanelBody>
      <PanelFoot sx={{justifyContent: 'space-between'}}>
        <Modal
          disabled={accept.isPending}
          title={m.refuse + ' ?'}
          confirmLabel={m.refuse}
          onConfirm={(e, close) => accept.mutateAsync({id: invitation.id, accept: false}).then(close)}
        >
          <IpBtn color="error">{m.refuse}</IpBtn>
        </Modal>
        <IpBtn
          disabled={accept.isPending}
          onClick={() => accept.mutateAsync({id: invitation.id, accept: true})}
          color="success"
          endIcon={<Icon>login</Icon>}
        >
          {m.accept}
        </IpBtn>
      </PanelFoot>
    </Panel>
  )
}
