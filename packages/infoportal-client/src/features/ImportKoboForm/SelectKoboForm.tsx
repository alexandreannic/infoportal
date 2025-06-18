import {useEffectFn, useFetcher} from '@axanc/react-hooks'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffect} from 'react'
import {IpBtn} from '@/shared'
import {useI18n} from '@/core/i18n'
import {Icon, useTheme} from '@mui/material'
import {useIpToast} from '@/core/useToast'
import {useAsync} from '@/shared/hook/useAsync'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {UUID} from 'infoportal-common'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {Datatable} from '@/shared/Datatable/Datatable'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'

export const SelectKoboForm = ({serverId, onAdded}: {serverId: UUID; onAdded?: () => void}) => {
  const {api} = useAppSettings()
  const {m, formatDate} = useI18n()
  const {workspaceId} = useWorkspaceRouter()
  const {toastHttpError} = useIpToast()
  const ctx = useDatabaseContext()
  const t = useTheme()
  const asyncAdd = useAsync(api.kobo.form.add)
  const fetchForms = useFetcher(api.koboApi.searchSchemas)

  useEffectFn(asyncAdd.error, toastHttpError)

  useEffect(() => {
    fetchForms.fetch({}, {serverId})
  }, [serverId])

  return (
    <Panel loading={fetchForms.loading || asyncAdd.loading}>
      <PanelHead>{m._koboDatabase.registerNewForm}</PanelHead>
      <PanelBody>
        <Datatable
          id="select-kobo-form"
          sx={{overflow: 'hidden', border: `1px solid ${t.palette.divider}`, borderRadius: t.shape.borderRadius + 'px'}}
          header={null}
          data={fetchForms.get}
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
                      disabled
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
                <IpBtn
                  size="small"
                  onClick={() => asyncAdd.call({workspaceId, serverId, uid: form.uid}).then(onAdded)}
                  disabled={!form.has_deployment || !ctx._forms.get || !!ctx._forms.get.find(_ => _.id === form.uid)}
                >
                  {m.add}
                </IpBtn>
              ),
            },
          ]}
        />
      </PanelBody>
    </Panel>
  )
}
