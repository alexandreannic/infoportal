import {Box, ButtonBase, ButtonBaseProps, Icon, useTheme} from '@mui/material'
import {AppAvatar, IpBtn, Modal, Txt} from '@/shared'
import {useI18n} from '@/core/i18n'
import {Panel, PanelBody} from '../../../../infoportal-client-core/src/Panel'
import {Link} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'
import {PanelProps} from '../../../../infoportal-client-core/src/Panel/Panel.js'
import {PanelFoot} from '../../../../infoportal-client-core/src/Panel/PanelFoot.js'
import {useQueryWorkspaceInvitation} from '@/core/query/useQueryWorkspaceInvitation.js'
import {appConfig} from '@/conf/AppConfig.js'

export const WorkspaceCardAdd = ({sx, ...props}: ButtonBaseProps) => {
  const t = useTheme()
  const {m} = useI18n()
  return (
    <ButtonBase
      {...props}
      sx={{
        borderRadius: t.vars.shape.borderRadius,
        minHeight: 200,
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'none',
        border: `1px dashed ${t.vars.palette.divider}`,
        // transition: t.transitions.create(''),
        // '&:hover': {
        //   boxShadow: t.vars.shadows[2],
        // },
        ...sx,
      }}
    >
      <Icon sx={{mb: 1, fontSize: 60, color: t.vars.palette.text.secondary}}>{appConfig.icons.workspace}</Icon>
      <Box display="flex" alignItems="center" mt={1}>
        <Icon fontSize="medium">add</Icon>
        <Txt bold size="big">{m.createWorkspace}</Txt>
      </Box>
    </ButtonBase>
  )
}

export const WorkspaceCard = ({workspace}: {workspace: Ip.Workspace}) => {
  const {m, formatDate} = useI18n()
  const t = useTheme()

  return (
    <Link to="/$workspaceId/dashboard" params={{workspaceId: workspace.id}}>
      <Panel
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
        <Txt size="title" bold block>
          {workspace.name}
        </Txt>
        <Txt color="hint" block>
          {workspace.slug}
        </Txt>
        <Txt truncate block>
          {workspace.sector}
        </Txt>
        <Txt color="hint" textAlign="right" block sx={{mt: 'auto'}}>
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
        borderColor: t.vars.palette.primary.main,
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
