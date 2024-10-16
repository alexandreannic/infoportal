import React, {useEffect, useMemo} from 'react'
import {add, DisplacementStatus, drcDonorTranlate, DrcSector, KoboMetaStatus, OblastIndex, Period, PeriodHelper, Person} from 'infoportal-common'
import {Div, PdfSlide, PdfSlideBody, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {format} from 'date-fns'
import {ThemeProvider, useTheme} from '@mui/material'
import {MetaDashboardProvider, useMetaContext} from '@/app/meta/MetaContext'
import {useI18n} from '@/core/i18n'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {Lazy} from '@/shared/Lazy'
import {Obj} from '@alexandreannic/ts-utils'
import {ChartLine} from '@/shared/charts/ChartLine'
import {MapSvgByOblast} from '@/shared/maps/MapSvgByOblast'
import {PanelWBody} from '@/shared/Panel/PanelWBody'
import {snapshotColors} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {ChartBarStacker} from '@/shared/charts/ChartBarStacked'
import {ChartPieWidgetBy} from '@/shared/charts/ChartPieWidgetBy'
import {MetaSnapshotHeader, MetaSnapshotProps} from './MetaSnapshot'
import {useShelterData} from '@/features/Shelter/useShelterData'
import {muiTheme} from '@/core/theme'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Txt} from '@/shared/Txt'
import {Panel} from '@/shared/Panel/Panel'
import {ChartBar} from '@/shared/charts/ChartBar'
import {PanelBody, PanelTitle} from '@/shared/Panel'

export const MetaSnapshotSnfi = (p: MetaSnapshotProps) => {
  const {theme} = useAppSettings()
  return (
    <ThemeProvider theme={muiTheme({...theme.appThemeParams, mainColor: '#ff9100'})}>
      <MetaDashboardProvider storageKeyPrefix="ss">
        <Cp {...p}/>
      </MetaDashboardProvider>
    </ThemeProvider>
  )
}

