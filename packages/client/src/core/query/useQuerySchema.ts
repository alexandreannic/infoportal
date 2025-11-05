import {useQuery} from '@tanstack/react-query'
import {KoboSchemaHelper} from '@infoportal/kobo-helper'
import {useAppSettings} from '../context/ConfigContext'
import {queryKeys} from './query.index'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'

export const useQuerySchema = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId?: Ip.FormId}) => {
  const {apiv2} = useAppSettings()

  return useQuery({
    queryKey: queryKeys.schema(workspaceId, formId),
    queryFn: () => apiv2.form.getSchema({workspaceId, formId: formId!}),
    retry: false,
    enabled: !!formId,
  })
}

export const useQuerySchemaBundle = ({workspaceId, formId, langIndex}: {workspaceId: Ip.WorkspaceId; formId?: Ip.FormId, langIndex: number}) => {
  const query = useQuerySchema({workspaceId, formId})

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
