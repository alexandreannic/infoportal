import {useAppSettings} from '@/core/context/ConfigContext'
import {Ip} from 'infoportal-api-sdk'
import {useIpToast} from '@/core/useToast'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {useSetState} from '@axanc/react-hooks'
import {usePendingMutation} from '@/core/query/usePendingMutation.js'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper.js'

export class UseQueryFromAction {
  static readonly create = (workspaceId: Ip.WorkspaceId, formId: Ip.FormId) => {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const {toastHttpError} = useIpToast()

    return useMutation<Ip.Form.Action, ApiError, Omit<Ip.Form.Action.Payload.Create, 'formId' | 'workspaceId'>>({
      mutationFn: async args => {
        return apiv2.form.action.create({...args, formId, workspaceId})
      },
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.formAction(workspaceId, formId)}),
      onError: toastHttpError,
    })
  }

  static readonly runAllActionByForm = (workspaceId: Ip.WorkspaceId, formId: Ip.FormId) => {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const {toastHttpError} = useIpToast()
    return useMutation({
      mutationFn: () =>
        apiv2.form.action.runAllActionsByForm({workspaceId, formId}).then(_ => {
          const queryKey = queryKeys.formActionReport(workspaceId, formId)
          const previous = queryClient.getQueryData<Ip.Form.Action.ExecReport[]>(queryKey) ?? []
          queryClient.setQueryData(queryKey, [_, ...previous])
          return _
        }),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.submission(formId)}),
      onError: toastHttpError,
    })
  }

  static readonly update = (workspaceId: Ip.WorkspaceId, formId: Ip.FormId) => {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const {toastHttpError} = useIpToast()
    return usePendingMutation<Ip.Form.Action, ApiError, Omit<Ip.Form.Action.Payload.Update, 'formId' | 'workspaceId'>>({
      getId: variables => variables.id,
      mutationFn: async args => {
        return apiv2.form.action.update({...args, formId, workspaceId})
      },
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.formAction(workspaceId, formId)}),
      onError: toastHttpError,
    })
  }

  static readonly getByDbId = (workspaceId: Ip.WorkspaceId, formId: Ip.FormId) => {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()

    return useQuery({
      queryKey: queryKeys.formAction(workspaceId, formId),
      queryFn: () => apiv2.form.action.getByDbId({workspaceId, formId}).catch(toastAndThrowHttpError),
    })
  }

  static readonly getById = (workspaceId: Ip.WorkspaceId, formId: Ip.FormId, functionId: Ip.Form.ActionId) => {
    const all = this.getByDbId(workspaceId, formId)
    return {
      ...all,
      data: all.data?.find(_ => _.id === functionId),
    }
  }
}
