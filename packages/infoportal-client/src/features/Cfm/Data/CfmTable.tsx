import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import React, {ReactNode, useCallback, useMemo} from 'react'
import {Page} from '@/shared/Page'
import {fnSwitch, Obj} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {IpInput} from '@/shared/Input/Input'
import {
  CfmDataPriority,
  CfmDataProgram,
  CfmDataSource,
  DrcOffice,
  DrcProject,
  KoboIndex,
  KoboMealCfmStatus,
  KoboMealCfmTag,
  Meal_cfmInternal,
  OblastIndex,
  Regexp,
} from 'infoportal-common'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {TableIcon, TableIconBtn, TableIconProps} from '@/features/Mpca/MpcaData/TableIcon'
import {CfmData, cfmMakeEditRequestKey, CfmStatusIcon, cfmStatusIconIndex, useCfmContext} from '@/features/Cfm/CfmContext'
import {NavLink} from 'react-router-dom'
import {cfmIndex} from '@/features/Cfm/Cfm'
import {IpIconBtn} from '@/shared/IconBtn'
import {useAsync} from '@/shared/hook/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Autocomplete} from '@mui/material'
import {useSession} from '@/core/Session/SessionContext'
import {Modal} from '@/shared'
import {SelectDrcProject} from '@/shared/customInput/SelectDrcProject'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {Datatable} from '@/shared/Datatable/Datatable'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {IpSelectMultipleHelper} from '@/shared/Select/SelectMultiple'
import {useKoboUpdateContext} from '@/core/context/KoboUpdateContext'

export interface CfmDataFilters extends KoboAnswerFilter {
}

export const CfmPriorityLogo = ({
  priority,
  fontSize,
  sx,
}: {
  sx?: TableIconProps['sx']
  fontSize?: TableIconProps['fontSize']
  priority?: CfmData['priority']
}) => {
  const {m} = useI18n()
  return fnSwitch(priority!, {
    Low: <TableIcon tooltip={m._cfm.priority + ': ' + priority} sx={sx} fontSize={fontSize} color="info">looks_3</TableIcon>,
    Medium: <TableIcon tooltip={m._cfm.priority + ': ' + priority} sx={sx} fontSize={fontSize} color="warning">looks_two</TableIcon>,
    High: <TableIcon tooltip={m._cfm.priority + ': ' + priority} sx={sx} fontSize={fontSize} color="error">looks_one</TableIcon>,
  }, () => undefined)
}

