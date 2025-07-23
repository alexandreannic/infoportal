import {Ip} from 'infoportal-api-sdk'
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
    queryKey: queryKeys.permission.global(),
    queryFn: apiv2.permission.getMineGlobal,
    staleTime: duration(10, 'minute'),
  })
}

function useQueryPermissionByWorkspace({workspaceId}: {workspaceId: Ip.Uuid}) {
  const {apiv2} = useAppSettings()
  return useQuery({
    queryKey: queryKeys.permission.byWorkspaceId(workspaceId),
    queryFn: () => apiv2.permission.getMineByWorkspace({workspaceId}),
    staleTime: duration(10, 'minute'),
  })
}

function useQueryPermissionByForm({workspaceId, formId}: {workspaceId: Ip.Uuid; formId: Ip.FormId}) {
  const {apiv2} = useAppSettings()
  return useQuery({
    queryKey: queryKeys.permission.byFormId(workspaceId, formId),
    queryFn: () => apiv2.permission.getMineByForm({workspaceId, formId}),
    staleTime: duration(10, 'minute'),
  })
}
