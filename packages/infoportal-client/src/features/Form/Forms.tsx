import {useI18n} from '@/core/i18n'
import {Core, Datatable} from '@/shared'
import {Page} from '@/shared/Page'
import {fnSwitch, seq} from '@axanc/ts-utils'
import {Icon, useTheme} from '@mui/material'
import {useEffect, useMemo} from 'react'
import {useQueryServers} from '@/core/query/useQueryServers'
import {useQueryForm} from '@/core/query/useQueryForm'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {createRoute, Link} from '@tanstack/react-router'
import {formRootRoute} from '@/features/Form/Form'
import {Ip} from 'infoportal-api-sdk'
import {appConfig} from '@/conf/AppConfig.js'

export const formsRoute = createRoute({
  getParentRoute: () => formRootRoute,
  path: 'list',
  component: Forms,
})

function Forms() {
  const {workspaceId} = formsRoute.useParams() as {workspaceId: Ip.WorkspaceId}
  const {formatDate, m} = useI18n()
  const t = useTheme()
  const {setTitle} = useLayoutContext()
  const queryServer = useQueryServers(workspaceId)
  const queryForm = useQueryForm(workspaceId)

  const formsAccessible = queryForm.accessibleForms.data

  const indexServers: Record<Ip.ServerId, Ip.Server> = useMemo(() => {
    return seq(queryServer.getAll.data).groupByFirst(_ => _.id)
  }, [queryServer.getAll.data])

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
            <Link to="/$workspaceId/new-form" params={{workspaceId}}>
              <Core.Btn icon="add" variant={'outlined'} sx={{mr: 0}}>
                {m.add}
              </Core.Btn>
            </Link>
          }
          id="kobo-index"
          data={formsAccessible}
          columns={[
            {
              id: 'status',
              type: 'select_one',
              width: 0,
              head: m.status,
              styleHead: {maxWidth: 0},
              align: 'center',
              render: _ => {
                return {
                  label: fnSwitch(_.deploymentStatus!, {
                    archived: (
                      <Icon fontSize="small" color="disabled">
                        {appConfig.icons.deploymentStatus.archived}
                      </Icon>
                    ),
                    deployed: (
                      <Icon fontSize="small" sx={{color: t.vars.palette.success.light}} color="success">
                        {appConfig.icons.deploymentStatus.deployed}
                      </Icon>
                    ),
                    draft: (
                      <Icon fontSize="small" color="disabled">
                        {appConfig.icons.deploymentStatus.draft}
                      </Icon>
                    ),
                  }),
                  value: _.deploymentStatus,
                  export: _.deploymentStatus,
                  option: _.deploymentStatus,
                }
              },
            },
            {
              id: 'name',
              type: 'select_one',
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
            //   type: 'select_one',
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
            //   type: 'select_one',
            //   head: m.program,
            //   renderQuick: _ => _.name,
            // },
            // {
            //   id: 'length',
            //   head: m.submissions,
            //   type: 'number',
            //   align: 'right',
            //   width: 0,
            //   renderQuick: _ => _.kobo.submissionsCount,
            // },
            {
              id: 'createdAt',
              type: 'date',
              head: m.createdAt,
              width: 0,
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
              width: 0,
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
              align: 'center',
              type: 'string',
              width: 0,
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
              width: 0,
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
