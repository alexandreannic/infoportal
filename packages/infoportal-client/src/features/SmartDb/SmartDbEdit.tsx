import {createRoute, Link} from '@tanstack/react-router'
import {smartDbRoute} from '@/features/SmartDb/SmartDb.js'
import {Core, Page} from '@/shared/index.js'
import {Box, Grid, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n/index.js'
import {UseQuerySmartDbAction} from '@/core/query/useQuerySmartDbAction.js'
import {Ip} from 'infoportal-api-sdk'
import {SmartDbEditCreateForm} from '@/features/SmartDb/SmartDbEditCreateForm.js'

export const smartDbEditRoute = createRoute({
  getParentRoute: () => smartDbRoute,
  path: 'edit',
  component: SmartDbEdit,
})

export function SmartDbEdit() {
  const {m} = useI18n()
  const params = smartDbEditRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const smartDbId = params.smartDbId as Ip.SmartDbId
  const queryFunctionCreate = UseQuerySmartDbAction.create(workspaceId, smartDbId)
  const queryFunctionGet = UseQuerySmartDbAction.getByDbId(workspaceId, smartDbId)

  return (
    <Page width="full">
      <Grid container>
        <Grid size={{xs: 12, md: 6}}>
          <Core.PanelWBody>
            <Core.Modal
              overrideActions={null}
              content={onClose => <SmartDbEditCreateForm onClose={onClose} />}
              onConfirm={console.log}
            >
              <Core.Btn size="large" variant="outlined" fullWidth sx={{textAlign: 'center', mb: 1}}>
                {m._smartDb.newFunction}
              </Core.Btn>
            </Core.Modal>
            {queryFunctionGet.data?.map(_ => (
              <ActionRow workspaceId={workspaceId} action={_} key={_.id} />
            ))}
          </Core.PanelWBody>
        </Grid>
        <Grid size={{xs: 12, md: 6}}>
          <Core.PanelWBody>OK</Core.PanelWBody>
        </Grid>
      </Grid>
    </Page>
  )
}

function ActionRow({action, workspaceId}: {workspaceId: Ip.WorkspaceId; action: Ip.SmartDb.Action}) {
  const t = useTheme()
  const {m, formatDate} = useI18n()
  return (
    <Link
      to="/$workspaceId/form/smart-db/$smartDbId/action/$actionId"
      params={{workspaceId, smartDbId: action.smartDbId, actionId: action.id}}
    >
      <Box
        sx={{
          '&:not(:last-of-type)': {mb: 1},
          background: t.vars.palette.AppBar.defaultBg,
          p: 1,
          borderRadius: t.vars.shape.borderRadius,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{flex: 1}}>
          <Core.Txt bold>{action.name}</Core.Txt>
          <Core.Txt color="hint">{formatDate(action.createdAt)}</Core.Txt>
        </Box>
        <Core.IconBtn>chevron_right</Core.IconBtn>
      </Box>
    </Link>
  )
}
