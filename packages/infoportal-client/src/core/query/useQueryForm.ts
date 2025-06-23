import {UUID} from 'infoportal-common'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {duration, seq} from '@axanc/ts-utils'
import {KoboForm, KoboServer} from '@/core/sdk/server/kobo/KoboMapper'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {useMemo} from 'react'
import {Kobo} from 'kobo-sdk'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'

type Params<T extends keyof ApiSdk['kobo']['form']> = Parameters<ApiSdk['kobo']['form'][T]>[0]

export const useQueryForm = (workspaceId: UUID) => {
  const {api} = useAppSettings()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const accessibleForms = useQuery({
    queryKey: queryKeys.form(workspaceId),
    queryFn: async () => {
      return api.kobo.form
        .getAll({workspaceId})
        .then(_ => seq(_).sortByString(_ => _.name))
        .catch(toastAndThrowHttpError)
      // return _forms.get?.filter(_ => session.user.admin || koboAccesses.includes(_.id))
    },
    staleTime: duration(10, 'minute'),
  })

  const create = useMutation<KoboForm, ApiError, Omit<Params<'add'>, 'workspaceId'>>({
    mutationFn: async args => {
      return api.kobo.form.add({workspaceId, ...args})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId)}),
    onError: toastHttpError,
  })

  const indexedForms = useMemo(() => {
    return seq(accessibleForms.data).groupByFirst(_ => _.id)
  }, [accessibleForms.data])

  return {
    create,
    getForm: (formId: Kobo.FormId): KoboForm | undefined => indexedForms[formId],
    accessibleForms,
  }
}
