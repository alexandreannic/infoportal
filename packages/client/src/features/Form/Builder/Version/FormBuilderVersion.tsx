import {seq} from '@axanc/ts-utils'
import {VersionRow, VersionRowRoot, VersionRowShowMore} from '@/features/Form/Builder/Version/VersionRow'
import React, {useEffect, useMemo, useState} from 'react'
import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {Ip} from '@infoportal/api-sdk'
import {UseQueryPermission} from '@/core/query/useQueryPermission'
import {UseQueryForm} from '@/core/query/useQueryForm'
import {createRoute} from '@tanstack/react-router'
import {formBuilderRoute, useFormBuilderContext} from '@/features/Form/Builder/FormBuilder'
import {FormBuilderBody} from '@/features/Form/Builder/FormBuilderBody'
import {useFormContext} from '@/features/Form/Form'

export const formBuilderVersionRoute = createRoute({
  getParentRoute: () => formBuilderRoute,
  path: 'version',
  component: FormBuilderVersion,
})

function FormBuilderVersion() {
  const {m} = useI18n()

  const formId = useFormContext(_ => _.formId)
  const workspaceId = useFormContext(_ => _.workspaceId)
  const formPermission = useFormContext(_ => _.permission)
  const versions = useFormBuilderContext(_ => _.versions)
  const draft = useFormBuilderContext(_ => _.versions.draft)
  const queryDeployLast = useQueryVersion({workspaceId, formId}).deployLast
  const queryForm = UseQueryForm.get({workspaceId, formId})

  const [versionVisible, setVersionVisible] = useState(5)

  return (
    <FormBuilderBody>
      <Core.Panel>
        <Core.PanelHead
          action={
            formPermission.version_canDeploy && (
              <Core.Modal
                loading={queryDeployLast.isPending}
                title={m.confirm}
                onConfirm={(event, close) => queryDeployLast.mutateAsync({workspaceId, formId}).then(close)}
              >
                <Core.Btn icon="send" variant="contained" disabled={!draft} loading={queryDeployLast.isPending}>
                  {m.deployLastVersion}
                </Core.Btn>
              </Core.Modal>
            )
          }
        >
          {m.versions}
        </Core.PanelHead>
        <Core.PanelBody>
          {seq(versions.all ?? [])
            .sortByNumber(_ => _.version, '9-0')
            .slice(0, versionVisible)
            .map((_, i) => (
              <VersionRow key={_.id} version={_} index={i} />
            ))}
          {versionVisible < versions.all.length && <VersionRowShowMore onClick={() => setVersionVisible(_ => _ + 5)} />}
          {queryForm.data && <VersionRowRoot createdAt={queryForm.data.createdAt} />}
        </Core.PanelBody>
      </Core.Panel>
    </FormBuilderBody>
  )
}
