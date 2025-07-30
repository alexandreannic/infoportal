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
    queryKey: queryKeys.metrics(params.workspaceId, 'getSubmissionsByMonth'),
    queryFn: () => apiv2.metrics.getSubmissionsByMonth(params),
  })
  const getSubmissionsByForm = useQuery({
    queryKey: queryKeys.metrics(params.workspaceId, 'getSubmissionsByForm'),
    queryFn: () => apiv2.metrics.getSubmissionsByForm(params),
  })
  return {getSubmissionsByMonth, getSubmissionsByForm}
}
