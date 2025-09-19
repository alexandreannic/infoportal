import {Ip} from 'infoportal-api-sdk'
import {useAppSettings} from '@/core/context/ConfigContext.js'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index.js'
import {useIpToast} from '@/core/useToast.js'
import {usePendingMutation} from '@/core/query/usePendingMutation.js'

export class UseQueryWorkspaceInvitation {
  static getMine() {
    const {apiv2} = useAppSettings()
    return useQuery({
      queryKey: queryKeys.workspaceInvitation('me'),
      queryFn: () => apiv2.workspace.invitation.getMine(),
    })
  }

  static search({workspaceId}: {workspaceId: Ip.WorkspaceId}) {
    const {apiv2} = useAppSettings()
    return useQuery({
      queryKey: queryKeys.workspaceInvitation(workspaceId),
      queryFn: () => apiv2.workspace.invitation.search({workspaceId}),
    })
  }

  static accept() {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({id, accept}: {id: Ip.Workspace.InvitationId; accept: boolean}) =>
        apiv2.workspace.invitation.accept({id, accept}),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: queryKeys.workspaceInvitation('me')})
        queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
      },
      onError: toastHttpError,
    })
  }

  static create(workspaceId: Ip.WorkspaceId) {
    const {apiv2} = useAppSettings()
    // const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (_: Omit<Ip.Workspace.Invitation.Payload.Create, 'workspaceId'>) => {
        return apiv2.workspace.invitation.create({..._, workspaceId})
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: queryKeys.user(workspaceId)})
        queryClient.invalidateQueries({queryKey: queryKeys.workspaceInvitation(workspaceId)})
      },
      // onError: toastHttpError,
    })
  }

  static remove({workspaceId}: {workspaceId: Ip.WorkspaceId}) {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    return usePendingMutation({
      getId: variables => variables.id,
      mutationFn: async ({id}: {id: Ip.Workspace.InvitationId}) => {
        return apiv2.workspace.invitation.remove({workspaceId, id})
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: queryKeys.workspaceInvitation(workspaceId)})
      },
    })
  }
}
