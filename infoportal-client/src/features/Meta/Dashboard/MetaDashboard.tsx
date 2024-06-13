import React, {ReactNode, useMemo} from 'react'
import {DisplacementStatus, KoboIndex, koboIndex, KoboMetaStatus, OblastIndex} from '@infoportal-common'
import {AgeGroupTable} from '@/shared/AgeGroupTable'
import {useI18n} from '@/core/i18n'
import {Page} from '@/shared/Page'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {ChartBarMultipleByKey} from '@/shared/charts/ChartBarMultipleByKey'
import {format} from 'date-fns'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {Lazy} from '@/shared/Lazy'
import {ChartHelper} from '@/shared/charts/chartHelper'
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import {Box, Grid, useTheme} from '@mui/material'
import {Txt} from 'mui-extension'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {useMetaContext} from '@/features/Meta/MetaContext'
import {Panel, PanelBody} from '@/shared/Panel'
import {Obj, seq} from '@alexandreannic/ts-utils'
import {ChartLine} from '@/shared/charts/ChartLine'
import {Map} from '@/shared/maps/Map'
import Link from 'next/link'
import {AppFeatureId} from '@/features/appFeatureId'
import {databaseIndex} from '@/features/Database/databaseIndex'
import {useAppSettings} from '@/core/context/ConfigContext'

export const MetaDashboard = () => {
  const t = useTheme()
  const {conf} = useAppSettings()
  const {m, formatLargeNumber} = useI18n()
  const [showProjectsBy, setShowProjectsBy] = usePersistentState<'donor' | 'project'>('donor', {storageKey: 'meta-dashboard-showProject'})
  const {data: ctx, fetcher} = useMetaContext()
  const koboFormTransalations = useMemo(() => {
    return seq(KoboIndex.names).reduceObject<Record<string, ReactNode>>(id => {
      const label = KoboIndex.searchById(id)?.translation ?? id
      return [
        id,
        <Link
          key={id}
          href={conf.linkToFeature(AppFeatureId.kobo_database, databaseIndex.siteMap.access.absolute(koboIndex.drcUa.server.prod, KoboIndex.byName('shelter_nta').id))}
        >
          {label}
        </Link>
      ]
    })
  }, [])
  console.log(koboFormTransalations)
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
            <AgeGroupTable tableId="meta-dashboard" persons={ctx.filteredPersons} enableDisplacementStatusFilter/>
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
            <ChartBarSingleBy
              data={ctx.filteredData}
              by={_ => _.formId}
              label={koboFormTransalations}
            />
          </SlidePanel>
        </Div>
        <Div column>
          <SlidePanel>
            <Lazy deps={[ctx.filteredData]} fn={() => {
              return ChartHelper.single({
                data: ctx.filteredData.map(_ => _.status ?? 'Blank'),
                percent: true,
              }).get()
            }}>
              {_ => (
                <Box>
                  <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Div responsive>
                      <Div>
                        <ChartPieWidget
                          dense sx={{flex: 1}} color={t.palette.success.main}
                          title={<Txt size="small">{m.committed}</Txt>}
                          value={_.Committed?.value ?? 0} base={1}
                        />
                        <ChartPieWidget
                          dense sx={{flex: 1}} color={t.palette.warning.main}
                          title={<Txt size="small">{m.pending}</Txt>}
                          value={_.Pending?.value ?? 0} base={1}
                        />
                      </Div>
                      <Div>
                        <ChartPieWidget
                          dense sx={{flex: 1}} color={t.palette.error.main}
                          title={<Txt size="small">{m.rejected}</Txt>}
                          value={_.Rejected?.value ?? 0} base={1}
                        />
                        <ChartPieWidget
                          dense sx={{flex: 1}} color={t.palette.info.main}
                          title={<Txt size="small">{m.blank}</Txt>}
                          value={_.Blank?.value ?? 0} base={1}
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
              return new Obj(gb)
                .map((k, v) => [k, {
                  count: v.length,
                  committed: gbByCommittedDate[k]?.filter(_ => _.status === KoboMetaStatus.Committed).length
                }])
                .sort(([ka], [kb]) => ka.localeCompare(kb))
                .entries()
                .map(([k, v]) => ({name: k, [m.submissionTime]: v.count, [m.committed]: v.committed}))
            }}>
              {_ => (
                <ChartLine
                  hideYTicks
                  height={200}
                  data={_ as any}
                  colors={() => [t.palette.primary.main, t.palette.success.main]}
                  hideLabelToggle
                />
              )}
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
          <SlidePanel title={m.program}><ChartBarSingleBy data={ctx.filteredData} by={_ => _.activity}/></SlidePanel>
        </Div>
      </Div>
    </Page>
  )
}