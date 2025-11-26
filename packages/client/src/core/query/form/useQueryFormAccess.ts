import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Api} from '@infoportal/api-sdk'

export class UseQueryFormAccess {
  static getByFormId({workspaceId, formId}: {workspaceId: Api.WorkspaceId; formId: Api.FormId}) {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()
    return useQuery({
      queryKey: queryKeys.formAccess(workspaceId, formId),
      queryFn: async () => {
        return apiv2.form.access.search({workspaceId, formId}).catch(toastAndThrowHttpError)
      },
    })
  }

  static remove({workspaceId, formId}: {workspaceId: Api.WorkspaceId; formId: Api.FormId}) {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (args: {id: Api.AccessId}) => {
        return apiv2.form.access.remove({...args, formId, workspaceId})
      },
      onSuccess: (data, variables) =>
        queryClient.invalidateQueries({queryKey: queryKeys.formAccess(workspaceId, formId)}),
      onError: toastHttpError,
    })
  }

  static update({workspaceId, formId}: {workspaceId: Api.WorkspaceId; formId: Api.FormId}) {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (args: Omit<Api.Access.Payload.Update, 'workspaceId'>) => {
        return apiv2.form.access.update({...args, workspaceId})
      },
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.formAccess(workspaceId, formId)}),
      onError: toastHttpError,
    })
  }

  static create({workspaceId, formId}: {workspaceId: Api.WorkspaceId; formId: Api.FormId}) {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (args: Omit<Api.Access.Payload.Create, 'formId'>) => {
        return apiv2.form.access.create({...args, formId, workspaceId})
      },
      onSuccess: (data, variables) =>
        queryClient.invalidateQueries({queryKey: queryKeys.formAccess(workspaceId, formId)}),
      onError: toastHttpError,
    })
  }
}
