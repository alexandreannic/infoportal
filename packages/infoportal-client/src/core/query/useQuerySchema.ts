import {useLangIndex} from '@/core/store/useLangIndex'
import {duration} from '@axanc/ts-utils'
import {QueryClient, useQuery} from '@tanstack/react-query'
import {KoboSchemaHelper} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@/core/i18n'

export const useQuerySchema = ({workspaceId, formId}: {workspaceId: Ip.Uuid; formId: Kobo.FormId}) => {
  const {apiv2} = useAppSettings()
  const langIndex = useLangIndex(state => state.langIndex)
  return useQuery({
    queryKey: queryKeys.koboSchema(formId),
    queryFn: async () => {
      const schema = await apiv2.form.getSchema({workspaceId, formId})
      if (schema) {
        return KoboSchemaHelper.buildBundle({schema, langIndex})
      }
    },
    staleTime: duration(10, 'minute'),
  })
}

export const getKoboSchema = (queryClient: QueryClient, formId: Kobo.FormId): undefined | KoboSchemaHelper.Bundle => {
  return queryClient.getQueryData<KoboSchemaHelper.Bundle>(queryKeys.koboSchema(formId))
}
