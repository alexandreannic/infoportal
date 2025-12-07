import {Api} from '@infoportal/api-sdk'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {useMemo} from 'react'
import {SchemaInspector} from '@infoportal/form-helper'

export class UseQuerySchema {
  static readonly get = ({workspaceId, formId}: {workspaceId: Api.WorkspaceId; formId?: Api.FormId}) => {
    const {apiv2} = useAppSettings()
    return useQuery({
      queryKey: queryKeys.schema.form(workspaceId, formId!),
      queryFn: () => apiv2.form.schema.get({workspaceId, formId: formId!}),
      retry: false,
      enabled: !!formId,
    })
  }

  static readonly getXml = ({workspaceId, formId}: {workspaceId: Api.WorkspaceId; formId?: Api.FormId}) => {
    const {apiv2} = useAppSettings()
    return useQuery({
      queryKey: queryKeys.schema.formXml(workspaceId, formId!),
      queryFn: () => apiv2.form.schema.getXml({workspaceId, formId: formId!}),
      retry: false,
      enabled: !!formId,
    })
  }

  static readonly getInspector = ({
    workspaceId,
    formId,
    langIndex,
  }: {
    workspaceId: Api.WorkspaceId
    formId?: Api.FormId
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
    workspaceId: Api.WorkspaceId
    formId: Api.FormId
    versionId?: Api.Form.VersionId
  }) => {
    const {apiv2} = useAppSettings()
    return useQuery({
      queryKey: queryKeys.schema.versionOne(workspaceId, formId, versionId!),
      queryFn: () => {
        return apiv2.form.schema.getByVersion({workspaceId, formId, versionId: versionId!})
      },
      enabled: !!versionId,
    })
  }

  static readonly getByVersionXml = ({
    workspaceId,
    formId,
    versionId,
  }: {
    workspaceId: Api.WorkspaceId
    formId: Api.FormId
    versionId?: Api.Form.VersionId
  }) => {
    const {apiv2} = useAppSettings()
    return useQuery({
      queryKey: queryKeys.schema.versionOneXml(workspaceId, formId, versionId!),
      queryFn: () => {
        return apiv2.form.schema.getByVersionXml({workspaceId, formId, versionId: versionId!})
      },
      enabled: !!versionId,
    })
  }
}
