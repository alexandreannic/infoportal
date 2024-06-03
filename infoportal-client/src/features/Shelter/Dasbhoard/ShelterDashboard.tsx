import {Page} from '@/shared/Page'
import {UseShelterComputedData, useShelterComputedData} from '@/features/Shelter/Dasbhoard/useShelterComputedData'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {Lazy} from '@/shared/Lazy'
import React, {useMemo, useState} from 'react'
import {Box} from '@mui/material'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {useI18n} from '@/core/i18n'
import {Enum, fnSwitch, seq, Seq} from '@alexandreannic/ts-utils'
import {
  DrcOffice,
  KoboValidation,
  OblastIndex,
  Period,
  PeriodHelper,
  Shelter_NTA,
  ShelterContractor,
  shelterDrcProject,
  ShelterProgress,
  ShelterTaPriceLevel
} from '@infoportal-common'
import {ChartHelperOld, makeChartData} from '@/shared/charts/chartHelperOld'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {Currency} from '@/features/Mpca/Dashboard/MpcaDashboard'
import {DashboardFilterLabel} from '@/shared/DashboardLayout/DashboardFilterLabel'
import {useAppSettings} from '@/core/context/ConfigContext'
import {ChartBar} from '@/shared/charts/ChartBar'
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import {Panel, PanelBody} from '@/shared/Panel'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {ShelterEntity} from '@/core/sdk/server/shelter/ShelterEntity'
import {useShelterContext} from '@/features/Shelter/ShelterContext'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {ChartPieWidgetBy} from '@/shared/charts/ChartPieWidgetBy'
import {DataFilterLayout} from '@/shared/DataFilter/DataFilterLayout'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {AgeGroupTable} from '@/shared/AgeGroupTable'
import {appConfig} from '@/conf/AppConfig'

const today = new Date()

