import React from 'react'
import {ProtectionMonito} from '@/features/Protection/DashboardMonito/ProtectionMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {Lazy} from '@/shared/Lazy'
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import {getIdpsAnsweringRegistrationQuestion} from '@/features/Protection/DashboardMonito/ProtectionDashboardMonitoDocument'
import {Person, Protection_hhs3} from 'infoportal-common'
import {ChartBar} from '@/shared/charts/ChartBar'
import {snapShotDefaultPieIndicatorsProps} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {ChartPieWidgetByKey} from '@/shared/charts/ChartPieWidgetByKey'
import {snapshotProtMonitoEchoLogo} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEchoSample'
import {useTheme} from '@mui/material'
import {ChartHelper} from '@/shared/charts/chartHelper'

export const SnapshotProtMonitoEchoRegistration = () => {
  const ctx = ProtectionMonito.useContext()
  const {formatLargeNumber, m} = useI18n()
  const t = useTheme()
  return (
    <PdfSlide>
      <SlideHeader logo={snapshotProtMonitoEchoLogo}>{m.protHHSnapshot.titles.document}</SlideHeader>
      <PdfSlideBody>
        <Div>
          <Div column>
            <SlideTxt>
              {/* The proportion of displaced individuals not formally registered as IDPs has increased significantly compared to the previous month (<Txt bold sx={{color: t.palette.success.main}}>+11%</Txt>). This rise can be
                  attributed to the implementation of Resolution No. 332, which substantially changes the provision of accommodation assistance to IDPs. The increase in
                  unregistered adult males (<Txt bold sx={{color: t.palette.success.main}}>+15%</Txt>) can be linked to the enforcement of the new mobilization law on May 18th. This law aims to bolster male mobilization by lowering
                  the conscription age, narrowing the grounds for exemptions, and heightening penalties for failing to update military records. */}
              Accessing government compensation for damaged or destroyed property remains significantly hindered by bureaucratic obstacles and complex procedures. 
              Residents in remote areas often need to travel long distances to obtain or renew essential documentation, with limited public transport options and high private transportation costs posing substantial barriers. 
              IDPs face additional challenges, particularly in formalizing inheritance and ownership documents, further complicating their access to compensation.
            </SlideTxt>
            <SlidePanel>
              <SlidePanelTitle sx={{mb: 1}}>{m.protHHSnapshot.maleWithoutIDPCert}</SlidePanelTitle>
              <Div>
                <Lazy deps={[ctx.dataFiltered, ctx.dataPreviousPeriod]} fn={d => ChartHelper.percentage({
                  data: getIdpsAnsweringRegistrationQuestion(d),
                  value: _ => _.isIdpRegistered !== 'yes' && _.are_you_and_your_hh_members_registered_as_idps !== 'yes_all'
                })}>
                  {(d, l) => (
                    <ChartPieWidget
                      title={m.all}
                      value={d.value}
                      base={d.base}
                      evolution={d.percent - l.percent}
                      {...snapShotDefaultPieIndicatorsProps}
                      sx={{
                        ...snapShotDefaultPieIndicatorsProps.sx,
                        flex: 1,
                        mb: 0,
                      }}
                      hideIndicatorTooltip={false}
                    />
                  )}
                </Lazy>
                <Lazy deps={[ctx.dataFiltered, ctx.dataPreviousPeriod]} fn={d => ChartHelper.percentage({
                  data: getIdpsAnsweringRegistrationQuestion(d).filter(_ => _.age && _.age >= 18 && _.age <= 60 && _.gender && _.gender === Person.Gender.Male),
                  value: _ => _.isIdpRegistered !== 'yes' && _.are_you_and_your_hh_members_registered_as_idps !== 'yes_all'
                })}>
                  {(d, l) => (
                    <ChartPieWidget
                      title={m.protHHSnapshot.maleYoung}
                      value={d.value}
                      base={d.base}
                      evolution={d.percent - l.percent}
                      {...snapShotDefaultPieIndicatorsProps}
                      sx={{
                        ...snapShotDefaultPieIndicatorsProps.sx,
                        flex: 1,
                        mb: 0,
                      }}
                    />
                  )}
                </Lazy>
              </Div>
            </SlidePanel>
            <SlidePanel>
              <ChartPieWidgetByKey
                compare={{before: ctx.dataPreviousPeriod}}
                title={m.protHHS2.accessBarriersToObtainDocumentation}
                property="have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation"
                filter={_ => !_.includes('no')}
                filterBase={_ => !_.includes('unable_unwilling_to_answer')}
                data={ctx.dataFiltered}
                {...snapShotDefaultPieIndicatorsProps}

              />
              <ChartBarMultipleBy
                data={ctx.dataFiltered}
                by={_ => _.have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation}
                label={Protection_hhs3.options.have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation}
                mergeOptions={{
                  distrust_of_public_institutions_and_authorities: 'other_specify',
                  discrimination: 'other_specify',
                  // discrimination: 'other_specify',
                  lack_of_devices_or_internet_connectivity_to_access_online_procedure: 'other_specify',
                  // distance_or_cost_of_transportation: 'other_specify',
                }}
                filterValue={[
                  'no',
                  'unable_unwilling_to_answer',
                ]}
              />
            </SlidePanel>
            {/*<SnapshotProtMonitoEvolutionNote sx={{mt: -1}}/>*/}
          </Div>
          <Div column>
            <SlidePanel>
              <Lazy deps={[ctx.dataFiltered, ctx.dataPreviousPeriod]} fn={(x) => ChartHelper.percentage({
                data: x.flatMap(_ => _.persons).map(_ => _.lackDoc).compact().filter(_ => !_.includes('unable_unwilling_to_answer')),
                value: _ => !_.includes('none')
              })}>
                {(_, last) => <ChartPieWidget
                  title={m.lackOfPersonalDoc}
                  value={_.value}
                  base={_.base}
                  evolution={_.percent - last.percent}
                  {...snapShotDefaultPieIndicatorsProps}
                />}
              </Lazy>
              <Lazy deps={[ctx.dataFiltered]} fn={() => ChartHelper.multiple({
                data: ctx.dataFiltered.flatMap(_ => _.persons).map(_ => _.lackDoc).compact(),
                filterValue: ['none', 'unable_unwilling_to_answer'],
              }).setLabel(Protection_hhs3.options.does_lack_doc)
                .sortBy.value()
                .get()
              }>
                {_ => <ChartBar data={_}/>}
              </Lazy>
            </SlidePanel>
            <SlidePanel>
              <ChartPieWidgetByKey
                compare={{before: ctx.dataPreviousPeriod}}
                title={m.lackOfHousingDoc}
                property="what_housing_land_and_property_documents_do_you_lack"
                filterBase={_ => !_.includes('unable_unwilling_to_answer')}
                filter={_ => !_.includes('none')}
                data={ctx.dataFiltered}
                {...snapShotDefaultPieIndicatorsProps}
              />
              <ChartBarMultipleBy
                data={ctx.dataFiltered}
                by={_ => _.what_housing_land_and_property_documents_do_you_lack}
                filterValue={['unable_unwilling_to_answer', 'none']}
                mergeOptions={{
                  cost_estimation_certificate_state_commission_issued_when_personal_request_is_made: 'other_specify',
                  death_certificate_of_predecessor: 'other_specify',
                  document_issues_by_police_state_emergency_service_proving_that_the_house_was_damaged_destroyedfor_ukrainian_state_control_areas: 'document_issues_by_local_self_government_proving_that_the_house_was_damaged_destroyed',
                  informatsiyna_dovidka_informational_extract_on_damaged_property: 'other_specify',
                  construction_stage_substituted_with_bti_certificate_following_completion_of_construction: 'other_specify',
                  inheritance_will: 'other_specify',
                }}
                label={{
                  ...Protection_hhs3.options.what_housing_land_and_property_documents_do_you_lack,
                  construction_stage_substituted_with_bti_certificate_following_completion_of_construction: 'Construction stage',
                  document_issues_by_local_self_government_proving_that_the_house_was_damaged_destroyed: 'Document issued by authority',
                  // document_issues_by_local_self_government_proving_that_the_house_was_damaged_destroyed: 'Document issued by local self-government proving a damaged house',
                  cost_estimation_certificate_state_commission_issued_when_personal_request_is_made: 'Cost estimation certificate - state commission',
                  // document_issues_by_police_state_emergency_service_proving_that_the_house_was_damaged_destroyedfor_ukrainian_state_control_areas: 'Document issued by authority proving a damaged house',
                }}
              />
            </SlidePanel>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}