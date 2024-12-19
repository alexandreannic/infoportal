import React, {useMemo, useState} from 'react'
import {map, mapFor, seq, Seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {Box, Icon} from '@mui/material'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import {ChartPieWidgetBy} from '@/shared/charts/ChartPieWidgetBy'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {Lazy} from '@/shared/Lazy'
import {MapSvgByOblast} from '@/shared/maps/MapSvgByOblast'
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import {IpBtn} from '@/shared/Btn'
import {CommentsPanel} from '@/shared/CommentsPanel'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {KoboSubmissionFlat, KoboIndex, Meal_visitMonitoring, OblastIndex} from 'infoportal-common'
import {NavLink} from 'react-router-dom'
import {DataFilterLayout} from '@/shared/DataFilter/DataFilterLayout'
import {useMealVisitContext} from '@/features/Meal/Visit/MealVisitContext'
import {mealIndex} from '@/features/Meal/Meal'
import {Page} from '@/shared/Page'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'

export interface DashboardPageProps {
  filters: Record<string, string[]>
  data: Seq<KoboSubmissionFlat<Meal_visitMonitoring.T>>
}

const mapOblast = OblastIndex.koboOblastIndexIso

export const MealVisitDashboard = () => {
  const ctx = useMealVisitContext()
  const ctxSchema = useKoboSchemaContext()
  const schema = ctxSchema.byName.meal_visitMonitoring.get!
  const langIndex = ctxSchema.langIndex
  const {m, formatDateTime, formatDate} = useI18n()
  const [optionFilter, setOptionFilters] = useState<Record<string, string[] | undefined>>({})

  const filterShape = useMemo(() => {
    return DataFilter.makeShape<KoboSubmissionFlat<Meal_visitMonitoring.T>>({
      oblast: {
        icon: 'location_on',
        getOptions: () => schema.helper.getOptionsByQuestionName('mdro').map(_ => ({value: _.name, label: _.label[langIndex]})),
        label: m.office,
        getValue: _ => _.mdro,
      },
      focalPoint: {
        icon: 'person',
        getOptions: () => schema.helper.getOptionsByQuestionName('mdp').map(_ => ({value: _.name, label: _.label[langIndex]})),
        label: m.focalPoint,
        getValue: _ => _.mdp,
      },
      donor: {
        icon: 'handshake',
        getOptions: () => schema.helper.getOptionsByQuestionName('mdd_001').map(_ => ({value: _.name, label: _.label[langIndex]})),
        label: m.donor,
        getValue: _ => _.mdd_001,
        multiple: true,
      },
      activity: {
        multiple: true,
        icon: 'edit_calendar',
        getOptions: () => schema.helper.getOptionsByQuestionName('mdt').map(_ => ({value: _.name, label: _.label[langIndex]})),
        label: m.project,
        getValue: _ => _.mdt,
      },
      nfi: {
        // icon: 'edit_calendar',
        getOptions: () => schema.helper.getOptionsByQuestionName('pan').map(_ => ({value: _.name, label: _.label[langIndex]})),
        label: m.mealMonitoringVisit.nfiDistribution,
        getValue: _ => _.pan,
        multiple: true,
      },
      ecrec: {
        // icon: 'edit_calendar',
        getOptions: () => schema.helper.getOptionsByQuestionName('pae').map(_ => ({value: _.name, label: _.label[langIndex]})),
        label: m.mealMonitoringVisit.ecrec,
        getValue: _ => _.pae,
      },
      shelter: {
        // icon: 'edit_calendar',
        getOptions: () => schema.helper.getOptionsByQuestionName('pas').map(_ => ({value: _.name, label: _.label[langIndex]})),
        label: m.mealMonitoringVisit.shelter,
        getValue: _ => _.pas,
      },
      lau: {
        // icon: 'edit_calendar',
        getOptions: () => schema.helper.getOptionsByQuestionName('pal').map(_ => ({value: _.name, label: _.label[langIndex]})),
        label: m.mealMonitoringVisit.lau,
        getValue: _ => _.pal,
      },
      protection: {
        // icon: 'edit_calendar',
        getOptions: () => schema.helper.getOptionsByQuestionName('pap').map(_ => ({value: _.name, label: _.label[langIndex]})),
        label: m.mealMonitoringVisit.protection,
        getValue: _ => _.pap,
      },
      eore: {
        // icon: 'edit_calendar',
        getOptions: () => schema.helper.getOptionsByQuestionName('pao').map(_ => ({value: _.name, label: _.label[langIndex]})),
        label: m.mealMonitoringVisit.eore,
        getValue: _ => _.pao,
      },
    })
  }, [schema])

  const data = useMemo(() => {
    return map(ctx.fetcherAnswers.get, _ => seq(DataFilter.filterData(_, filterShape, optionFilter)))
  }, [ctx.fetcherAnswers.get, optionFilter, filterShape])

  return (
    <Page
      width="full"
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
            <Div column>
              <SlidePanel>
                <MapSvgByOblast
                  fillBaseOn="value"
                  data={data}
                  getOblast={_ => mapOblast[_.md_det_oblast!]}
                  value={_ => true}
                  base={_ => _.md_det_oblast !== undefined}
                />
              </SlidePanel>
              <SlidePanel>
                <Box sx={{display: 'flex', '& > *': {flex: 1}}}>
                  <Lazy deps={[data]} fn={() => {
                    const base = data.map(_ => _.sew).compact()
                    return {value: base.sum(), base: base.length * 100}
                  }}>
                    {_ => <ChartPieWidget titleIcon="female" title={m.women} value={_.value} base={_.base}/>}
                  </Lazy>
                  <Lazy deps={[data]} fn={() => {
                    const base = data.map(_ => _.sem).compact()
                    return {value: base.sum(), base: base.length * 100}
                  }}>
                    {_ => <ChartPieWidget titleIcon="male" title={m.men} value={_.value} base={_.base}/>}
                  </Lazy>
                </Box>
              </SlidePanel>
              <SlidePanel title={m.donor}>
                <ChartBarMultipleBy
                  label={Meal_visitMonitoring.options.mdd_001}
                  data={data}
                  by={_ => _.mdd_001}
                />
              </SlidePanel>
              <SlidePanel>
                <ChartPieWidgetBy title={m.mealMonitoringVisit.securityConcerns} filter={_ => _.ssy === 'yes'} data={data} sx={{mb: 1}}/>
                <ChartBarMultipleBy data={data} by={_ => _.sst} label={Meal_visitMonitoring.options.sst}/>
              </SlidePanel>
              <SlidePanel>
                <ChartPieWidgetBy title={m.mealMonitoringVisit.concerns} filter={_ => _.sef === 'yes'} data={data} sx={{mb: 1}}/>
                <ChartBarMultipleBy data={data} by={_ => _.sei} label={Meal_visitMonitoring.options.sei}/>
              </SlidePanel>
              <SlidePanel>
                <ChartPieWidgetBy title={m.mealMonitoringVisit.criticalConcern} filter={_ => _.visf === 'yes'} data={data} sx={{mb: 1}}/>
                <ChartBarMultipleBy data={data} by={_ => _.visp} label={Meal_visitMonitoring.options.visp}/>
              </SlidePanel>
            </Div>

            <Div column sx={{maxHeight: '33%'}}>
              <SlidePanel title={m.mealMonitoringVisit.nfiDistribution}>
                <ChartBarMultipleBy data={data} by={_ => _.pan} label={Meal_visitMonitoring.options.pan}/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringVisit.ecrec}>
                <ChartBarSingleBy data={data} by={_ => _.pae} label={Meal_visitMonitoring.options.pae}/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringVisit.shelter}>
                <ChartBarSingleBy data={data} by={_ => _.pas} label={Meal_visitMonitoring.options.pas}/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringVisit.lau}>
                <ChartBarSingleBy data={data} by={_ => _.pal} label={Meal_visitMonitoring.options.pal}/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringVisit.protection}>
                <ChartBarSingleBy data={data} by={_ => _.pap} label={Meal_visitMonitoring.options.pap}/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringVisit.eore}>
                <ChartBarSingleBy data={data} by={_ => _.pao} label={Meal_visitMonitoring.options.pao}/>
              </SlidePanel>
            </Div>

            <Div column>
              <SlidePanel title={`${m.comments} (${data.length})`} BodyProps={{sx: {pr: 0}}}>
                <Lazy deps={[data]} fn={() => data.map(row => ({
                  id: row.id,
                  title: <>
                    {schema.translate.choice('mdp', row.mdp)}
                    {/*<AAIconBtn>chevron_right</AAIconBtn>*/}
                  </>,
                  date: row.mdd ?? row.end,
                  desc: row.fcpc,
                  children: (
                    <Box>
                      <Box sx={{display: 'flex', flexWrap: 'wrap', '& > *': {mb: 1, mr: 1}}}>
                        {row.fcpl && (
                          <Box component="a" target="_blank" href={row.fcpl} sx={{
                            height: 90,
                            width: 90,
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '6px',
                            justifyContent: 'center',
                            color: t => t.palette.primary.main,
                            border: t => `1px solid ${t.palette.divider}`
                          }}>
                            <Icon>open_in_new</Icon>
                          </Box>
                        )}
                        {mapFor(10, i =>
                          <KoboAttachedImg answerId={row.id} formId={KoboIndex.byName('meal_visitMonitoring').id} key={i} attachments={row.attachments} size={90} fileName={(row as any)['fcp' + (i + 1)]}/>
                        )}
                      </Box>
                      <Box sx={{textAlign: 'right'}}>
                        <NavLink to={mealIndex.siteMap.visit.details(row.id)}>
                          <IpBtn iconAfter="chevron_right">View details</IpBtn>
                        </NavLink>
                      </Box>
                    </Box>
                  )
                }))}>
                  {_ => <CommentsPanel data={_} height={700}/>}
                </Lazy>
              </SlidePanel>
            </Div>
          </Div>
        </>
      )}
    </Page>
  )
}
