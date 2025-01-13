import React, {useMemo, useState} from 'react'
import {map, seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {Meal_cashPdm, OblastIndex} from 'infoportal-common'
import {DataFilterLayout} from '@/shared/DataFilter/DataFilterLayout'
import {Page} from '@/shared/Page'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {PdmData, PdmForm, useMealPdmContext} from '@/features/Meal/Pdm/Context/MealPdmContext'
import {appConfig} from '@/conf/AppConfig'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {ChartPieWidgetBy} from '@/shared/charts/ChartPieWidgetBy'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {AgeGroupTable} from '@/shared/AgeGroupTable'
import {Panel, PanelBody} from '@/shared/Panel'
import {MapSvgByOblast} from '@/shared/maps/MapSvgByOblast'
import {usePdmFilters} from '@/features/Meal/Pdm/Context/usePdmFilter'

const mapOblast = OblastIndex.koboOblastIndexIso

const isCashPdm = (_: PdmData<PdmForm>): _ is PdmData<Meal_cashPdm.T> => {
  return _.type === 'Cash'
}

export const MealPdmCashDashboard = () => {
  const ctx = useMealPdmContext()
  const ctxSchema = useKoboSchemaContext()
  const schema = ctxSchema.byName.meal_cashPdm.get!
  const langIndex = ctxSchema.langIndex
  const {m, formatDateTime, formatDate} = useI18n()
  const {shape: commonShape} = usePdmFilters(ctx.fetcherAnswers.get)
  const [optionFilter, setOptionFilters] = useState<Record<string, string[] | undefined>>({})
  const filterShape = useMemo(() => {
    return DataFilter.makeShape<PdmData<Meal_cashPdm.T>>({
      ...commonShape,
      pdmtype: {
        icon: appConfig.icons.project,
        getOptions: () =>
          schema.helper.getOptionsByQuestionName('pdmtype').map((_) => ({
            value: _.name,
            label: _.label[langIndex],
          })),
        label: m.mealMonitoringPdm.pdmType,
        getValue: (_) => (_.answers.pdmtype && _.answers.pdmtype.length > 0 ? _.answers.pdmtype[0] : undefined),
      },
    })
  }, [commonShape, schema])

  const data = useMemo(() => {
    return map(ctx.fetcherAnswers.get, (_) => {
      return seq(DataFilter.filterData(_.filter(isCashPdm), filterShape, optionFilter))
    })
  }, [ctx.fetcherAnswers.get, optionFilter, filterShape])

  return (
    <Page width="lg" loading={ctx.fetcherAnswers.loading}>
      <DataFilterLayout
        shapes={filterShape}
        filters={optionFilter}
        setFilters={setOptionFilters}
        before={
          <DebouncedInput<[Date | undefined, Date | undefined]>
            debounce={400}
            value={[ctx.periodFilter.start, ctx.periodFilter.end]}
            onChange={([start, end]) => ctx.setPeriodFilter((prev) => ({...prev, start, end}))}
          >
            {(value, onChange) => (
              <PeriodPicker
                sx={{marginTop: '-6px'}}
                defaultValue={value ?? [undefined, undefined]}
                onChange={onChange}
                min={ctx.fetcherPeriod.get?.start}
                max={ctx.fetcherPeriod.get?.end}
              />
            )}
          </DebouncedInput>
        }
      />
      {data && (
        <>
          <Div responsive>
            <Div column sx={{maxHeight: '50%'}}>
              <SlidePanel title={m.mealMonitoringPdm.feedback}>
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.satisfiedAmount}
                  data={data}
                  filter={(_) => _.answers.satisfied_cash_amount === 'yes' || _.answers.satisfied_cash_amount === 'no'}
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.treated}
                  data={data}
                  filter={(_) => _.answers.feel_treated_respect === 'rcyc' || _.answers.feel_treated_respect === 'rcnt'}
                  filterBase={(_) =>
                    _.answers.feel_treated_respect === 'rcyc' ||
                    _.answers.feel_treated_respect === 'rcnt' ||
                    _.answers.feel_treated_respect === 'rcnr' ||
                    _.answers.feel_treated_respect === 'rcmy' ||
                    _.answers.feel_treated_respect === 'rcdk' ||
                    _.answers.feel_treated_respect === 'rcna'
                  }
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.provideInfo}
                  data={data}
                  filter={(_) => _.answers.organization_provide_information === 'yes'}
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.satisfiedProcess}
                  data={data}
                  filter={(_) => _.answers.satisfied_process === 'ndyl' || _.answers.satisfied_process === 'ndna'}
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.correspond}
                  data={data}
                  filter={(_) => _.answers.amount_cash_received_correspond === 'yes'}
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.problems}
                  data={data}
                  filter={(_) => _.answers.experience_problems === 'yes'}
                />
              </SlidePanel>
              <Panel savableAsImg expendable title={m.location}>
                <PanelBody>
                  <MapSvgByOblast
                    sx={{maxWidth: 480, margin: 'auto'}}
                    fillBaseOn="value"
                    data={data}
                    getOblast={(_) => mapOblast[_.answers.ben_det_oblast!]}
                    value={(_) => true}
                    base={(_) => _.answers.ben_det_oblast !== undefined}
                  />
                </PanelBody>
              </Panel>
              <Panel title={m.ageGroup}>
                <PanelBody>
                  <AgeGroupTable
                    tableId="pdm-dashboard"
                    persons={data.flatMap((_) => _.persons)}
                    enableDisplacementStatusFilter
                    enablePwdFilter
                  />
                </PanelBody>
              </Panel>
              <SlidePanel title={m.mealMonitoringPdm.pdmType}>
                <ChartBarMultipleBy data={data} by={(_) => _.answers.pdmtype} label={Meal_cashPdm.options.pdmtype} />
              </SlidePanel>
            </Div>
            <Div column sx={{maxHeight: '50%'}}>
              <SlidePanel title={m.mealMonitoringPdm.betterInform}>
                <ChartBarMultipleBy
                  data={data}
                  by={(_) => _.answers.better_inform_distribution}
                  label={Meal_cashPdm.options.better_inform_distribution}
                />
              </SlidePanel>
              <SlidePanel title={m.project}>
                <ChartBarSingleBy data={data} by={(_) => _.answers.donor} label={Meal_cashPdm.options.donor} />
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringPdm.timeToTake}>
                <ChartBarSingleBy
                  data={data}
                  by={(_) => _.answers.time_registered_assistance}
                  label={Meal_cashPdm.options.time_registered_assistance}
                />
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringPdm.assistanceReceive}>
                <ChartBarSingleBy
                  data={data}
                  by={(_) => _.answers.assistance_delivered}
                  label={Meal_cashPdm.options.assistance_delivered}
                />
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringPdm.priorityNeeds}>
                <ChartBarMultipleBy
                  data={data}
                  by={(_) => _?.answers?.needs_community_currently}
                  label={Meal_cashPdm.options?.needs_community_currently}
                />
              </SlidePanel>
            </Div>
          </Div>
        </>
      )}
    </Page>
  )
}
