import {useLangIndex} from '@/core/store/useLangIndex'
import {useQuery} from '@tanstack/react-query'
import {KoboSchemaHelper} from 'infoportal-common'
import {useAppSettings} from '../context/ConfigContext'
import {queryKeys} from './query.index'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'

export const useQuerySchema = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId?: Ip.FormId}) => {
  const {apiv2} = useAppSettings()
  const langIndex = useLangIndex(state => state.langIndex)

  const query = useQuery({
    queryKey: queryKeys.schema(workspaceId, formId),
    queryFn: () => apiv2.form.getSchema({workspaceId, formId: formId!}),
    retry: false,
    enabled: !!formId,
  })

  const bundle = useMemo(() => {
    if (query.data === undefined) return
    return KoboSchemaHelper.buildBundle({
      schema: query.data,
      langIndex,
    })
  }, [query.data, langIndex])

  return {
    ...query,
    data: bundle,
  }
}
