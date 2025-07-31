import {Ip} from 'infoportal-api-sdk'
import {useAppSettings} from '@/core/context/ConfigContext.js'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index.js'
//
// export const useQueryMetrics = {
//   getSubmissionsByMonth,
// }

export function useQueryMetrics(params: {workspaceId: Ip.WorkspaceId} & Ip.Metrics.Payload.Filter) {
  const {apiv2} = useAppSettings()

  const getSubmissionsByMonth = useQuery({
    queryKey: queryKeys.metrics(params.workspaceId, 'submissionsBy', 'month'),
    queryFn: () => apiv2.metrics.getSubmissionsBy({type: 'month', ...params}),
  })
  const getSubmissionsByForm = useQuery({
    queryKey: queryKeys.metrics(params.workspaceId, 'submissionsBy', 'form'),
    queryFn: () => apiv2.metrics.getSubmissionsBy({type: 'form', ...params}),
  })
  const getSubmissionsByCategory = useQuery({
    queryKey: queryKeys.metrics(params.workspaceId, 'submissionsBy', 'category'),
    queryFn: () => apiv2.metrics.getSubmissionsBy({type: 'category', ...params}),
  })
  const getSubmissionsByStatus = useQuery({
    queryKey: queryKeys.metrics(params.workspaceId, 'submissionsBy', 'status'),
    queryFn: () => apiv2.metrics.getSubmissionsBy({type: 'status', ...params}),
  })
  const getSubmissionsByUser = useQuery({
    queryKey: queryKeys.metrics(params.workspaceId, 'submissionsBy', 'user'),
    queryFn: () => apiv2.metrics.getSubmissionsBy({type: 'user', ...params}),
  })
  return {
    getSubmissionsByMonth,
    getSubmissionsByForm,
    getSubmissionsByCategory,
    getSubmissionsByStatus,
    getSubmissionsByUser,
  }
}
