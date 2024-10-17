import React, {useMemo, useState} from 'react'
import {map, seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {OblastIndex} from 'infoportal-common'
import {DataFilterLayout} from '@/shared/DataFilter/DataFilterLayout'
import {Page} from '@/shared/Page'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {PdmData, PdmForm, useMealPdmContext} from '@/features/Meal/Pdm/Context/MealPdmContext'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {ChartPieWidgetBy} from '@/shared/charts/ChartPieWidgetBy'
import {AgeGroupTable} from '@/shared/AgeGroupTable'
import {Panel, PanelBody} from '@/shared/Panel'
import {MapSvgByOblast} from '@/shared/maps/MapSvgByOblast'
import {Meal_shelterPdm} from 'infoportal-common/lib/kobo/generated/Meal_shelterPdm'
import {usePdmFilters} from '@/features/Meal/Pdm/Context/usePdmFilter'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'

const mapOblast = OblastIndex.koboOblastIndexIso

const isShelterPdm = (_: PdmData<PdmForm>): _ is PdmData<Meal_shelterPdm.T> => {
  return _.type === 'Shelter'
}

export const MealPdmShelterDashboard = () => {
  const ctx = useMealPdmContext()
  const ctxSchema = useKoboSchemaContext()
  const schema = ctxSchema.byName.meal_shelterPdm.get!
  const {shape: commonShape} = usePdmFilters(ctx.fetcherAnswers.get)
  const langIndex = ctxSchema.langIndex
  const {m, formatDateTime, formatDate} = useI18n()
  const [optionFilter, setOptionFilters] = useState<Record<string, string[] | undefined>>({})
  const filterShape = useMemo(() => {
    return DataFilter.makeShape(commonShape) // Reusing the common filter shape
  }, [commonShape])


  const data = useMemo(() => {
    return map(ctx.fetcherAnswers.get, _ => {
      return seq(DataFilter.filterData(_.filter(isShelterPdm), filterShape, optionFilter))
    })
  }, [ctx.fetcherAnswers.get, optionFilter, filterShape])

  return (
    <Page
      width="lg"
      loading={ctx.fetcherAnswers.loading}
    >
      <DataFilterLayout
        shapes={filterShape}
        filters={optionFilter}
        setFilters={setOptionFilters}
        before={
          <DebouncedInput<[Date | undefined, Date | undefined]>
            debounce={400}
            value={[ctx.periodFilter.start, ctx.periodFilter.end]}
            onChange={([start, end]) => ctx.setPeriodFilter(prev => ({...prev, start, end}))}
          >
            {(value, onChange) => <PeriodPicker
              sx={{marginTop: '-6px'}}
              defaultValue={value ?? [undefined, undefined]}
              onChange={onChange}
              min={ctx.fetcherPeriod.get?.start}
              max={ctx.fetcherPeriod.get?.end}
            />}
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
                  filter={_ => _.answers.satisfied_cash_amount === 'yes'}
                  filterBase={_ => _.answers.satisfied_cash_amount === 'yes' || _.answers.satisfied_cash_amount === 'no'}
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.repaired}
                  data={data}
                  filter={_ => _.answers.satisfied_repaired_premises === 'yesc'}
                  filterBase={_ => _.answers.satisfied_repaired_premises === 'yesc' || _.answers.satisfied_repaired_premises === 'notr' || _.answers.satisfied_repaired_premises === 'na' || _.answers.satisfied_repaired_premises === 'dk' || _.answers.satisfied_repaired_premises === 'myes'}
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.provideInfo}
                  data={data}
                  filter={_ => _.answers.organization_provide_information === 'yes'}
                  filterBase={_ => _.answers.organization_provide_information === 'yes' || _.answers.organization_provide_information === 'no'}
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.satisfiedProcess}
                  data={data}
                  filter={_ => _.answers.satisfied_process === 'ndyl' || _.answers.satisfied_process === 'ndna'}
                  filterBase={_ => _.answers.satisfied_process === 'ndyl' || _.answers.satisfied_process === 'ndna' || _.answers.satisfied_process === 'ndnr'}
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.eskContent}
                  data={data}
                  filter={_ => _.answers.satisfied_esk_content === 'yesc'}
                  filterBase={_ => _.answers.satisfied_esk_content === 'yesc' || _.answers.satisfied_esk_content === 'myes' || _.answers.satisfied_process === 'ndna' || _.answers.satisfied_process === 'ndnr' || _.answers.satisfied_process === 'ndyl'}
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.problems}
                  data={data}
                  filter={_ => _.answers.experience_problems === 'yes'}
                  filterBase={_ => _.answers.experience_problems === 'yes' || _.answers.experience_problems === 'no'}
                />
              </SlidePanel>
              <Panel savableAsImg expendable title={m.location}>
                <PanelBody>
                  <MapSvgByOblast
                    sx={{maxWidth: 480, margin: 'auto'}}
                    fillBaseOn="value"
                    data={data}
                    getOblast={_ => mapOblast[_.answers.oblast!]}
                    value={_ => true}
                    base={_ => _.answers.oblast !== undefined}
                  />
                </PanelBody>
              </Panel>
              <Panel title={m.ageGroup}>
                <PanelBody>
                  <AgeGroupTable tableId="pdm-dashboard" persons={data.flatMap(_ => _.persons)} enableDisplacementStatusFilter enablePwdFilter/>
                </PanelBody>
              </Panel>
              <SlidePanel title={m.mealMonitoringPdm.assistanceReceived}>
                <ChartBarSingleBy data={data} by={_ => _.answers.which_type_of_assistance_have} label={Meal_shelterPdm.options.which_type_of_assistance_have}/>
              </SlidePanel>
            </Div>
            <Div column sx={{maxHeight: '50%'}}>
              <SlidePanel title={m.mealMonitoringPdm.needsShelter}>
                <ChartBarSingleBy data={data} by={_ => _.answers.contents_immediate_sneeds} label={Meal_shelterPdm.options.contents_immediate_sneeds}/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringPdm.carryKit}>
                <ChartBarSingleBy data={data} by={_ => _.answers.carry_kit_received} label={Meal_shelterPdm.options.carry_kit_received}/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringPdm.timeToTake}>
                <ChartBarSingleBy data={data} by={_ => _.answers.time_registered_assistance} label={Meal_shelterPdm.options.time_registered_assistance}/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringPdm.assistanceReceive}>
                <ChartBarSingleBy data={data} by={_ => _.answers.assistance_delivered} label={Meal_shelterPdm.options.assistance_delivered}/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringPdm.priorityNeeds}>
                <ChartBarMultipleBy data={data} by={_ => _.answers.top3_priority_needs} label={Meal_shelterPdm.options.top3_priority_needs}/>
              </SlidePanel>
            </Div>
          </Div>
        </>
      )}
    </Page>
  )
}