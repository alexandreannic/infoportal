export namespace Meal_pdmStandardised {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aCWKwfvJ6F48HxUZTrr9L7
  export interface T {
    start: string
    end: string
    // metadata/interwiever_name [text] Interwiever's name
    interwiever_name: string | undefined
    // metadata/type_interview [select_one] Type of interview
    type_interview: undefined | Option<'type_interview'>
    // metadata/donor [text] Donor
    donor: string | undefined
    // metadata/pdmtype [select_one] PDM Type:
    pdmtype: undefined | Option<'pdmtype'>
    // metadata/office [select_one] Office responsible for implementation of the project
    office: undefined | Option<'office'>
    // metadata/unique_number [integer] Beneficiary unique number
    unique_number: number | undefined
    // metadata/not_loc [note] Please, indicate your current location
    not_loc: string
    // metadata/ben_det_oblast [select_one] Select oblast
    ben_det_oblast: undefined | Option<'ben_det_oblast'>
    // metadata/ben_det_raion [select_one] Select raion
    ben_det_raion: undefined | string
    // metadata/ben_det_hromada [select_one] Select hromada
    ben_det_hromada: undefined | string
    // metadata/gps_coordinates [geopoint] GPS Coordinates
    gps_coordinates: string
    // ic/not_mpca [note] For MPCA Hello I am from DRC organization (please mention your organization name)! We want to ask you some questions to obtain information about the Cash Assistance that you and your household have received from us. We want to hear your thoughts so we can improve the way that we are doing our job. Your participation is voluntary and the questions will take around 20-30 minutes to answer. If you accept to participate, you have the option to stop answering or to not answer any question that you don't want to. This information will help us to understand what has been done appropriately in the process, what hasn't worked that good and what we should be doing differently. The information you share will be kept protected and will only be shared with a small group of people in the organization (please mention your organization name). Finally, please know that if you provide negative feedback about our work, this will not have any negative consequences to your permanence in this or future activities of this project.
    not_mpca: string
    // ic/not_cash_for_rent [note] Cash for Rent Hello, my name is {insert name} I am from DRC.   We want to ask you some questions to obtain information about the Cash for Rent Assistance that you and your household have received from us. Your participation is voluntary and the questions will take around 20-30 minutes to answer. If you accept to participate, you have the option to stop answering or to not answer any question that you don't want to. This information will help us to understand what has been done appropriately in the process, what hasn't worked that good and what we should be doing differently. We want to hear your thoughts, so we can improve the way that we are doing our job in the future.   The information we collect about your personal identity will only be used to identify you for follow up questions if necessary, and will not be shared wider than internal DRC Staff. The information you share will be kept protected and will only be shared with a small group of people in DRC. Finally, please know that if you provide negative feedback about our work, this will not have any negative consequences to your permanence in this or future activities of this project.
    not_cash_for_rent: string
    // ic/not_cash_for_repair [note] Cash for repair The purpose of this interview is to obtain information about the shelter programs to understand whether they are being implemented properly and whether we are addressing the needs of vulnerable people. Your information and the data will be obtained from you are considered as confidential. The information will be used to prepare reports, but will not include any specific names. We would appreciate providing us with the most accurate answers that you can.
    not_cash_for_repair: string
    // ic/agree_interviewed [select_one] Do you agree to be interviewed?
    agree_interviewed: undefined | Option<'know_address_suggestions'>
    // overview/age [integer] What is your age?
    age: number | undefined
    // overview/sex [select_one] What is your sex?
    sex: undefined | Option<'repgender'>
    // overview/status_person [select_one] Are you an IDP/conflict-affected person?
    status_person: undefined | Option<'status_person'>
    // overview/how_many_family [integer] How many family members reside with you in the apartment/house?
    how_many_family: number | undefined
    // overview/family [begin_repeat] Family
    family:
      | {repage: number | undefined | undefined; repgender: undefined | Option<'repgender'> | undefined}[]
      | undefined
    // overview/did_receive_cash [select_one] Did you receive Cash assistance from DRC?
    did_receive_cash: undefined | Option<'know_address_suggestions'>
    // overview/did_receive_cash_no [text] If "No", please specify
    did_receive_cash_no: string | undefined
    // overview/cash_repair_type [select_one] Which type of intervention have you received from cash for repairs?
    cash_repair_type: undefined | Option<'cash_repair_type'>
    // overview/cash_repair_type_other [text] If "Other" Please clarify:
    cash_repair_type_other: string | undefined
    // overview/register_receive [select_one] How did you register to receive CASH?
    register_receive: undefined | Option<'register_receive'>
    // overview/register_receive_other [text] If "Other", please specify
    register_receive_other: string | undefined
    // dp/assistance_delivered [select_one] How was the assistance delivered to you?
    assistance_delivered: undefined | Option<'assistance_delivered'>
    // dp/assistance_delivered_other [text] If "Other", please specify
    assistance_delivered_other: string | undefined
    // dp/satisfied_process [select_one] Are you satisfied with the process you went through to receive cash assistance?
    satisfied_process: undefined | Option<'satisfied_process'>
    // dp/satisfied_process_no [text] If "Not very satisfied" or "Not satisfied at all" then:  If you were not satisfied, could you tell us why you were not satisfied?
    satisfied_process_no: string | undefined
    // dp/satisfied_cash_amount [select_one] Are you satisfied with the cash amount received?
    satisfied_cash_amount: undefined | Option<'know_address_suggestions'>
    // dp/how_much_money [select_one] Were you told how much money you would receive?
    how_much_money: undefined | Option<'know_address_suggestions'>
    // dp/how_much_money_yes [select_one] If "Yes" - Did you receive less, the same or more money than the amount you were told you would be receiving?
    how_much_money_yes: undefined | Option<'how_much_money_yes'>
    // dp/time_registered_assistance [select_one] How much time did it take from the moment your household registered into the CASH assistance program to the moment you actually received the money in your bank account?
    time_registered_assistance: undefined | Option<'time_registered_assistance'>
    // challenges/experience_problems [select_one] Did you experience any problems with the registration for cash assistance?
    experience_problems: undefined | Option<'know_address_suggestions'>
    // challenges/experience_problems_yes [select_one] If "Yes", what was the problem?
    experience_problems_yes: undefined | Option<'experience_problems_yes'>
    // challenges/assistance_delivered_other [text] If "Other", please specify
    assistance_delivered_other_001: string | undefined
    // challenges/know_people_needing [select_one] Do you know of people needing assistance who were excluded from the assistance provided?
    know_people_needing: undefined | Option<'know_people_needing'>
    // challenges/know_people_needing_yes [text] If "yes, a lot" or "yes, a few" then - can you tell me who you think were excluded?
    know_people_needing_yes: string | undefined
    // challenges/organization_provide_information [select_one] Did the organization provide you with all the information you needed about the cash transfer?
    organization_provide_information: undefined | Option<'know_address_suggestions'>
    // challenges/better_inform_distribution [select_one] What could DRC have done to better inform you about the assistance or distribution?
    better_inform_distribution: undefined | Option<'better_inform_distribution'>
    // challenges/better_inform_distribution_other [text] If "Other", please specify
    better_inform_distribution_other: string | undefined
    // challenges/rate_quality_assistance [select_one] How would you rate the overall quality of the assistance provided?
    rate_quality_assistance: undefined | Option<'rate_quality_assistance'>
    // challenges/rate_quality_assistance_dis [text] If "Satisfactory" or "Dissatisfied" or "Very Dissatisfied", please, comment why:
    rate_quality_assistance_dis: string | undefined
    // use_mpca_assistance/sectors_cash_assistance [select_multiple] Please indicate top 3 sectors you spent cash assistance for:
    sectors_cash_assistance: undefined | Option<'sectors_cash_assistance'>[]
    // use_mpca_assistance/sectors_cash_assistance_other [text] If "Other", please specify
    sectors_cash_assistance_other: string | undefined
    // use_mpca_assistance/sectors_cash_assistance_food [integer] If yes, how much (%) did you spend approximately? (HH NFIs %)
    sectors_cash_assistance_food: number | undefined
    // use_mpca_assistance/sectors_cash_assistance_clothing [integer] If yes, how much (%) did you spend approximately? (Clothing %)
    sectors_cash_assistance_clothing: number | undefined
    // use_mpca_assistance/sectors_cash_assistance_utilities_heating [integer] If yes, how much (%) did you spend approximately? (Utilities & Heating - %)
    sectors_cash_assistance_utilities_heating: number | undefined
    // use_mpca_assistance/sectors_cash_assistance_healthcare [integer] If yes, how much (%) did you spend approximately? (Health Care Regular %)
    sectors_cash_assistance_healthcare: number | undefined
    // use_mpca_assistance/sectors_cash_assistance_hygiene_items [integer] If yes, how much (%) did you spend approximately? (Hygiene items - %)
    sectors_cash_assistance_hygiene_items: number | undefined
    // use_mpca_assistance/receive_additional [select_one] Did you receive an additional 5,000 UAH as a top-up? If the respondent did not receive the additional 5,000 UAH and they were eligible, please flag to programs.
    receive_additional: undefined | Option<'property_double_glazed_windows'>
    // use_mpca_assistance/rent_benefit [select_one] Was the cash for rent benefit enough to cover your rent for the specified period?
    rent_benefit: undefined | Option<'know_address_suggestions'>
    // use_mpca_assistance/rent_benefit_no [text] If "No", how much extra did you have to pay?
    rent_benefit_no: string | undefined
    // use_mpca_assistance/access_adequate_housing [select_one] Do you have access to adequate housing after receiving the cash assistance?
    access_adequate_housing: undefined | Option<'know_address_suggestions'>
    // use_mpca_assistance/improve_living [select_one] What has been done to improve your living conditions?
    improve_living: undefined | Option<'improve_living'>
    // use_mpca_assistance/improve_living_other [text] If "Other", please specify
    improve_living_other: string | undefined
    // use_mpca_assistance/spent_cash_assistance [select_one] Have you spent the Cash assistance for things other than rent
    spent_cash_assistance: undefined | Option<'know_address_suggestions'>
    // use_mpca_assistance/spent_cash_assistance_yes [text] If "Yes", please specify
    spent_cash_assistance_yes: string | undefined
    // use_mpca_assistance/spent_cash_assistance_rent [select_one] If "Yes", How much of the allowance did you use?
    spent_cash_assistance_rent: undefined | Option<'assistance_other_repairs_rate'>
    // use_mpca_assistance/money_received [select_one] What have you spent the money you had received on?
    money_received: undefined | Option<'money_received'>
    // use_mpca_assistance/money_received_other [text] If "Other", please specify
    money_received_other: string | undefined
    // use_mpca_assistance/assistance_enough [select_one] Was the cash assistance enough to cover the expenditures?
    assistance_enough: undefined | Option<'know_address_suggestions'>
    // use_mpca_assistance/assistance_enough_no [text] If "No", please explain why:
    assistance_enough_no: string | undefined
    // use_mpca_assistance/assistance_other_repairs [select_one] Have you spent the Cash assistance for things other than repairs?
    assistance_other_repairs: undefined | Option<'know_address_suggestions'>
    // use_mpca_assistance/assistance_other_repairs_yes [text] If "Yes", please specify
    assistance_other_repairs_yes: string | undefined
    // use_mpca_assistance/assistance_other_repairs_rate [select_one] If "Yes", how much of the rent allowance did you use for these things?
    assistance_other_repairs_rate: undefined | Option<'assistance_other_repairs_rate'>
    // use_mpca_assistance/brochure_provided [select_one] Did you use the brochure provided as guidance on how to spend money on repairs?
    brochure_provided: undefined | Option<'brochure_provided'>
    // impact/basic needs_priorities [select_one] Have you been able to meet the basic needs of your HH according to your priorities?
    basic_needs_priorities: undefined | Option<'basic_needs_priorities'>
    // impact/living_conditions_interventions [select_one] Have you been able to improve your living conditions as a result of the project interventions?
    living_conditions_interventions: undefined | Option<'living_conditions_interventions'>
    // impact/living_conditions_interventions_no [text] If "No", please specify
    living_conditions_interventions_no: string | undefined
    // impact/who_assisted [select_one] Who assisted you with the house repairs?
    who_assisted: undefined | Option<'who_assisted'>
    // impact/who_assisted_other [text] If "Other", please specify
    who_assisted_other: string | undefined
    // impact/issues_regarding_repaired [select_one] Do you have any HLP issues regarding your repaired apartment / house?
    issues_regarding_repaired: undefined | Option<'know_address_suggestions'>
    // impact/issues_regarding_repaired_yes [text] If "Yes", please explain why:
    issues_regarding_repaired_yes: string | undefined
    // impact/shelter_assistance_return [select_one] Did shelter assistance help you to return and reside in the repaired house/apartment?
    shelter_assistance_return: undefined | Option<'know_address_suggestions'>
    // impact/shelter_assistance_return_no [text] If "No", please explain why:
    shelter_assistance_return_no: string | undefined
    // impact/planning_staying_repaired [select_one] Are you planning on staying in your repaired  house/apartment for a long time?
    planning_staying_repaired: undefined | Option<'planning_staying_repaired'>
    // impact/planning_staying_repaired_other [text] If "Other", please specify
    planning_staying_repaired_other: string | undefined
    // impact/planning_staying_repaired_no [text] If "No", please explain why:
    planning_staying_repaired_no: string | undefined
    // hi/square_metres [integer] In square metres, what is the total space of your accommodation?
    square_metres: number | undefined
    // hi/dwelling_water_proof [select_one] Is your dwelling water proof?
    dwelling_water_proof: undefined | Option<'know_address_suggestions'>
    // hi/access_running_water [select_one] Do you have access to running water?
    access_running_water: undefined | Option<'access_heating'>
    // hi/access_hot_water [select_one] Do you have access to hot water?
    access_hot_water: undefined | Option<'access_heating'>
    // hi/access_washing_facilities [select_one] Do you have access to adequate washing facilities?
    access_washing_facilities: undefined | Option<'access_heating'>
    // hi/access_sanitation_facilities [select_one] Do you have access to adequate sanitation facilities?
    access_sanitation_facilities: undefined | Option<'access_heating'>
    // hi/access_heating [select_one] Do you have access to adequate heating?
    access_heating: undefined | Option<'access_heating'>
    // hi/property_draft_proofing [select_one] Does your property have draft proofing?
    property_draft_proofing: undefined | Option<'know_address_suggestions'>
    // hi/property_adequately_insulated [select_one] Is your property adequately insulated?
    property_adequately_insulated: undefined | Option<'know_address_suggestions'>
    // hi/property_double_glazed_windows [select_one] Does your property have double-glazed windows?
    property_double_glazed_windows: undefined | Option<'property_double_glazed_windows'>
    // hi/formal_agreement_landlord [select_one] Does you have a formal written agreement of tenancy with your landlord?
    formal_agreement_landlord: undefined | Option<'know_address_suggestions'>
    // hi/access_external_locked [select_one] Do you have access to external locked doors on your property?
    access_external_locked: undefined | Option<'know_address_suggestions'>
    // hi/access-private_space [select_one] Does your houeshold have access to private space (space you don't share with other households)?
    'access-private_space': undefined | Option<'know_address_suggestions'>
    // on/current_living_space [select_one] Does your current living space allow you to conduct essential household activities with dignity, security, and provide protection from physical and environmental harm?
    current_living_space: undefined | Option<'know_address_suggestions'>
    // on/household_currently_have_clothing [select_one] Does your household currently have enough clothing, bedding, cooking supplies, fuel, lighting, and other items needed to provide a basic level of comfort?
    household_currently_have_clothing: undefined | Option<'know_address_suggestions'>
    // on/two_weeks_household [select_one] During the past two weeks, did your household purchase more, fewer, or the usual amount of items to meet your basic water, sanitation, and hygiene needs?
    two_weeks_household: undefined | Option<'two_weeks_household'>
    // on/receive_shelter_assistance [select_one] How would your HH prefer to receive shelter assistance in the future?
    receive_shelter_assistance: undefined | Option<'receive_shelter_assistance'>
    // on/receive_shelter_assistance_no [text] If "Other", please explain why:
    receive_shelter_assistance_no: string | undefined
    // on/needs_community_currently [select_multiple] In your opinion, what are the top 3 priority needs in your community currently?
    needs_community_currently: undefined | Option<'needs_community_currently'>[]
    // on/needs_community_currently_other [text] If "Other", please specify
    needs_community_currently_other: string | undefined
    // aap/any_member_household [select_one] Have you or any member of your household been exposed to any risk as a consequence of receiving the CASH?
    any_member_household: undefined | Option<'know_address_suggestions'>
    // aap/any_member_household_yes [text] If "Yes", you have experienced any challenge or insecurity situation as consequence of receiving CASH, can you tell us what happened?
    any_member_household_yes: string | undefined
    // aap/provide_someone_commission [select_one] Have you ever had to provide someone with a commission, a gift, a tip, a service or a favor to get in the list of project participants, or to receive the cash?
    provide_someone_commission: undefined | Option<'know_address_suggestions'>
    // aap/provide_someone_commission_yes [select_one] If "Yes", to whom did you had to provide the rate, gift, tip, favor, or service?
    provide_someone_commission_yes: undefined | Option<'provide_someone_commission_yes'>
    // aap/provide_someone_commission_yes_other [text] If "To another person", please specify
    provide_someone_commission_yes_other: string | undefined
    // aap/feel_safe_travelling [select_one] Did you feel safe at all times travelling to receive the assistance/service (to/from your place), while receiving the assistance/service, and upon return to your place?
    feel_safe_travelling: undefined | Option<'feel_treated_respect'>
    // aap/feel_safe_travelling_bad [text] If "Mostly yes" or "Not really" or "Not at all", please specify:
    feel_safe_travelling_bad: string | undefined
    // aap/feel_treated_respect [select_one] Did you feel you were treated with respect by NGO/agency staff during the intervention?
    feel_treated_respect: undefined | Option<'feel_treated_respect'>
    // fcm/know_address_suggestions [select_one] Do you know how and where you could address your suggestions, comments or complaints related to the work of the Danish Refugee Council, if any?
    know_address_suggestions: undefined | Option<'know_address_suggestions'>
    // fcm/know_address_suggestions_yes [select_one] If "Yes", have you provided any feedback/ suggestions, complaints, or questions?
    know_address_suggestions_yes: undefined | Option<'know_address_suggestions_yes'>
    // fcm/know_address_suggestions_yes_ndnp [select_one] If "No did not provide any", why?
    know_address_suggestions_yes_ndnp: undefined | Option<'know_address_suggestions_yes_ndnp'>
    // fcm/know_address_suggestions_yes_ndnp_other [text] If "Other", please specify
    know_address_suggestions_yes_ndnp_other: string | undefined
    // fcm/know_address_suggestions_no [select_one] If "No", why?
    know_address_suggestions_no: undefined | Option<'know_address_suggestions_no'>
    // fcm/know_address_suggestions_no_other [text] If "Other", please specify
    know_address_suggestions_no_other: string | undefined
    // fcm/submitted_feedback_complaint [select_one] If you submitted any feedback and complaint, did you receive a response from the program and organization?
    submitted_feedback_complaint: undefined | Option<'submitted_feedback_complaint'>
    // fcm/feedback_reporting_channels [select_one] Which feedback and reporting channels would you use to communicate with us?
    feedback_reporting_channels: undefined | Option<'feedback_reporting_channels'>
    // fcm/feedback_reporting_channels_other [text] If "Other", please specify
    feedback_reporting_channels_other: string | undefined
    // fcm/comment [text] Interviewer's comment
    comment: string | undefined
    // not_thank [note] Thank you for taking the time to fill out this form.
    not_thank: string
  }
  export const options = {
    type_interview: {
      inperson: `In-person`,
      remote: `Remote`,
    },
    pdmtype: {
      empca: `Emergency MPCA`,
      bnmpca: `Basic Needs MPCA`,
      caren: `Cash for Rent`,
      carep: `Cash for Repair`,
    },
    office: {
      dnipro: `DNK (Dnipro)`,
      kharkiv: `HRK (Kharkiv)`,
      chernihiv: `CEJ (Chernihiv)`,
      sumy: `UMY (Sumy)`,
      mykolaiv: `NLV (Mykolaiv)`,
      lviv: `LWO (Lviv)`,
    },
    know_address_suggestions: {
      yes: `Yes`,
      no: `No`,
    },
    repgender: {
      male: `Male`,
      female: `Female`,
      pnd: `Prefer not to disclose`,
    },
    status_person: {
      yesidp: `Yes, an IDP`,
      yescap: `Yes, a conflict-affected person`,
      neap: `Neither is applicable`,
    },
    undefined: {
      tamc: `Multi-purpose cash assistance (MPCA)`,
      tacn: `Cash for rent`,
      tacr: `Cash for repairs`,
      styc: `Yes, completely or mostly`,
      stnr: `No, not really or not at all`,
      stdk: `Don't know`,
      rtvs: `Very Satisfied`,
      rtsi: `Satisfied`,
      rtsf: `Satisfactory`,
      rtds: `Dissatisfied`,
      rtvd: `Very Dissatisfied`,
    },
    cash_repair_type: {
      rphr: `Cash for the house repairs`,
      rphc: `I hired a contractor`,
      other: `Other`,
    },
    how_much_money_yes: {
      rele: `Less`,
      rets: `The same`,
      remo: `More`,
    },
    register_receive: {
      rrip: `In person`,
      rrbp: `By phone`,
      rros: `Online Survey [cash for rent only]`,
      other: `Other`,
    },
    assistance_delivered: {
      asba: `Bank transfer without card`,
      asuk: `Ukrposhta`,
      asbc: `Bank account`,
      asca: `Card`,
      asnp: `Nova Poshta office`,
      aswu: `Western Union`,
      other: `Other`,
    },
    time_registered_assistance: {
      trlw: `Less than a week`,
      trow: `One week`,
      trtw: `Two weeks`,
      trhw: `Three weeks`,
      trfw: `Four weeks or more`,
      trrm: `I haven't received the money yet`,
    },
    experience_problems_yes: {
      pbrl: `Registration took too long`,
      pbrc: `Registration excluded/left out certain groups`,
      pbrp: `Registration process was unclear or confusing`,
      pbrm: `Registration required too many documents`,
      pbna: `No answer`,
      other: `Other`,
    },
    satisfied_process: {
      ndyl: `Yes, very satisfied`,
      ndyf: `Yes, somewhat satisfied`,
      ndnr: `Not very satisfied`,
      ndna: `Not satisfied at all`,
    },
    know_people_needing: {
      ndyl: `Yes, a lot`,
      ndyf: `Yes, a few`,
      ndnr: `Not really`,
      ndna: `Not at all`,
      nddk: `Don't know`,
      ndnn: `No answer`,
    },
    better_inform_distribution: {
      dbbd: `Improved communication before the distribution`,
      dbdd: `Improved communication during the distribution`,
      dbcd: `Improved communication after the distribution`,
      dbad: `More information about the date of the distribution`,
      dbtd: `More information about the time of the distribution`,
      other: `Other`,
    },
    rate_quality_assistance: {
      rtvs: `Very Satisfied`,
      rtsf: `Satisfactory`,
      rtds: `Dissatisfied`,
      rtvd: `Very Dissatisfied`,
    },
    sectors_cash_assistance: {
      stfo: `Food`,
      sthh: `HH NFIs`,
      stcl: `Clothing`,
      sthe: `Heating (fuel)`,
      stha: `Healthcare (services)`,
      strn: `Renovation materials`,
      stre: `Rent`,
      star: `Agricultural inputs`,
      sthg: `Hygiene items`,
      stut: `Utilities`,
      stme: `Medication`,
      steu: `Education materials (i.e., books)`,
      other: `Other`,
    },
    property_double_glazed_windows: {
      yes: `Yes`,
      no: `No`,
      ydk: `Dont know`,
    },
    improve_living: {
      ippr: `Paying rent for the current place (avoiding eviction)`,
      ipnp: `Renting a new place`,
      iprd: `Restoring damaged house/apartment where you currently reside`,
      ipba: `Buying additional HH supplies to improve the level of comfort`,
      other: `Other`,
    },
    assistance_other_repairs_rate: {
      rnct: `0-25%`,
      rntf: `26-50%`,
      rnfs: `51-75%`,
      rnst: `76-100%`,
    },
    money_received: {
      smwi: `Windows`,
      smdi: `Doors interior / doors exterior`,
      smro: `Roof`,
      other: `Other`,
    },
    brochure_provided: {
      yes: `Yes`,
      no: `No`,
      dnb: `I did not receive a brochure`,
    },
    basic_needs_priorities: {
      pryf: `Yes- fully`,
      prym: `Yes- most of the priority needs`,
      prys: `Yes- some of the priority needs`,
      prno: `None`,
      prdk: `Don't know`,
      prna: `No answer`,
    },
    living_conditions_interventions: {
      piyf: `Yes- greatly`,
      piym: `Yes- mostly`,
      piys: `Yes- some`,
      pino: `None`,
      pidk: `Don't know`,
      pina: `No answer`,
    },
    who_assisted: {
      wahd: `I have done it myself`,
      wacd: `Contractor driven approach`,
      wanb: `Nothing has been done yet`,
      other: `Other`,
    },
    planning_staying_repaired: {
      yes: `Yes`,
      no: `No`,
      other: `Other`,
    },
    access_heating: {
      acal: `A = Always`,
      acna: `B = Not always on but comes daily`,
      acco: `C = Comes on intermittent days`,
      acre: `D = Rarely`,
      acne: `E = Never`,
    },
    two_weeks_household: {
      usmo: `More`,
      usfe: `Fewer`,
      usnc: `No change`,
    },
    receive_shelter_assistance: {
      rsca: `Cash`,
      rsmk: `Building materials in kind (distribution)`,
      rsmc: `Building materials in kind + cash for labour`,
      other: `Other`,
    },
    needs_community_currently: {
      tpfo: `Food`,
      tpdw: `Drinking water`,
      tphi: `Household Non-Food Items`,
      tpcs: `Clothing/shoes`,
      tphe: `Heating (fuel)`,
      tphs: `Healthcare services/Medication`,
      tpsp: `Shelter repair`,
      tpre: `Rent`,
      tpai: `Agricultural inputs`,
      tpht: `Hygiene items`,
      tput: `Utilities`,
      tped: `Education`,
      tpdr: `Debt repayment`,
      tpla: `Legal assistance/documents`,
      tptr: `Transport`,
      other: `Other`,
      tpdk: `I don’t know / I don’t want to answer`,
    },
    provide_someone_commission_yes: {
      wpds: `To the DRC staff`,
      wplo: `To a local organization that is part of the project`,
      wpvo: `To a volunteer`,
      wpap: `To another person`,
    },
    feel_treated_respect: {
      rcyc: `Yes, completely`,
      rcmy: `Mostly yes`,
      rcnr: `Not really`,
      rcnt: `Not at all`,
      rcdk: `Don't know`,
      rcna: `No answer`,
    },
    know_address_suggestions_yes: {
      pvyc: `Yes, with a complaint`,
      pvyf: `Yes, with feedback`,
      pvyq: `Yes, with a question`,
      pvnp: `No did not provide any`,
    },
    know_address_suggestions_yes_ndnp: {
      pfnp: `I did not need to provide feedback`,
      pfpf: `I do not feel comfortable providing feedback/ suggestions, complaints, or questions`,
      pfhf: `I have provided feedback/ suggestions, complaints, or questions in the past and I was never responded to.`,
      other: `Other`,
    },
    know_address_suggestions_no: {
      nkhb: `The helpline has not been shared with me before`,
      nknk: `I do not know where to find the helpline number`,
      other: `Other`,
    },
    submitted_feedback_complaint: {
      smyc: `Yes, completely`,
      smry: `Rather yes than no`,
      smnn: `Not answered at all`,
      smna: `No answer`,
    },
    feedback_reporting_channels: {
      cnbp: `By phone`,
      cnbe: `By email`,
      cnws: `On Web-site`,
      cnbs: `Complaint box on site`,
      cncd: `Complaint desk on site`,
      cntm: `Text message`,
      other: `Other`,
      cnno: `None`,
    },
    ben_det_oblast: {
      aroc: `Autonomous Republic of Crimea`,
      vinnytska: `Vinnytsia`,
      volynska: `Volyn`,
      dnipropetrovska: `Dnipropetrovsk`,
      donetska: `Donetsk`,
      zhytomyrska: `Zhytomyr`,
      zakarpatska: `Zakarpattia`,
      zaporizka: `Zaporizhzhia`,
      'ivano-frankivska': `Ivano-Frankivsk`,
      kyivska: `Kyiv`,
      kirovohradska: `Kirovohrad`,
      luhanska: `Luhansk`,
      lvivska: `Lviv`,
      mykolaivska: `Mykolaiv`,
      odeska: `Odesa`,
      poltavska: `Poltava`,
      rivnenska: `Rivne`,
      sumska: `Sumy`,
      ternopilska: `Ternopil`,
      kharkivska: `Kharkiv`,
      khersonska: `Kherson`,
      khmelnytska: `Khmelnytskyi`,
      cherkaska: `Cherkasy`,
      chernivetska: `Chernivtsi`,
      chernihivska: `Chernihiv`,
      citykyiv: `City Kyiv`,
      sevastopilska: `Sevastopil`,
    },
  }

  const extractQuestionName = (_: Record<string, any>) => {
    const output: any = {}
    Object.entries(_).forEach(([k, v]) => {
      const arr = k.split('/')
      const qName = arr[arr.length - 1]
      output[qName] = v
    })
    return output
  }

  export const map = (_: Record<keyof T, any>): T =>
    ({
      ..._,
      unique_number: _.unique_number ? +_.unique_number : undefined,
      age: _.age ? +_.age : undefined,
      how_many_family: _.how_many_family ? +_.how_many_family : undefined,
      family: _['family']?.map(extractQuestionName).map((_: any) => {
        _['repage'] = _.repage ? +_.repage : undefined
        return _
      }),
      sectors_cash_assistance: _.sectors_cash_assistance?.split(' '),
      sectors_cash_assistance_food: _.sectors_cash_assistance_food ? +_.sectors_cash_assistance_food : undefined,
      sectors_cash_assistance_clothing: _.sectors_cash_assistance_clothing
        ? +_.sectors_cash_assistance_clothing
        : undefined,
      sectors_cash_assistance_utilities_heating: _.sectors_cash_assistance_utilities_heating
        ? +_.sectors_cash_assistance_utilities_heating
        : undefined,
      sectors_cash_assistance_healthcare: _.sectors_cash_assistance_healthcare
        ? +_.sectors_cash_assistance_healthcare
        : undefined,
      sectors_cash_assistance_hygiene_items: _.sectors_cash_assistance_hygiene_items
        ? +_.sectors_cash_assistance_hygiene_items
        : undefined,
      square_metres: _.square_metres ? +_.square_metres : undefined,
      needs_community_currently: _.needs_community_currently?.split(' '),
    }) as T
}
