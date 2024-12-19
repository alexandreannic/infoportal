import {ActiviftyInfoRecords} from '@/core/sdk/server/activity-info/ActiviftyInfoType'
import {Datatable} from '@/shared/Datatable/Datatable'
import React, {ReactNode, useEffect, useMemo, useState} from 'react'
import {UseFetcher} from '@/shared/hook/useFetcher'
import {seq} from '@alexandreannic/ts-utils'
import {AiPreviewActivity, AiPreviewRequest, AiSendBtn, AiViewAnswers} from '@/features/ActivityInfo/shared/ActivityInfoActions'
import {useAsync} from '@/shared/hook/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Badge, Box, useTheme} from '@mui/material'
import {IpBtn} from '@/shared/Btn'
import {useI18n} from '@/core/i18n'
import {endOfMonth, startOfMonth, subMonths} from 'date-fns'
import {KoboSubmissionFlat, KoboIndex} from 'infoportal-common'
import {useSession} from '@/core/Session/SessionContext'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {DatatableHeadIconByType} from '@/shared/Datatable/DatatableHead'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {Period} from 'infoportal-common'

export interface AiTable<
  TActivity = any,
  TSubActivity extends any = undefined,
  TAnswer extends Record<string, any> = any
> {
  submit?: boolean
  recordId: string
  data: KoboSubmissionFlat<TAnswer>[],
  activity: TActivity,
  subActivity?: TSubActivity,
  requestBody: ActiviftyInfoRecords,
}

export const aiInvalidValueFlag = '⚠️'
export const checkAiValid = (...args: (string | undefined)[]) => {
  return !args.find(_ => _ === undefined || _.includes(aiInvalidValueFlag))
}

export const AiBundleTable = ({
  fetcher,
  header,
  id,
}: {
  header?: ReactNode
  id: string
  fetcher: UseFetcher<(period: Partial<Period>) => Promise<AiTable<any, any, any>[]>>
}) => {
  const {api, conf} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const {session} = useSession()
  const {m} = useI18n()
  const t = useTheme()

  const [period, setPeriod] = useState<Partial<Period>>({start: subMonths(startOfMonth(new Date()), 1), end: subMonths(endOfMonth(new Date()), 1)})

  useEffect(() => {
    fetcher.fetch({clean: false}, period)
  }, [period])

  const {
    activityCols,
    subActivityCols,
  } = useMemo(() => {
    return {
      activityCols: seq(fetcher.get ?? [])
        .flatMap(row => Object.keys(row.activity ?? {}))
        .distinct(_ => _)
        .map(key => ({key, type: fetcher.get?.some(_ => typeof _.activity[key] === 'number') ? 'number' : 'select_one'})),
      subActivityCols: seq(fetcher.get ?? [])
        .flatMap(row => Object.keys(row.subActivity ?? {}))
        .distinct(_ => _)
        .map(key => ({key, type: fetcher.get?.some(_ => typeof _.subActivity[key] === 'number') ? 'number' : 'select_one'})),
    }
  }, [fetcher.get])

  const _submit = useAsync((id: string, p: any) => api.activityInfo.submitActivity(p), {
    requestKey: ([i]) => i
  })

  return (
    <>
      <Datatable
        defaultLimit={100}
        showExportBtn
        id={`datatable-ai-${id}`}
        loading={fetcher.loading}
        data={fetcher.get}
        header={
          <Box sx={{display: 'flex', alignItems: 'center', flex: 1,}}>
            <PeriodPicker
              defaultValue={[period.start, period.end]}
              onChange={([start, end]) => setPeriod({start, end})}
              max={endOfMonth(new Date())}
            />
            {header}
            <IpBtn icon="send" variant="contained" sx={{ml: 'auto'}} onClick={() => {
              if (!fetcher.get) return
              _submit.call('all', fetcher.get.filter(_ => _.submit).map(_ => _.requestBody)).catch(toastHttpError)
            }}>
              {m.submitAll}
            </IpBtn>
          </Box>
        }
        columns={[
          {
            width: 120,
            id: 'actions',
            noCsvExport: true,
            renderQuick: _ => {
              return (
                <>
                  {session.admin && (
                    <>
                      <AiSendBtn
                        disabled={!_.submit || JSON.stringify(_.requestBody).includes('undefined')}
                        onClick={() => {
                          _submit.call(_.recordId, [_.requestBody]).catch(toastHttpError)
                        }}
                      />
                      <AiPreviewActivity activity={{..._.activity, ..._.subActivity}}/>
                      <Badge variant="dot" color="primary" overlap="circular" badgeContent="!" invisible={!JSON.stringify(_.requestBody).includes('undefined')}>
                        <AiPreviewRequest request={_.requestBody}/>
                      </Badge>
                    </>
                  )}
                  <AiViewAnswers answers={_.data.map(_ => {
                    const copy = {..._}
                    copy.formId = KoboIndex.searchById(copy.formId)?.translation ?? copy.formId
                    delete copy.referencedFormId
                    delete copy.id
                    delete copy.uuid
                    return copy
                  })}/>
                </>
              )
            }
          },
          {
            id: 'form',
            head: m.kobo,
            width: 220,
            type: 'select_multiple',
            options: () => {
              return DatatableUtils.buildOptions(seq(fetcher.get).flatMap(_ => _.data).map(_ => KoboIndex.searchById(_.formId)?.translation ?? _.formId).distinct(_ => _).compact())
            },
            render: _ => {
              const formIds = seq(_.data).map(_ => KoboIndex.searchById(_.formId)?.translation ?? _.formId).distinct(_ => _).compact()
              return {
                value: formIds,
                label: formIds.join(', '),
              }
            },
          },
          {
            id: 'submissions',
            head: m.submissions,
            type: 'number',
            renderQuick: _ => _.data.length,
          },
          {
            id: 'koboId',
            type: 'string',
            head: m.koboId,
            typeIcon: <DatatableHeadIconByType type="id"/>,
            className: 'td-id',
            renderQuick: _ => _.data.map(_ => _.koboId).join(' '),
            // options: () => DatatableUtils.buildOptions(fetcher.get?.flatMap(_ => _.data.map(_ => _.koboId)) ?? []),
            // render: _ => {
            //   // console.log(_)
            //   const ids = _.data.map(_ => _.koboId)
            //   return {
            //     label: ids.join(' '),
            //     value: ids,
            //   }
            // }
          },
          {
            id: 'id',
            type: 'select_one',
            head: 'Record ID',
            style: () => ({borderRight: '3px solid ' + t.palette.divider}),
            styleHead: {borderRight: '3px solid ' + t.palette.divider},
            renderQuick: _ => _.recordId
          },
          // @ts-ignore enforce `col.type` type
          ...activityCols.map(col => {
            return {
              head: col.key,
              id: col.key,
              // type: 'select_one',
              // type: 'string',
              type: col.type,
              renderQuick: (_: any) => _.activity[col.key] as any,
            }
          }),
          // @ts-ignore enforce `col.type` type
          ...subActivityCols.map(col => {
            return {
              head: col.key,
              id: col.key,
              // type: 'select_one',
              // type: 'string',
              type: col.type,
              renderQuick: (_: any) => _.subActivity[col.key] as any,
            }
          }),
        ]}
      />
    </>
  )
}