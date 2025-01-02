import {useAppSettings} from '@/core/context/ConfigContext'
import {fnSwitch, Obj, seq} from '@alexandreannic/ts-utils'
import React, {useMemo, useState} from 'react'
import {alpha, Box, Icon, Tooltip, useTheme} from '@mui/material'
import {Kobo} from 'kobo-sdk'
import {KoboSubmissionFlat, KoboSchemaHelper, NonNullableKey, toPercent} from 'infoportal-common'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {DatabaseKoboAnswerViewDialog} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {TableIcon, TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {MealVerification, MealVerificationAnsers, MealVerificationAnswersStatus} from '@/core/sdk/server/mealVerification/MealVerification'
import {MealVerificationActivity, mealVerificationConf, VerifiedColumnsMapping} from '@/features/Meal/Verification/mealVerificationConfig'
import {useAsync} from '@/shared/hook/useAsync'
import {useMealVerificationContext} from '@/features/Meal/Verification/MealVerificationContext'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {Datatable} from '@/shared/Datatable/Datatable'
import {IpAlert} from '@/shared/Alert'
import {InferTypedAnswer, KoboFormNameMapped} from '@/core/sdk/server/kobo/KoboTypedAnswerSdk'
import {columnBySchemaGenerator} from '@/features/Database/KoboTable/columns/columnBySchema'

enum Status {
  Selected = 'Selected',
  Completed = 'Completed',
  NotSelected = 'NotSelected'
}

interface ComputedCell {
  name: string
  valueReg: any
  valueVerif: any
  equals?: boolean
}

interface ComputedRow {
  score: number
  rowReg: KoboSubmissionFlat<any>
  rowVerif: KoboSubmissionFlat<any>
  verifiedData: Record<string, ComputedCell>
  status: Status
}


const areEquals = (a: any, b: any): boolean => {
  try {
    if (typeof a !== typeof b) false
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a === undefined || b === undefined) return a === b
      return a.every(c => (b.find(d => c === d)))
    }
    if (typeof a === 'number' || !isNaN(a) && !isNaN(b))
      return Math.abs(+a - +b) <= +b * mealVerificationConf.numericToleranceMargin
    if (typeof a === 'string')
      return a?.trim() === b?.trim()
    return a === b
  } catch (e) {
    return false
  }
}

const displayArray = (a: any): any => {
  return Array.isArray(a) ? a.join(' | ') : a
}

export type MealVerificationBundle<
  TReg extends KoboFormNameMapped = any,
  TVerif extends KoboFormNameMapped = any,
> = {
  mealVerification: MealVerification
  activity: MealVerificationActivity<TReg, TVerif>
  schemaReg: Kobo.Form
  schemaVerif: Kobo.Form
  dataReg: InferTypedAnswer<TReg>[]
  dataVerif: InferTypedAnswer<TVerif>[]
  toVerify: MealVerificationAnsers[]
}

export enum PlaceHolderState {
  Loading = 'Loading',
  Error = 'Error',
  Success = 'Success',
}

export const MealVerificationDataTable = <
  TReg extends KoboFormNameMapped = any,
  TVerif extends KoboFormNameMapped = any,
