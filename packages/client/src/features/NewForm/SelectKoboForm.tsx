import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@infoportal/client-i18n'
import {Icon, useTheme} from '@mui/material'
import {Core, Datatable} from '@/shared'
import {UseQueryForm} from '@/core/query/form/useQueryForm'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {Api} from '@infoportal/api-sdk'
import {useMemo} from 'react'
import {seq} from '@axanc/ts-utils'
import {useIpToast} from '@/core/useToast.js'
import {Link} from '@tanstack/react-router'

export const SelectKoboForm = ({
  workspaceId,
  serverId,
  onAdded,
}: {
  workspaceId: Api.WorkspaceId
  serverId: Api.ServerId
  onAdded?: () => void
}) => {
  const {api} = useAppSettings()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const t = useTheme()
  const {toastSuccess} = useIpToast()
  const importFromKobo = UseQueryForm.importFromKobo(workspaceId)
  const queryForms = UseQueryForm.getAccessibles(workspaceId)

  const formFromKoboMap = useMemo(() => {
    if (!queryForms.data) return
    return seq(queryForms.data)
      .compactBy('kobo')
      .groupByToMap(_ => _.kobo.koboId)
  }, [queryForms.data])

  const queryKoboForms = useQuery({
    queryKey: queryKeys.koboForm(serverId),
    queryFn: () => api.koboApi.searchSchemas({serverId}),
  })

  return (
    <Datatable.Component
      getRowKey={_ => _.uid}
      loading={queryKoboForms.isLoading}
      id="select-kobo-form"
      contentProps={{
        maxHeight: 600,
      }}
      sx={{
        mb: 1,
        overflow: 'hidden',
        background: t.vars.palette.background.paper,
        // border: `1px solid ${t.vars.palette.divider}`,
        borderRadius: t.vars.shape.borderRadius,
      }}
      header={<Core.PanelTitle>{m.selectKoboForm}</Core.PanelTitle>}
      data={queryKoboForms.data}
      columns={[
        {
          id: m.live,
          width: 40,
          align: 'center',
          head: '',
          type: 'select_one',
          render: _ => {
            return {
              value: '' + _.has_deployment,
              label: _.has_deployment ? (
                <Icon fontSize="small" color="success">
                  check_circle
                </Icon>
              ) : (
                <Icon fontSize="small" color="error">
                  block
                </Icon>
              ),
            }
          },
        },
        {id: 'uid', type: 'id', width: '1fr', head: m.id, renderQuick: _ => _.uid},
        {
          type: 'string',
          id: 'name',
          width: '2fr',
          head: m.name,
          render: _ => {
            return {
              value: _.name,
              label: <Core.Txt bold>{_.name}</Core.Txt>,
            }
          },
        },
        {
          type: 'date',
          width: '1fr',
          id: 'date_created',
          head: m.createdAt,
          render: _ => {
            return {
              value: _.date_created,
              label: <Core.Txt color="hint">{formatDate(_.date_created)}</Core.Txt>,
            }
          },
        },
        {
          type: 'number',
          width: '1fr',
          align: 'right',
          id: 'deployment__submission_count',
          head: m.submissions,
          render: _ => {
            return {
              value: _.deployment__submission_count,
              label: formatLargeNumber(_.deployment__submission_count),
            }
          },
        },
        {
          id: 'actions',
          width: 65,
          align: 'right',
          head: '',
          renderQuick: form => (
            <Core.Btn
              size="small"
              loading={importFromKobo.pendingIds.has(form.uid)}
              onClick={() =>
                importFromKobo
                  .mutateAsync({serverId, uid: form.uid})
                  .then(_ => {
                    return toastSuccess(m.successfullyAdded, {
                      action: (
                        <Link to="/$workspaceId/form/$formId" params={{workspaceId, formId: _.id}}>
                          <Core.Btn endIcon={<Icon>arrow_forward</Icon>}>{m.open}</Core.Btn>
                        </Link>
                      ),
                    })
                  })
                  .then(onAdded)
              }
              disabled={!form.has_deployment || !formFromKoboMap || formFromKoboMap.has(form.uid)}
            >
              {m.add}
            </Core.Btn>
          ),
        },
      ]}
    />
  )
}
