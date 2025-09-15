import {UseQueryFormActionLog} from '@/core/query/useQueryFormActionLog.js'
import {Ip} from 'infoportal-api-sdk'
import {Box, Icon, styled, useTheme} from '@mui/material'
import {Core, Datatable} from '@/shared'
import {useI18n} from '@/core/i18n/index.js'
import {UseQueryFromAction} from '@/core/query/useQueryFromAction.js'
import {useMemo} from 'react'
import {seq} from '@axanc/ts-utils'
import {PopoverWrapper} from '@infoportal/client-core'

const Code = styled(Box)(({theme: t}) => ({
  color: t.vars.palette.text.secondary,
  fontFamily: 'monospace',
}))

export const FormActionLog = ({
  workspaceId,
  formId,
  actionId,
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  actionId?: Ip.Form.ActionId
}) => {
  const {m, formatDateTime} = useI18n()
  const t = useTheme()
  const queryLog = UseQueryFormActionLog.search({workspaceId, formId})
  const queryActionGet = UseQueryFromAction.getByDbId(workspaceId, formId)

  const logs = useMemo(() => {
    if (!actionId) return queryLog.data?.data
    return queryLog.data?.data.filter(_ => _.actionId === actionId)
  }, [actionId, queryLog.data])

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
          getRowKey={_ => _.id}
          data={logs}
          loading={queryLog.isLoading || queryActionGet.isLoading}
          header={actionId ? null : <Core.PanelTitle>{m.logs}</Core.PanelTitle>}
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
            ...(actionId
              ? []
              : [
                  {
                    head: m.action,
                    type: 'select_one',
                    id: 'actionId',
                    width: 180,
                    render: (_: Ip.Form.Action.Log) => {
                      const name = actionAsMap?.[_.actionId]?.name
                      return {
                        label: <Core.Txt sx={{fontWeight: '700'}}>{name}</Core.Txt>,
                        value: name,
                      }
                    },
                  } as const,
                ]),
            {
              head: m.submissionId,
              type: 'id',
              className: 'td-id',
              id: 'submissionId',
              width: 80,
              renderQuick: _ => _.submission?.id,
            },
            {
              head: m.type,
              type: 'select_one',
              width: '1fr',
              id: 'title',
              render: _ => {
                return {
                  value: _.title,
                  label: <Code>{_.title}</Code>,
                }
              },
            },
            // {
            //   width: 40,
            //   align: 'center',
            //   head: '',
            //   type: 'string',
            //   id: 'details',
            //   render: _ => {
            //     return {
            //       value: _.details,
            //       label: (
            //         <PopoverWrapper
            //           content={() => {
            //             return (
            //               <Box sx={{p: 1}}>
            //                 <Code sx={{color: t.vars.palette.text.primary, fontWeight: '700'}}>{_.title}</Code>
            //                 <Code>{_.details}</Code>
            //               </Box>
            //             )
            //           }}
            //         >
            //           <Core.IconBtn size="small" children="open_in_new" />
            //         </PopoverWrapper>
            //       ),
            //     }
            //   },
            // },
            {
              head: m.details,
              width: '2fr',
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
        />
      )}
    </Box>
  )
}
