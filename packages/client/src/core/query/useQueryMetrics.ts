import {Ip} from '@infoportal/api-sdk'
import {useAppSettings} from '@/core/context/ConfigContext.js'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index.js' //

export function useQueryMetrics(
  params: {workspaceId: Ip.WorkspaceId; formIds: Ip.FormId[]} & Ip.Metrics.Payload.Filter,
) {
  const {apiv2} = useAppSettings()

  const filtersForms = {formIds: params.formIds.sort(), start: params.start, end: params.end}
  const filters = {formIds: params.formIds.sort(), start: params.start, end: params.end}
  const getSubmissionsByMonth = useQuery({
    placeholderData: old => old,
    queryKey: queryKeys.metrics(params.workspaceId, 'submissionsBy', 'month', filtersForms),
    queryFn: () => apiv2.metrics.getSubmissionsBy({type: 'month', ...params}),
  })
  const getSubmissionsByForm = useQuery({
    placeholderData: old => old,
    queryKey: queryKeys.metrics(params.workspaceId, 'submissionsBy', 'form', filtersForms),
    queryFn: () => apiv2.metrics.getSubmissionsBy({type: 'form', ...params}),
  })
  const getSubmissionsByCategory = useQuery({
    placeholderData: old => old,
    queryKey: queryKeys.metrics(params.workspaceId, 'submissionsBy', 'category', filtersForms),
    queryFn: () => apiv2.metrics.getSubmissionsBy({type: 'category', ...params}),
  })
  const getSubmissionsByStatus = useQuery({
    placeholderData: old => old,
    queryKey: queryKeys.metrics(params.workspaceId, 'submissionsBy', 'status', filtersForms),
    queryFn: () => apiv2.metrics.getSubmissionsBy({type: 'status', ...params}),
  })
  const getSubmissionsByUser = useQuery({
    placeholderData: old => old,
    queryKey: queryKeys.metrics(params.workspaceId, 'submissionsBy', 'user', filtersForms),
    queryFn: () => apiv2.metrics.getSubmissionsBy({type: 'user', ...params}),
  })
  const getUsersByIsoCode = useQuery({
    placeholderData: old => old,
    queryKey: queryKeys.metrics(params.workspaceId, 'submissionsBy', 'isoCode', filters),
    queryFn: () => apiv2.metrics.getSubmissionsBy({type: 'location', ...params}),
  })
  const getUsersByDate = useQuery({
    placeholderData: old => old,
    queryKey: queryKeys.metrics(params.workspaceId, 'user', 'by-date', filters),
    queryFn: () => apiv2.metrics.getUsersByDate(params),
  })
  return {
    getUsersByDate,
    getUsersByIsoCode,
    getSubmissionsByMonth,
    getSubmissionsByForm,
    getSubmissionsByCategory,
    getSubmissionsByStatus,
    getSubmissionsByUser,
  }
}
