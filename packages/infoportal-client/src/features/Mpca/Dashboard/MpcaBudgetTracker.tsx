import {DrcOffice, DrcProgram, DrcProject, groupBy, MpcaEntity} from 'infoportal-common'
import {Seq, seq, toPercent} from '@alexandreannic/ts-utils'
import React, {useEffect, useMemo, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {MpcaAmountType} from '@/features/Mpca/Dashboard/MpcaDashboard'
import {Datatable} from '@/shared/Datatable/Datatable'
import {Alert, Box, useTheme} from '@mui/material'
import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {PopoverWrapper} from '@/shared/PopoverWrapper'
import {IpInput} from '@/shared/Input/Input'
import {IpBtn} from '@/shared/Btn'
import {Modal} from '@/shared'
import {SelectDrcProject} from '@/shared/customInput/SelectDrcProject'
import {SelectDrcOffice} from '@/shared/customInput/SelectDrcOffice'
import {Controller, useForm} from 'react-hook-form'
import {useFetcher} from '@/shared/hook/useFetcher'
import {useAppSettings} from '@/core/context/ConfigContext'
import {JsonStoreKey, JsonStoreMpcaBudget} from '@/core/sdk/server/jsonStore/JsonStoreSdk'
import {useAsync} from '@/shared/hook/useAsync'
import {appConfig} from '@/conf/AppConfig'
import {useSession} from '@/core/Session/SessionContext'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'

interface CreateBudgetForm {
  office: DrcOffice
  project: DrcProject
  activity: DrcProgram
  budget: number
}

interface UpdateBudgetForm {
  budget: number
}

export const MpcaBudgetTracker = ({
  data,
  getAmount,
  amountType,
}: {
  amountType: MpcaAmountType
  data: Seq<MpcaEntity>
  getAmount: (_: MpcaEntity) => number | undefined
}) => {
  const t = useTheme()
  const {m, formatLargeNumber} = useI18n()
  const {api, conf} = useAppSettings()
  const [errorFormAlreadyExists, setErrorFormAlreadyExists] = useState(false)
  const createBudgetForm = useForm<CreateBudgetForm>()
  const updateBudgetForm = useForm<UpdateBudgetForm>()
  const {session} = useSession()
  const canEditFetcher = useFetcher(() =>
    session.admin
      ? Promise.resolve(true)
      : (api.group
          .getMine()
          .then((_) => !!_.find((_) => _.name === appConfig.mpcaBudgetHolderGroupName)) as Promise<boolean>),
  )
  const req = () => api.jsonStore.getValue(JsonStoreKey.MpcaBudget).then(seq)
  const fetcherBudget = useFetcher(req)
  const asyncBudgetUpdate = useAsync((json: JsonStoreMpcaBudget) => api.jsonStore.set(JsonStoreKey.MpcaBudget, json))

  const programs = useMemo(
    () =>
      data
        .map((_) => _.activity)
        .distinct((_) => _)
        .compact(),
    [data],
  )

  useEffect(() => {
    canEditFetcher.fetch()
    fetcherBudget.fetch()
  }, [])

  const budgetData = useMemo(() => {
    if (!fetcherBudget.get) return
    const gb = groupBy({
      data,
      groups: [{by: (_) => _.project?.[0]!}, {by: (_) => _.activity!}, {by: (_) => _.office!}],
      finalTransform: (_) => _,
    }).groups
    return fetcherBudget.get
      .map((_) => {
        const d = gb[_.project]?.[_.activity]?.[_.office] ?? seq()
        return {
          ..._,
          committedAmount: d.sum((_) => _[amountType] ?? 0),
          individuals: d.sum((_) => _.persons?.length ?? 0),
          rows: d.length,
        }
      })
      .sortByString((_) => _.office, 'a-z')
  }, [fetcherBudget.get])

  return (
    <Datatable
      id="mpca-dashboard-helper"
      defaultLimit={200}
      rowsPerPageOptions={[200, 1000]}
      header={
        canEditFetcher.get && (
          <Modal
            loading={asyncBudgetUpdate.loading}
            title={m.mpca.addTracker}
            confirmDisabled={!fetcherBudget.get || !createBudgetForm.formState.isValid}
            onConfirm={createBudgetForm.handleSubmit((form) => {
              const alreadyExists = fetcherBudget.get!.find(
                (_) => _.office === form.office && _.project === form.project && _.activity === form.activity,
              )
              if (alreadyExists) {
                setErrorFormAlreadyExists(true)
              } else {
                asyncBudgetUpdate.call([...(fetcherBudget.get ?? []), form]).then(() => fetcherBudget.fetch())
              }
            })}
            content={() => (
              <Box sx={{width: 280, pt: 1}}>
                {errorFormAlreadyExists && (
                  <Alert color="error" sx={{mb: 1}}>
                    {m.mpca.errorFormAlreadyExists}
                  </Alert>
                )}
                <Controller
                  control={createBudgetForm.control}
                  rules={{required: true}}
                  name="project"
                  render={({field: {onChange, ...field}}) => (
                    <SelectDrcProject {...field} onChange={(e) => onChange(e)} sx={{mb: 2}} />
                  )}
                />
                <Controller
                  control={createBudgetForm.control}
                  rules={{required: true}}
                  name="activity"
                  render={({field: {onChange, ...field}}) => (
                    <IpSelectSingle<DrcProgram>
                      {...field}
                      hideNullOption
                      label={m.program}
                      onChange={(e) => onChange(e)}
                      sx={{mb: 2}}
                      options={programs}
                    />
                  )}
                />
                <Controller
                  control={createBudgetForm.control}
                  name="office"
                  rules={{required: true}}
                  render={({field: {onChange, ...field}}) => (
                    <SelectDrcOffice {...field} onChange={(e) => onChange(e)} sx={{mb: 2}} />
                  )}
                />
                <IpInput
                  {...createBudgetForm.register('budget', {required: true})}
                  type="number"
                  label={m.budget}
                  endAdornment="UAH"
                />
              </Box>
            )}
          >
            <IpBtn icon="add" variant="outlined">
              {m.mpca.addTracker}
            </IpBtn>
          </Modal>
        )
      }
      data={budgetData}
      columns={[
        {
          width: 0,
          id: 'office',
          head: m.office,
          type: 'select_one',
          renderQuick: (_) => _.office,
        },
        // {width: 0, id: 'donor', head: m.donor, type: 'select_one', renderQuick: _ => DrcProjectHelper.donorByProject[_.project]},
        {width: 0, id: 'project', head: m.project, type: 'select_one', renderQuick: (_) => _.project},
        {width: 0, id: 'program', head: m.program, type: 'select_one', renderQuick: (_) => _.activity},
        {
          width: 0,
          id: 'total',
          head: 'Committed',
          type: 'number',
          render: (_) => {
            return {
              label: formatLargeNumber(_.committedAmount, {maximumFractionDigits: 0}),
              value: _.committedAmount,
            }
          },
        },
        {
          width: 0,
          id: 'buget',
          head: 'Budget available',
          type: 'number',
          render: (row) => {
            return {
              value: row.budget,
              label: (
                <>
                  {formatLargeNumber(row.budget, {maximumFractionDigits: 0})}
                  {canEditFetcher.get && (
                    // && (session.drcJob !== 'Area Manager' || session.drcOffice === row.office)
                    <PopoverWrapper
                      content={(close) => {
                        updateBudgetForm.setValue('budget', row.budget)
                        return (
                          <Box sx={{p: 1}}>
                            <IpInput type="number" {...updateBudgetForm.register('budget')} helperText={null} />
                            <Box sx={{mt: 1}}>
                              <IpBtn size="small" onClick={close}>
                                {m.close}
                              </IpBtn>
                              <IpBtn
                                size="small"
                                variant="contained"
                                disabled={!fetcherBudget.get}
                                loading={asyncBudgetUpdate.loading}
                                onClick={updateBudgetForm.handleSubmit((form) => {
                                  asyncBudgetUpdate
                                    .call(
                                      fetcherBudget.get!.map((_) => {
                                        if (_.project === row.project && _.office === row.office) {
                                          _.budget = form.budget
                                        }
                                        return _
                                      }),
                                    )
                                    .then(() => fetcherBudget.fetch({clean: false, force: true}))
                                    .then(close)
                                })}
                              >
                                {m.confirm}
                              </IpBtn>
                            </Box>
                          </Box>
                        )
                      }}
                    >
                      <TableIconBtn color="primary">edit</TableIconBtn>
                    </PopoverWrapper>
                  )}
                </>
              ),
            }
          },
        },
        {
          width: 0,
          id: 'rest',
          head: 'Rest',
          type: 'number',
          render: (_) => {
            return {
              label: formatLargeNumber(_.budget - _.committedAmount),
              value: _.budget - _.committedAmount,
            }
          },
        },
        {
          id: 'progress',
          head: m.progress,
          type: 'number',
          style: () => ({
            padding: 0,
            verticalAlign: 'bottom',
          }),
          render: (_) => {
            const value = (_.committedAmount / _.budget) * 100
            return {
              value,
              label: (
                <Box>
                  {toPercent(value)}
                  <Box>
                    <Box sx={{height: 2, width: value + '%', background: t.palette.primary.main}} />
                  </Box>
                </Box>
              ),
            }
          },
        },
        {
          id: 'actions',
          head: '',
          width: 0,
          align: 'right',
          renderQuick: (row) => (
            <Modal
              title={m.mpca.deleteTracker}
              content={m.mpca.deleteTrackerDetails}
              loading={asyncBudgetUpdate.loading}
              onConfirm={() => {
                asyncBudgetUpdate
                  .call(
                    fetcherBudget.get!.filter(
                      (_) => _.office !== row.office || _.project !== row.project || _.activity !== row.activity,
                    ),
                  )
                  .then(() => fetcherBudget.fetch())
              }}
            >
              <TableIconBtn color="primary">delete</TableIconBtn>
            </Modal>
          ),
        },
      ]}
    />
  )
}
