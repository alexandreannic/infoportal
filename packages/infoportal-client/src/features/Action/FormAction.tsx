import {createRoute} from '@tanstack/react-router'
import {Page} from '@/shared/index.js'
import {UseQuerySmartDbAction} from '@/core/query/useQuerySmartDbAction.js'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'
import {useQuerySchema} from '@/core/query/useQuerySchema.js'
import {KoboInterfaceBuilder} from 'infoportal-common'
import {map} from '@axanc/ts-utils'
import {FormActionEditor} from '@/features/Action/FormActionEditor.js'
import {formRoute} from '@/features/Form/Form.js'

export const formActionRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'action/$actionId',
  component: FormAction,
})

const useGetInterfaceInput = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId?: Ip.FormId}) => {
  const querySchema = useQuerySchema({workspaceId, formId})
  const data = useMemo(() => {
    if (!querySchema.data) return
    return map(querySchema.data, bundle =>
      new KoboInterfaceBuilder('Input', bundle.schema, undefined, undefined, bundle).build(),
    )
  }, [querySchema.data])
  return {
    ...querySchema,
    data,
  }
}

export function FormAction() {
  const params = formActionRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const formId = params.formId as Ip.FormId
  const actionId = params.actionId as Ip.Form.ActionId
  const queryAction = UseQuerySmartDbAction.getById(workspaceId, formId, actionId)
  const interfaceInput = useGetInterfaceInput({workspaceId, formId: queryAction.data?.targetForm})

  return (
    <Page loading={queryAction.isLoading || interfaceInput.isLoading}>
      {queryAction.data && interfaceInput.data && (
        <FormActionEditor
          inputType={interfaceInput.data}
          outputType={interfaceInput.data}
          body={queryAction.data.body ?? undefined}
          onBodyChange={console.log}
        />
      )}
    </Page>
  )
}
