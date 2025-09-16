import {createRoute, Link, Outlet, useMatch} from '@tanstack/react-router'
import {Core} from '@/shared/index.js'
import {Box, CircularProgress, Skeleton, Switch, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n/index.js'
import {UseQueryFromAction} from '@/core/query/useQueryFromAction.js'
import {Ip} from 'infoportal-api-sdk'
import {FormActionCreate} from '@/features/Form/Action/FormActionCreate.js'
import {formRoute} from '@/features/Form/Form.js'
import {FormActionLog} from '@/features/Form/Action/FormActionLog.js'
import {UseQueryForm} from '@/core/query/useQueryForm.js'
import {TabContent} from '@/shared/Tab/TabContent.js'
import {formActionRoute} from '@/features/Form/Action/FormAction.js'
import {mapFor} from '@axanc/ts-utils'
import {Panel} from '@infoportal/client-core'

export const formActionsRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'action',
  component: FormActions,
})

export function FormActions() {
  const {m} = useI18n()
  const t = useTheme()
  const params = formActionsRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const formId = params.formId as Ip.FormId
  const queryActionGet = UseQueryFromAction.getByDbId(workspaceId, formId)
  const actionId = useMatch({from: formActionRoute.id, shouldThrow: false})?.params.actionId as Ip.Form.ActionId
  return (
    <TabContent
      width="full"
      sx={{
        gap: t.vars.spacing,
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gridTemplateRows: actionId ? '64px 5fr minmax(220px, 2fr)' : '64px 0fr 1fr',
        flex: '1 1 auto',
        minHeight: 0,
      }}
    >
      <Panel sx={{mb: 0, px: 1, display: 'flex', alignItems: 'center', gridRow: 1, gridColumn: '1 / 3'}}>
        <Core.Btn>Test</Core.Btn>
      </Panel>
      <Core.Panel
        sx={{
          p: 1,
          gridColumn: 1,
          gridRow: '2 / 4',
          overflowY: 'scroll',
        }}
      >
        <Core.Modal
          overrideActions={null}
          content={onClose => <FormActionCreate onClose={onClose} />}
          onConfirm={console.log}
        >
          <Core.Btn icon="add" size="large" variant="outlined" fullWidth sx={{textAlign: 'center', mb: 1}}>
            {m._formAction.newAction}
          </Core.Btn>
        </Core.Modal>
        {queryActionGet.isLoading && mapFor(3, i => <Skeleton key={i} height={50} sx={{transform: 'none', mb: 1}} />)}
        {queryActionGet.data?.map(_ => (
          <ActionRow workspaceId={workspaceId} action={_} key={_.id} />
        ))}
      </Core.Panel>
      <Box
        sx={{
          minWidth: 0,
          minHeight: 0,
          gridColumn: 2,
          gridRow: '2 / 3',
        }}
      >
        <Outlet />
      </Box>
      <Box
        sx={{
          gridRow: '3 / 4',
          gridColumn: 2,
          overflowY: 'scroll',
          mt: actionId ? 0 : -1,
        }}
      >
        <Core.Panel>
          <FormActionLog workspaceId={workspaceId} formId={formId} actionId={actionId} />
        </Core.Panel>
      </Box>
    </TabContent>
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
      to="/$workspaceId/form/$formId/action/$actionId"
      params={{workspaceId, formId: action.formId, actionId: action.id}}
    >
      {({isActive}) => (
        <Box
          sx={{
            '&:hover': {
              // background: Core.alphaVar(t.vars.palette.primary.main, 0.08),
              // mx: -0.5,
              // px: 1,
            },
            ...(isActive && {
              // mt: 1,
              // mb: 1,
              mx: -0.5,
              px: 1,
              color: t.palette.primary.main,
              background: Core.alphaVar(t.vars.palette.primary.main, 0.18),
              // border: 'none',
            }),
            borderRadius: t.vars.shape.borderRadius,
            transition: t.transitions.create('all'),
            py: 0.5,
            my: 0.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{flex: 1}}>
            <Box>
              <Core.Txt bold truncate>
                {action.name}
              </Core.Txt>
              <Core.Txt color="disabled" sx={{ml: 2}}>
                {formatDate(action.createdAt)}
              </Core.Txt>
            </Box>
            <Core.Txt truncate>{queryForms?.get(action.targetFormId)?.name}</Core.Txt>
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
      )}
    </Link>
  )
}
