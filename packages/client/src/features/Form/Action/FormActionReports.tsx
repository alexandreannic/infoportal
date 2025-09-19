import {Ip} from 'infoportal-api-sdk'
import {CircularProgress, Icon, useTheme} from '@mui/material'
import {AppAvatar, Core, Datatable} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {UseQueryFormActionReport} from '@/core/query/useQueryFormActionReport.js'
import {Code} from '@/features/Form/Action/FormActionLogs.js'
import {useNow} from '@/shared/useNow.js'
import {FormActionRunBtn} from '@/features/Form/Action/FormActionRunBtn.js'
import {useMemo} from 'react'
import {fnSwitch} from '@axanc/ts-utils'
import {createRoute} from '@tanstack/react-router'
import {formActionsRoute} from '@/features/Form/Action/FormActions.js'

export const formActionReportsRoute = createRoute({
  getParentRoute: () => formActionsRoute,
  path: 'report',
  component: FormActionReports,
})

type Report = Ip.Form.Action.Report & {
  running?: boolean
}

export function FormActionReports() {
  const params = formActionReportsRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const formId = params.formId as Ip.FormId

  const {m, formatDateTime, formatDuration, formatLargeNumber} = useI18n()
  const t = useTheme()

  const queryReports = UseQueryFormActionReport.getByFormId({workspaceId, formId})
  const queryLiveReport = UseQueryFormActionReport.getRunning({workspaceId, formId})

  const data: Report[] | undefined = useMemo(() => {
    if (!queryLiveReport.data) return queryReports.data
    return [{...queryLiveReport.data, running: true}, ...(queryReports.data ?? [])]
  }, [queryReports.data, queryLiveReport.data?.actionExecuted, queryLiveReport.data?.submissionsExecuted])

  return (
    <Core.Animate>
      <Core.Panel sx={{height: '100%'}}>
        <Datatable.Component
          getRowKey={_ => _.id}
          data={data ?? []}
          loading={queryReports.isLoading}
          rowStyle={_ => (_.running ? {background: Core.alphaVar(t.vars.palette.warning.light, 0.5)} : {})}
          header={
            <>
              <Core.PanelTitle>
                {m._formAction.executionsHistory} ({data?.length ?? '...'})
              </Core.PanelTitle>
              <FormActionRunBtn
                workspaceId={workspaceId}
                formId={formId}
                disabled={!!queryLiveReport.data}
                sx={{marginLeft: 'auto'}}
              />
            </>
          }
          id={`reports:${formId}`}
          columns={[
            {
              type: 'select_one',
              head: '',
              id: 'error',
              width: 60,
              align: 'center',
              render: _ => {
                const value = _.failed ? 'error' : _.running ? 'running' : 'success'
                return {
                  label: fnSwitch(value, {
                    error: <Icon color="error" children="error" />,
                    success: <Icon color="success" children="check_circle" />,
                    running: <CircularProgress size={24} color="warning" />,
                  }),
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
              width: '1.5fr',
              type: 'string',
              render: _ => {
                const duration = _.endedAt ? formatDuration({start: _.startedAt, end: _.endedAt}) : undefined
                return {
                  tooltip: duration,
                  value: duration,
                  label: duration && (
                    <>
                      {_.running ? <Duration start={_.startedAt} /> : duration}
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
      </Core.Panel>
    </Core.Animate>
  )
}

function Duration({start}: {start: Date}) {
  const {formatDuration} = useI18n()
  const now = useNow()
  return formatDuration({start, end: now})
}
