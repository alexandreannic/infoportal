import {UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {duration} from '@axanc/ts-utils'

export const useQuerySchema = ({
  workspaceId,
  formId,
  versionId,
}: {
  workspaceId: UUID
  formId: Kobo.FormId
  versionId?: UUID
}) => {
  const {apiv2} = useAppSettings()
  const get = useQuery({
    queryKey: queryKeys.schema(workspaceId, formId, versionId),
    queryFn: () => apiv2.form.version.getSchema({workspaceId, formId, versionId: versionId!}),
    enabled: !!versionId,
    staleTime: duration(10, 'minute'),
  })
  return {get}
}
