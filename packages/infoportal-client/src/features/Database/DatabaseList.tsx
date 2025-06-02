import {KoboForm} from '@/core/sdk/server/kobo/KoboMapper'
import {useI18n} from '@/core/i18n'
import {Page, PageTitle} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {KoboFormSdk} from '@/core/sdk/server/kobo/KoboFormSdk'
import {TableIconBtn} from '@/shared/TableIcon'
import React, {useEffect, useMemo} from 'react'
import {Txt} from '@/shared/Txt'
import {Datatable} from '@/shared/Datatable/Datatable'
import {Icon, useTheme} from '@mui/material'
import {databaseIndex} from '@/features/Database/databaseIndex'
import {useFetcher} from '@/shared/hook/useFetcher'
import {useAppSettings} from '@/core/context/ConfigContext'
import {fnSwitch, seq} from '@axanc/ts-utils'
import {NavLink} from 'react-router-dom'

export const DatabaseList = ({forms}: {forms?: KoboForm[]}) => {
  const {api} = useAppSettings()
  const fetcherServers = useFetcher(api.kobo.server.getAll)
  const {formatDate, m} = useI18n()
  const t = useTheme()

  useEffect(() => {
    fetcherServers.fetch()
  }, [])
  const indexServers = useMemo(() => {
    return seq(fetcherServers.get).groupByFirst(_ => _.id)
  }, [fetcherServers.get])

  return (
    <Page width="full">
      {forms && forms.length > 0 && (
        <>
          <PageTitle>{m.selectADatabase}</PageTitle>
          <Panel>
            <Datatable
              showExportBtn
              defaultLimit={500}
              id="kobo-index"
              data={forms}
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
                    const url = indexServers[_.serverId]?.url
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
                      label: <Txt bold>{KoboFormSdk.parseFormName(_.name)?.name}</Txt>,
                      value: KoboFormSdk.parseFormName(_.name)?.name,
                    }
                  },
                },
                {
                  id: 'program',
                  type: 'select_one',
                  head: m.program,
                  renderQuick: _ => KoboFormSdk.parseFormName(_.name)?.program,
                },
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
                      label: <Txt color="hint">{formatDate(_.updatedAt)}</Txt>,
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
                    <NavLink to={databaseIndex.siteMap.database.absolute(_.id)}>
                      <TableIconBtn color="primary" children="chevron_right" />
                    </NavLink>
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
