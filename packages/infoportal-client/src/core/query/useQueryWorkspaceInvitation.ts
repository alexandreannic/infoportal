import {Ip} from 'infoportal-api-sdk'
import {useAppSettings} from '@/core/context/ConfigContext.js'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index.js'

export const useQueryWorkspaceInvitation = {
  search,
}

function search({workspaceId}: {workspaceId: Ip.WorkspaceId}) {
  const {apiv2} = useAppSettings()
  return useQuery({
    queryKey: queryKeys.workspaceInvitation(workspaceId),
    queryFn: () => apiv2.workspace.invitation.search({workspaceId}),
  })
}
