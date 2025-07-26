import {useLangIndex} from '@/core/store/useLangIndex'
import {duration} from '@axanc/ts-utils'
import {QueryClient, useQuery} from '@tanstack/react-query'
import {KoboSchemaHelper} from 'infoportal-common'
import {useAppSettings} from '../context/ConfigContext'
import {queryKeys} from './query.index'
import {Ip} from 'infoportal-api-sdk'

export const useQuerySchema = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
  const {apiv2} = useAppSettings()
  const langIndex = useLangIndex(state => state.langIndex)
  return useQuery({
    queryKey: queryKeys.schema(workspaceId, formId),
    queryFn: async () => {
      const schema = await apiv2.form.getSchema({workspaceId, formId})
      if (schema) {
        return KoboSchemaHelper.buildBundle({schema, langIndex})
      }
    },
    retry: false,
    staleTime: duration(10, 'minute'),
  })
}

export const getSchema = ({
  workspaceId,
  formId,
  queryClient,
}: {
  workspaceId: Ip.WorkspaceId
  queryClient: QueryClient
  formId: Ip.FormId
}): undefined | KoboSchemaHelper.Bundle => {
  return queryClient.getQueryData<KoboSchemaHelper.Bundle>(queryKeys.schema(workspaceId, formId))
}
