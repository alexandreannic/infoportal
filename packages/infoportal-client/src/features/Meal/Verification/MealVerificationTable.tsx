import {useAppSettings} from '@/core/context/ConfigContext'
import {fnSwitch, map, seq} from '@alexandreannic/ts-utils'
import React, {useEffect, useMemo, useState} from 'react'
import {Page, PageTitle} from '@/shared/Page'
import {alpha, Box, Icon, Tooltip, useTheme} from '@mui/material'
import {capitalize, KoboAnswerFlat, KoboIndex, KoboSchemaHelper, toPercent} from 'infoportal-common'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {DatabaseKoboAnswerViewDialog} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {TableIcon, TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {useParams} from 'react-router'
import * as yup from 'yup'
import {MealVerificationAnsers, MealVerificationAnswersStatus, MealVerificationStatus} from '@/core/sdk/server/mealVerification/MealVerification'
import {mealVerificationActivities, MealVerificationActivity, mealVerificationConf} from '@/features/Meal/Verification/mealVerificationConfig'
import {useAsync} from '@/shared/hook/useAsync'
import {getColumnByQuestionSchema} from '@/features/Database/KoboTable/columns/getColumnBySchema'
import {useMealVerificationContext} from '@/features/Meal/Verification/MealVerificationContext'
import {MealVerificationLinkToForm} from '@/features/Meal/Verification/MealVerificationList'
import {useFetcher} from '@/shared/hook/useFetcher'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {DatatableSkeleton} from '@/shared/Datatable/DatatableSkeleton'
import {Datatable} from '@/shared/Datatable/Datatable'
import {IpAlert} from '@/shared/Alert'
import {KoboFormNameMapped} from '@/core/sdk/server/kobo/KoboTypedAnswerSdk'
import {useToast} from '@/shared/Toast'
import {KoboApiQuestionSchema} from 'infoportal-common/kobo'
import {NonNullableKey} from 'infoportal-common/type/Generic'

export enum MergedDataStatus {
  Selected = 'Selected',
  Completed = 'Completed',
  NotSelected = 'NotSelected'
}

interface MergedData {
  status: MergedDataStatus
  dataCheck?: KoboAnswerFlat<any>
  data: KoboAnswerFlat<any>
  score: number
}

const paramSchema = yup.object({id: yup.string().required()})

export const MealVerificationTable = () => {
  const {m} = useI18n()
  const t = useTheme()
  const {id} = paramSchema.validateSync(useParams())
  const {api, conf} = useAppSettings()
  const ctx = useMealVerificationContext()
  const ctxSchema = useKoboSchemaContext()
  const fetcherVerificationAnswers = useFetcher(api.mealVerification.getAnswers)
  const {dateFromNow} = useI18n()
  const {toastError} = useToast()

  useEffect(() => {
    ctx.fetcherVerifications.fetch({force: true})
  }, [id])

  const {mealVerification, activity, formName} = useMemo(() => {
    if (!ctx.fetcherVerifications.get) return {}
    const mealVerification = ctx.fetcherVerifications.get.find(_ => _.id === id)
    const activity = mealVerificationActivities.find(_ => _.id === mealVerification?.activity)
    if (!activity) {
      toastError(`No activity ${mealVerification?.name}.`)
    }
    const formInfo = activity ? KoboIndex.searchById(activity.registration.koboFormId) : undefined
    if (!formInfo) {
      toastError(`No form coded for id ${activity?.registration.koboFormId}.`)
    }
    return {
      mealVerification,
      activity,
      formName: formInfo?.name,
    }
  }, [id, ctx.fetcherVerifications.get])

  useEffect(() => {
    if (mealVerification && activity && formName) {
      ctxSchema.fetchByName(formName)
      fetcherVerificationAnswers.fetch({force: false, clean: false}, mealVerification.id)
    }
  }, [id, mealVerification, activity])

  return (
    <Page width="full">
      {formName && ctxSchema.byName[formName].get && fetcherVerificationAnswers.get && activity && mealVerification ? (
        <>
          <PageTitle
            action={
              <>
                <IpSelectSingle
                  label={m.status}
                  sx={{minWidth: 140}}
                  disabled={!ctx.access.admin}
                  value={mealVerification.status}
                  options={[
                    {
                      children: <>
                        <Icon sx={{verticalAlign: 'middle', mr: .5, color: t.palette.success.main}} title={m.Approved}>check_circle</Icon>
                        {m.Approved}
                      </>, value: MealVerificationStatus.Approved
                    },
                    {
                      children: <>
                        <Icon sx={{verticalAlign: 'middle', mr: .5, color: t.palette.error.main}} title={m.Rejected}>error</Icon>
                        {m.Rejected}
                      </>, value: MealVerificationStatus.Rejected
                    },
                    {
                      children: <>
                        <Icon sx={{verticalAlign: 'middle', mr: .5, color: t.palette.warning.main}} title={m.Pending}>schedule</Icon>
                        {m.Pending}
                      </>, value: MealVerificationStatus.Pending
                    },
                  ]}
                  onChange={(e) => {
                    ctx.asyncUpdate.call(mealVerification.id, e ?? undefined)
                  }}
                />
              </>
            }
            subTitle={
              <Box>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <MealVerificationLinkToForm koboFormId={activity.registration.koboFormId} sx={{mr: 2}}/>
                  <MealVerificationLinkToForm koboFormId={activity.verification.koboFormId}/>
                </Box>
                {capitalize(dateFromNow(mealVerification.createdAt))} by <b>{mealVerification.createdBy}</b>
                <Box>{mealVerification.desc}</Box>
              </Box>
            }
          >
            {mealVerification.activity} {'>'} {mealVerification.name}
          </PageTitle>
          <MealVerificationTableContent
            schema={ctxSchema.byName[formName].get!}
            activity={activity}
            verificationAnswers={fetcherVerificationAnswers.get}
            verificationAnswersRefresh={() => fetcherVerificationAnswers.fetch({force: true, clean: false}, mealVerification.id)}
          />
        </>
      ) : (
        <DatatableSkeleton/>
      )}
    </Page>
  )
}

const MealVerificationTableContent = <
  TData extends KoboFormNameMapped = any,
  TCheck extends KoboFormNameMapped = any,
>({
  schema,
  activity,
  verificationAnswers,
  verificationAnswersRefresh,
}: {
  schema: KoboSchemaHelper.Bundle
  activity: MealVerificationActivity<TData, TCheck>
  verificationAnswers: MealVerificationAnsers[]
  verificationAnswersRefresh: () => Promise<any>
}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const t = useTheme()
  const {langIndex, setLangIndex} = useKoboSchemaContext()
  const ctx = useMealVerificationContext()

  const indexVerification = useMemo(() => seq(verificationAnswers).groupByFirst(_ => _.koboAnswerId), [verificationAnswers])

  const reqDataOrigin = () => api.kobo.typedAnswers.searchByAccess[activity.registration.fetch]({}).then(_ => _.data as unknown as KoboAnswerFlat[])
  const reqDataVerified = () => api.kobo.typedAnswers.searchByAccess[activity.verification.fetch]({}).then(_ => _.data as unknown as KoboAnswerFlat[])
  const fetcherDataOrigin = useFetcher(reqDataOrigin)
  const fetcherDataVerified = useFetcher(reqDataVerified)
  const asyncUpdateAnswer = useAsync(api.mealVerification.updateAnswers, {requestKey: _ => _[0]})

  const [openModalAnswer, setOpenModalAnswer] = useState<KoboAnswerFlat<any> | undefined>()
  const [display, setDisplay] = useState<'data' | 'dataCheck' | 'all'>('all')

  useEffect(() => {
    fetcherDataVerified.fetch()
    fetcherDataOrigin.fetch()
  }, [])

  const areEquals = (c: string, _: Pick<MergedData, 'data' | 'dataCheck'>) => {
    if (!_.dataCheck) return true
    if (_.dataCheck[c] === undefined && _.data?.[c] === undefined) return true
    switch (schema.schemaHelper.questionIndex[c].type) {
      case 'select_multiple':
        const checkArr = [_.dataCheck[c]].flat() as string[]
        const dataArr = [_.data?.[c]].flat() as string[]
        if (_.dataCheck[c] === undefined || _.data?.[c] === undefined) return _.dataCheck[c] === _.data?.[c]
        return checkArr.every(c => (dataArr.find(d => c === d)))
      case 'decimal':
      case 'integer':
        return Math.abs(_.dataCheck[c] - _.data?.[c]) <= _.data?.[c] * mealVerificationConf.numericToleranceMargin
      case 'text':
        return _.dataCheck[c]?.trim() === _.data?.[c]?.trim()
      default:
        return _.dataCheck[c] === _.data?.[c]
    }
  }

  const {mergedData, duplicateErrors} = useMemo(() => {
    const duplicateErrors = new Set<string>()
    const newMergedData = map(fetcherDataOrigin.get, fetcherDataVerified.get, (origin, verified) => {
      const indexDataVerified: Record<any, KoboAnswerFlat[]> = seq(verified).groupBy(_ => _[activity.verification.joinColumn] ?? '')
      return seq(origin)
        .filter(_ => indexVerification[_.id])
        .flatMap((_: any) => {
          const dataVerified = indexDataVerified[_[activity.registration.joinColumn]]
          if (dataVerified && dataVerified.length > 1 && !duplicateErrors.has(_[activity.registration.joinColumn])) {
            duplicateErrors.add(_[activity.registration.joinColumn])
          }
          if (dataVerified)
            return dataVerified.map(dv => {
              const mergedData: Omit<MergedData, 'score'> = {
                data: _,
                dataCheck: dv,
                status: (() => {
                  if (!!dataVerified) return MergedDataStatus.Completed
                  if (indexVerification[_.id]?.status === MealVerificationAnswersStatus.Selected) return MergedDataStatus.Selected
                  return MergedDataStatus.NotSelected
                })(),
              }
              const res: MergedData = {
                ...mergedData,
                score: seq(activity.verifiedColumns).sum(c => areEquals(c, mergedData) ? 1 : 0),
              }
              return res
            })
          return {
            data: _,
            dataCheck: undefined,
            score: 0,
            status: (() => {
              if (indexVerification[_.id]?.status === MealVerificationAnswersStatus.Selected) return MergedDataStatus.Selected
              return MergedDataStatus.NotSelected
            })()
          }
        }).sortByNumber(_ => fnSwitch(_.status, {
          [MergedDataStatus.Completed]: 1,
          [MergedDataStatus.NotSelected]: 2,
          [MergedDataStatus.Selected]: 0,
        }))
    })
    return {mergedData: newMergedData, duplicateErrors}
  }, [
    fetcherDataVerified.get,
    fetcherDataOrigin.get,
    indexVerification,
    activity
  ])

  const stats = useMemo(() => {
    if (!mergedData) return
    const verifiedRows = mergedData.filter(_ => _.status === MergedDataStatus.Completed)
    const selectedRows = mergedData?.filter(_ => _.status !== MergedDataStatus.NotSelected)
    return {
      selectedRows,
      verifiedRows,
      globalScore: verifiedRows.sum(_ => _.score ?? 0),
      indicatorsCount: selectedRows.length * activity.verifiedColumns.length,
    }
  }, [mergedData])

  const unselectedAnswers = useMemo(
    () => verificationAnswers.filter(_ => _.status !== MealVerificationAnswersStatus.Selected).sort(() => Math.random() - .5),
    [verificationAnswers]
  )

  return (
    <>
      {duplicateErrors.size > 0 && (
        <Box sx={{mb: 2}}>
          <IpAlert severity="error">{m._mealVerif.duplicateErrors(Array.from(duplicateErrors))}</IpAlert>
        </Box>
      )}
      {stats && (
        <Div sx={{mb: 2, alignItems: 'stretch'}}>
          <SlidePanel sx={{flex: 1}}>
            <ChartPieWidget
              value={stats.selectedRows.length ?? 0}
              base={verificationAnswers.length}
              title={m._mealVerif.sampleSize}
              dense showBase showValue
            />
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <ChartPieWidget dense showValue value={stats?.verifiedRows.length ?? 0} base={stats.selectedRows?.length ?? 1} title={m._mealVerif.verified}/>
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <ChartPieWidget dense showValue showBase value={stats?.globalScore ?? 0} base={stats?.indicatorsCount ?? 1} title={m._mealVerif.valid}/>
          </SlidePanel>
          <SlideWidget title={m._mealVerif.numericToleranceMargin} sx={{flex: 1}} icon="expand">
            {toPercent(mealVerificationConf.numericToleranceMargin)}
          </SlideWidget>
        </Div>
      )}
      <Panel>
        <Datatable
          showExportBtn
          id="meal-verif-ecrec"
          loading={fetcherDataVerified.loading || fetcherDataOrigin.loading}
          data={mergedData}
          header={
            <>
              <IpSelectSingle<number>
                hideNullOption
                sx={{maxWidth: 128, mr: 1}}
                value={langIndex}
                onChange={setLangIndex}
                options={[
                  {children: 'XML', value: -1},
                  ...schema.schemaHelper.sanitizedSchema.content.translations.map((_, i) => ({children: _, value: i}))
                ]}
              />
              <ScRadioGroup inline dense value={display} onChange={setDisplay} sx={{mr: 1}}>
                <ScRadioGroupItem hideRadio value="all" title={
                  <Tooltip title={m._mealVerif.showBoth}>
                    <Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_full</Icon>
                  </Tooltip>
                }/>
                <ScRadioGroupItem hideRadio value="data" title={
                  <Tooltip title={m._mealVerif.activityForm}>
                    <Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_bottom</Icon>
                  </Tooltip>
                }/>
                <ScRadioGroupItem hideRadio value="dataCheck" title={
                  <Tooltip title={m._mealVerif.verificationForm}>
                    <Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_top</Icon>
                  </Tooltip>
                }/>
              </ScRadioGroup>
            </>
          }
          columns={[
            {
              id: 'actions',
              width: 124,
              renderExport: false,
              head: '',
              style: _ => ({fontWeight: t.typography.fontWeightBold}),
              renderQuick: _ => {
                const verif = indexVerification[_.data.id] ?? {}
                return (
                  <>
                    <TableIconBtn tooltip={m._mealVerif.viewRegistrationData} children="text_snippet" onClick={() => setOpenModalAnswer(_.data)}/>
                    <TableIconBtn tooltip={m._mealVerif.viewDataCheck} disabled={!_.dataCheck} children="fact_check" onClick={() => setOpenModalAnswer(_.dataCheck)}/>
                    {ctx.access.write && fnSwitch(_.status, {
                      NotSelected: (
                        <>
                          <TableIconBtn
                            color="primary"
                            loading={asyncUpdateAnswer.loading[verif.id]}
                            children="add"
                            onClick={() => asyncUpdateAnswer.call(verif.id, MealVerificationAnswersStatus.Selected).then(verificationAnswersRefresh)}
                          />
                        </>
                      ),
                      Selected: (
                        <>
                          <TableIconBtn
                            children="delete"
                            loading={asyncUpdateAnswer.loading[verif.id]}
                            onClick={() => asyncUpdateAnswer.call(verif.id,).then(verificationAnswersRefresh)}
                          />
                          <TableIconBtn
                            children="casino"
                            loading={asyncUpdateAnswer.loading[verif.id]}
                            disabled={unselectedAnswers.length === 0 || asyncUpdateAnswer.anyLoading}
                            onClick={() => {
                              Promise.all([
                                asyncUpdateAnswer.call(verif.id,),
                                asyncUpdateAnswer.call(unselectedAnswers.pop()?.id!, MealVerificationAnswersStatus.Selected,)
                              ]).then(verificationAnswersRefresh)
                            }}
                          />
                        </>
                      )
                    }, () => undefined)}
                  </>
                )
              },
            },
            {
              id: 'taxid',
              head: m.taxID,
              type: 'string',
              renderQuick: _ => _.data[activity.registration.joinColumn],
              style: (rowData: MergedData) => {
                if (duplicateErrors.has(rowData.data[activity.registration.joinColumn])) {
                  return {color: 'red', fontWeight: 'bold'}
                }
                return {}
              },
            },
            {
              id: 'status',
              width: 0,
              align: 'center',
              head: m.status,
              type: 'select_one',
              render: _ => {
                const label = fnSwitch(_.status, {
                  NotSelected: <TableIcon color="disabled">do_disturb_on</TableIcon>,
                  Completed: <TableIcon color="success">check_circle</TableIcon>,
                  Selected: <TableIcon color="warning">schedule</TableIcon>,
                })
                return {
                  value: _.status,
                  label: label,
                  option: label
                }
              },
            },
            ...activity.dataColumns?.flatMap(c => {
              const q = schema.schemaHelper.questionIndex[c] as NonNullableKey<KoboApiQuestionSchema, 'name'>
              if(!q.name) return []
              const w = getColumnByQuestionSchema({
                formId: activity.registration.koboFormId,
                data: mergedData,
                q,
                groupSchemas: schema.schemaHelper.groupSchemas,
                translateChoice: schema.translate.choice,
                translateQuestion: schema.translate.question,
                m,
                theme: t,
                getRow: _ => _.data,
                choicesIndex: schema.schemaHelper.choicesIndex,
              })
              return w as any
            }) ?? [],
            ...activity.verifiedColumns.map(c => {
              return {
                id: c,
                type: 'select_one',
                head: schema.translate.question(c),
                style: (_: MergedData) => {
                  if (areEquals(c, _)) {
                    return {}
                  } else
                    return {
                      color: t.palette.error.dark,
                      background: alpha(t.palette.error.main, .08)
                    }
                },
                render: (_: MergedData) => {
                  const isOption = schema.schemaHelper.questionIndex[c].type === 'select_one' || schema.schemaHelper.questionIndex[c].type === 'select_multiple'
                  const dataCheck = _.dataCheck && isOption ? schema.translate.choice(c, _.dataCheck?.[c] as string) : _.dataCheck?.[c]
                  const data = isOption ? schema.translate.choice(c, _.data?.[c] as string) : _.data?.[c]
                  return {
                    option: _.dataCheck ? areEquals(c, _) ? <Icon color="success">check</Icon> : <Icon color="error">close</Icon> : '',
                    value: _.dataCheck ? areEquals(c, _) ? '1' : '0' : '',
                    label: fnSwitch(display, {
                      'data': data,
                      'dataCheck': dataCheck ?? <TableIcon color="disabled">schedule</TableIcon>,
                      'all': <>{data ?? '""'} = {_.dataCheck ? dataCheck ?? '""' : <TableIcon color="disabled">schedule</TableIcon>}</>,
                    }),
                    export: fnSwitch(display, {
                      'data': data,
                      'dataCheck': dataCheck ?? '???',
                      'all': (data ?? '""') + ' = ' + (dataCheck ?? '???'),
                    }),
                  }
                },
              } as const
            }),
            {
              id: 'total',
              type: 'number',
              head: m.total,
              stickyEnd: true,
              align: 'right',
              style: _ => ({fontWeight: t.typography.fontWeightBold}),
              renderQuick: _ => (
                _.dataCheck ? toPercent(_.score / activity.verifiedColumns.length) : ''
              )
            }
          ]}/>
      </Panel>
      {openModalAnswer && (
        <DatabaseKoboAnswerViewDialog
          formId={activity.registration.koboFormId}
          open={!!openModalAnswer}
          onClose={() => setOpenModalAnswer(undefined)}
          answer={openModalAnswer}
        />
      )}
    </>
  )
}