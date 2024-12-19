import React from 'react'
import {Box, Icon, useTheme} from '@mui/material'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {MapSvg} from '@/shared/maps/MapSvg'
import {ChartLineByDate} from '@/shared/charts/ChartLineByDate'
import {snapshotColors} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {Protection_hhs3} from 'infoportal-common'
import {snapshotProtMonitoEchoLogo} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEchoSample'
import {ProtectionMonito} from '@/features/Protection/DashboardMonito/ProtectionMonitoContext'

export const SnapshotProtMonitoEchoDisplacement = () => {
  const ctx = ProtectionMonito.useContext()
  const {formatLargeNumber, formatDate, m} = useI18n()
  const t = useTheme()
  return (
    <PdfSlide>
      <SlideHeader logo={snapshotProtMonitoEchoLogo}>{m.displacement}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column>
            <SlideTxt sx={{mb: .5}} block>
            The conflict has caused widespread family separations, with many households reporting members living apart due to safety concerns, economic pressures, and mobilisation. 
            Displaced individuals frequently recount the emotional toll of separation, including the loss of contact with loved ones and the uncertainty surrounding their safety. 
            This isolation exacerbates feelings of loneliness and stress, making it even harder to adapt to new living conditions.
            </SlideTxt>

            <SlidePanel>
              <SlidePanelTitle>{m.intentions}</SlidePanelTitle>
              <ChartBarSingleBy
                data={ctx.dataIdps}
                by={_ => _.what_are_your_households_intentions_in_terms_of_place_of_residence}
                filter={_ => _.what_are_your_households_intentions_in_terms_of_place_of_residence !== 'unable_unwilling_to_answer'}
                label={{
                  ...Protection_hhs3.options.what_are_your_households_intentions_in_terms_of_place_of_residence,
                  integrate_into_the_local_community_of_current_place_of_residence: m.snapshotProtMonito.integrateIntoTheLocalCommunity,
                  return_to_the_area_of_origin: m.returnToThePlaceOfHabitualResidence
                }}
              />
            </SlidePanel>

            <SlidePanel sx={{flex: 1}}>
              <SlidePanelTitle>{m.protHHS2.factorToReturn}</SlidePanelTitle>
              <ChartBarMultipleBy
                data={ctx.dataIdps}
                filterValue={['unable_unwilling_to_answer']}
                by={_ => _.what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin}
                label={{
                  ...Protection_hhs3.options.what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin,
                  increased_restored_access_to_livelihood_employment_and_economic_opportunities: 'Increased/restored access to livelihood/employment',
                  repaired_housing_compensation_for_destroyedor_damaged_property: 'Repaired housing/compensation for damaged property',
                  improved_security_situation: 'Improved security situation / Cessation of hostilities'
                }}
                mergeOptions={{
                  cessation_of_hostilities: 'improved_security_situation',
                }}
              />
            </SlidePanel>
          </Div>

          <Div column>

            <SlidePanel BodyProps={{sx: {paddingBottom: t => t.spacing(.25) + ' !important'}}}>
              <SlidePanelTitle>{m.idpPopulationByOblast}</SlidePanelTitle>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <MapSvg sx={{flex: 1, mr: 1,}} data={ctx.idpsByOriginOblast} base={ctx.dataIdps.length} title={m.originOblast}/>
                <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
                {/* <Box sx={{display: 'flex', flexDirection: 'column'}}>
                  <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
                  <Icon color="disabled" fontSize="large" sx={{mx: 1}}>arrow_forward</Icon>
                </Box> */}
                <MapSvg sx={{flex: 1, ml: 1,}} data={ctx.byCurrentOblast} base={ctx.dataIdps.length} legend={false} title={m.currentOblast}/>
              </Box>
            </SlidePanel>

            <SlidePanel BodyProps={{sx: {paddingBottom: t => t.spacing(.25) + ' !important'}}}>
              <SlidePanelTitle>{m.displacementAndReturn}</SlidePanelTitle>
              <ChartLineByDate
                hideYTicks={false}
                sx={{ml: -5}}
                colors={snapshotColors}
                height={188}
                data={ctx.dataFiltered}
                start={new Date(2022, 0, 1)}
                curves={{
                  [m.departureFromAreaOfOrigin]: _ => _.when_did_you_leave_your_area_of_origin,
                  [m.returnToOrigin]: _ => _.when_did_you_return_to_your_area_of_origin,
                }}
                label={[m.departureFromAreaOfOrigin, m.returnToOrigin]}
                end={ctx.period.end}
              />
            </SlidePanel>

            <SlidePanel sx={{flex: 1}}>
              <SlidePanelTitle>{m.protHHS2.factorToHelpIntegration}</SlidePanelTitle>
              <ChartBarMultipleBy
                data={ctx.dataIdps}
                filterValue={['unable_unwilling_to_answer']}
                by={_ => _.what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community}
                label={{
                  ...Protection_hhs3.options.what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community,
                  access_to_essential_services: 'Access to essential services'
                }}
                limit={4}
              />
            </SlidePanel>

          </Div>
        </Div>
        {/*<Div>*/}
        {/*  <SlidePanel sx={{flex: 1}}>*/}
        {/*    <SlidePanelTitle>{m.protHHS2.factorToReturn}</SlidePanelTitle>*/}
        {/*    <ProtHHS2BarChart*/}
        {/*      data={ctx.idps}*/}
        {/*      filterValue={['unable_unwilling_to_answer']}*/}
        {/*      questionType="multiple"*/}
        {/*      question="what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin"*/}
        {/*      label={{*/}
        {/*        increased_restored_access_to_livelihood_employment_and_economic_opportunities: 'Increased/restored access to livelihood/employment',*/}
        {/*        repaired_housing_compensation_for_destroyedor_damaged_property: 'Repaired housing/compensation for damaged property',*/}
        {/*        improved_security_situation: 'Improved security situation / Cessation of hostilities'*/}
        {/*      }}*/}
        {/*      mergeOptions={{*/}
        {/*        cessation_of_hostilities: 'improved_security_situation',*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </SlidePanel>*/}
        {/*  <SlidePanel sx={{flex: 1}}>*/}
        {/*    <SlidePanelTitle>{m.protHHS2.factorToHelpIntegration}</SlidePanelTitle>*/}
        {/*    <ProtHHS2BarChart*/}
        {/*      data={ctx.idps}*/}
        {/*      filterValue={['unable_unwilling_to_answer']}*/}
        {/*      questionType="multiple"*/}
        {/*      question="what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community"*/}
        {/*      label={{*/}
        {/*        access_to_essential_services: 'Access to essential services',*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </SlidePanel>*/}
        {/*</Div>*/}
      </PdfSlideBody>
    </PdfSlide>
  )
}