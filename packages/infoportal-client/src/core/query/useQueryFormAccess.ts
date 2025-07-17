import {UUID} from 'infoportal-common'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {duration} from '@axanc/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Ip} from 'infoportal-api-sdk'

export const useQueryFormAccess = {
  getByFormId,
  remove,
  update,
  create,
}

function getByFormId({workspaceId, formId}: {workspaceId: UUID; formId: Ip.FormId}) {
  const {apiv2} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()
  return useQuery({
    queryKey: queryKeys.formAccess(workspaceId, formId),
    queryFn: async () => {
      return apiv2.form.access.search({workspaceId, formId}).catch(toastAndThrowHttpError)
    },
    staleTime: duration(10, 'minute'),
  })
}

function remove({workspaceId}: {workspaceId: UUID}) {
  const {apiv2} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: {id: Ip.Uuid}) => {
      return apiv2.form.access.remove({...args, workspaceId})
    },
    onSuccess: (data, variables) =>
      queryClient.invalidateQueries({queryKey: queryKeys.formAccess(workspaceId, variables.id)}),
    onError: toastHttpError,
  })
}

function update({workspaceId}: {workspaceId: UUID}) {
  const {apiv2} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: Omit<Ip.Form.Access.Payload.Update, 'workspaceId'>) => {
      return apiv2.form.access.update({...args, workspaceId})
    },
    onSuccess: data => queryClient.invalidateQueries({queryKey: queryKeys.formAccess(workspaceId, data.formId)}),
    onError: toastHttpError,
  })
}

function create({workspaceId}: {workspaceId: UUID}) {
  const {apiv2} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: Ip.Form.Access.Payload.Create) => {
      return apiv2.form.access.create({...args, workspaceId})
    },
    onSuccess: (data, variables) =>
      queryClient.invalidateQueries({queryKey: queryKeys.formAccess(workspaceId, variables.formId)}),
    onError: toastHttpError,
  })
}
