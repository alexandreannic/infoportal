import {Meal_nfiPdm, OblastIndex} from 'infoportal-common'
import {PdmData, PdmForm, useMealPdmContext} from '@/features/Meal/Pdm/Context/MealPdmContext'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {usePdmFilters} from '@/features/Meal/Pdm/Context/usePdmFilter'
import {useI18n} from '@/core/i18n'
import React, {useMemo, useState} from 'react'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {map, seq} from '@alexandreannic/ts-utils'
import {AgeGroupTable, DebouncedInput, Page} from '@/shared'
import {DataFilterLayout} from '@/shared/DataFilter/DataFilterLayout'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import {ChartPieWidgetBy} from '@/shared/charts/ChartPieWidgetBy'
import {Panel, PanelBody} from '@/shared/Panel'
import {MapSvgByOblast} from '@/shared/maps/MapSvgByOblast'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'

const mapOblast = OblastIndex.koboOblastIndexIso

const isNfiPdm = (_: PdmData<PdmForm>): _ is PdmData<Meal_nfiPdm.T> => {
  return _.type === 'Nfi'
}

export const MealPdmNfiDashboard = () => {
  const ctx = useMealPdmContext()
  const ctxSchema = useKoboSchemaContext()
  const schema = ctxSchema.byName.meal_nfiPdm.get!
  const {shape: commonShape} = usePdmFilters(ctx.fetcherAnswers.get)
  const langIndex = ctxSchema.langIndex
  const {m, formatDateTime, formatDate} = useI18n()
  const [optionFilter, setOptionFilters] = useState<Record<string, string[] | undefined>>({})
  const filterShape = useMemo(() => {
    return DataFilter.makeShape(commonShape)
  }, [commonShape])

  const data = useMemo(() => {
    return map(ctx.fetcherAnswers.get, (_) => {
      return seq(DataFilter.filterData(_.filter(isNfiPdm), filterShape, optionFilter))
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
                  title={m.mealMonitoringPdm.satisfiedProcess}
                  data={data}
                  filter={(_) =>
                    _.answers.process_assistance_delivery === 'excellent' ||
                    _.answers.process_assistance_delivery === 'vbad'
                  }
                  filterBase={(_) =>
                    _.answers.process_assistance_delivery === 'excellent' ||
                    _.answers.process_assistance_delivery === 'vbad' ||
                    _.answers.process_assistance_delivery === 'satisfactory'
                  }
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.eskUseful}
                  data={data}
                  filter={(_) => _.answers.kit_useful === 'yes'}
                  filterBase={(_) =>
                    _.answers.kit_useful === 'yes' || _.answers.kit_useful === 'no' || _.answers.kit_useful === 'yeb'
                  }
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.treated}
                  data={data}
                  filter={(_) => _.answers.treated_respect_staff === 'yesc'}
                  filterBase={(_) =>
                    _.answers.treated_respect_staff === 'yesc' ||
                    _.answers.treated_respect_staff === 'myes' ||
                    _.answers.treated_respect_staff === 'notr' ||
                    _.answers.treated_respect_staff === 'nota' ||
                    _.answers.treated_respect_staff === 'dk' ||
                    _.answers.treated_respect_staff === 'na'
                  }
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.eskContent}
                  data={data}
                  filter={(_) => _.answers.satisfied_kit_contents === 'yesc'}
                  filterBase={(_) =>
                    _.answers.satisfied_kit_received === 'yesc' ||
                    _.answers.satisfied_kit_received === 'myes' ||
                    _.answers.satisfied_kit_received === 'notr' ||
                    _.answers.satisfied_kit_received === 'nota' ||
                    _.answers.satisfied_kit_received === 'dk' ||
                    _.answers.satisfied_kit_received === 'na'
                  }
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.contentEnough}
                  data={data}
                  filter={(_) => _.answers.you_quantity_given === 'yes'}
                  filterBase={(_) => _.answers.you_quantity_given === 'yes' || _.answers.you_quantity_given === 'no'}
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.satisfiedKits}
                  data={data}
                  filter={(_) => _.answers.satisfied_kit_received === 'yesc'}
                  filterBase={(_) =>
                    _.answers.satisfied_kit_received === 'yesc' ||
                    _.answers.satisfied_kit_received === 'myes' ||
                    _.answers.satisfied_kit_received === 'notr' ||
                    _.answers.satisfied_kit_received === 'nota' ||
                    _.answers.satisfied_kit_received === 'dk' ||
                    _.answers.satisfied_kit_received === 'na'
                  }
                />
                <ChartPieWidgetBy
                  dense
                  title={m.mealMonitoringPdm.satisfiedNumber}
                  data={data}
                  filter={(_) => _.answers.satisfied_kit_number === 'yesc'}
                  filterBase={(_) =>
                    _.answers.satisfied_kit_number === 'yesc' ||
                    _.answers.satisfied_kit_number === 'myes' ||
                    _.answers.satisfied_kit_number === 'notr' ||
                    _.answers.satisfied_kit_number === 'nota' ||
                    _.answers.satisfied_kit_number === 'dk' ||
                    _.answers.satisfied_kit_number === 'na'
                  }
                />
              </SlidePanel>
              <Panel savableAsImg expendable title={m.location}>
                <PanelBody>
                  <MapSvgByOblast
                    sx={{maxWidth: 480, margin: 'auto'}}
                    fillBaseOn="value"
                    data={data}
                    getOblast={(_) => mapOblast[_.answers.oblast!]}
                    value={(_) => true}
                    base={(_) => _.answers.oblast !== undefined}
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
              <SlidePanel title={m.mealMonitoringPdm.kitReceived}>
                <ChartBarMultipleBy
                  data={data}
                  by={(_) => _.answers.you_receive_kit_yes}
                  label={Meal_nfiPdm.options.received_number_communicated_yes}
                />
              </SlidePanel>
            </Div>
            <Div column sx={{maxHeight: '50%'}}>
              <SlidePanel title={m.mealMonitoringPdm.needsShelter}>
                <ChartBarSingleBy
                  data={data}
                  by={(_) => _.answers.items_received_needed}
                  label={Meal_nfiPdm.options.items_received_needed}
                />
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringPdm.qualityKit}>
                <ChartBarSingleBy
                  data={data}
                  by={(_) => _.answers.quality_meet_needs}
                  label={Meal_nfiPdm.options.quality_meet_needs}
                />
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringPdm.carryKit}>
                <ChartBarSingleBy
                  data={data}
                  by={(_) => _.answers.carry_kit_received}
                  label={Meal_nfiPdm.options.carry_kit_received}
                />
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringPdm.priorityNeeds}>
                <ChartBarMultipleBy
                  data={data}
                  by={(_) => _.answers.types_humanitarian_assistance}
                  label={Meal_nfiPdm.options.types_humanitarian_assistance}
                />
              </SlidePanel>
            </Div>
          </Div>
        </>
      )}
    </Page>
  )
}