export const CfmTable = ({}: any) => {
  const ctx = useCfmContext()
  const ctxAnswers = useKoboAnswersContext()
  const ctxKoboUpdate = useKoboUpdateContext()
  const {langIndex, setLangIndex} = useKoboSchemaContext()

  // const [selectedFromId_Ids, setSelectedFromId_Ids] = useState<string[]>([])
  // const {meal_cfmInternal: selectedIdsInternal, meal_cfmExternal: selectedIdsExternal} = useMemo(() => {
  //   return selectedFromId_Ids.reduce((acc, _) => {
  //     const [formId, id] = _.split('_')
  //     acc[KoboIndex.searchById(formId)?.name as keyof typeof acc].push(id)
  //     return acc
  //   }, {} as Record<'meal_cfmInternal' | 'meal_cfmExternal', string[]>)
  // }, [selectedFromId_Ids])

  const {m, formatDate, formatLargeNumber} = useI18n()
  const {session} = useSession()
  const {api} = useAppSettings()

  const _refresh = useAsync(async () => {
    await Promise.all([
      api.koboApi.synchronizeAnswers(KoboIndex.byName('meal_cfmInternal').id),
      api.koboApi.synchronizeAnswers(KoboIndex.byName('meal_cfmExternal').id),
    ])
    await Promise.all([
      ctxAnswers.byName('meal_cfmExternal').fetch({force: true, clean: false}),
      ctxAnswers.byName('meal_cfmInternal').fetch({force: true, clean: false}),
    ])
  })

  // const {toastHttpError, toastLoading} = useAaToast()
  //
  // const _editExternal = useFetchers(async (answerId: Kobo.SubmissionId) => {
  //   return api.koboApi.getEditUrl(kobo.drcUa.server.prod, KoboIndex.byName('cfmExternal').id, answerId).then(_ => {
  //     if (_.url) window.open(_.url, '_blank')
  //   }).catch(toastHttpError)
  // }, {requestKey: _ => _[0]})
  //
  // const _editInternal = useFetchers(async (answerId: Kobo.SubmissionId) => {
  //   return api.koboApi.getEditUrl(kobo.drcUa.server.prod, KoboIndex.byName('cfmInternal').id, answerId).then(_ => {
  //     if (_.url) window.open(_.url, '_blank')
  //   }).catch(toastHttpError)
  // }, {requestKey: _ => _[0]})


  const buildTagObjColumn = useCallback(<T extends keyof Partial<KoboMealCfmTag>, K extends string, >({
    head,
    tag,
    enumerator,
    translate,
    value,
    ...sheetProps
  }: Pick<DatatableColumn.Props<any>, 'typeIcon' | 'style' | 'styleHead' | 'width'> & {
    head: string
    value?: KoboMealCfmTag[T]
    enumerator: Record<K, string>
    translate?: Record<K, ReactNode>
    tag: T,
  }): DatatableColumn.Props<CfmData> => {
    const enumKeys = Obj.keys(enumerator)
    return {
      id: tag,
      head,
      type: 'select_one',
      options: () => enumKeys.map(_ => ({value: _, label: _})),
      render: row => {
        return {
          value: (row?.tags?.[tag] ?? value) as string,
          label: (
            <IpSelectSingle
              value={(row.tags as any)?.[tag] ?? value ?? ''}
              onChange={(tagChange) => {
                ctxKoboUpdate.asyncUpdateById.tag.call({
                  formId: row.formId,
                  answerIds: [row.id],
                  tag,
                  value: tagChange,
                })
              }}
              options={enumKeys.map(_ => ({
                value: _, children: translate ? translate[_] : _,
              }))}
            />
          )
        }
      },
      ...sheetProps,
    }
  }, [ctx.visibleData])

  const column = useMemo(() => {
    return {
      status: buildTagObjColumn({
        head: m.status,
        width: 0,
        typeIcon: null,
        style: () => ({padding: 0}),
        tag: 'status',
        value: KoboMealCfmStatus.Open,
        enumerator: KoboMealCfmStatus,
        translate: cfmStatusIconIndex
      }),
      office: buildTagObjColumn({
        head: m.office,
        tag: 'office',
        width: 100,
        enumerator: DrcOffice,
      }),
      program: buildTagObjColumn({
        head: m.program,
        width: 140,
        tag: 'program',
        enumerator: CfmDataProgram,
      })
    }
  }, [ctx.visibleData])

  const defaultFilters = useMemo(() => {
    return {
      status: [
        KoboMealCfmStatus.Processing,
        KoboMealCfmStatus.Open,
        KoboMealCfmStatus.Close,
      ]
    }
  }, [])
  return (
    <Page width="full">
      <Panel>
        <Datatable
          // select={{
          //   getId: _ => _.formId + '_' + _.id,
          //   onSelect: _ => setSelectedFromId_Ids(_),
          showExportBtn
          defaultFilters={defaultFilters}
          id="cfm"
          header={
            <>
              <IpSelectSingle
                hideNullOption
                sx={{maxWidth: 128, mr: 1}}
                defaultValue={langIndex}
                onChange={setLangIndex}
                options={[
                  {children: 'XML', value: -1},
                  ...ctx.schemaExternal.schemaSanitized.content.translations.map((_, i) => ({children: _, value: i}))
                ]}
              />
              <IpIconBtn
                loading={_refresh.loading}
                children="cloud_sync"
                tooltip={m._koboDatabase.pullData}
                onClick={_refresh.call}
              />
            </>
          }
          data={ctx.visibleData}
          loading={ctx.fetching}
          getRenderRowKey={_ => _.form + _.id}
          columns={[
            {
              id: 'status',
              head: m.status,
              type: 'select_one',
              style: () => ({padding: 0}),
              typeIcon: null,
              width: 0,
              options: () => Obj.keys(KoboMealCfmStatus).map(_ => ({value: _, label: _})),
              render: row => {
                const isNotesEmpty = !row?.tags?.notes || row?.tags?.notes.trim() === ''

                return {
                  export: row?.tags?.status ?? KoboMealCfmStatus.Open,
                  value: row?.tags?.status ?? KoboMealCfmStatus.Open,
                  tooltip: isNotesEmpty ? 'Notes section is empty!' : '',
                  label: (
                    <IpSelectSingle
                      value={row.tags?.status ?? KoboMealCfmStatus.Open ?? ''}
                      onChange={(tagChange) => {
                        if (!isNotesEmpty) {
                          ctxKoboUpdate.asyncUpdateById.tag.call({
                            formId: row.formId,
                            answerIds: [row.id],
                            tag: 'status',
                            value: tagChange,
                          })
                        }
                      }}
                      options={Obj.keys(KoboMealCfmStatus)
                        .filter(_ => !ctx.authorizations.sum.admin ? _ !== KoboMealCfmStatus.Archived : true)
                        .map(_ => ({
                          value: _, children: <CfmStatusIcon status={KoboMealCfmStatus[_]}/>,
                        }))
                      }
                      disabled={isNotesEmpty}
                      sx={{width: '100%'}}
                    />
                  )
                }
              }
            },
            {
              type: 'select_one',
              id: 'priority',
              width: 0,
              typeIcon: null,
              align: 'center',
              head: m._cfm.priority,
              options: () => [
                {value: CfmDataPriority.Low, label: CfmDataPriority.Low},
                {value: CfmDataPriority.Medium, label: CfmDataPriority.Medium},
                {value: CfmDataPriority.High, label: CfmDataPriority.High},
              ],
              render: _ => {
                return {
                  tooltip: null,
                  export: _.priority,
                  value: _.priority,
                  label: <CfmPriorityLogo priority={_.priority}/>
                }
              },
            },
            {
              type: 'id',
              head: m.id,
              id: 'id',
              width: 78,
              renderQuick: _ => _.id,
            },
            {
              type: 'date',
              head: m.koboSubmissionTime,
              id: 'submission_time',
              width: 78,
              render: _ => {
                return {
                  label: formatDate(_.submissionTime),
                  value: _.submissionTime,
                }
              }
            },
            {
              type: 'date',
              head: m.date,
              id: 'date',
              width: 78,
              render: _ => {
                return {
                  label: formatDate(_.date),
                  value: _.date
                }
              }
            },
            {
              type: 'select_one',
              head: m.form,
              id: 'form',
              width: 80,
              options: () => Obj.keys(CfmDataSource).map(_ => ({value: _, label: m._cfm.form[_]})),
              renderQuick: _ => m._cfm.form[_.form]
            },
            {
              type: 'select_one',
              head: m.project,
              id: 'project',
              width: 180,
              render: row => {
                return {
                  export: row.project,
                  value: row.project,
                  option: row.project,
                  label: row.form === CfmDataSource.Internal
                    ? <IpSelectSingle
                      label={null}
                      options={ctx.schemaInternal.helper.getOptionsByQuestionName('project_code').map(_ => {
                        const label = ctx.schemaInternal.translate.choice('project_code', _.name) as DrcProject
                        return IpSelectMultipleHelper.makeOption({
                          value: label,
                          children: DrcProject[label] ?? label + '⚠️',
                        })
                      })}
                      value={row.project}
                      onChange={newValue => {
                        ctxKoboUpdate.asyncUpdateByName.answer.call({
                          answerIds: [row.id],
                          formName: 'meal_cfmInternal',
                          question: 'project_code',
                          answer: newValue as any
                        })
                      }}
                    />
                    : <SelectDrcProject
                      label={null}
                      value={row.project}
                      onChange={newValue => {
                        ctxKoboUpdate.asyncUpdateById.tag.call({formId: row.formId, answerIds: [row.id], tag: 'project', value: newValue})
                      }}
                    />
                }
              }
            },
            {
              type: 'select_one',
              head: ctx.schemaExternal.translate.question('benef_origin'),
              id: 'benef_origin',
              render: row => {
                return {
                  value: row.benef_origin,
                  option: ctx.schemaInternal.translate.choice('benef_origin', row.benef_origin),
                  label: (
                    <IpSelectSingle
                      defaultValue={row.benef_origin}
                      onChange={newValue => {
                        ctxKoboUpdate.asyncUpdateById.answer.call({formId: row.formId, answerIds: [row.id], question: 'benef_origin', answer: newValue})
                      }}
                      options={Obj.entries(Meal_cfmInternal.options.benef_origin).map(([k, v]) => ({value: k, children: v}))}
                    />
                  )
                }
              },
            },
            column.office,
            column.program,
            {
              width: 170,
              type: 'select_one',
              // options: () => seq(ctx.visibleData).map(_ => _.tags?.focalPointEmail).compact().distinct(_ => _).map(DatatableUtils.buildOption),
              head: m.focalPoint,
              id: 'focalPoint',
              render: row => {
                return {
                  export: row.tags?.focalPointEmail,
                  value: row.tags?.focalPointEmail,
                  option: row.tags?.focalPointEmail,
                  label: (
                    <DebouncedInput<string>
                      debounce={1250}
                      value={row.tags?.focalPointEmail}
                      onChange={_ => {
                        if (_ === '' || Regexp.get.drcEmail.test(_))
                          ctxKoboUpdate.asyncUpdateById.tag.call({formId: row.formId, answerIds: [row.id], tag: 'focalPointEmail', value: _})
                      }}
                    >
                      {(value, onChange) => (
                        <Autocomplete
                          freeSolo
                          loading={ctx.users.loading}
                          disableClearable
                          value={value}
                          onChange={(e, _) => onChange(_)}
                          options={ctx.users.get?.map((option) => option.email) ?? []}
                          // renderInput={(params) => <TextField {...params} label="freeSolo" />}
                          renderInput={({InputProps, ...props}) => <IpInput
                            {...InputProps}
                            {...props}
                            helperText={null}
                            placeholder="@drc.ngo"
                            endAdornment={value && !Regexp.get.drcEmail.test(value) && <TableIcon tooltip={m.invalidEmail} color="error">error</TableIcon>}
                          />
                          }
                        />
                      )}
                    </DebouncedInput>
                  )
                }
              }
            },
            {
              type: 'select_one',
              head: m._cfm.feedbackType,
              id: 'feedbackType',
              width: 120,
              render: row => {
                return {
                  value: row.category,
                  option: ctx.schemaInternal.translate.choice('feedback_type', row.category),
                  label: row.form === CfmDataSource.Internal
                    ? ctx.schemaInternal.translate.choice('feedback_type', row.category)
                    : <IpSelectSingle
                      defaultValue={row.category}
                      onChange={newValue => {
                        ctxKoboUpdate.asyncUpdateById.tag.call({formId: row.formId, answerIds: [row.id], tag: 'feedbackTypeOverride', value: newValue})
                      }}
                      options={Obj.entries(Meal_cfmInternal.options.feedback_type).map(([k, v]) => ({value: k, children: v}))}
                    />
                }
              }
            },
            {
              type: 'select_one',
              head: m._cfm.feedbackTypeExternal,
              id: 'feedbackTypeExternal',
              // options: () => Obj.entries(m._cfm._feedbackType).map(([k, v]) => ({value: k, label: v})),
              render: _ => {
                return {
                  value: _.external_feedback_type,
                  label: m._cfm._feedbackType[_.external_feedback_type!]
                }
              },
            },
            {
              type: 'string',
              head: m._cfm.feedback,
              id: 'feedback',
              renderQuick: _ => _.feedback,
            },
            {
              type: 'string',
              head: m.comments,
              id: 'comments',
              renderQuick: _ => _.comments,
            },
            {
              type: 'string',
              head: m.name,
              id: 'name',
              renderQuick: _ => _.name,
            },
            {
              type: 'select_one',
              head: m.gender,
              width: 80,
              id: 'gender',
              options: () => Obj.keys(Meal_cfmInternal.options.gender).map(value => ({value, label: ctx.schemaExternal.translate.choice('gender', value)})),
              render: _ => {
                return {
                  value: _.gender,
                  label: ctx.schemaExternal.translate.choice('gender', _.gender)
                }
              }
            },
            {
              type: 'string',
              head: m.email,
              id: 'email',
              renderQuick: _ => _.email,
            },
            {
              type: 'string',
              head: m.phone,
              id: 'phone',
              renderQuick: _ => _.phone,
            },
            {
              type: 'select_one',
              head: m.oblast,
              options: () => OblastIndex.names.map(value => ({value, label: value})),
              id: 'oblast',
              renderQuick: _ => _.oblast,
            },
            {
              type: 'select_one',
              head: m.raion,
              id: 'raion',
              renderQuick: _ => ctx.schemaExternal.translate.choice('ben_det_raion', _.ben_det_raion),
            },
            {
              type: 'select_one',
              head: m.hromada,
              id: 'hromada',
              renderQuick: _ => ctx.schemaExternal.translate.choice('ben_det_hromada', _.ben_det_hromada),
            },
            {
              type: 'string',
              head: m.note,
              id: 'note',
              renderQuick: _ => _.tags?.notes
            },
            {
              id: 'actions',
              width: 95,
              align: 'center',
              noCsvExport: true,
              stickyEnd: true,
              renderQuick: row => (
                <>
                  {(ctx.authorizations.sum.write || session.email === row.tags?.focalPointEmail) && (
                    <>
                      <TableIconBtn
                        tooltip={m.edit}
                        href={api.koboApi.getEditUrl({formId: row.formId, answerId: row.id})}
                        target="_blank"
                        children="edit"
                      />
                      <Modal
                        loading={ctx.asyncRemove.loading[cfmMakeEditRequestKey(row.formId, row.id)]}
                        content={m._cfm.deleteWarning}
                        onConfirm={(e, close) => ctx.asyncRemove.call({formId: row.formId, answerId: row.id}).then(close)}
                        title={m.shouldDelete}
                      >
                        <TableIconBtn children="delete"/>
                      </Modal>
                    </>
                  )}
                  <NavLink to={cfmIndex.siteMap.entry(row.formId, '' + row.id)}>
                    <TableIconBtn children="keyboard_arrow_right"/>
                  </NavLink>
                </>
              )
            }
          ]}
        />
      </Panel>
    </Page>
  )
}
