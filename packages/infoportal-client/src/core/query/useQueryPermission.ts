import {HttpError, Ip} from 'infoportal-api-sdk'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {duration} from '@axanc/ts-utils'

export const useQueryPermission = {
  global: useQueryPermissionGlobal,
  workspace: useQueryPermissionByWorkspace,
  form: useQueryPermissionByForm,
}

function useQueryPermissionGlobal() {
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

function useQueryPermissionByWorkspace({workspaceId}: {workspaceId: Ip.WorkspaceId}) {
  const {apiv2} = useAppSettings()
  return useQuery({
    queryKey: queryKeys.permission.byWorkspaceId(workspaceId),
    queryFn: () => apiv2.permission.getMineByWorkspace({workspaceId}),
    
  })
}

function useQueryPermissionByForm({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) {
  const {apiv2} = useAppSettings()
  return useQuery({
    queryKey: queryKeys.permission.byFormId(workspaceId, formId),
    queryFn: () => apiv2.permission.getMineByForm({workspaceId, formId}),
    
  })
}
