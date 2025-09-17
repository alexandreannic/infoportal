import {useAppSettings} from '@/core/context/ConfigContext.js'
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {queryKeys} from '@/core/query/query.index.js'
import {duration} from '@axanc/ts-utils'

export class UseQueryFormActionReport {
  static getLive({formId, workspaceId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) {
    const queryClient = useQueryClient()
    const {apiv2} = useAppSettings()
    const queryKey = queryKeys.formActionReport(workspaceId, formId, 'live')
    return useQuery({
      queryKey,
      queryFn: async () =>
        apiv2.form.action.report.getLive({workspaceId, formId}).catch(e => {
          if (e instanceof HttpError.NotFound) queryClient.removeQueries({queryKey})
          throw e
        }),
      staleTime: 0,
      retry: Infinity,
      retryDelay: 1000,
      refetchInterval: 1000,
    })
  }

  static getByFormId({formId, workspaceId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) {
    const {apiv2} = useAppSettings()
    const queryKey = queryKeys.formActionReport(workspaceId, formId)
    return useQuery({
      queryKey,
      queryFn: async () => apiv2.form.action.report.getByFormId({workspaceId, formId}),
    })
  }
}
