import {Ip} from 'infoportal-api-sdk'
import {Icon} from '@mui/material'
import {AppAvatar, Core, Datatable} from '@/shared'
import {useI18n} from '@/core/i18n/index.js'
import {UseQueryFormActionReport} from '@/core/query/useQueryFormActionReport.js'
import {Code} from '@/features/Form/Action/FormActionLogs.js'

export const FormActionReports = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
  const {m, formatDateTime, formatDuration, formatLargeNumber} = useI18n()
  const queryReports = UseQueryFormActionReport.getByFormId({workspaceId, formId})

  return (
    <Datatable.Component
      getRowKey={_ => _.id}
      data={queryReports.data}
      loading={queryReports.isLoading}
      header={
        <Core.PanelTitle>
          {m._formAction.executionsHistory} ({queryReports.data?.length ?? '...'})
        </Core.PanelTitle>
      }
      id={`logs:${formId}`}
      columns={[
        {
          type: 'select_one',
          head: '',
          id: 'error',
          width: 60,
          align: 'center',
          render: _ => {
            const value = _.failed ? 'error' : 'success'
            return {
              label: <Icon color={value} children={value === 'success' ? 'check_circle' : 'error'} />,
              value,
            }
          },
        },
        {
          head: m.start,
          type: 'date',
          id: 'date',
          width: '1.5fr',
          align: 'right',
          render: _ => {
            const formated = formatDateTime(_.startedAt)
            return {
              value: _.startedAt,
              tooltip: formated,
              label: (
                <>
                  {formated}
                  <Icon fontSize="small" color="action" children="schedule" sx={{ml: 1}} />
                </>
              ),
            }
          },
        },
        {
          head: m.duration,
          id: 'duration',
          align: 'right',
          type: 'string',
          render: _ => {
            const duration = _.endedAt ? formatDuration({start: _.startedAt, end: _.endedAt}) : undefined
            return {
              tooltip: duration,
              value: duration,
              label: duration && (
                <>
                  {duration}
                  <Icon fontSize="small" color="action" children="today" sx={{ml: 1}} />
                </>
              ),
            }
          },
        },
        {
          head: m.createdBy,
          type: 'select_one',
          id: 'startedBy',
          width: '2fr',
          render: _ => {
            return {
              value: _.startedBy,
              label: (
                <>
                  <AppAvatar size={26} email={_.startedBy} sx={{mr: 0.5}} />
                  {_.startedBy}
                </>
              ),
            }
          },
        },
        {
          head: m._formAction.executedActions,
          type: 'number',
          id: 'action',
          render: _ => {
            return {
              value: _.actionExecuted,
              label: (
                <Core.Txt bold color={_.actionExecuted !== _.totalActions ? 'error' : undefined}>
                  {_.actionExecuted} / {_.totalActions}
                </Core.Txt>
              ),
            }
          },
        },
        {
          head: m.error,
          type: 'select_one',
          width: '1fr',
          id: 'title',
          render: _ => {
            return {
              value: _.failed,
              label: (
                <>
                  <Code>{_.failed}</Code>
                </>
              ),
            }
          },
        },
        {
          head: m.submissions,
          type: 'number',
          id: 'submissions',
          render: _ => {
            return {
              value: _.submissionsExecuted,
              label: formatLargeNumber(_.submissionsExecuted),
            }
          },
        },
      ]}
    />
  )
}
