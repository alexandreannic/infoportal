import {UUID} from 'infoportal-common'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {duration, seq} from '@axanc/ts-utils'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {Kobo} from 'kobo-sdk'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'

export const useQueryForm = (workspaceId: UUID) => {
  const {apiv2} = useAppSettings()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const accessibleForms = useQuery({
    queryKey: queryKeys.form(workspaceId),
    queryFn: async () => {
      const forms = await apiv2.form.getAll({workspaceId}).catch(toastAndThrowHttpError)
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
    staleTime: duration(10, 'minute'),
  })

  const importFromKobo = useMutation<Ip.Form, ApiError, Ip.Form.Payload.Import>({
    mutationFn: args => apiv2.kobo.importFromKobo({workspaceId, ...args}),
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId)}),
    onError: toastHttpError,
  })

  const remove = useMutation<number, ApiError, {formId: Ip.FormId}>({
    mutationFn: args => apiv2.form.remove({workspaceId, ...args}),
    onSuccess: (_, {formId}) => {
      queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId)})
      queryClient.removeQueries({queryKey: queryKeys.form(workspaceId, formId)})
      queryClient.removeQueries({queryKey: queryKeys.schema(workspaceId, formId)})
      queryClient.removeQueries({queryKey: queryKeys.answers(formId)})
      queryClient.removeQueries({queryKey: queryKeys.schemaByVersion(workspaceId, formId)})
    },
    onError: toastHttpError,
  })

  const create = useMutation<Ip.Form, ApiError, Ip.Form.Payload.Create>({
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
    remove,
    categories,
    create,
    importFromKobo,
    accessibleForms,
  }
}

export const useQueryFormById = ({workspaceId, formId}: {workspaceId: UUID; formId: Kobo.FormId}) => {
  const {apiv2} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()

  return useQuery({
    queryKey: queryKeys.form(workspaceId, formId),
    queryFn: () => apiv2.form.get({workspaceId, formId}).catch(toastAndThrowHttpError),
    staleTime: duration(10, 'minute'),
  })
}
