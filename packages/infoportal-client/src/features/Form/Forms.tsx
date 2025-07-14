import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useI18n} from '@/core/i18n'
import {Datatable} from '@/shared/Datatable/Datatable'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {TableIconBtn} from '@/shared/TableIcon'
import {Txt} from '@/shared/Txt'
import {seq} from '@axanc/ts-utils'
import {Icon, useTheme} from '@mui/material'
import {useEffect, useMemo} from 'react'
import {useQueryServers} from '@/core/query/useQueryServers'
import {useQueryForm} from '@/core/query/useQueryForm'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Link} from '@tanstack/react-router'

export const Forms = () => {
  const {workspaceId} = useWorkspaceRouter()
  const {formatDate, m} = useI18n()
  const t = useTheme()
  const {setTitle} = useLayoutContext()
  const queryServer = useQueryServers(workspaceId)
  const queryForm = useQueryForm(workspaceId)

  const formsAccessible = queryForm.accessibleForms.data

  const indexServers = useMemo(() => {
    return seq(queryServer.getAll.data).groupByFirst(_ => _.id)
  }, [queryServer.getAll.data])

  useEffect(() => {
    setTitle(m.selectADatabase)
    return () => setTitle('')
  }, [])

  return (
    <Page width="full">
      {formsAccessible && formsAccessible.length > 0 && (
        <>
          <Panel>
            <Datatable
              showExportBtn
              defaultLimit={500}
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
                      label:
                        _.deploymentStatus === 'archived' ? (
                          <Icon fontSize="small" color="disabled">
                            archive
                          </Icon>
                        ) : _.deploymentStatus === 'deployed' ? (
                          <Icon fontSize="small" sx={{color: t.palette.success.light}} color="success">
                            fiber_manual_record
                          </Icon>
                        ) : undefined,
                      value: _.deploymentStatus,
                      export: _.deploymentStatus,
                      option: _.deploymentStatus,
                    }
                  },
                },
                {
                  id: 'id',
                  type: 'string',
                  head: m.id,
                  renderQuick: _ => _.id,
                },
                {
                  id: 'serverId',
                  type: 'select_one',
                  head: m.serverId,
                  renderQuick: _ => _.serverId,
                },
                {
                  id: 'serverUrl',
                  type: 'select_one',
                  head: m.server,
                  render: _ => {
                    const url = _.serverId ? indexServers[_.serverId]?.url : undefined
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
                {
                  id: 'name',
                  type: 'select_one',
                  head: m.name,
                  render: _ => {
                    return {
                      label: <Txt bold>{_.name}</Txt>,
                      value: _.name,
                    }
                  },
                },
                // {
                //   id: 'program',
                //   type: 'select_one',
                //   head: m.program,
                //   renderQuick: _ => _.name,
                // },
                {
                  id: 'length',
                  head: m.submissions,
                  type: 'number',
                  align: 'right',
                  width: 0,
                  renderQuick: _ => _.submissionsCount,
                },
                {
                  id: 'createdAt',
                  type: 'date',
                  head: m.createdAt,
                  width: 0,
                  render: _ => {
                    return {
                      label: <Txt color="hint">{formatDate(_.createdAt)}</Txt>,
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
                      label: _.updatedAt && <Txt color="hint">{formatDate(_.updatedAt)}</Txt>,
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
                    if (!_.enketoUrl) return {label: '', value: undefined}
                    return {
                      export: _.enketoUrl,
                      tooltip: _.enketoUrl,
                      value: _.enketoUrl,
                      label: (
                        <a href={_.enketoUrl} target="_blank" rel="noopener noreferrer">
                          <TableIconBtn color="primary">file_open</TableIconBtn>
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
                    <Link to="/app/$workspaceId/form/$formId" params={{workspaceId, formId: _.id}}>
                      <TableIconBtn color="primary" children="chevron_right" />
                    </Link>
                  ),
                },
              ]}
            />
          </Panel>
        </>
      )}
    </Page>
  )
}
