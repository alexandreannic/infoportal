import React from 'react'
import {DisplacementStatus, KoboIndex, KoboMetaStatus, OblastIndex} from 'infoportal-common'
import {AgeGroupTable} from '@/shared/AgeGroupTable'
import {useI18n} from '@/core/i18n'
import {Page} from '@/shared/Page'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {ChartBarMultipleByKey} from '@/shared/charts/ChartBarMultipleByKey'
import {format} from 'date-fns'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {Lazy} from '@/shared/Lazy'
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import {Box, Grid, useTheme} from '@mui/material'
import {Txt} from '@/shared/Txt'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {useMetaContext} from '@/app/meta/MetaContext'
import {Panel, PanelBody} from '@/shared/Panel'
import {Obj, seq} from '@alexandreannic/ts-utils'
import {ChartLine} from '@/shared/charts/ChartLine'
import {Map} from '@/shared/maps/Map'
import {MetaDashboardActivityPanel} from '@/app/meta/dashboard/MetaDashboardActivityPanel'

export default function DashboardPage() {
  const t = useTheme()
  const {m, formatLargeNumber} = useI18n()
  const [showProjectsBy, setShowProjectsBy] = usePersistentState<'donor' | 'project'>('donor', {storageKey: 'meta-dashboard-showProject'})
  const {data: ctx, fetcher} = useMetaContext()
  return (
    <Page width="lg" loading={fetcher.loading}>
      <Grid container sx={{mb: 2}} columnSpacing={2}>
        <Grid item xs={6} md={4} lg={2}>
          <SlideWidget sx={{flex: 1}} icon="electrical_services" title={m._meta.pluggedKobo}>
            <Lazy deps={[ctx.filteredData]} fn={() => {
              return ctx.filteredData.distinct(_ => _.formId).length
            }}>
              {_ => formatLargeNumber(_)}
            </Lazy>
          </SlideWidget>
        </Grid>
        <Grid item xs={6} md={4} lg={2}>
          <SlideWidget sx={{flex: 1}} icon="storage" title={m.submissions}>
            {formatLargeNumber(ctx.filteredData.length)}
          </SlideWidget>
        </Grid>
        <Grid item xs={6} md={4} lg={2}>
          <SlideWidget sx={{flex: 1}} icon="home" title={m.hhs}>
            {formatLargeNumber(ctx.filteredUniqueData.length)}
          </SlideWidget>
        </Grid>
        <Grid item xs={6} md={4} lg={2}>
          <SlideWidget sx={{flex: 1}} icon="group" title={m.hhSize}>
            {(ctx.filteredUniquePersons.length / ctx.filteredUniqueData.length).toFixed(2)}
          </SlideWidget>
        </Grid>
        <Grid item xs={6} md={4} lg={2}>
          <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
            {formatLargeNumber(ctx.filteredPersons.length)}
          </SlideWidget>
        </Grid>
        <Grid item xs={6} md={4} lg={2}>
          <SlideWidget sx={{flex: 1}} icon="person" title={m.uniqIndividuals}>
            {formatLargeNumber(ctx.filteredUniquePersons.length)}
          </SlideWidget>
        </Grid>
      </Grid>
      <Div responsive>
        <Div column>
          <Map
            data={ctx.filteredData}
            getSettlement={_ => _.settlement}
            getOblast={_ => OblastIndex.byName(_.oblast).iso}
          />
          <SlidePanel title={m.ageGroup}>
            <AgeGroupTable tableId="meta-dashboard" persons={ctx.filteredPersons} enableDisplacementStatusFilter enablePwdFilter/>
          </SlidePanel>
          <Panel title={m.displacementStatus}>
            <PanelBody>
              <ChartBarSingleBy
                data={ctx.filteredPersons}
                by={_ => _.displacement}
                label={DisplacementStatus}
              />
            </PanelBody>
          </Panel>
          <SlidePanel title={m.form}>
            <ChartBarSingleBy data={ctx.filteredData} by={_ => KoboIndex.searchById(_.formId)?.translation ?? _.formId}/>
          </SlidePanel>
        </Div>
        <Div column>
          <SlidePanel>
            <Lazy deps={[ctx.filteredData]} fn={() => {
              const group = ctx.filteredData.groupByAndApply(_ => _.status ?? 'Blank', _ => _.length)
              return {
                group,
                total: seq(Obj.values(group)).sum(),
              }
            }}>
              {_ => (
                <Box>
                  <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Div responsive>
                      <Div>
                        <ChartPieWidget
                          dense sx={{flex: 1}} color={t.palette.success.main}
                          title={<Txt size="small">{m.committed}</Txt>}
                          value={_.group.Committed ?? 0} base={_.total}
                        />
                        <ChartPieWidget
                          dense sx={{flex: 1}} color={t.palette.warning.main}
                          title={<Txt size="small">{m.pending}</Txt>}
                          value={_.group.Pending ?? 0} base={_.total}
                        />
                      </Div>
                      <Div>
                        <ChartPieWidget
                          dense sx={{flex: 1}} color={t.palette.error.main}
                          title={<Txt size="small">{m.rejected}</Txt>}
                          value={_.group.Rejected ?? 0} base={_.total}
                        />
                        <ChartPieWidget
                          dense sx={{flex: 1}} color={t.palette.info.main}
                          title={<Txt size="small">{m.blank}</Txt>}
                          value={_.group.Blank ?? 0} base={_.total}
                        />
                      </Div>
                    </Div>
                  </Box>
                </Box>
              )}
            </Lazy>
          </SlidePanel>
          <SlidePanel>
            <Lazy deps={[ctx.filteredData]} fn={() => {
              const gb = ctx.filteredData.groupBy(d => format(d.date, 'yyyy-MM'))
              const gbByCommittedDate = ctx.filteredData.groupBy(d => d.lastStatusUpdate ? format(d.lastStatusUpdate!, 'yyyy-MM') : '')
              const months = seq([...Obj.keys(gb), ...Obj.keys(gbByCommittedDate)]).distinct(_ => _).sort()
              return months.map(month => ({
                name: month,
                [m.submissionTime]: gb[month]?.length ?? 0,
                [m.committed]: gbByCommittedDate[month]?.filter(_ => _.status === KoboMetaStatus.Committed).length ?? 0
              }))
            }}>
              {_ =>
                <ChartLine
                  fixMissingMonths
                  hideYTicks
                  height={200}
                  data={_ as any}
                  colors={() => [t.palette.primary.main, t.palette.success.main]}
                  hideLabelToggle
                />
              }
            </Lazy>
          </SlidePanel>
          <SlidePanel>
            <ScRadioGroup value={showProjectsBy} onChange={setShowProjectsBy} inline dense>
              <ScRadioGroupItem hideRadio value="donoor" title={m.donor}/>
              <ScRadioGroupItem hideRadio value="project" title={m.project}/>
            </ScRadioGroup>
            {showProjectsBy === 'project' ? (
              <ChartBarMultipleByKey data={ctx.filteredData} property="project"/>
            ) : (
              <ChartBarMultipleByKey data={ctx.filteredData} property="donor"/>
            )}
          </SlidePanel>
          <MetaDashboardActivityPanel/>
        </Div>
      </Div>
    </Page>
  )
}