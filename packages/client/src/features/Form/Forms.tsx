import {useI18n} from '@infoportal/client-i18n'
import {Core, Datatable} from '@/shared'
import {Page} from '@/shared/Page'
import {seq} from '@axanc/ts-utils'
import {Icon, useTheme} from '@mui/material'
import {useEffect, useMemo} from 'react'
import {useQueryKoboAccounts} from '@/core/query/useQueryKoboAccounts'
import {UseQueryForm} from '@/core/query/form/useQueryForm'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {createRoute, Link} from '@tanstack/react-router'
import {formRootRoute} from '@/features/Form/Form'
import {Api} from '@infoportal/api-sdk'
import {appConfig} from '@/conf/AppConfig.js'
import {DeploymentStatusIcon} from '@/shared/DeploymentStatus'
import {AssetIcon} from '@/shared/Asset.js'
import {UseQueryPermission} from '@/core/query/useQueryPermission.js'

export const formsRoute = createRoute({
  getParentRoute: () => formRootRoute,
  path: 'list',
  component: Forms,
})

function Forms() {
  const {workspaceId} = formsRoute.useParams() as {workspaceId: Api.WorkspaceId}
  const {formatDate, m} = useI18n()
  const t = useTheme()
  const {setTitle} = useLayoutContext()
  const queryKoboAccount = useQueryKoboAccounts(workspaceId)
  const queryForm = UseQueryForm.getAccessibles(workspaceId)
  const permissionWorkspace = UseQueryPermission.workspace({workspaceId})

  const indexServers: Record<Api.Kobo.AccountId, Api.Kobo.Account> = useMemo(() => {
    return seq(queryKoboAccount.getAll.data).groupByFirst(_ => _.id)
  }, [queryKoboAccount.getAll.data])

  useEffect(() => {
    setTitle(m.selectADatabase)
    return () => setTitle('')
  }, [])

  return (
    <Page width="full">
      <Core.Panel>
        <Datatable.Component
          getRowKey={_ => _.id}
          // showExportBtn
          header={
            permissionWorkspace.data?.form_canCreate && (
              <Link to="/$workspaceId/new-form" params={{workspaceId}}>
                <Core.Btn icon="add" variant={'outlined'} sx={{mr: 0}}>
                  {m.add}
                </Core.Btn>
              </Link>
            )
          }
          id="kobo-index"
          data={queryForm.data}
          columns={[
            {
              id: 'type',
              type: 'select_one',
              width: 65,
              head: m.type,
              align: 'center',
              render: _ => {
                return {
                  label: <AssetIcon type={_.type as any} />,
                  value: _.type,
                  export: _.type,
                  option: _.type,
                }
              },
            },
            {
              id: 'linkedToKobo',
              type: 'select_one',
              width: 65,
              head: m.connectedToKobo,
              align: 'center',
              render: _ => {
                const isKobo = Api.Form.isKobo(_)
                const connected = Api.Form.isConnectedToKobo(_)
                return {
                  label: isKobo ? !connected && <Icon color="error" children="block" /> : undefined,
                  value: isKobo ? '' + connected : undefined,
                  export: isKobo ? '' + connected : undefined,
                  option: isKobo ? '' + connected : undefined,
                }
              },
            },
            {
              id: 'status',
              type: 'select_one',
              width: 65,
              head: m.status,
              align: 'center',
              render: _ => {
                return {
                  label: <DeploymentStatusIcon status={_.deploymentStatus} />,
                  value: _.deploymentStatus,
                  export: _.deploymentStatus,
                  option: _.deploymentStatus,
                }
              },
            },
            {
              id: 'name',
              type: 'select_one',
              width: '2fr',
              head: m.name,
              render: _ => {
                return {
                  label: <Core.Txt bold>{_.name}</Core.Txt>,
                  value: _.name,
                }
              },
            },
            {
              id: 'category',
              type: 'select_one',
              head: m.category,
              render: _ => {
                return {
                  label: _.category,
                  value: _.category,
                }
              },
            },
            {
              id: 'id',
              type: 'string',
              head: m.id,
              renderQuick: _ => _.id,
            },
            // {
            //   id: 'serverId',
            //   module: 'select_one',
            //   head: m.serverId,
            //   renderQuick: _ => _.kobo?.accountId,
            // },
            {
              id: 'serverUrl',
              type: 'select_one',
              head: m.koboServer,
              render: _ => {
                const url = _.kobo?.accountId ? indexServers[_.kobo?.accountId]?.url : undefined
                if (url) {
                  return {
                    value: url,
                    label: (
                      <a className="link" href={url} target="_blank">
                        {url.replace(/https?:\/\//, '')}
                      </a>
                    ),
                  }
                }
                return {value: undefined, label: ''}
              },
            },
            // {
            //   id: 'program',
            //   module: 'select_one',
            //   head: m.program,
            //   renderQuick: _ => _.name,
            // },
            // {
            //   id: 'length',
            //   head: m.submissions,
            //   module: 'number',
            //   align: 'right',
            //   width: 0,
            //   renderQuick: _ => _.kobo.submissionsCount,
            // },
            {
              id: 'createdAt',
              type: 'date',
              head: m.createdAt,
              render: _ => {
                return {
                  label: <Core.Txt color="hint">{formatDate(_.createdAt)}</Core.Txt>,
                  value: _.createdAt,
                }
              },
            },
            {
              id: 'updatedAt',
              type: 'date',
              head: m.updatedAt,
              render: _ => {
                return {
                  label: _.updatedAt && <Core.Txt color="hint">{formatDate(_.updatedAt)}</Core.Txt>,
                  value: _.updatedAt,
                }
              },
            },
            {
              id: 'form_url',
              head: m.link,
              width: 60,
              align: 'center',
              type: 'string',
              render: _ => {
                if (!_.kobo?.enketoUrl) return {label: '', value: undefined}
                return {
                  export: _.kobo.enketoUrl,
                  tooltip: _.kobo.enketoUrl,
                  value: _.kobo.enketoUrl,
                  label: (
                    <a href={_.kobo.enketoUrl} target="_blank" rel="noopener noreferrer">
                      <Core.IconBtn color="primary">{appConfig.icons.openFormLink}</Core.IconBtn>
                    </a>
                  ),
                }
              },
            },
            {
              id: 'actions',
              width: 45,
              styleHead: {maxWidth: 0},
              align: 'right',
              head: '',
              renderQuick: _ => (
                <Link to="/$workspaceId/form/$formId" params={{workspaceId, formId: _.id}}>
                  <Core.IconBtn color="primary" children="chevron_right" />
                </Link>
              ),
            },
          ]}
        />
      </Core.Panel>
    </Page>
  )
}
