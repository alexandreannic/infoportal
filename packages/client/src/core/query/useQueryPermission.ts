import {HttpError, Api} from '@infoportal/api-sdk'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'

export class UseQueryPermission {
  static global() {
    const {apiv2} = useAppSettings()
    return useQuery({
      retry: (failureCount, error) => {
        if (error instanceof HttpError.Forbidden) return false
        return failureCount < 5
      },
      queryKey: queryKeys.permission.global(),
      queryFn: apiv2.permission.getMineGlobal,
    })
  }

  static workspace({workspaceId}: {workspaceId: Api.WorkspaceId}) {
    const {apiv2} = useAppSettings()
    return useQuery({
      queryKey: queryKeys.permission.byWorkspaceId(workspaceId),
      queryFn: () => apiv2.permission.getMineByWorkspace({workspaceId}),
    })
  }

  static form({workspaceId, formId}: {workspaceId: Api.WorkspaceId; formId: Api.FormId}) {
    const {apiv2} = useAppSettings()
    return useQuery({
      queryKey: queryKeys.permission.byFormId(workspaceId, formId),
      queryFn: () => apiv2.permission.getMineByForm({workspaceId, formId}),
    })
  }
}
