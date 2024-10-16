import React, {useEffect} from 'react'
import {drcDonorTranlate, DrcProgram, DrcSector, IKoboMeta, KoboMetaStatus, KoboValidation, OblastIndex, Period, PeriodHelper, Person} from 'infoportal-common'
import {Div, PdfSlide, PdfSlideBody, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {addMonths, differenceInMonths, format} from 'date-fns'
import {ThemeProvider, useTheme} from '@mui/material'
import {MetaDashboardProvider, useMetaContext} from '@/app/meta/MetaContext'
import {useI18n} from '@/core/i18n'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {Lazy} from '@/shared/Lazy'
import {Obj, seq} from '@alexandreannic/ts-utils'
import {ChartLine} from '@/shared/charts/ChartLine'
import {MapSvgByOblast} from '@/shared/maps/MapSvgByOblast'
import {PanelWBody} from '@/shared/Panel/PanelWBody'
import {snapshotColors} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {ChartBarStacker} from '@/shared/charts/ChartBarStacked'
import {ChartPieWidgetBy} from '@/shared/charts/ChartPieWidgetBy'
import {MetaSnapshotHeader, MetaSnapshotProps} from './MetaSnapshot'
import {useKoboAnswersContext} from '@/core/context/KoboAnswers'
import {muiTheme} from '@/core/theme'
import {useAppSettings} from '@/core/context/ConfigContext'

export const MetaSnapshotEcrec = (p: MetaSnapshotProps) => {
  const {theme} = useAppSettings()
  return (
    <ThemeProvider theme={muiTheme({...theme.appThemeParams, mainColor: '#00c5b2'})}>
      <MetaDashboardProvider storageKeyPrefix="ss">
        <Cp {...p}/>
      </MetaDashboardProvider>
    </ThemeProvider>
  )
}

const estimatedSectoralCashAssistanceUah = 221 * 41 // Isabelle amount * current USD exchange rate

export const Cp = ({period}: MetaSnapshotProps) => {
  const monthsList = Array.from({length: differenceInMonths(new Date(period.end), new Date(period.start)) + 1}, (_, i) =>
    format(addMonths(new Date(period.start), i), 'yyyy-MM')
  )

  const t = useTheme()
  const {m, formatLargeNumber} = useI18n()
  const fetcherVet = useKoboAnswersContext().byName('ecrec_vetEvaluation')
  const {data: ctx, fetcher} = useMetaContext()
  useEffect(() => {
    fetcherVet.fetch()
    ctx.setShapeFilters({sector: [DrcSector.Livelihoods]})
    ctx.setPeriod(period)
  }, [])

  const filteredVet = seq(fetcherVet.get?.data ?? []).filter(_ => PeriodHelper.isDateIn(period, _.date))
  if (!ctx.period.start || !ctx.period.end) return 'Set a period'
  const flatData = ctx.filteredData.flatMap(_ => _.persons?.map(p => ({...p, ..._})) ?? [])
  const filteredCashData = ctx.filteredData.filter(_ => [
    DrcProgram.SectoralCashForAgriculture,
    DrcProgram.SectoralCashForAnimalShelterRepair,
    DrcProgram.SectoralCashForAnimalFeed,
  ].includes(_.activity!))

  return (
    <PdfSlide format="vertical">
      <MetaSnapshotHeader
        period={ctx.period as Period}
        subTitle="Livelihoods"
      />
      <PdfSlideBody>
        <Div column>
          <Div column>
            <Div column>
              <Div>
                <SlideWidget sx={{flex: 1}} icon="home" title="Households">
                  {formatLargeNumber(ctx.filteredUniqueData.length)}
                </SlideWidget>
                <SlideWidget sx={{flex: 1}} icon="group" title="Average HH size">
                  {(ctx.filteredUniquePersons.length / ctx.filteredUniqueData.length).toFixed(2)}
                </SlideWidget>
                <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
                  {formatLargeNumber(ctx.filteredPersons.length)}
                </SlideWidget>
                <SlideWidget sx={{flex: 1}} icon="person_remove" title={m.uniqIndividuals}>
                  {formatLargeNumber(ctx.filteredUniquePersons.length)}
                </SlideWidget>
              </Div>
            </Div>
          </Div>
          <Div>
            <Div column>
              <PanelWBody title="Households reached by Oblast">
                <MapSvgByOblast
                  sx={{mx: 1.5, mt: -1, mb: -1.5}}
                  getOblast={_ => OblastIndex.byName(_.oblast).iso}
                  data={ctx.filteredData}
                  fillBaseOn="value"
                />
              </PanelWBody>
              <PanelWBody title="Donors">
                <ChartBarMultipleBy
                  data={flatData}
                  label={drcDonorTranlate}
                  by={_ => _.donor ?? []}
                />
              </PanelWBody>
              <PanelWBody title={m.ageGroup}>
                <Lazy deps={[ctx.filteredData]} fn={(d) => {
                  const gb = Person.groupByGenderAndGroup(Person.ageGroup.ECHO, true)(d?.flatMap(_ => _.persons ?? [])!)
                  return new Obj(gb).entries().map(([k, v]) => ({key: k, ...v}))
                }}>
                  {_ => <ChartBarStacker data={_} height={157} sx={{mb: -1, mr: -2}}/>}
                </Lazy>
              </PanelWBody>
              <Div>
                <Div column>
                  <PanelWBody sx={{mb: 0}}>
                    <ChartPieWidgetBy
                      dense
                      title="Females"
                      data={ctx.filteredUniquePersons}
                      filter={_ => _.gender === Person.Gender.Female}
                    />
                  </PanelWBody>
                </Div>
                <Div column>
                  <PanelWBody sx={{mb: 0}}>
                    <ChartPieWidgetBy
                      dense
                      title={<span style={{textTransform: 'none'}}>PwDs</span>}
                      data={ctx.filteredUniquePersons}
                      filter={_ => (_.disability ?? []).length > 0}
                    />
                  </PanelWBody>
                </Div>
              </Div>
              <PanelWBody title={m.displacementStatus}>
                <ChartBarSingleBy
                  data={ctx.filteredPersons}
                  by={_ => _.displacement}
                  label={{
                    Idp: 'IDP',
                    Returnee: 'Returnee',
                    Refugee: 'Refugee',
                    NonDisplaced: 'Non-displaced',
                  }}
                />
              </PanelWBody>
            </Div>
            <Div column>
              <PanelWBody>
                <Lazy deps={[ctx.filteredData]} fn={(d) => {
                  const gb = d.groupBy(d => format(d.date, 'yyyy-MM'))
                  const gbByCommittedDate = d.groupBy(d => d.lastStatusUpdate ? format(d.lastStatusUpdate!, 'yyyy-MM') : '')
                  const months = seq([...Obj.keys(gb), ...Obj.keys(gbByCommittedDate)]).distinct(_ => _).sort()
                  return months.map(month => ({
                    name: month,
                    count: gb[month].length,
                    committed: gbByCommittedDate[month]?.filter(_ => _.status === KoboMetaStatus.Committed).length
                  }))
                }}>
                  {_ => (
                    <ChartLine
                      fixMissingMonths
                      height={180}
                      hideYTicks={true}
                      data={_ as any}
                      colors={() => snapshotColors(t)}
                      hideLabelToggle
                    />
                  )}
                </Lazy>
              </PanelWBody>
              <PanelWBody title="Activities">
                <ChartBarSingleBy
                  data={ctx.filteredData}
                  by={_ => m.activitiesMerged_[_.activity!]}
                  limit={5}
                />
              </PanelWBody>

              <PanelWBody>
                <SlideWidget title="Estimated Sectoral Cash Provided " sx={{mt: 0, pt: 0, mb: -1}}>
                  ~ {formatLargeNumber(filteredCashData.filter(_ => _.status === KoboMetaStatus.Committed).length * estimatedSectoralCashAssistanceUah)} UAH
                </SlideWidget>
                <Lazy deps={[filteredCashData]} fn={(d) => {
                  const supposed = d.groupBy(d => format(d.date, 'yyyy-MM'))
                  const final = d
                    .filter((_: IKoboMeta) => _.status === KoboMetaStatus.Committed)
                    .compactBy('lastStatusUpdate')
                    .groupBy((_: IKoboMeta) => format(_.lastStatusUpdate!, 'yyyy-MM'))

                  return monthsList
                    .map(m => ({
                      name: m,
                      'Provided': (final[m]?.length ?? 0) * estimatedSectoralCashAssistanceUah,
                      'Planned': (supposed[m]?.length ?? 0) * estimatedSectoralCashAssistanceUah,
                    }))
                }}>
                  {_ => (
                    <ChartLine
                      height={180}
                      data={_ as any}
                      hideLabelToggle
                    />
                  )}
                </Lazy>
              </PanelWBody>
              <PanelWBody>
                <SlideWidget title="Estimated Cash Provided for VET" sx={{mt: 0, pt: 0, mb: -1}}>
                  ~ {formatLargeNumber(filteredVet.filter(_ => _.tags?._validation === KoboValidation.Approved).sum(_ => _.grant_amount ?? 0))} UAH
                </SlideWidget>
                <Lazy deps={[filteredVet]} fn={(d) => {
                  const all = d.groupBy(d => format(d.date, 'yyyy-MM'))
                  return monthsList
                    .map(m => ({
                      name: m,
                      'Provided': seq(all[m]).filter(_ => _.tags?._validation === KoboValidation.Approved).sum(_ => _.grant_amount ?? 0),
                      'Planned': seq(all[m]).sum(_ => _.grant_amount ?? 0),
                    }))
                }}>
                  {_ => (
                    <ChartLine
                      height={180}
                      data={_ as any}
                      hideLabelToggle
                    />
                  )}
                </Lazy>
              </PanelWBody>
            </Div>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}