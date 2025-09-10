import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {seq} from '@axanc/ts-utils'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'

export const useQueryForm = (workspaceId: Ip.WorkspaceId) => {
  const {apiv2} = useAppSettings()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const accessibleForms = useQuery({
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
  const formIndex = useMemo(() => {
    if (!accessibleForms.data) return
    const map = new Map<Ip.FormId, Ip.Form>()
    accessibleForms.data.forEach(_ => map.set(_.id, _))
    return map
  }, [accessibleForms.data])

  const importFromKobo = useMutation<Ip.Form, ApiError, Ip.Form.Payload.Import>({
    mutationFn: args => apiv2.kobo.importFromKobo({workspaceId, ...args}),
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId)}),
    onError: toastHttpError,
  })

  const create = useMutation<Ip.Form, ApiError, Omit<Ip.Form.Payload.Create, 'workspaceId'>>({
    mutationFn: args => apiv2.form.create({workspaceId, ...args}),
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId)}),
    onError: toastHttpError,
  })

  const categories = useMemo(() => {
    return accessibleForms.data
      ?.map(_ => _.category)
      .compact()
      .distinct(_ => _)
  }, [accessibleForms.data])

  // const indexedForms = useMemo(() => {
  //   return seq(accessibleForms.data).groupByFirst(_ => _.id)
  // }, [accessibleForms.data])

  return {
    categories,
    create,
    importFromKobo,
    accessibleForms,
    formIndex,
  }
}

export const useQueryFormById = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
  const {apiv2} = useAppSettings()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const remove = useMutation<void, ApiError, void>({
    mutationFn: () => apiv2.form.remove({workspaceId, formId}),
    onSuccess: _ => {
      queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId)})
      queryClient.removeQueries({queryKey: queryKeys.form(workspaceId, formId)})
      queryClient.removeQueries({queryKey: queryKeys.schema(workspaceId, formId)})
      queryClient.removeQueries({queryKey: queryKeys.answers(formId)})
      queryClient.removeQueries({queryKey: queryKeys.schemaByVersion(workspaceId, formId)})
    },
    onError: toastHttpError,
  })

  const update = useMutation<Ip.Form, ApiError, Omit<Ip.Form.Payload.Update, 'workspaceId' | 'formId'>>({
    mutationFn: args => apiv2.form.update({workspaceId, formId, ...args}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId, formId)})
      // queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId)})
    },
    onError: toastHttpError,
  })

  const disconnectFromKobo = useMutation<Ip.Form, ApiError, void>({
    mutationFn: () => apiv2.form.disconnectFromKobo({workspaceId, formId}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId, formId)})
    },
    onError: toastHttpError,
  })

  const get = useQuery({
    queryKey: queryKeys.form(workspaceId, formId),
    queryFn: () => apiv2.form.get({workspaceId, formId}).catch(toastAndThrowHttpError),
  })
  return {get, update, remove, disconnectFromKobo}
}
