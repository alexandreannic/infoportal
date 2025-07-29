import {useAppSettings} from '@/core/context/ConfigContext'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {Ip} from 'infoportal-api-sdk'

export const useQuerySchemaByVersion = ({
  workspaceId,
  formId,
  versionId,
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  versionId?: Ip.Form.VersionId
}) => {
  const {apiv2} = useAppSettings()
  return useQuery({
    queryKey: queryKeys.schemaByVersion(workspaceId, formId, versionId),
    queryFn: () => apiv2.form.getSchemaByVersion({workspaceId, formId, versionId: versionId!}),
    enabled: !!versionId,
  })
}
