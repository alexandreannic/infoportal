import {createRoute} from '@tanstack/react-router'
import {smartDbRoute} from '@/features/SmartDb/SmartDb.js'
import {Page} from '@/shared/index.js'
import {UseQuerySmartDbAction} from '@/core/query/useQuerySmartDbAction.js'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'
import {useQuerySchema} from '@/core/query/useQuerySchema.js'
import {KoboInterfaceBuilder} from 'infoportal-common'
import {map} from '@axanc/ts-utils'
import {SmartDbActionEditor} from '@/features/SmartDb/SmartDbActionEditor.js'

export const smartDbActionRoute = createRoute({
  getParentRoute: () => smartDbRoute,
  path: 'action/$actionId',
  component: SmartDbAction,
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

export function SmartDbAction() {
  const params = smartDbActionRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const smartDbId = params.smartDbId as Ip.SmartDbId
  const actionId = params.actionId as Ip.SmartDb.ActionId
  const queryAction = UseQuerySmartDbAction.getById(workspaceId, smartDbId, actionId)
  const interfaceInput = useGetInterfaceInput({workspaceId, formId: queryAction.data?.formId})

  return (
    <Page loading={queryAction.isLoading || interfaceInput.isLoading}>
      {queryAction.data && interfaceInput.data && (
        <SmartDbActionEditor
          inputType={interfaceInput.data}
          outputType={interfaceInput.data}
          body={queryAction.data.body ?? undefined}
          onBodyChange={console.log}
        />
      )}
    </Page>
  )
}
