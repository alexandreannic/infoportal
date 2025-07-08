import {UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {duration} from '@axanc/ts-utils'

export const useQuerySchemaByVersion = ({
  workspaceId,
  formId,
  versionId,
}: {
  workspaceId: UUID
  formId: Kobo.FormId
  versionId?: UUID
}) => {
  const {apiv2} = useAppSettings()
  return useQuery({
    queryKey: queryKeys.schemaByVersion(workspaceId, formId, versionId),
    queryFn: () => apiv2.form.getSchemaByVersion({workspaceId, formId, versionId: versionId!}),
    enabled: !!versionId,
    staleTime: duration(10, 'minute'),
  })
}
