import {useLangIndex} from '@/core/store/useLangIndex'
import {duration} from '@axanc/ts-utils'
import {QueryClient, useQuery} from '@tanstack/react-query'
import {KoboSchemaHelper} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'

/** @deprecated*/
export const useQueryKoboSchema = (formId: Kobo.FormId) => {
  const {api} = useAppSettings()
  const langIndex = useLangIndex(state => state.langIndex)
  const {toastAndThrowHttpError} = useIpToast()
  return useQuery({
    queryKey: queryKeys.koboSchema(formId),
    queryFn: async () => {
      const schema = await api.koboApi.getSchema({id: formId}).catch(toastAndThrowHttpError)
      return KoboSchemaHelper.buildBundle({schema: schema!, langIndex})
    },
    staleTime: duration(10, 'minute'),
  })
}

export const getKoboSchema = (queryClient: QueryClient, formId: Kobo.FormId): undefined | KoboSchemaHelper.Bundle => {
  return queryClient.getQueryData<KoboSchemaHelper.Bundle>(queryKeys.koboSchema(formId))
}
