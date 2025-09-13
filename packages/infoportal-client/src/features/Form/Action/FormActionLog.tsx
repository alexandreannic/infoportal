import {UseQueryFormActionLog} from '@/core/query/useQueryFormActionLog.js'
import {Ip} from 'infoportal-api-sdk'
import {Box, Icon, styled} from '@mui/material'
import {Core, Datatable} from '@/shared'
import {useI18n} from '@/core/i18n/index.js'
import {UseQueryFromAction} from '@/core/query/useQueryFromAction.js'
import {useMemo} from 'react'
import {seq} from '@axanc/ts-utils'

const Code = styled('div')(({theme: t}) => ({
  color: t.vars.palette.text.secondary,
  fontFamily: 'monospace',
}))

export const FormActionLog = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
  const {m, formatDateTime} = useI18n()
  const queryLog = UseQueryFormActionLog.search({workspaceId, formId})
  const queryActionGet = UseQueryFromAction.getByDbId(workspaceId, formId)
  const actionAsMap = useMemo(() => {
    if (!queryActionGet.data) return
    return seq(queryActionGet.data).groupByFirst(_ => _.id)
  }, [queryActionGet.data])
  return (
    <Box>
      {queryLog.error ? (
        <Core.Alert
          severity="error"
          title={m.anErrorOccurred}
          action={<Core.Btn loading={queryLog.isRefetching} onClick={() => queryLog.refetch()} children={m.retry} />}
        />
      ) : (
        <Datatable.Component
          header={<Core.PanelTitle>{m.logs}</Core.PanelTitle>}
          id={`logs:${formId}`}
          columns={[
            {
              type: 'select_one',
              head: '',
              id: 'error',
              width: 52,
              align: 'center',
              render: _ => {
                return {
                  label:
                    _.type === 'error' ? (
                      <Icon color={_.type} fontSize="small" children={_.type} />
                    ) : (
                      <Icon color="info" fontSize="small" children="info" />
                    ),
                  value: _.type,
                }
              },
            },
            {
              head: m.date,
              type: 'date',
              id: 'date',
              width: 160,
              render: _ => {
                return {
                  value: _.createdAt,
                  label: formatDateTime(_.createdAt),
                }
              },
            },
            {
              head: m.action,
              type: 'select_one',
              id: 'actionId',
              width: 180,
              render: _ => {
                const name = actionAsMap?.[_.actionId]?.name
                return {
                  label: <Core.Txt bold>{name}</Core.Txt>,
                  value: name,
                }
              },
            },
            {
              head: m.submissionId,
              type: 'id',
              className: 'td-id',
              id: 'submissionId',
              width: 80,
              renderQuick: _ => _.submission?.id,
            },
            {
              head: m.title,
              type: 'select_one',
              id: 'title',
              render: _ => {
                return {
                  value: _.title,
                  label: <Code>{_.title}</Code>,
                }
              },
            },
            {
              width: '2fr',
              head: m.details,
              type: 'string',
              id: 'details',
              render: _ => {
                return {
                  value: _.details,
                  label: <Code>{_.details}</Code>,
                }
              },
            },
          ]}
          getRowKey={_ => _.id}
          data={queryLog.data?.data}
          loading={queryLog.isLoading || queryActionGet.isLoading}
        />
      )}
    </Box>
  )
}