// TODO Data re-fetched from ShelterTable to display data from all offices no matter accesses. Need to find a more proper way
export const ShelterDashboard = () => {
  const ctx = useShelterContext()
  const [currency, setCurrency] = usePersistentState<Currency>(Currency.USD, {storageKey: 'mpca-dashboard-currency'})
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})
  const [workDonePeriodFilter, setWorkDonePeriodFilter] = useState<Partial<Period>>({})
  const {m} = useI18n()

  const filterShape = useMemo(() => {
    return DataFilter.makeShape<ShelterEntity>({
      office: {
        icon: 'business',
        label: m.office,
        getValue: _ => _.office,
        getOptions: (get) => DataFilter.buildOptionsFromObject(DrcOffice),
      },
      oblast: {
        icon: 'location_on',
        label: m.oblast,
        getValue: _ => _.oblast,
        getOptions: (get) => get().map(_ => _.oblast)
          .compact()
          .distinct(_ => _)
          .sort()
          .map(_ => ({value: _, label: _}))
      },
      raion: {
        label: m.raion,
        getValue: _ => _.nta?.ben_det_raion,
        getOptions: (get) => get().map(_ => _.nta?.ben_det_raion).compact()
          .distinct(_ => _)
          .sort().map(_ => ({value: _, label: ctx.nta.schema.translate.choice('ben_det_raion', _)}))
      },
      hromada: {
        label: m.hromada,
        getValue: _ => _.nta?.ben_det_hromada,
        getOptions: (get) => get()
          .map(_ => _.nta?.ben_det_hromada)
          .compact()
          .distinct(_ => _)
          .sort()
          .map(_ => ({value: _, label: ctx.nta.schema.translate.choice('ben_det_hromada', _)}))
      },
      settlement: {
        // icon: 'location_on',
        label: m.settlement,
        getValue: _ => _.nta?.settlement,
        getOptions: (get) => get().map(_ => _.nta?.settlement)
          .compact()
          .distinct(_ => _)
          .sort()
          .map(_ => ({value: _, label: _}))
      },
      project: {
        multiple: true,
        icon: appConfig.icons.project,
        label: m.project,
        getValue: _ => _.nta?.tags?.project,
        getOptions: (get) => DataFilter.buildOptions(shelterDrcProject, true)
      },
      validationStatus: {
        icon: 'check',
        label: m._shelter.validationStatus,
        getValue: _ => _.nta?.tags?._validation,
        getOptions: (get) => DataFilter.buildOptionsFromObject(KoboValidation),
      },
      status: {
        icon: 'engineering',
        label: m._shelter.progressStatus,
        getValue: _ => _.ta?.tags?.progress,
        getOptions: (get) => DataFilter.buildOptionsFromObject(ShelterProgress),
      },
      modality: {
        icon: 'attach_money',
        label: m.modality,
        getValue: _ => _.nta?.modality,
        getOptions: (get) => get()
          .map(_ => _.nta?.modality)
          .distinct(_ => _)
          .compact()
          .map(_ => DataFilter.buildOption(_, ctx.nta.schema.translate.choice('modality', _)))
      },
      accommodation: {
        icon: 'home',
        label: m._shelter.accommodation,
        getValue: _ => _.nta?.dwelling_type ?? DataFilter.blank,
        getOptions: (get) => [
          DataFilter.blankOption,
          ...get()
            .map(_ => _.nta?.dwelling_type)
            .distinct(_ => _)
            .compact()
            .map(_ => DataFilter.buildOption(_, ctx.nta.schema.translate.choice('dwelling_type', _)))
        ],
      },
      damageLevel: {
        icon: 'construction',
        label: m.levelOfPropertyDamaged,
        getValue: _ => _.ta?.tags?.damageLevel,
        getOptions: (get) => DataFilter.buildOptionsFromObject(ShelterTaPriceLevel),
      },
      contractor: {
        icon: 'gavel',
        label: m._shelter.contractor,
        customFilter: (filters, _) => filters.includes(_.ta?.tags?.contractor1!) || filters.includes(_.ta?.tags?.contractor2!),
        getOptions: (get) => ctx.contractors.map(_ => _.),
      },
      vulnerabilities: {
        icon: appConfig.icons.disability,
        label: m.vulnerabilities,
        getValue: _ => _.nta?.hh_char_dis_select,
        getOptions: (get) => ctx.nta.schema.schemaHelper.getOptionsByQuestionName('hh_char_dis_select').map(_ => ({value: _.name, label: _.label[ctx.langIndex]})),
        multiple: true,
      },
      displacementStatus: {
        icon: appConfig.icons.displacementStatus,
        label: m.displacement,
        getValue: _ => _.nta?.ben_det_res_stat,
        getOptions: (get) => ctx.nta.schema.schemaHelper.getOptionsByQuestionName('ben_det_res_stat').map(_ => ({value: _.name, label: _.label[ctx.langIndex]}))
      },
    })
  }, [ctx.data.mappedData])

  const [filters, setFilters] = usePersistentState<DataFilter.InferShape<typeof filterShape>>({}, {storageKey: 'shelter-dashboard'})

  const filteredByDate = useMemo(() => {
    if (!ctx.data.mappedData) return
    return seq(ctx.data.mappedData).filter(d => {
      return PeriodHelper.isDateIn(periodFilter, d.nta?.submissionTime) && PeriodHelper.isDateIn(workDonePeriodFilter, d.ta?.tags?.workDoneAt)
    })
  }, [ctx.data, periodFilter, workDonePeriodFilter])

  const filteredData = useMemo(() => {
    if (!filteredByDate) return
    return DataFilter.filterData(filteredByDate, filterShape, filters)
  }, [filteredByDate, filters, filterShape,])

  const computed = useShelterComputedData({data: filteredData})

  return (
    <Page loading={ctx.data.fetching} width="lg">
      <DataFilterLayout
        sx={{mb: 1}}
        filters={filters}
        setFilters={setFilters}
        data={filteredByDate}
        shapes={filterShape}
        onClear={() => {
          setFilters({})
          setPeriodFilter({})
          setWorkDonePeriodFilter({})
        }}
        before={
          <>
            <PeriodPicker
              defaultValue={[periodFilter.start, periodFilter.end]}
              onChange={([start, end]) => setPeriodFilter(prev => ({...prev, start, end}))}
              label={[m.submissionStart, m.endIncluded]}
              max={today}
            />
            <PeriodPicker
              defaultValue={[workDonePeriodFilter.start, workDonePeriodFilter.end]}
              onChange={([start, end]) => setWorkDonePeriodFilter(prev => ({...prev, start, end}))}
              label={[m._shelter.workDoneStart, m.endIncluded]}
              max={today}
            />
            <DashboardFilterLabel icon="attach_money" active={true} label={currency}>
              {() => (
                <Box sx={{p: 1}}>
                  <ScRadioGroup value={currency} onChange={setCurrency} inline dense>
                    <ScRadioGroupItem value={Currency.USD} title="USD" sx={{width: '100%'}}/>
                    <ScRadioGroupItem value={Currency.UAH} title="UAH" sx={{width: '100%'}}/>
                  </ScRadioGroup>
                </Box>
              )}
            </DashboardFilterLabel>
          </>
        }
      />

      {filteredData && computed && (
        <_ShelterDashboard
          data={filteredData}
          computed={computed}
          currency={currency}
        />
      )}
    </Page>
  )
}