export const Cp = ({period}: MetaSnapshotProps) => {
  const t = useTheme()
  const {m, formatLargeNumber} = useI18n()
  const fetcherShelterData = useShelterData()
  useEffect(() => {
    fetcherShelterData.fetchAll()
  }, [])
  const {
    filteredDataRepair,
    filteredDataRepairDone,
    filterDataRepairHouse,
    filteredDataRepairDoneByAcc,
    filteredDataRepairPlannedByAcc,
    filterDataRepairApt,
  } = useMemo(() => {
    const filteredDataRepair = fetcherShelterData.mappedData.filter(_ => _.nta?.modality === 'contractor' && PeriodHelper.isDateIn(period, _.ta?.date))
    return {
      filteredDataRepair,
      filteredDataRepairDone: filteredDataRepair.filter(_ => !!_.ta?.tags?.workDoneAt),
      filteredDataRepairPlannedByAcc: filteredDataRepair.groupByAndApply(_ => _.nta?.dwelling_type!, _ => _.length),
      filteredDataRepairDoneByAcc: filteredDataRepair.filter(_ => !!_.ta?.tags?.workDoneAt).groupByAndApply(_ => _.nta?.dwelling_type!, _ => _.length),
      filterDataRepairHouse: filteredDataRepair.filter(_ => _.nta?.dwelling_type === 'house'),
      filterDataRepairApt: filteredDataRepair.filter(_ => _.nta?.dwelling_type === 'apartment'),
    }
  }, [fetcherShelterData.mappedData])

  const {data: ctx, fetcher} = useMetaContext()
  useEffect(() => {
    ctx.setShapeFilters({sector: [DrcSector.Shelter, DrcSector.NFI]})
    ctx.setPeriod(period)
  }, [])

  if (!ctx.period.start || !ctx.period.end) return 'Set a period'
  const flatData = ctx.filteredData.flatMap(_ => _.persons?.map(p => ({...p, ..._})) ?? [])

  return (
    <PdfSlide format="vertical">
      <MetaSnapshotHeader
        period={ctx.period as Period}
        subTitle="Shelter & NFIs"
      />
      <PdfSlideBody>
        <Div column>
          <Div column>
            <Div column>
              <Div>
                <SlideWidget sx={{flex: 1}} icon="home" title={m.households}>
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
              <PanelWBody title={m.ageGroup}>
                <Lazy deps={[ctx.filteredData]} fn={(d) => {
                  const gb = Person.groupByGenderAndGroup(Person.ageGroup.ECHO, true)(d?.flatMap(_ => _.persons ?? [])!)
                  return new Obj(gb).entries().map(([k, v]) => ({key: k, ...v}))
                }}>
                  {_ => <ChartBarStacker data={_} height={156} sx={{mb: -1, mr: -2}}/>}
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
                      title={<span style={{textTransform: 'none'}}>IDPs</span>}
                      data={ctx.filteredUniquePersons}
                      filter={_ => _.displacement === DisplacementStatus.Idp}
                    />
                  </PanelWBody>
                </Div>
              </Div>
              <PanelWBody title="Donors">
                <ChartBarMultipleBy
                  data={flatData}
                  label={drcDonorTranlate}
                  by={_ => _.donor ?? []}
                />
              </PanelWBody>
              {/*<PanelWBody title={m.displacementStatus}>*/}
              {/*  <ChartBarSingleBy*/}
              {/*    data={ctx.filteredPersons}*/}
              {/*    by={_ => _.displacement}*/}
              {/*    label={{*/}
              {/*      Idp: 'IDP',*/}
              {/*      Returnee: 'Returnee',*/}
              {/*      Refugee: 'Refugee',*/}
              {/*      NonDisplaced: 'Non-displaced',*/}
              {/*    }}*/}
              {/*  />*/}
              {/*</PanelWBody>*/}
            </Div>
            <Div column>
              <PanelWBody>
                <Lazy deps={[ctx.filteredData]} fn={(d) => {
                  const gb = d.groupBy(d => format(d.date, 'yyyy-MM'))
                  const gbByCommittedDate = d.groupBy(d => d.lastStatusUpdate ? format(d.lastStatusUpdate!, 'yyyy-MM') : '')
                  return new Obj(gb)
                    .map((k, v) => [k, {
                      count: v.length,
                      committed: gbByCommittedDate[k]?.filter(_ => _.status === KoboMetaStatus.Committed).length
                    }])
                    .sort(([ka], [kb]) => ka.localeCompare(kb))
                    .entries()
                    .map(([k, v]) => ({'Assistance': v.committed, name: k, 'Registration': v.count,}))
                }}>
                  {_ => (
                    <ChartLine
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
              <Panel>
                <Div>
                  <Div column>
                    <SlideWidget sx={{flex: 1}} icon="home" title="Houses repaired">
                      {formatLargeNumber(filteredDataRepairDoneByAcc.house)}
                      <Txt color="disabled" sx={{fontWeight: 400}}>&nbsp;+{formatLargeNumber(filteredDataRepairPlannedByAcc.house)}</Txt>
                    </SlideWidget>
                  </Div>
                  <Div column>
                    <SlideWidget sx={{flex: 1}} icon="business" title="Apartments repaired">
                      {formatLargeNumber(filteredDataRepairDoneByAcc.apartment)}
                      <Txt color="disabled" sx={{fontWeight: 400}}>&nbsp;+{formatLargeNumber(filteredDataRepairPlannedByAcc.apartment)}</Txt>
                    </SlideWidget>
                  </Div>
                </Div>
                <PanelBody sx={{mt: -2}}>
                  <PanelTitle>Level of damage</PanelTitle>
                  <ChartBarSingleBy data={filteredDataRepairDone} by={_ => _.ta?.tags?.damageLevel}/>
                  {/*<Lazy deps={[filteredDataRepairDone]} fn={d => {*/}
                  {/*  return Obj.entries(d.map(_ => _.ta?.tags?.damageLevel).compact().groupByAndApply(_ => _, _ => _.length)).map(([level, count]) => {*/}
                  {/*    return {*/}
                  {/*      key: level,*/}
                  {/*      count,*/}
                  {/*    }*/}
                  {/*  })*/}
                  {/*}}>*/}
                  {/*  {_ => <ChartBarStacker layout="horizontal" data={_} height={100} hideLegend hideYTicks/>}*/}
                  {/*</Lazy>*/}
                </PanelBody>
              </Panel>
              <Lazy deps={[ctx.filteredData]} fn={() => {
                const d = ctx.filteredData.map(_ => _.tags).compact()
                const total = d.sum(_ => {
                  return add(
                    _.HKF,
                    _.NFKF_KS,
                    _.FoldingBed,
                    _.FKS,
                    _.CollectiveCenterKits,
                    _.BK,
                    _.WKB,
                    _.HKMV,
                    _.ESK,
                  )
                })
                return {
                  total,
                  data: new Obj({
                    [m.nfi_.HKF]: {value: d.sum(_ => _.HKF ?? 0)},
                    [m.nfi_.NFKF_KS]: {value: d.sum(_ => _.NFKF_KS ?? 0)},
                    [m.nfi_.FoldingBed]: {value: d.sum(_ => _.FoldingBed ?? 0)},
                    // [m.nfi_.FKS]: {value: d.sum(_ => _.FKS ?? 0)},
                    // [m.nfi_.CollectiveCenterKits]: {value: d.sum(_ => _.CollectiveCenterKits ?? 0)},
                    [m.nfi_.BK]: {value: d.sum(_ => _.BK ?? 0)},
                    // [m.nfi_.WKB]: {value: d.sum(_ => _.WKB ?? 0)},
                    [m.nfi_.HKMV]: {value: d.sum(_ => _.HKMV ?? 0)},
                    [m.nfi_.ESK]: {value: d.sum(_ => _.ESK ?? 0)},
                  }).sort(([, a], [, b]) => b.value - a.value).get()
                }
              }}>
                {_ => (
                  <PanelWBody title={`Most distributed NFIs (${formatLargeNumber(_.total)} kits)`}>
                    <ChartBar data={_.data}/>
                  </PanelWBody>
                )}
              </Lazy>
              {/*<Div>*/}
              {/*  <Div column>*/}
              {/*    <PanelWBody sx={{mb: 0}}>*/}
              {/*      <ChartPieWidgetBy*/}
              {/*        dense*/}
              {/*        title="Houses repaired"*/}
              {/*        data={filterDataRepairHouse}*/}
              {/*        filter={_ => !!_.ta?.tags?.workDoneAt}*/}
              {/*      />*/}
              {/*    </PanelWBody>*/}
              {/*  </Div>*/}
              {/*  <Div column>*/}
              {/*    <PanelWBody sx={{mb: 0}}>*/}
              {/*      <ChartPieWidgetBy*/}
              {/*        dense*/}
              {/*        title="Appartments repaired"*/}
              {/*        data={filterDataRepairApt}*/}
              {/*        filter={_ => !!_.ta?.tags?.workDoneAt}*/}
              {/*      />*/}
              {/*    </PanelWBody>w*/}
              {/*  </Div>*/}
              {/*</Div>*/}
            </Div>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}