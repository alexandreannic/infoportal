import React, {useEffect} from 'react'
import {drcDonorTranlate, OblastIndex, Period, Person, WgDisability} from 'infoportal-common'
import {Div, PdfSlide, PdfSlideBody, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {format} from 'date-fns'
import {useTheme} from '@mui/material'
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

export const MetaSnapshotOverview = (p: MetaSnapshotProps) => {
  return (
    <MetaDashboardProvider storageKeyPrefix="ss">
      <Cp {...p}/>
    </MetaDashboardProvider>
  )
}

export const Cp = ({period}: MetaSnapshotProps) => {
  const {data: ctx, fetcher} = useMetaContext()
  useEffect(() => {
    ctx.clearAllFilter()
    ctx.setPeriod(period)
  }, [])
  const t = useTheme()
  const {m, formatLargeNumber} = useI18n()
  if (!ctx.period.start || !ctx.period.end) return 'Set a period'
  const flatData = ctx.filteredData.flatMap(_ => _.persons?.map(p => ({...p, ..._})) ?? [])
  return (
    <PdfSlide format="vertical">
      <MetaSnapshotHeader period={ctx.period as Period} subTitle="Overview"/>
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
              <PanelWBody title="Individuals reached by Oblast">
                <MapSvgByOblast
                  sx={{mx: 1.5, mt: -1, mb: -1.5}}
                  getOblast={_ => OblastIndex.byName(_.oblast).iso}
                  data={flatData}
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
                      title={<span style={{textTransform: 'none'}}>PwDs</span>}
                      data={ctx.filteredUniquePersons}
                      filter={_ => (_.disability ?? []).length > 0}
                    />
                  </PanelWBody>
                </Div>
              </Div>
              <PanelWBody title="Most Reported Access Issues">
                <ChartBarMultipleBy
                  data={ctx.filteredPersons}
                  filterValue={[WgDisability.None]}
                  by={_ => _.disability}
                  limit={3}
                  label={m.disability_}
                />
              </PanelWBody>
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
                <Lazy deps={[ctx.filteredData]} fn={() => {
                  const gb = ctx.filteredData.groupBy(d => format(d.date, 'yyyy-MM'))
                  const gbByCommittedDate = ctx.filteredData.groupBy(d => d.lastStatusUpdate ? format(d.lastStatusUpdate!, 'yyyy-MM') : '')
                  return new Obj(gb)
                    .map((k, v) => [k, {
                      count: v.length,
                      // committed: gbByCommittedDate[k]?.filter(_ => _.status === KoboMetaStatus.Committed).length
                    }])
                    .sort(([ka], [kb]) => ka.localeCompare(kb))
                    .entries()
                    .map(([k, v]) => ({
                      name: k,
                      'Registration': v.count,
                      // 'Assistance': v.committed,
                    }))
                }}>
                  {_ => (
                    <ChartLine
                      fixMissingMonths
                      height={200}
                      sx={{mb: -1.5}}
                      hideYTicks={true}
                      data={_ as any}
                      colors={() => snapshotColors(t)}
                      hideLabelToggle
                    />
                  )}
                </Lazy>
              </PanelWBody>
              <PanelWBody title="Programs">
                <ChartBarSingleBy
                  data={flatData}
                  by={_ => _.sector}
                />
              </PanelWBody>
              <PanelWBody title="Donors">
                <ChartBarMultipleBy
                  data={flatData}
                  label={drcDonorTranlate}
                  by={_ => _.donor ?? []}
                />
              </PanelWBody>
            </Div>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}