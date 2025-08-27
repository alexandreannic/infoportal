import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@/core/i18n'
import {Icon, useTheme} from '@mui/material'
import {Core, Datatable} from '@/shared'
import {useQueryForm} from '@/core/query/useQueryForm'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {Ip} from 'infoportal-api-sdk'

export const SelectKoboForm = ({
  workspaceId,
  serverId,
  onAdded,
}: {
  workspaceId: Ip.WorkspaceId
  serverId: Ip.ServerId
  onAdded?: () => void
}) => {
  const {api} = useAppSettings()
  const {m, formatDate} = useI18n()
  const t = useTheme()
  const queryForms = useQueryForm(workspaceId)

  const queryKoboForms = useQuery({
    queryKey: queryKeys.koboForm(serverId),
    queryFn: () => api.koboApi.searchSchemas({serverId}),
  })

  return (
    <Core.Panel>
      <Core.PanelHead>{m.selectKoboForm}</Core.PanelHead>
      <Core.PanelBody>
        <Datatable.Component
          getRowKey={_ => _.uid}
          loading={queryKoboForms.isLoading || queryForms.importFromKobo.isPending}
          id="select-kobo-form"
          sx={{
            overflow: 'hidden',
            border: `1px solid ${t.vars.palette.divider}`,
            borderRadius: t.vars.shape.borderRadius,
          }}
          header={null}
          data={queryKoboForms.data}
          columns={[
            {
              id: m.live,
              width: 0,
              head: 'has_deployment',
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
            {id: 'uid', type: 'id', head: m.id, renderQuick: _ => _.uid},
            {type: 'string', id: 'name', head: m.name, renderQuick: _ => _.name},
            {
              type: 'date',
              id: 'date_created',
              head: m.createdAt,
              render: _ => {
                return {
                  value: _.date_created,
                  label: formatDate(_.date_created),
                }
              },
            },
            {
              type: 'number',
              width: 0,
              align: 'right',
              id: 'deployment__submission_count',
              head: m.submissions,
              renderQuick: _ => _.deployment__submission_count,
            },
            {
              id: 'actions',
              width: 0,
              align: 'right',
              head: '',
              renderQuick: form => (
                <Core.Btn
                  size="small"
                  onClick={() => queryForms.importFromKobo.mutateAsync({serverId, uid: form.uid}).then(onAdded)}
                  disabled={
                    !form.has_deployment ||
                    !queryForms.accessibleForms.data ||
                    !!queryForms.accessibleForms.data.find(_ => _.id === form.uid)
                  }
                >
                  {m.add}
                </Core.Btn>
              ),
            },
          ]}
        />
      </Core.PanelBody>
    </Core.Panel>
  )
}
