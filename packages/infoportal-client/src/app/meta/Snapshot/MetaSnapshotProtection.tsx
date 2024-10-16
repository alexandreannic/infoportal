import React, {useEffect} from 'react'
import {drcDonorTranlate, DrcSector, OblastIndex, Period, Person} from 'infoportal-common'
import {Div, PdfSlide, PdfSlideBody, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {format} from 'date-fns'
import {Box, Icon, ThemeProvider, useTheme} from '@mui/material'
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
import {useAppSettings} from '@/core/context/ConfigContext'
import {muiTheme} from '@/core/theme'
import {Txt} from '@/shared/Txt'

export const MetaSnapshotProtection = (p: MetaSnapshotProps) => {
  const {theme} = useAppSettings()
  return (
    <ThemeProvider theme={muiTheme({...theme.appThemeParams, mainColor: '#1357d0'})}>
      <MetaDashboardProvider storageKeyPrefix="ss-prot">
        <Cp {...p}/>
      </MetaDashboardProvider>
    </ThemeProvider>
  )
}

const products = [
  {label: 'Monthly protection monitoring snapshots', icon: 'photo'},
  {label: 'Quarterly protection analysis reports', icon: 'trending_up'},
  {label: 'Rapid protection & GBV assessments', icon: 'travel_explore'},
  {label: 'Monthly legal alerts', icon: 'update'},
  {label: 'Protection monitoring dashboard', icon: 'query_stats'},
  {label: 'Legal aid platform', icon: 'hub'},
]

export const Cp = ({period}: MetaSnapshotProps) => {
  const {data: ctx, fetcher} = useMetaContext()
  useEffect(() => {
    ctx.setShapeFilters({
      sector: [
        DrcSector.GeneralProtection,
        DrcSector.GBV
      ]
    })
    ctx.setPeriod(period)
  }, [])
  const t = useTheme()
  const {m, formatLargeNumber} = useI18n()
  if (!ctx.period.start || !ctx.period.end) return 'Set a period'
  const dataFilteredFlat = ctx.filteredData.flatMap(_ => _.persons?.map(p => ({..._, ...p})) ?? [])
  const dataFilteredPm = ctx.filteredData.filter(_ => m.activitiesMerged_[_.activity!] === 'Protection Monitoring')
  const dataFilteredPmIndividuals = dataFilteredPm.flatMap(_ => _.persons ?? [])
  const dataFilteredActivities = ctx.filteredData.filter(_ => m.activitiesMerged_[_.activity!] !== 'Protection Monitoring')
  const dataFilteredActivitiesIndividuals = dataFilteredActivities.flatMap(_ => _.persons ?? [])
  return (
    <PdfSlide format="vertical">
      <MetaSnapshotHeader
        period={ctx.period as Period}
        subTitle="Protection"
      />
      <PdfSlideBody>
        <Div column>
          <Div column>
            <Div column>
              <Div>
                <SlideWidget sx={{flex: 1}} icon="group_work" title="Sessions">
                  {formatLargeNumber(dataFilteredActivities.length)}
                </SlideWidget>
                <SlideWidget sx={{flex: 1}} icon="groups" title="Average group size">
                  {(dataFilteredActivitiesIndividuals.length / dataFilteredActivities.length).toFixed(2)}
                </SlideWidget>
                <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
                  {formatLargeNumber(dataFilteredActivitiesIndividuals.length)}
                </SlideWidget>
                <SlideWidget sx={{flex: 1}} icon="person_search" title="Ind. reached via PM">
                  {formatLargeNumber(dataFilteredPmIndividuals.length)}
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
                  data={dataFilteredFlat}
                  fillBaseOn="value"
                />
              </PanelWBody>
              <PanelWBody title={m.ageGroup}>
                <Lazy deps={[ctx.filteredData]} fn={(d) => {
                  const gb = Person.groupByGenderAndGroup(Person.ageGroup.Quick)(d?.flatMap(_ => _.persons ?? [])!)
                  return new Obj(gb).entries().map(([k, v]) => ({key: k, ...v}))
                }}>
                  {_ => <ChartBarStacker data={_} height={130} sx={{mb: -1, mr: -2}}/>}
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
                  limit={3}
                  label={{
                    Idp: 'IDP',
                    Returnee: 'Returnee',
                    Refugee: 'Refugee',
                    NonDisplaced: 'Non-displaced',
                  }}
                />
              </PanelWBody>
              <PanelWBody title="PIM Products">
                {products.map(_ =>
                  <Box key={_.label} sx={{display: 'flex', alignItems: 'center', '&:not(:last-of-type)': {pb: 1}}}>
                    <Icon sx={{mr: 1.5}} color="primary">{_.icon}</Icon>
                    {_.label}
                  </Box>
                )}
              </PanelWBody>
            </Div>
            <Div column>
              <PanelWBody>
                <Lazy deps={[ctx.filteredData]} fn={() => {
                  const gb = ctx.filteredData.groupBy(d => format(d.date, 'yyyy-MM'))
                  const gbByCommittedDate = ctx.filteredData.groupBy(d => d.lastStatusUpdate ? format(d.lastStatusUpdate!, 'yyyy-MM') : '')
                  return new Obj(gb)
                    .map((k, v) => [k, {
                      pm: v.filter(_ => m.activitiesMerged_[_.activity!] === 'Protection Monitoring').length,
                      activities: v.filter(_ => m.activitiesMerged_[_.activity!] !== 'Protection Monitoring').length,
                      // committed: gbByCommittedDate[k]?.filter(_ => _.status === KoboMetaStatus.Committed).length
                    }])
                    .sort(([ka], [kb]) => ka.localeCompare(kb))
                    .entries()
                    .map(([k, v]) => ({
                      name: k,
                      'Protection Monitoring': v.pm,
                      'Assistance': v.activities,
                      // 'Assistance': v.committed,
                    }))
                }}>
                  {_ => (
                    <ChartLine
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
              <PanelWBody title="Activities">
                <ChartBarSingleBy
                  data={dataFilteredFlat}
                  by={_ => m.activitiesMerged_[_.activity!]}
                  min={10}
                />
                <Txt color="hint" block sx={{mt: 2, textAlign: 'justify'}}>
                  <Icon sx={{mr: 1, fontSize: '15px !important'}} color="disabled">info</Icon>
                  Not included in the above breakdown:
                  <Box sx={{display: 'flex'}}>
                    <ul style={{margin: 0}}>
                      <li>Legal awareness</li>
                      <li>Legal counselling</li>
                      <li>Legal assistance</li>
                      <li>IPA</li>
                    </ul>
                    <ul style={{margin: 0}}>
                      <li>Prot. Case Management</li>
                      <li>GBV Case Management</li>
                      <li>CBP activities</li>
                    </ul>
                  </Box>
                </Txt>
              </PanelWBody>
              <PanelWBody title="Donors">
                <ChartBarMultipleBy
                  data={dataFilteredFlat}
                  label={{
                    ...drcDonorTranlate,
                    OKF: 'OKF / SDC / SIDA',
                  }}
                  by={_ => _.donor ?? []}
                  mergeOptions={{
                    OKF: 'OKF',
                    SDC: 'OKF',
                    SIDA: 'OKF',
                  }}
                />
              </PanelWBody>
            </Div>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}