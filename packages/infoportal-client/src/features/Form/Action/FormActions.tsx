import {createRoute, Link} from '@tanstack/react-router'
import {Core, Page} from '@/shared/index.js'
import {Box, CircularProgress, Grid, Switch, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n/index.js'
import {UseQueryFromAction} from '@/core/query/useQueryFromAction.js'
import {Ip} from 'infoportal-api-sdk'
import {FormActionCreate} from '@/features/Form/Action/FormActionCreate.js'
import {formRoute} from '@/features/Form/Form.js'
import {FormActionLog} from '@/features/Form/Action/FormActionLog.js'
import {UseQueryForm} from '@/core/query/useQueryForm.js'

export const formActionsRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'action',
  component: FormActions,
})

export function FormActions() {
  const {m} = useI18n()
  const params = formActionsRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const formId = params.formId as Ip.FormId
  const queryActionCreate = UseQueryFromAction.create(workspaceId, formId)
  const queryActionGet = UseQueryFromAction.getByDbId(workspaceId, formId)

  return (
    <Page width="full">
      <Grid container>
        <Grid size={{xs: 12, md: 4}}>
          <Core.PanelWBody>
            <Core.Modal
              overrideActions={null}
              content={onClose => <FormActionCreate onClose={onClose} />}
              onConfirm={console.log}
            >
              <Core.Btn size="large" variant="outlined" fullWidth sx={{textAlign: 'center', mb: 1}}>
                {m._formAction.newAction}
              </Core.Btn>
            </Core.Modal>
            {queryActionGet.data?.map(_ => (
              <ActionRow workspaceId={workspaceId} action={_} key={_.id} />
            ))}
          </Core.PanelWBody>
        </Grid>
        <Grid size={{xs: 12, md: 8}}>
          <Core.Panel>
            <FormActionLog workspaceId={workspaceId} formId={formId} />
          </Core.Panel>
        </Grid>
      </Grid>
    </Page>
  )
}

function ActionRow({action, workspaceId}: {workspaceId: Ip.WorkspaceId; action: Ip.Form.Action}) {
  const t = useTheme()
  const {m, formatDate} = useI18n()
  const queryActionUpdate = UseQueryFromAction.update(workspaceId, action.formId)
  const queryForms = UseQueryForm.getAsMap(workspaceId)
  const isUpdating = queryActionUpdate.pendingIds.has(action.id)
  return (
    <Link
      style={{
        display: 'block',
        marginBottom: t.vars.spacing,
      }}
      to="/$workspaceId/form/$formId/action/$actionId"
      params={{workspaceId, formId: action.formId, actionId: action.id}}
    >
      <Box
        sx={{
          '&:hover': {
            boxShadow: t.vars.shadows[1],
          },
          transition: t.transitions.create('all'),
          background: t.vars.palette.AppBar.defaultBg,
          p: 1,
          borderRadius: t.vars.shape.borderRadius,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{flex: 1}}>
          <Box>
            <Core.Txt bold>{action.name}</Core.Txt>
            <Core.Txt color="hint" sx={{ml: 2}}>
              {formatDate(action.createdAt)}
            </Core.Txt>
          </Box>
          {queryForms?.get(action.targetFormId)?.name}
        </Box>
        {isUpdating && <CircularProgress size={24} />}
        <Switch
          size="small"
          disabled={isUpdating}
          sx={{justifySelf: 'flex-end'}}
          checked={!action.disabled}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
            queryActionUpdate.mutateAsync({id: action.id, disabled: !action.disabled})
          }}
        />
        <Core.IconBtn sx={{justifySelf: 'flex-end', mr: -1}}>chevron_right</Core.IconBtn>
      </Box>
    </Link>
  )
}
