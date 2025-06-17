import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {useQuery} from '@tanstack/react-query'
import {duration} from '@axanc/ts-utils'
import {Kobo} from 'kobo-sdk'
import {queryKeys} from './store'

export const useAnswersContext = (formId: Kobo.FormId) => {
  const {api} = useAppSettings()
  const {toastHttpError} = useIpToast()
  return useQuery({
    queryKey: queryKeys.answers(formId),
    queryFn: () =>
      api.user.search({workspaceId}).catch(e => {
        toastHttpError(e)
        throw e
      }),
    staleTime: duration(10, 'minute'),
  })
}
