import {seq} from '@axanc/ts-utils'
import {VersionRow, VersionRowRoot, VersionRowShowMore} from '@/features/Form/Builder/Version/VersionRow'
import React, {useMemo, useState} from 'react'
import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {Ip} from 'infoportal-api-sdk'
import {UseQueryPermission} from '@/core/query/useQueryPermission'
import {UseQueryForm} from '@/core/query/useQueryForm'
import {createRoute} from '@tanstack/react-router'
import {formBuilderRoute} from '@/features/Form/Builder/FormBuilder'
import {FormBuilderBody} from '@/features/Form/Builder/FormBuilderBody'

export const formBuilderVersionRoute = createRoute({
  getParentRoute: () => formBuilderRoute,
  path: 'version',
  component: FormBuilderVersion,
})

function FormBuilderVersion() {
  const {workspaceId, formId} = formBuilderRoute.useParams() as {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}
  const queryPermission = UseQueryPermission.form({workspaceId, formId})
  const queryVersion = useQueryVersion({workspaceId, formId})
  const {m} = useI18n()
  const versions = queryVersion.get.data ?? []
  const queryForm = UseQueryForm.get({workspaceId, formId})
  const [versionVisible, setVersionVisible] = useState(5)

  const draft = useMemo(() => {
    return queryVersion.get.data?.find(_ => _.status === 'draft')
  }, [queryVersion.get.data])

  return (
    <FormBuilderBody>
      <Core.Panel>
        <Core.PanelHead
          action={
            queryPermission.data?.version_canDeploy && (
              <Core.Modal
                loading={queryVersion.deployLast.isPending}
                title={m.confirm}
                onConfirm={(event, close) => queryVersion.deployLast.mutateAsync({workspaceId, formId}).then(close)}
              >
                <Core.Btn icon="send" variant="contained" disabled={!draft} loading={queryVersion.deployLast.isPending}>
                  {m.deployLastVersion}
                </Core.Btn>
              </Core.Modal>
            )
          }
        >
          {m.versions}
        </Core.PanelHead>
        <Core.PanelBody>
          {seq(versions ?? [])
            .sortByNumber(_ => _.version, '9-0')
            .slice(0, versionVisible)
            .map((_, i) => (
              <VersionRow key={_.id} version={_} index={i} />
            ))}
          {versionVisible < versions.length && <VersionRowShowMore onClick={() => setVersionVisible(_ => _ + 5)} />}
          {queryForm.data && <VersionRowRoot createdAt={queryForm.data.createdAt} />}
        </Core.PanelBody>
      </Core.Panel>
    </FormBuilderBody>
  )
}
