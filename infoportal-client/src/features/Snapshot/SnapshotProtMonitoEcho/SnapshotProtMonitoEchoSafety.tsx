import React, {useMemo} from 'react'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {Lazy} from '@/shared/Lazy'
import {ChartHelperOld} from '@/shared/charts/chartHelperOld'
import {OblastIndex, Protection_hhs3} from '@infoportal-common'
import {ChartPieWidgetBy} from '@/shared/charts/ChartPieWidgetBy'
import {UaMapBy} from '@/features/DrcUaMap/UaMapBy'
import {snapShotDefaultPieIndicatorsProps} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {seq, Seq} from '@alexandreannic/ts-utils'
import {useTheme} from '@mui/material'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {snapshotProtMonitoEchoLogo} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEchoSample'

export const SnapshotProtMonitoEchoSafety = () => {
  const {data, computed, period} = useSnapshotProtMonitoringContext()
  const {m} = useI18n()
  const t = useTheme()
  const groupedIndividualsType = useMemo(() => {
    const res = {
      type: seq() as Seq<Protection_hhs3.T['what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence']>,
      when: seq() as Seq<Protection_hhs3.T['when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence']>,
      who: seq() as Seq<Protection_hhs3.T['who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence']>,
    }
    data.forEach(_ => {
      res.type.push(...[
        _.what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_boy_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_girl_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_other_member_experienced_violence,
      ])
      res.when.push(...[
        _.when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_boy_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_girl_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_other_member_experienced_violence,
      ])
      res.who.push(...[
        _.who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence,
      ])
    })
    return res
  }, [data])

  return (
    <PdfSlide>
      <SlideHeader logo={snapshotProtMonitoEchoLogo}>{m.snapshotProtMonito.safetyProtectionIncidents}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column>
            <SlideTxt sx={{marginBottom: t.spacing() + ' !important'}}>
              <Lazy deps={[data]} fn={() => {
                return {
                  senseOfSafety: ChartHelperOld.percentage({
                    data: data.map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  poorSafetyChernihiv: ChartHelperOld.percentage({
                    data: data.filter(_ => _.where_are_you_current_living_oblast === OblastIndex.byName('Chernihivska').iso).map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  poorSafetySumy: ChartHelperOld.percentage({
                    data: data.filter(_ => _.where_are_you_current_living_oblast === OblastIndex.byName('Sumska').iso).map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  senseOfSafetyUrban: ChartHelperOld.percentage({
                    data: data.filter(_ => _.type_of_site === 'urban_area').map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  senseOfSafetyRural: ChartHelperOld.percentage({
                    data: data.filter(_ => _.type_of_site === 'rural_area').map(_ => _.please_rate_your_sense_of_safety_in_this_location),
                    value: _ => _ === '_2_unsafe' || _ === '_1_very_unsafe',
                    base: _ => _ !== 'unable_unwilling_to_answer',
                  }),
                  incidents: ChartHelperOld.percentage({
                    data,
                    value: _ => _.has_any_adult_male_member_experienced_violence === 'yes'
                      || _.has_any_adult_female_member_experienced_violence === 'yes'
                      || _.has_any_boy_member_experienced_violence === 'yes'
                      || _.has_any_girl_member_experienced_violence === 'yes'
                      || _.has_any_other_member_experienced_violence === 'yes',
                  })
                }
              }}>
                {_ =>
                  <p
                    //   dangerouslySetInnerHTML={{
                    //   __html: m.snapshotProtMonito.echo.safety({
                    //     poorSafety: toPercent(_.senseOfSafety.percent, 0),
                    //     poorSafetyChernihiv: toPercent(_.poorSafetyChernihiv.percent, 0),
                    //     poorSafetySumy: toPercent(_.poorSafetySumy.percent, 0),
                    //     poorSafetyUrban: toPercent(_.senseOfSafetyUrban.percent, 0),
                    //     poorSafetyRural: toPercent(_.senseOfSafetyRural.percent, 0),
                    //     protectionIncident: toPercent(_.incidents.percent, 0)
                    //   })
                    // }}
                  >
                    The lack of transportation remains a significant barrier to freedom of movement, particularly for inhabitants of remote settlements and villages and for persons with reduced mobility. 
                    Without regular or accessible public transport connections to larger urban centers, individuals residing in these areas face significant challenges in accessing livelihood opportunities, essential services, and maintaining overall mobility. 
                    Moreover, mobilization efforts significantly affect the male population, resulting in self-imposed restrictions of movement and isolation. 
                  </p>
                }
              </Lazy>
            </SlideTxt>
            <SlidePanel>
              <SlidePanelTitle>{m.majorStressFactors}</SlidePanelTitle>
              <ChartBarMultipleBy
                data={data}
                filterValue={['unable_unwilling_to_answer']}
                by={_ => _.what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members}
                label={Protection_hhs3.options.what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members}
                limit={5}
              />
              {/*<SlidePanelTitle>{m.protHHS2.typeOfIncident}</SlidePanelTitle>*/}
              {/*<Lazy deps={[groupedIndividualsType.type]} fn={() =>*/}
              {/*  chain(ChartHelperOld.multiple({*/}
              {/*    data: groupedIndividualsType.type,*/}
              {/*    filterValue: ['unable_unwilling_to_answer']*/}
              {/*  }))*/}
              {/*    .map(ChartHelperOld.setLabel({*/}
              {/*      ...Protection_hhs3.options.what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence,*/}
              {/*      // TODO TO REMOVE*/}
              {/*      // other_specify: 'Psychological abuse',*/}
              {/*    }))*/}
              {/*    .map(ChartHelperOld.sortBy.value)*/}
              {/*    .get()*/}
              {/*}>*/}
              {/*  {_ => (*/}
              {/*    <ChartBar data={_}/>*/}
              {/*  )}*/}
              {/*</Lazy>*/}
            </SlidePanel>
            <SlidePanel>
              <SlidePanelTitle>{m.protHHS2.freedomOfMovement}</SlidePanelTitle>
              <ChartBarMultipleBy
                data={data}
                by={_ => _.do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area}
                limit={5}
                label={{
                  ...Protection_hhs3.options.do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area,
                  lack_of_transportationfinancial_resources_to_pay_transportation: 'Lack of transportation'
                }}
                filterValue={['no', 'unable_unwilling_to_answer']}
              />
            </SlidePanel>
          </Div>
          <Div column>
            <SlidePanel>
              <ChartPieWidgetBy
                title={m.protHHS2.poorSenseOfSafety}
                filter={_ => _.please_rate_your_sense_of_safety_in_this_location === '_2_unsafe' || _.please_rate_your_sense_of_safety_in_this_location === '_1_very_unsafe'}
                filterBase={_ => _.please_rate_your_sense_of_safety_in_this_location !== 'unable_unwilling_to_answer'}
                compare={{before: computed.lastMonth}}
                data={data}
                {...snapShotDefaultPieIndicatorsProps}
              />
              <UaMapBy
                sx={{mx: 4}}
                data={data}
                getOblast={_ => _.where_are_you_current_living_oblast as any}
                value={_ => _.please_rate_your_sense_of_safety_in_this_location === '_1_very_unsafe'
                  || _.please_rate_your_sense_of_safety_in_this_location === '_2_unsafe'}
                base={_ => _.please_rate_your_sense_of_safety_in_this_location !== 'unable_unwilling_to_answer' &&
                  _.please_rate_your_sense_of_safety_in_this_location !== undefined}
              />
              <SlidePanelTitle sx={{mt: 2}}>{m.influencingFactors}</SlidePanelTitle>
              <ChartBarMultipleBy
                data={data}
                by={_ => _.what_are_the_main_factors_that_make_this_location_feel_unsafe}
                filterValue={['unable_unwilling_to_answer']}
                label={Protection_hhs3.options.what_are_the_main_factors_that_make_this_location_feel_unsafe}
                // mergeOptions={{
                //   intercommunity_tensions: 'other_specify',
              />
            </SlidePanel>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}