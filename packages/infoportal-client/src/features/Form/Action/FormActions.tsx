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
        gridTemplateColumns: '310px 1fr',
        gridTemplateRows: actionId ? '5fr minmax(220px, 2fr)' : '0fr 1fr',
        transition: 'grid-template-rows 0.4s ease',
        flex: '1 1 auto',
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          gridColumn: 1,
          gridRow: '1 / 3',
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
      </Box>
      <Box
        sx={{
          minWidth: 0,
          minHeight: 0,
          gridColumn: 2,
          gridRow: 1,
        }}
      >
        <Outlet />
      </Box>
      <Core.Panel
        sx={{
          gridRow: 2,
          gridColumn: 2,
          overflowY: 'scroll',
        }}
      >
        <FormActionLog workspaceId={workspaceId} formId={formId} actionId={actionId} />
      </Core.Panel>
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
      style={{
        display: 'block',
        marginBottom: t.vars.spacing,
      }}
      to="/$workspaceId/form/$formId/action/$actionId"
      params={{workspaceId, formId: action.formId, actionId: action.id}}
    >
      {({isActive}) => (
        <Core.Panel
          sx={{
            '&:hover': {
              boxShadow: t.vars.shadows[1],
            },
            border: '2px solid transparent',
            ...(isActive && {
              borderColor: t.palette.primary.main,
              color: t.palette.primary.main,
              background: Core.alphaVar(t.vars.palette.primary.main, 0.18),
            }),
            transition: t.transitions.create('all'),
            // background: t.vars.palette.AppBar.defaultBg,
            p: 1,
            borderRadius: t.vars.shape.borderRadius,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{flex: 1}}>
            <Box>
              <Core.Txt bold truncate>
                {action.name}
              </Core.Txt>
              <Core.Txt color="hint" sx={{ml: 2}}>
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
        </Core.Panel>
      )}
    </Link>
  )
}
