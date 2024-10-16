import React, {useMemo} from 'react'
import {DisplacementStatus, drcDonorTranlate, DrcSector, KoboMetaStatus, OblastIndex, Period, PeriodHelper, Person} from 'infoportal-common'
import {Div, PdfSlide, PdfSlideBody, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {Divider, Icon, ThemeProvider, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {Lazy} from '@/shared/Lazy'
import {Obj, seq} from '@alexandreannic/ts-utils'
import {MapSvgByOblast} from '@/shared/maps/MapSvgByOblast'
import {PanelWBody} from '@/shared/Panel/PanelWBody'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {ChartBarStacker} from '@/shared/charts/ChartBarStacked'
import {ChartPieWidgetBy} from '@/shared/charts/ChartPieWidgetBy'
import {MetaSnapshotHeader, MetaSnapshotProps} from './MetaSnapshot'
import {MpcaProvider, useMpcaContext} from '@/features/Mpca/MpcaContext'
import {useMpcaComputed} from '@/features/Mpca/useMpcaComputed'
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import {format} from 'date-fns'
import {ChartLine} from '@/shared/charts/ChartLine'
import {Panel, PanelBody} from '@/shared/Panel'
import {snapshotColors} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {muiTheme} from '@/core/theme'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Txt} from '@/shared/Txt'

export const MetaSnapshotCashAssistance = (p: MetaSnapshotProps) => {
  const {theme} = useAppSettings()
  return (
    <ThemeProvider theme={muiTheme({
      ...theme.appThemeParams,
      mainColor: '#3700b3'
      // mainColor: '#6200ee'
    })}>
      <MpcaProvider>
        <Cp {...p}/>
      </MpcaProvider>
    </ThemeProvider>
  )
}

const Cp = ({period}: MetaSnapshotProps) => {
  const t = useTheme()
  const {m, formatLargeNumber} = useI18n()
  const ctx = useMpcaContext()

  const data = useMemo(() => ctx.data?.filter(_ => PeriodHelper.isDateIn(period, _.date)) ?? seq([]), [ctx.data])
  const dataMpca = data.filter(_ => _.sector === DrcSector.MPCA)
  const persons = data.flatMap(_ => _.persons ?? [])
  const computed = useMpcaComputed({data: dataMpca})
  const totalAmount = useMemo(() => data.sum(_ => _.amountUahFinal ?? 0), [data])

  return (
    <PdfSlide format="vertical">
      <MetaSnapshotHeader
        period={period as Period}
        subTitle="Cash assistance"
      />
      <PdfSlideBody>
        <Div column>
          <Div column>
            <Div column>
              <Div>
                <SlideWidget sx={{flex: 1}} icon="home" title={m.households}>
                  {formatLargeNumber(data.length)}
                </SlideWidget>
                <SlideWidget sx={{flex: 1}} icon="group" title="Average HH size">
                  {(persons.length / data.length).toFixed(2)}
                </SlideWidget>
                <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
                  {formatLargeNumber(persons.length)}
                </SlideWidget>
                <SlideWidget sx={{flex: 1}} icon="person_remove" title={m.uniqIndividuals}>
                  {formatLargeNumber(data.distinct(_ => _.taxId).sum(_ => _.personsCount ?? 0))}
                </SlideWidget>
              </Div>
            </Div>
          </Div>
          <Div>
            <Div column>
              <PanelWBody title="Registrations by Oblast">
                <MapSvgByOblast
                  sx={{mx: 1.5, mt: -1, mb: -1.5}}
                  getOblast={_ => OblastIndex.byName(_.oblast).iso}
                  data={data}
                  fillBaseOn="value"
                />
              </PanelWBody>
              <PanelWBody title={m.ageGroup}>
                <Lazy deps={[data]} fn={(d) => {
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
                      data={persons}
                      filter={_ => _.gender === Person.Gender.Female}
                    />
                  </PanelWBody>
                </Div>
                <Div column>
                  <PanelWBody sx={{mb: 0}}>
                    <ChartPieWidgetBy
                      dense
                      title={<span style={{textTransform: 'none'}}>PwDs</span>}
                      data={persons}
                      filter={_ => (_.disability ?? []).length > 0}
                    />
                  </PanelWBody>
                </Div>
              </Div>
              <Div>
                <Div column>
                  <PanelWBody sx={{mb: 0}}>
                    <ChartPieWidgetBy
                      dense
                      title="IDPs"
                      data={persons}
                      filter={_ => _.displacement === DisplacementStatus.Idp}
                    />
                  </PanelWBody>
                </Div>
                <Div column>
                  <PanelWBody sx={{mb: 0}}>
                    <ChartPieWidgetBy
                      dense
                      title="Returnees"
                      data={persons}
                      filter={_ => _.displacement === DisplacementStatus.Returnee}
                    />
                  </PanelWBody>
                </Div>
              </Div>
              <PanelWBody title="Main Donors">
                <ChartBarMultipleBy
                  data={data}
                  label={drcDonorTranlate}
                  limit={5}
                  by={_ => _.donor ?? []}
                />
              </PanelWBody>
            </Div>
            <Div column>
              <PanelWBody>
                <Lazy deps={[data]} fn={() => {
                  const gb = data.groupBy(d => format(d.date, 'yyyy-MM'))
                  const gbByCommittedDate = data.groupBy(d => d.lastStatusUpdate ? format(d.lastStatusUpdate!, 'yyyy-MM') : '')
                  const months = seq([...Obj.keys(gb), ...Obj.keys(gbByCommittedDate)]).distinct(_ => _).sort()
                  return months.map(month => ({
                    name: month,
                    'Registration': gb[month].length,
                    'Assistance': gbByCommittedDate[month]?.filter(_ => _.status === KoboMetaStatus.Committed).length
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
                  data={data}
                  by={_ => m.activitiesMerged_[_.activity!]}
                />
                <Txt color="hint" block sx={{mt: 2, textAlign: 'justify'}}>
                  <Icon sx={{mr: 1, fontSize: '15px !important'}} color="disabled">info</Icon>
                  IPA/C4P not included not included
                </Txt>
              </PanelWBody>
              <Panel>
                <PanelBody>
                  <SlideWidget title="Total amount provided with MPCA" sx={{mt: 0, pt: 0}}>
                    {formatLargeNumber(totalAmount)} UAH
                  </SlideWidget>
                  <Lazy deps={[dataMpca]} fn={(d) => {
                    const all = d.groupBy(d => format(d.date, 'yyyy-MM'))
                    return Obj.keys(all).sort().map(m => ({
                      name: m,
                      'Provided': seq(all[m]).filter(_ => _.status === KoboMetaStatus.Committed).sum(_ => _.amountUahFinal ?? 0),
                      'Planned': seq(all[m]).sum(_ => _.amountUahSupposed ?? 0),
                    }))
                    // .map((k, v) => [k, {
                    //   supposed: seq(v).sum(_ => _.amountUahSupposed ?? 0),
                    //   final: seq(v).filter(_ => _.status === KoboMetaStatus.Committed).sum(_ => _.amountUahFinal ?? 0),
                    // }])
                    // .sort(([ka], [kb]) => ka.localeCompare(kb))
                    // .entries()
                    // .map(([k, v]) => ({
                    //   name: k,
                    //   'Estimated amount': v.supposed,
                    //   'Amount provided': v.final,
                    // }))
                  }}>
                    {_ => (
                      <ChartLine
                        fixMissingMonths
                        height={180}
                        data={_ as any}
                        hideLabelToggle
                      />
                    )}
                  </Lazy>
                  {/*</PanelBody>*/}
                  <Divider sx={{my: 2}}/>
                  {/*<PanelBody>*/}
                  <ChartPieWidget
                    dense
                    showValue
                    showBase
                    value={computed.preventedAssistance.length}
                    base={computed.deduplications.length}
                    title="Deduplicated registrations"
                  />
                </PanelBody>
              </Panel>
            </Div>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}