import React from 'react'
import {darken, useTheme} from '@mui/material'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlidePanel, SlidePanelTitle, SlideTxt, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {DRCLogo, EULogo, UhfLogo, UsaidLogo} from '@/shared/logo/logo'
import {ChartBarStacker, commonLegendProps} from '@/shared/charts/ChartBarStacked'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {Legend} from 'recharts'
import {ChartPie} from '@/shared/charts/ChartPie'
import {snapshotAlternateColor} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {useAppSettings} from '@/core/context/ConfigContext'
import {SnapshotHeader} from '@/features/Snapshot/SnapshotHeader'
import {Obj, seq} from '@alexandreannic/ts-utils'
import {OblastIndex, Person, Protection_hhs3} from '@infoportal-common'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'

export const snapshotProtMonitoEchoLogo = (
  <>
    <UsaidLogo sx={{mr: 1.5}}/>
    <UhfLogo sx={{mr: 1.5}}/>
    <EULogo sx={{mr: 1.5}}/>
    <DRCLogo/>
  </>
)

export const SnapshotProtMonitoEchoSample = () => {
  const theme = useTheme()
  const {conf} = useAppSettings()
  const {data, computed, period} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()
  const registrationOblasts = Obj.filter(computed.byCurrentOblast, (k, v) => v.value > 5)
  return (
    <PdfSlide>
      <SnapshotHeader period={period} logo={snapshotProtMonitoEchoLogo}/>
      <PdfSlideBody>
        <Div>
          <Div column sx={{flex: 4}}>
            <SlideTxt>
              This snapshot summarizes the findings of <b>protection monitoring</b>&nbsp;
              implemented through household surveys in the following oblasts:
              <ul style={{columns: 2}}>
                {seq(Obj.entries(registrationOblasts))
                  .map(([k]) => {
                    const r = OblastIndex.byIso(k).shortName
                    if (!r) throw new Error(k)
                    return r
                  })
                  .sortByString(_ => _)
                  .map(oblast =>
                    <li key={oblast}>{oblast}</li>
                  )}
              </ul>
            </SlideTxt>
            <SlideTxt sx={{mb: 2}}>
            DRC protection monitoring targeted internally displaced persons (IDPs) and people directly exposed to and affected by the current 
            armed conflict in order to understand the protection needs facing affected populations; informing DRC and the humanitarian community's response
            </SlideTxt>
            <UkraineMap data={Obj.filter(computed.byCurrentOblast, (k, v) => v.value > 5)} sx={{mx: 1}}/>
          </Div>

          <Div column sx={{flex: 6}}>
            <Div sx={{flex: 0}}>
              <SlideWidget sx={{flex: 1}} icon="home" title={m.hhs}>
                {formatLargeNumber(data.length)}
              </SlideWidget>
              <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
                {formatLargeNumber(computed.individualsCount)}
              </SlideWidget>
              <SlideWidget sx={{flex: 1}} icon="group" title={m.hhSize}>
                {(computed.individualsCount / data.length).toFixed(1)}
              </SlideWidget>
            </Div>

            <Div>
              <Div column>
                <SlidePanel>
                  <ChartPie
                    outerRadius={65}
                    height={140}
                    width={270}
                    m={{
                      male: m.male,
                      female: m.female,
                      // other: m.other,
                    }}
                    data={{
                      female: computed.byGender.Female,
                      male: computed.byGender.Male,
                    }}
                    colors={{
                      female: theme.palette.primary.main,
                      malew: snapshotAlternateColor(theme),
                      // other: theme.palette.divider,
                    }}
                  >
                    <Legend {...commonLegendProps} layout="vertical" verticalAlign="middle" align="right"/>
                  </ChartPie>
                </SlidePanel>
                <SlidePanel>
                  <SlidePanelTitle>{m.ageGroup}</SlidePanelTitle>
                  <ChartBarStacker data={computed.ageGroup(Person.ageGroup['DRC'], true)} sx={{mt: 2}} height={300} colors={t => [
                    t.palette.primary.main,
                    snapshotAlternateColor(t),
                    darken(t.palette.primary.main, .5),
                  ]}/>
                </SlidePanel>
              </Div>
              <Div column>
                <SlidePanel>
                  <SlidePanelTitle>{m.protHHS2.hhTypes}</SlidePanelTitle>
                  <ChartBarSingleBy
                    data={data}
                    by={_ => _.what_is_the_type_of_your_household}
                    label={{
                      ...Protection_hhs3.options.what_is_the_type_of_your_household,
                      extended_family: 'Extended family',
                      couple_with_children: 'Couple with children',
                      couple_without_children: 'Couple without children',
                      father_with_children: 'Father with children',
                      mother_with_children: 'Mother with children',
                      one_person_household: 'One person household'
                    }}
                  />
                </SlidePanel>
                <SlidePanel>
                  <SlidePanelTitle>{m.displacementStatus}</SlidePanelTitle>
                  <ChartBarSingleBy data={data} by={_ => _.do_you_identify_as_any_of_the_following} label={Protection_hhs3.options.do_you_identify_as_any_of_the_following}/>
                </SlidePanel>
              </Div>
            </Div>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}