>({
  refreshToVerify,
  ...bundle
}: MealVerificationBundle<TReg, TVerif> & {refreshToVerify: () => void}) => {
  const {
    mealVerification,
    activity,
    dataReg,
    dataVerif,
    toVerify,
  } = bundle
  const {api} = useAppSettings()
  const {m} = useI18n()
  const t = useTheme()
  const {langIndex, setLangIndex} = useKoboSchemaContext()
  const ctx = useMealVerificationContext()

  const indexToVerify = useMemo(() => seq(toVerify).groupByFirst(_ => _.koboAnswerId), [toVerify])
  const asyncUpdateAnswer = useAsync(api.mealVerification.updateAnswers, {requestKey: _ => _[0]})

  const [openModalAnswer, setOpenModalAnswer] = useState<KoboSubmissionFlat<any> | undefined>()
  const [display, setDisplay] = useState<'reg' | 'verif' | 'both'>('both')

  const {schemaReg, schemaVerif} = useMemo(() => {
    return {
      schemaReg: KoboSchemaHelper.buildBundle({schema: bundle.schemaReg, langIndex}),
      schemaVerif: KoboSchemaHelper.buildBundle({schema: bundle.schemaVerif, langIndex}),
    }
  }, [bundle, langIndex])

  const harmonizedVerifiedColumns = useMemo(() => {
    return Obj.mapValues(activity.verifiedColumns as any, ((_, col) => {
      if (_ === 'AUTO_MAPPING')
        return {
          reg: (_: InferTypedAnswer<TReg>, schema: KoboSchemaHelper.Bundle) => {
            return schema.translate.choice(col as any, (_ as any)[col])
          },
          verif: (_: InferTypedAnswer<TVerif>, schema: KoboSchemaHelper.Bundle) => {
            return schema.translate.choice(col as any, (_ as any)[col])
          },
        }
      return _ as VerifiedColumnsMapping<TReg, TVerif>
    }))
  }, [schemaReg, schemaVerif, activity.verifiedColumns])

  const {
    mergedData,
    duplicateErrors,
    unselectedAnswers,
  } = useMemo(() => {
    const duplicateErrors = new Set<string>()
    const indexDataVerif: Record<any, InferTypedAnswer<TVerif>[]> = seq(dataVerif).groupBy(_ => activity.verification.joinBy(_) ?? '')
    const mergedData = seq(dataReg)
      .filter(_ => indexToVerify[_.id])
      .flatMap((rowReg: InferTypedAnswer<TReg>) => {
        const joinValue = activity.registration.joinBy(rowReg) + ''
        const rowVerifs = indexDataVerif[joinValue]
        if (rowVerifs && rowVerifs.length > 1 && !duplicateErrors.has(joinValue)) {
          duplicateErrors.add(joinValue)
        }
        return (rowVerifs ? rowVerifs : [undefined]).map(rowVerif => {
          const mergedData: Omit<ComputedRow, 'score'> = {
            rowReg,
            rowVerif,
            verifiedData: Obj.mapValues(harmonizedVerifiedColumns, (x, name: string) => {
              const valueReg = displayArray(x.reg(rowReg, schemaReg))
              const valueVerif = rowVerif ? displayArray(x.verif(rowVerif, schemaVerif)) : undefined
              return {name, valueReg, valueVerif, equals: areEquals(valueVerif, valueReg)}
            }),
            status: (() => {
              if (!!rowVerif) return Status.Completed
              if (indexToVerify[rowReg.id]?.status === MealVerificationAnswersStatus.Selected) return Status.Selected
              return Status.NotSelected
            })(),
          }
          const res: ComputedRow = {
            ...mergedData,
            score: mergedData.verifiedData ? seq(Obj.values(mergedData.verifiedData)).sum(_ => _.equals ? 1 : 0) : 0,
          }
          return res
        })
      }).sortByNumber(_ => fnSwitch(_.status, {
        [Status.Completed]: 0,
        [Status.Selected]: 1,
        [Status.NotSelected]: 2,
      }))
    return {
      mergedData,
      duplicateErrors,
      unselectedAnswers: bundle.toVerify.filter(_ => _.status !== MealVerificationAnswersStatus.Selected).sort(() => Math.random() - .5),
    }
  }, [bundle, schemaVerif, schemaReg])

  const stats = useMemo(() => {
    if (!mergedData) return
    const verifiedRows = mergedData.filter(_ => _.status === Status.Completed)
    const selectedRows = mergedData?.filter(_ => _.status !== Status.NotSelected)
    return {
      selectedRows,
      verifiedRows,
      globalScore: verifiedRows.sum(_ => _.score ?? 0),
      indicatorsCount: selectedRows.length * Obj.keys(harmonizedVerifiedColumns).length,
    }
  }, [mergedData])

  return (
    <>
      {duplicateErrors.size > 0 && (
        <Box sx={{mb: 1}}>
          <IpAlert severity="error">{m._mealVerif.duplicateErrors(Array.from(duplicateErrors))}</IpAlert>
        </Box>
      )}
      {stats && (
        <Div sx={{mb: 1, alignItems: 'stretch'}}>
          <SlidePanel sx={{flex: 1}}>
            <ChartPieWidget
              value={stats.selectedRows.length ?? 0}
              base={bundle.toVerify.length}
              title={m._mealVerif.sampleSize}
              dense showBase showValue
            />
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <ChartPieWidget dense showValue showBase value={stats?.verifiedRows.length ?? 0} base={stats.selectedRows?.length ?? 1} title={m._mealVerif.verified}/>
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
                  ...schemaVerif.schema.content.translations.map((_, i) => ({children: _, value: i}))
                ]}
              />
              <ScRadioGroup inline dense value={display} onChange={setDisplay} sx={{mr: 1}}>
                <ScRadioGroupItem hideRadio value="both" title={
                  <Tooltip title={m._mealVerif.showBoth}>
                    <Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_full</Icon>
                  </Tooltip>
                }/>
                <ScRadioGroupItem hideRadio value="reg" title={
                  <Tooltip title={m._mealVerif.activityForm}>
                    <Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_bottom</Icon>
                  </Tooltip>
                }/>
                <ScRadioGroupItem hideRadio value="verif" title={
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
              noCsvExport: true,
              head: '',
              style: _ => ({fontWeight: t.typography.fontWeightBold}),
              renderQuick: _ => {
                const verif = indexToVerify[_.rowReg.id] ?? {}
                return (
                  <>
                    <TableIconBtn tooltip={m._mealVerif.viewRegistrationData} children="text_snippet" onClick={() => setOpenModalAnswer(_.rowReg)}/>
                    <TableIconBtn tooltip={m._mealVerif.viewDataCheck} disabled={!_.rowVerif} children="fact_check" onClick={() => setOpenModalAnswer(_.rowVerif)}/>
                    {ctx.access.write && fnSwitch(_.status, {
                      NotSelected: (
                        <TableIconBtn
                          color="primary"
                          loading={asyncUpdateAnswer.loading[verif.id]}
                          children="add"
                          onClick={() => asyncUpdateAnswer.call(verif.id, MealVerificationAnswersStatus.Selected).then(refreshToVerify)}
                        />
                      ),
                      Selected: (
                        <>
                          <TableIconBtn
                            children="delete"
                            loading={asyncUpdateAnswer.loading[verif.id]}
                            onClick={() => asyncUpdateAnswer.call(verif.id,).then(refreshToVerify)}
                          />
                          <TableIconBtn
                            children="casino"
                            loading={asyncUpdateAnswer.loading[verif.id]}
                            disabled={unselectedAnswers.length === 0 || asyncUpdateAnswer.anyLoading}
                            onClick={() => {
                              Promise.all([
                                asyncUpdateAnswer.call(verif.id,),
                                asyncUpdateAnswer.call(unselectedAnswers.pop()?.id!, MealVerificationAnswersStatus.Selected,)
                              ]).then(refreshToVerify)
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
              renderQuick: (_: ComputedRow) => '' + activity.registration.joinBy(_.rowReg),
              style: (_: ComputedRow) => {
                if (duplicateErrors.has('' + activity.registration.joinBy(_.rowReg))) {
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
              const q = schemaReg.helper.questionIndex[c] as NonNullableKey<Kobo.Form.Question, 'name'>
              if (!q.name) return []
              return columnBySchemaGenerator({
                formId: activity.registration.koboFormId,
                schema: schemaReg,
                getRow: _ => _.rowReg,
                m,
                t,
              }).getByQuestion(q) ?? []
            }) ?? [],
            ...Obj.entries(harmonizedVerifiedColumns).map(([id, c]) => {
              return {
                id,
                type: 'select_one',
                head: schemaVerif.translate.question(id),
                style: (_: ComputedRow) => {
                  if (!_.verifiedData[id].valueVerif) return {
                    color: t.palette.text.disabled,
                  }
                  if (!_.rowVerif || _.verifiedData[id].equals) return {}
                  else return {
                    color: t.palette.error.dark,
                    background: alpha(t.palette.error.main, .08)
                  }
                },
                render: (_: ComputedRow) => {
                  const reg = _.verifiedData[id]?.valueReg
                  const verif = _.verifiedData[id]?.valueVerif ?? <TableIcon color="disabled">block</TableIcon>
                  return {
                    export: reg + ' <=> ' + verif,
                    value: _.verifiedData[id].equals ? '1' : '0',
                    label: fnSwitch(display, {
                      reg,
                      verif,
                      both: <>{reg} <TableIcon color="disabled" sx={{transform: 'rotate(90deg)'}}>height</TableIcon> {verif}</>,
                    })
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
              render: _ => {
                return {
                  value: _.rowVerif ? _.score / Object.keys(harmonizedVerifiedColumns).length : undefined,
                  label: _.rowVerif ? toPercent(_.score / Object.keys(harmonizedVerifiedColumns).length) : ''
                }
              }
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