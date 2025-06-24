import {QueryClient, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {KoboSchemaHelper, UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {duration} from '@axanc/ts-utils'
import {Schema} from '@/core/sdk/server/kobo/FormVersionSdk'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'

type Params<T extends keyof ApiSdk['kobo']['schema']> = Parameters<ApiSdk['kobo']['schema'][T]>[0]

export const useQuerySchema = ({workspaceId, formId}: {workspaceId: UUID; formId: Kobo.FormId}) => {
  const {api} = useAppSettings()
  const queryClient = useQueryClient()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()

  const get = useQuery({
    queryKey: queryKeys.schema(workspaceId, formId),
    queryFn: () => api.kobo.schema.get({workspaceId, formId}),
    staleTime: duration(10, 'minute'),
  })

  const validateXls = useMutation({
    mutationFn: (xlsFile: File) => api.kobo.schema.validateXlsForm({workspaceId, formId, xlsFile}),
  })

  const upload = useMutation({
    mutationFn: async (params: Omit<Params<'uploadXlsForm'>, 'formId' | 'workspaceId'>) => {
      return api.kobo.schema.uploadXlsForm({formId, workspaceId, ...params}).catch(toastAndThrowHttpError)
    },
    onSuccess: newSchema => {
      queryClient.setQueryData<Schema>(queryKeys.schema(workspaceId, formId), old => newSchema.schema)
    },
    onError: toastHttpError,
  })
  return {
    validateXls,
    get,
    upload,
  }
}

export const getKoboSchema = (queryClient: QueryClient, formId: Kobo.FormId): undefined | KoboSchemaHelper.Bundle => {
  return queryClient.getQueryData<KoboSchemaHelper.Bundle>(queryKeys.koboSchema(formId))
}
