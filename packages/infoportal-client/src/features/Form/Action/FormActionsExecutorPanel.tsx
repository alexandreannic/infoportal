import {map} from '@axanc/ts-utils'
import {Box, BoxProps, CircularProgress, Icon, useTheme} from '@mui/material'
import {Core} from '@/shared'
import {useI18n} from '@/core/i18n/index.js'
import {useIpToast} from '@/core/useToast.js'
import {UseQueryFormActionReport} from '@/core/query/useQueryFormActionReport.js'
import {UseQueryFromAction} from '@/core/query/useQueryFromAction.js'
import {Ip} from 'infoportal-api-sdk'
import {useNow} from '@/shared/useNow.js'

export const FormActionsExecutorPanel = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
  const {m, formatLargeNumber, formatDuration} = useI18n()
  const t = useTheme()
  const {toastSuccess} = useIpToast()
  const now = useNow()

  const queryLiveReport = UseQueryFormActionReport.getLive({workspaceId, formId})
  const queryRunAllActionByForm = UseQueryFromAction.runAllActionByForm(workspaceId, formId)

  return (
    <Core.Panel sx={{mb: 0, px: 1, display: 'flex', alignItems: 'center', gridRow: 1, gridColumn: '1 / 3'}}>
      <Core.Modal
        title={m._formAction.reRunOnAllData}
        loading={queryRunAllActionByForm.isPending}
        content={<div dangerouslySetInnerHTML={{__html: m._formAction.reRunOnAllDataDetails}} />}
        onConfirm={(e, close) => {
          queryRunAllActionByForm.mutateAsync()
          toastSuccess(m._formAction.syncStarted)
          close()
        }}
      >
        <Core.Btn disabled={!!queryLiveReport.data} icon="refresh" variant="contained">
          {m._formAction.reRunOnAllData}
        </Core.Btn>
      </Core.Modal>
      {map(queryLiveReport.data, report => (
        <Box sx={{ml: 2, display: 'flex', alignItems: 'center'}}>
          <CircularProgress size={24} color="warning" sx={{mr: 1}} hidden={!queryLiveReport.data} />
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Core.Txt sx={{color: t.vars.palette.warning.main, mr: 2}} bold>
              {m.runningEllipsis}
            </Core.Txt>
            <Core.Txt block color="hint" sx={{minWidth: 200}}>
              {formatDuration({start: report.startedAt, end: now})}
            </Core.Txt>
            <Box>
              <Title>Actions</Title> <Core.Txt bold>{report.actionExecuted}</Core.Txt> / {report.totalActions}
            </Box>
            <Icon sx={{mx: 1.5}} fontSize="inherit" children="horizontal_rule" />
            <Box>
              <Title>Submissions</Title> <Core.Txt bold>{formatLargeNumber(report.submissionsExecuted)}</Core.Txt>
            </Box>
          </Box>
        </Box>
      ))}
    </Core.Panel>
  )
}

function Title({sx, children, ...props}: BoxProps) {
  const t = useTheme()
  return (
    <Box component="span" {...props} sx={{...sx, textTransform: 'uppercase', color: t.vars.palette.text.secondary}}>
      {children}:
    </Box>
  )
}
