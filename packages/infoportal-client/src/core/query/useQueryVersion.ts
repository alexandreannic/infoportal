import {QueryClient, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {KoboSchemaHelper, UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {duration} from '@axanc/ts-utils'
import {IpClient} from 'infoportal-api-sdk/lib'

type Params<T extends keyof IpClient['form']['version']> = Parameters<IpClient['form']['version'][T]>[0]
type Return<T extends keyof IpClient['form']['version']> = Awaited<ReturnType<IpClient['form']['version'][T]>>

export const useQueryVersion = ({workspaceId, formId}: {workspaceId: UUID; formId: Kobo.FormId}) => {
  const {apiv2} = useAppSettings()
  const queryClient = useQueryClient()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()

  const get = useQuery({
    queryKey: queryKeys.version(workspaceId, formId),
    queryFn: () => apiv2.form.version.getByFormId({workspaceId, formId}),
    staleTime: duration(10, 'minute'),
  })

  const validateXls = useMutation({
    mutationFn: (xlsFile: File) => apiv2.form.version.validateXlsForm({workspaceId, formId, xlsFile}),
  })

  const upload = useMutation({
    mutationFn: async (params: Omit<Params<'uploadXlsForm'>, 'formId' | 'workspaceId'>) => {
      return apiv2.form.version.uploadXlsForm({formId, workspaceId, ...params}).catch(toastAndThrowHttpError)
    },
    onSuccess: newSchema => {
      queryClient.setQueryData<Return<'getByFormId'>>(queryKeys.version(workspaceId, formId), old => [
        ...(old ?? []),
        newSchema,
      ])
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
