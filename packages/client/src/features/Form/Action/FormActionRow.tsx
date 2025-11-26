import {Api} from '@infoportal/api-sdk'
import {Box, CircularProgress, Icon, Switch, Tooltip, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import {UseQueryFromAction} from '@/core/query/form/useQueryFromAction.js'
import {UseQueryForm} from '@/core/query/form/useQueryForm.js'
import {Link} from '@tanstack/react-router'
import {Core} from '@/shared'
import {ReactNode} from 'react'
import {styleUtils} from '@infoportal/client-core'
import {UseQueryPermission} from '@/core/query/useQueryPermission.js'

export function FormActionRow({action, workspaceId}: {workspaceId: Api.WorkspaceId; action: Api.Form.Action}) {
  const t = useTheme()
  const {m, formatDate} = useI18n()
  const queryActionUpdate = UseQueryFromAction.update(workspaceId, action.formId)
  const queryForms = UseQueryForm.getAsMap(workspaceId)
  const isUpdating = queryActionUpdate.pendingIds.has(action.id)
  const queryPermission = UseQueryPermission.form({workspaceId, formId: action.formId})

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
              pl: 1,
              pr: 0.5,
              color: t.palette.primary.main,
              background: Core.alphaVar(t.vars.palette.primary.main, 0.18),
              // border: 'none',
            }),
            position: 'relative',
            borderRadius: t.vars.shape.borderRadius,
            transition: t.transitions.create('all'),
            py: 0.5,
            my: 0.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{flex: 1, ...styleUtils(t).truncate}}>
            <Box>
              <Core.Txt bold truncate>
                {action.name}
              </Core.Txt>
              <Core.Txt color="disabled" sx={{ml: 2}}>
                {formatDate(action.createdAt)}
              </Core.Txt>
            </Box>
            <Tooltip title={queryForms?.get(action.targetFormId)?.name}>
              <Core.Txt truncate>{queryForms?.get(action.targetFormId)?.name ?? <Core.Txt italic color="disabled">{m._formAction.noAccessToForm}</Core.Txt>}</Core.Txt>
            </Tooltip>
          </Box>
          {isUpdating && <CircularProgress size={24} />}
          <CompilationTooltip
            bodyWarnings={action.bodyWarnings ?? undefined}
            bodyErrors={action.bodyErrors ?? undefined}
          >
            <Switch
              size="small"
              color={(action.bodyErrors ?? 0) > 0 ? 'error' : (action.bodyWarnings ?? 0) > 0 ? 'warning' : undefined}
              disabled={!queryPermission.data || !queryPermission.data.action_canUpdate || isUpdating || !action.body}
              sx={{justifySelf: 'flex-end'}}
              checked={!action.disabled}
              onClick={e => {
                e.stopPropagation()
                e.preventDefault()
                queryActionUpdate.mutateAsync({id: action.id, disabled: !action.disabled})
              }}
            />
          </CompilationTooltip>
        </Box>
      )}
    </Link>
  )
}

function CompilationTooltip({
  children,
  bodyErrors = 0,
  bodyWarnings = 0,
}: {
  children: ReactNode
  bodyErrors?: number
  bodyWarnings?: number
}) {
  const {m} = useI18n()
  if (bodyErrors === 0 && bodyWarnings === 0) return children
  return (
    <Tooltip
      placement="right"
      title={
        <>
          {bodyErrors > 0 && (
            <Box display="flex" alignItems="center">
              <Icon fontSize="small" color="error" children="error" sx={{mr: 0.5}} /> {m.error}:&nbsp;
              <b>{bodyErrors}</b>
            </Box>
          )}
          {bodyErrors > 0 && (
            <Box display="flex" alignItems="center" sx={{mb: 1}}>
              <Icon fontSize="small" color="warning" children="warning" sx={{mr: 0.5}} /> {m.warning}:&nbsp;
              <b>{bodyWarnings}</b>
            </Box>
          )}
          {bodyErrors > 0 && m._formAction.actionWithErrorWontRun}
        </>
      }
    >
      <span>{children}</span>
    </Tooltip>
  )
}
