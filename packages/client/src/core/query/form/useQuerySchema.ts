import {Ip} from '@infoportal/api-sdk'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {useMemo} from 'react'
import {SchemaInspector} from '@infoportal/form-helper'

export class UseQuerySchema {
  static readonly get = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId?: Ip.FormId}) => {
    const {apiv2} = useAppSettings()

    return useQuery({
      queryKey: queryKeys.schema(workspaceId, formId),
      queryFn: () => apiv2.form.getSchema({workspaceId, formId: formId!}),
      retry: false,
      enabled: !!formId,
    })
  }

  static readonly getInspector = ({
    workspaceId,
    formId,
    langIndex,
  }: {
    workspaceId: Ip.WorkspaceId
    formId?: Ip.FormId
    langIndex: number
  }) => {
    const query = UseQuerySchema.get({workspaceId, formId})

    const bundle = useMemo(() => {
      if (query.data === undefined) return
      return new SchemaInspector(query.data, langIndex)
    }, [query.data, langIndex])

    return {
      ...query,
      data: bundle,
    }
  }

  static readonly getByVersion = ({
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
      queryFn: () => {
        return apiv2.form.getSchemaByVersion({workspaceId, formId, versionId: versionId!})
      },
      enabled: !!versionId,
    })
  }
}
