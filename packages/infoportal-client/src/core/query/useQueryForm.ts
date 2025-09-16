import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {seq} from '@axanc/ts-utils'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'
import {usePendingMutation} from '@/core/query/usePendingMutation.js'

export class UseQueryForm {
  static getAccessibles(workspaceId: Ip.WorkspaceId) {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useQuery({
      queryKey: queryKeys.form(workspaceId),
      queryFn: async () => {
        const forms = await apiv2.form.getMine({workspaceId}).catch(toastAndThrowHttpError)
        forms.forEach(form => {
          queryClient.setQueryData(queryKeys.form(workspaceId, form.id), form)
        })
        return seq(forms).sortByString(_ => _.name)
        // return api.kobo.form
        //   .getAll({workspaceId})
        //   .then(_ => seq(_).sortByString(_ => _.name))
        //   .catch(toastAndThrowHttpError)
        // // return _forms.get?.filter(_ => session.user.admin || koboAccesses.includes(_.id))
      },
    })
  }

  static getAsMap(workspaceId: Ip.WorkspaceId) {
    const accessibleForms = this.getAccessibles(workspaceId)
    return useMemo(() => {
      if (!accessibleForms.data) return
      const map = new Map<Ip.FormId, Ip.Form>()
      accessibleForms.data.forEach(_ => map.set(_.id, _))
      return map
    }, [accessibleForms.data])
  }

  static importFromKobo(workspaceId: Ip.WorkspaceId) {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<Ip.Form, ApiError, Ip.Form.Payload.Import>({
      getId: _ => _.uid,
      mutationFn: args => apiv2.kobo.importFromKobo({workspaceId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId)}),
      onError: toastHttpError,
    })
  }

  static categories(workspaceId: Ip.WorkspaceId) {
    const accessibleForms = this.getAccessibles(workspaceId)
    return useMemo(() => {
      return accessibleForms.data
        ?.map(_ => _.category)
        .compact()
        .distinct(_ => _)
    }, [accessibleForms.data])
  }

  static create(workspaceId: Ip.WorkspaceId) {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const {toastHttpError} = useIpToast()
    return useMutation<Ip.Form, ApiError, Omit<Ip.Form.Payload.Create, 'workspaceId'>>({
      mutationFn: args => apiv2.form.create({workspaceId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId)}),
      onError: toastHttpError,
    })
  }

  static remove(workspaceId: Ip.WorkspaceId) {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const {toastHttpError} = useIpToast()
    return usePendingMutation({
      mutationFn: (formId: Ip.FormId) => apiv2.form.remove({workspaceId, formId}),
      getId: _ => _,
      onSuccess: (data, formId) => {
        queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId)})
        queryClient.removeQueries({queryKey: queryKeys.form(workspaceId, formId)})
        queryClient.removeQueries({queryKey: queryKeys.schema(workspaceId, formId)})
        queryClient.removeQueries({queryKey: queryKeys.answers(formId)})
        queryClient.removeQueries({queryKey: queryKeys.schemaByVersion(workspaceId, formId)})
      },
      onError: toastHttpError,
    })
  }

  static update(workspaceId: Ip.WorkspaceId) {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const {toastHttpError} = useIpToast()
    return usePendingMutation<Ip.Form, ApiError, Omit<Ip.Form.Payload.Update, 'workspaceId'>>({
      getId: _ => _.formId,
      mutationFn: args => apiv2.form.update({workspaceId, ...args}),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId, variables.formId)})
        // queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId)})
      },
      onError: toastHttpError,
    })
  }

  static disconnectFromKobo(workspaceId: Ip.WorkspaceId) {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const {toastHttpError} = useIpToast()
    return useMutation({
      mutationFn: (formId: Ip.FormId) => apiv2.form.disconnectFromKobo({workspaceId, formId}),
      onSuccess: (data, formId) => {
        queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId, formId)})
      },
      onError: toastHttpError,
    })
  }

  static get({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId?: Ip.FormId}) {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()
    return useQuery({
      queryKey: queryKeys.form(workspaceId, formId),
      queryFn: () => apiv2.form.get({workspaceId, formId: formId!}).catch(toastAndThrowHttpError),
      enabled: !!formId,
    })
  }
}
