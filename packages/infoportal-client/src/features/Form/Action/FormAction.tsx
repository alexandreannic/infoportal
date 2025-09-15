import {createRoute, Link} from '@tanstack/react-router'
import {Core, Page} from '@/shared/index.js'
import {UseQueryFromAction} from '@/core/query/useQueryFromAction.js'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'
import {useQuerySchema} from '@/core/query/useQuerySchema.js'
import {KoboInterfaceBuilder} from 'infoportal-common'
import {map} from '@axanc/ts-utils'
import {FormActionEditor} from '@/features/Form/Action/FormActionEditor.js'
import {useI18n} from '@/core/i18n/index.js'
import {UseQueryForm} from '@/core/query/useQueryForm.js'
import {formActionsRoute} from '@/features/Form/Action/FormActions.js'
import {Box, Skeleton, useTheme} from '@mui/material'

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

export function FormAction() {
  const {m} = useI18n()
  const t = useTheme()
  const params = formActionRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const formId = params.formId as Ip.FormId
  const actionId = params.actionId as Ip.Form.ActionId
  const queryAction = UseQueryFromAction.getById(workspaceId, formId, actionId)
  const queryActionUpdate = UseQueryFromAction.update(workspaceId, formId)
  const interfaceInput = useBuildInterface({name: 'Input', workspaceId, formId: queryAction.data?.targetFormId})
  const interfaceOutput = useBuildInterface({name: 'Output', workspaceId, formId: queryAction.data?.formId})

  return (
    <Box sx={{height: 500, mb: 1}}>
      {queryAction.isLoading || interfaceInput.isLoading ? (
        <Skeleton sx={{height: '100%', transform: 'none', borderRadius: t.vars.shape.borderRadius}} />
      ) : (
        queryAction.data &&
        (interfaceInput.data && interfaceOutput.data ? (
          <FormActionEditor
            saving={queryActionUpdate.isPending}
            inputType={interfaceInput.data}
            outputType={interfaceOutput.data}
            body={queryAction.data.body ?? undefined}
            onSave={body => {
              queryActionUpdate.mutateAsync({id: queryAction.data!.id, body})
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
  )
}