export const _ShelterDashboard = ({
  data,
  currency,
  computed,
}: {
  currency: Currency
  data: Seq<ShelterEntity>
  computed: NonNullable<UseShelterComputedData>
}) => {
  const {m, formatLargeNumber} = useI18n()
  const {conf} = useAppSettings()

  return (
    <Div responsive>
      <Div column>
        <Div>
          <SlideWidget title={m.households} icon="home">
            {formatLargeNumber(data.length)}
          </SlideWidget>
          <SlideWidget title={m.individuals} icon="person">
            {formatLargeNumber(computed.persons.length)}
          </SlideWidget>
          <SlideWidget title={m.hhSize} icon="person">
            {formatLargeNumber(computed.persons.length / data.length, {maximumFractionDigits: 2})}
          </SlideWidget>
        </Div>
        <Panel title={m.project}>
          <PanelBody>
            <ChartBarMultipleBy
              data={data}
              by={_ => _.nta?.tags?.project!}
            />
          </PanelBody>
        </Panel>
        <Panel title={m.ageGroup}>
          <PanelBody>
            <AgeGroupTable tableId="shelter-dashboard-ag" persons={computed.persons}/>
          </PanelBody>
        </Panel>
        <SlidePanel>
          <ChartPieWidgetBy
            title={m.vulnerabilities}
            filter={_ => !_.nta?.hh_char_dis_select?.includes('diff_none')}
            filterBase={_ => !!_.nta?.hh_char_dis_select!}
            data={data}
          />
          <ChartBarMultipleBy
            data={data.filter(_ => !!_.nta?.hh_char_dis_select)}
            by={_ => _.nta?.hh_char_dis_select ?? []}
            label={Shelter_NTA.options.hh_char_dis_select}
          />
        </SlidePanel>
        <SlidePanel title={m.status}>
          <ChartBarSingleBy
            data={data.filter(_ => !!_.nta?.ben_det_res_stat)}
            by={_ => _.nta?.ben_det_res_stat}
            label={Shelter_NTA.options.ben_det_res_stat}
          />
        </SlidePanel>
      </Div>
      <Div column>
        <Div>
          <Lazy deps={[data]} fn={() => {
            const assisted = data.filter(_ => !!_.ta?._price)
            return {
              amount: assisted.sum(_ => _.ta?._price ?? 0) * fnSwitch(currency, {[Currency.UAH]: 1, [Currency.USD]: conf.uahToUsd}),
              assistedHhs: assisted.length,
            }
          }}>
            {_ => (
              <>
                <SlideWidget title={m._shelter.repairCost} icon="savings">
                  <>{formatLargeNumber(_.amount, {maximumFractionDigits: 0})} {currency}</>
                </SlideWidget>
                <SlideWidget title={m._shelter.repairCostByHh} icon="real_estate_agent">
                  <>{formatLargeNumber(_.amount / _.assistedHhs, {maximumFractionDigits: 0})} {currency}</>
                </SlideWidget>
              </>
            )}
          </Lazy>
        </Div>
        <Panel title={m._shelter.assessmentLocations}>
          <PanelBody>
            <Lazy deps={[data]} fn={() => {
              const gb = seq(data).groupBy(_ => OblastIndex.byKoboName(_.nta?.ben_det_oblast)?.iso!)
              return new Enum(gb).transform((k, v) => [k, makeChartData({value: v.length})]).get()
            }}>
              {_ => <UkraineMap data={_} sx={{mx: 1}} maximumFractionDigits={0} base={data.length}/>}
            </Lazy>
          </PanelBody>
        </Panel>
        <Lazy deps={[data]} fn={() => {
          const contractors = data.map(_ => seq([_.ta?.tags?.contractor1 ?? undefined, _.ta?.tags?.contractor2 ?? undefined]).compact()).filter(_ => _.length > 0)
          return {
            count: contractors.length,
            contractors: ChartHelperOld.multiple({
              data: contractors,
              base: 'percentOfTotalChoices',
              filterValue: [undefined as any]
            })
          }
        }}>
          {_ => (
            <Panel>
              <PanelBody>
                <ChartPieWidget title={m._shelter.assignedContractor} value={_.count} base={data.length}/>
                <ChartBar data={_.contractors}/>
              </PanelBody>
            </Panel>
          )}
        </Lazy>
        <SlidePanel title={m.status}>
          <ChartBarSingleBy
            data={data}
            filter={_ => !!_.ta?.tags?.damageLevel}
            by={_ => _.ta?.tags?.damageLevel}
            label={ShelterTaPriceLevel}
          />
        </SlidePanel>
      </Div>
    </Div>
  )
}
