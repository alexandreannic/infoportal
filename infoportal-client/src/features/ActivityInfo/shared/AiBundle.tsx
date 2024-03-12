import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {ActiviftyInfoRecords} from '@/core/sdk/server/activity-info/ActiviftyInfoType'
import {Datatable} from '@/shared/Datatable/Datatable'
import React, {useEffect, useMemo, useState} from 'react'
import {UseFetcher} from '@/shared/hook/useFetcher'
import {map, Obj} from '@alexandreannic/ts-utils'
import {AiPreviewActivity, AiPreviewRequest, AiSendBtn, AiViewAnswers} from '@/features/ActivityInfo/shared/ActivityInfoActions'
import {useAsync} from '@/shared/hook/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Box} from '@mui/material'
import {IpInput} from '@/shared/Input/Input'
import {IpBtn} from '@/shared/Btn'
import {useI18n} from '@/core/i18n'
import {format, subMonths} from 'date-fns'


export interface AiBundle<
  TActivity = any,
  TSubActivity extends any = undefined,
  TAnswer extends Record<string, any> = any
> {
  submit?: boolean
  recordId: string
  data: KoboAnswer<TAnswer>[],
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
  id,
}: {
  id: string
  fetcher: UseFetcher<(period: string) => Promise<AiBundle<any, any, any>[]>>
}) => {
  const {api, conf} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const {m} = useI18n()

  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))

  useEffect(() => {
    fetcher.fetch({clean: false}, period)
  }, [period])

  const maybeFirst = useMemo(() => {
    return fetcher.get?.[0]
  }, [fetcher])

  const _submit = useAsync((id: string, p: any) => api.activityInfo.submitActivity(p), {
    requestKey: ([i]) => i
  })

  return (
    <>
      <Datatable
        showExportBtn
        id={`datatable-ai-${id}`}
        loading={fetcher.loading}
        data={fetcher.get}
        header={
          <Box sx={{display: 'flex', alignItems: 'center', flex: 1,}}>
            <IpInput
              helperText={null}
              sx={{width: 200}}
              type="month"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            />
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
                  <AiSendBtn
                    disabled={!_.submit}
                    onClick={() => {
                      _submit.call(_.recordId, [_.requestBody]).catch(toastHttpError)
                    }}
                  />
                  <AiViewAnswers answers={_.data}/>
                  <AiPreviewActivity activity={{..._.activity, ..._.subActivity}}/>
                  <AiPreviewRequest request={_.requestBody}/>
                </>
              )
            }
          },
          {
            id: 'id',
            type: 'select_one',
            head: 'Record ID',
            renderQuick: _ => _.recordId
          },
          ...map(maybeFirst, first => [
            ...Object.keys(first.activity).map(colId => ({
              head: colId,
              id: colId,
              // type: 'select_one',
              // type: 'string',
              type: typeof first.activity[colId] === 'number' ? 'number' : 'select_one' as any,
              renderQuick: (_: any) => _.activity[colId] as any,
            })),
            ...Obj.keys(first.subActivity ?? {}).map(colId => ({
              head: colId,
              id: colId,
              // type: 'string',
              type: typeof first.activity[colId] === 'number' ? 'number' : 'select_one' as any,
              renderQuick: (_: any) => _.subActivity[colId] as any,
            }))]) ?? []
        ]}
      />
    </>
  )
}