import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Ip} from 'infoportal-api-sdk'

export const useQueryFormAccess = {
  getByFormId,
  remove,
  update,
  create,
}

function getByFormId({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) {
  const {apiv2} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()
  return useQuery({
    queryKey: queryKeys.formAccess(workspaceId, formId),
    queryFn: async () => {
      return apiv2.form.access.search({workspaceId, formId}).catch(toastAndThrowHttpError)
    },
  })
}

function remove({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) {
  const {apiv2} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: {id: Ip.Form.AccessId}) => {
      return apiv2.form.access.remove({...args, formId, workspaceId})
    },
    onSuccess: (data, variables) =>
      queryClient.invalidateQueries({queryKey: queryKeys.formAccess(workspaceId, formId)}),
    onError: toastHttpError,
  })
}

function update({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) {
  const {apiv2} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: Omit<Ip.Form.Access.Payload.Update, 'workspaceId'>) => {
      return apiv2.form.access.update({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.formAccess(workspaceId, formId)}),
    onError: toastHttpError,
  })
}

function create({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) {
  const {apiv2} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: Omit<Ip.Form.Access.Payload.Create, 'formId'>) => {
      return apiv2.form.access.create({...args, formId, workspaceId})
    },
    onSuccess: (data, variables) =>
      queryClient.invalidateQueries({queryKey: queryKeys.formAccess(workspaceId, formId)}),
    onError: toastHttpError,
  })
}
