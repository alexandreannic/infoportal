import {createRoute, Link} from '@tanstack/react-router'
import {Core} from '@/shared/index.js'
import {UseQueryFromAction} from '@/core/query/useQueryFromAction.js'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'
import {useQuerySchema} from '@/core/query/useQuerySchema.js'
import {KoboInterfaceBuilder} from 'infoportal-common'
import {map} from '@axanc/ts-utils'
import {FormActionEditor} from '@/features/Form/Action/FormActionEditor.js'
import {useI18n} from '@infoportal/client-i18n'
import {UseQueryForm} from '@/core/query/useQueryForm.js'
import {formActionsRoute} from '@/features/Form/Action/FormActions.js'
import {Box, BoxProps, Skeleton, useTheme} from '@mui/material'
import {FormActionLogs} from '@/features/Form/Action/FormActionLogs.js'
import {UseQueryPermission} from '@/core/query/useQueryPermission.js'

export const formActionRoute = createRoute({
  getParentRoute: () => formActionsRoute,
  path: '$actionId',
  component: FormAction,
})

const useBuildInterface = ({
  name,
  workspaceId,
  formId,
}: {
  name: string
  workspaceId: Ip.WorkspaceId
  formId?: Ip.FormId
}) => {
  const querySchema = useQuerySchema({workspaceId, formId})
  const queryForm = UseQueryForm.get({workspaceId, formId})
  const data = useMemo(() => {
    if (!querySchema.data || !queryForm.data) return
    return map(
      querySchema.data,
      bundle =>
        `// ${queryForm.data!.name}\n` +
        new KoboInterfaceBuilder(name, bundle.schema, undefined, undefined, bundle).build(),
    )
  }, [querySchema.data])
  return {
    ...querySchema,
    data,
  }
}

export function FormAction({sx, ...props}: BoxProps) {
  const {m} = useI18n()
  const t = useTheme()
  const params = formActionRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const formId = params.formId as Ip.FormId
  const actionId = params.actionId as Ip.Form.ActionId
  const queryAction = UseQueryFromAction.getById(workspaceId, formId, actionId)
  const queryActionUpdate = UseQueryFromAction.update(workspaceId, formId)
  const queryPermissionForm = UseQueryPermission.form({formId, workspaceId})
  const interfaceInput = useBuildInterface({name: 'Input', workspaceId, formId: queryAction.data?.targetFormId})
  const interfaceOutput = useBuildInterface({name: 'Output', workspaceId, formId: queryAction.data?.formId})

  return (
    <Core.Animate>
      <Box sx={{display: 'grid', gridTemplateRows: '2.5fr minmax(200px, 1fr)', height: '100%', ...sx}} {...props}>
        <Box sx={{mb: 1, gridRow: '1 / 2', minHeight: 0}}>
          {queryAction.isLoading || interfaceInput.isLoading ? (
            <Skeleton sx={{height: '100%', transform: 'none', borderRadius: t.vars.shape.borderRadius}} />
          ) : (
            queryAction.data &&
            (interfaceInput.data && interfaceOutput.data ? (
              <FormActionEditor
                key={actionId}
                isReadOnly={!queryPermissionForm.data || !queryPermissionForm.data.action_canUpdate}
                actionId={actionId}
                saving={queryActionUpdate.isPending}
                inputType={interfaceInput.data}
                outputType={interfaceOutput.data}
                body={queryAction.data.body ?? undefined}
                onSave={body => {
                  queryActionUpdate.mutateAsync({id: queryAction.data!.id, ...body})
                }}
              />
            ) : (
              <Core.Alert
                severity="warning"
                action={
                  <Link
                    to="/$workspaceId/form/$formId/formCreator"
                    params={{workspaceId, formId: queryAction.data!.targetFormId}}
                  >
                    <Core.Btn color="inherit">{m.createShema}</Core.Btn>
                  </Link>
                }
              >
                {m._formAction.thisActionTargetAFormWithoutSchema}
              </Core.Alert>
            ))
          )}
        </Box>
        <FormActionLogs sx={{gridRow: '2 / 3'}} workspaceId={workspaceId} formId={formId} actionId={actionId} />
      </Box>
    </Core.Animate>
  )
}
