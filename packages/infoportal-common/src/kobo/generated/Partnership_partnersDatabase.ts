export namespace Partnership_partnersDatabase {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aLs32U5Qc9HfQ5mxQtsEML
  export interface T {
    start: string
    end: string
    // group_dc9af43/Partner_name_English [text] Partner name (English)
    Partner_name_English: string | undefined
    // group_dc9af43/Partner_name_Ukrainian [text] Partner name (Ukrainian)
    Partner_name_Ukrainian: string | undefined
    // group_dc9af43/Type_of_organization [select_one] Type of organization
    Type_of_organization: undefined | Option<'Type_of_organization'>
    // group_dc9af43/Is_this_a_women_led_organization [select_one] Is this a women-led organization?
    Is_this_a_women_led_organization: undefined | Option<'Is_this_a_women_led_organization'>
    // group_dc9af43/Is_this_a_youth_led_organization [select_one] Is this a youth-led organization?
    Is_this_a_youth_led_organization: undefined | Option<'Is_this_a_youth_led_organization'>
    // group_dc9af43/If_other_detail [text] If other, detail
    If_other_detail: string | undefined
    // group_dc9af43/group_gu2ls22/Name [text] Name
    Name: string | undefined
    // group_dc9af43/group_gu2ls22/Position [text] Position
    Position: string | undefined
    // group_dc9af43/group_gu2ls22/Phone_number [text] Phone number
    Phone_number: string | undefined
    // group_dc9af43/group_gu2ls22/E_mail [text] E-mail
    E_mail: string | undefined
    // group_dc9af43/group_gu2ls22/Comments_on_contacts [text] Comments on contacts
    Comments_on_contacts: string | undefined
    // group_dc9af43/group_mw5wy59/Name_of_the_interviewer [text] Name of the interviewer
    Name_of_the_interviewer: string | undefined
    // group_dc9af43/group_mw5wy59/Position_of_the_interviewer [text] Position of the interviewer
    Position_of_the_interviewer: string | undefined
    // group_dc9af43/group_mw5wy59/Assessment_conducted_with_the_ [select_one] Assessment conducted with the focal point (information in previous questions)?
    Assessment_conducted_with_the_: undefined | Option<'Assessment_conducted_with_the_'>
    // group_dc9af43/group_mw5wy59/Name_of_the_interviewee [text] Name of the interviewee
    Name_of_the_interviewee: string | undefined
    // group_dc9af43/group_mw5wy59/Position_of_the_interviewee [text] Position of the interviewee
    Position_of_the_interviewee: string | undefined
    // group_dc9af43/group_mw5wy59/Date_of_assessment [date] Date of assessment
    Date_of_assessment: Date | undefined
    // group_dc9af43/group_mw5wy59/Interviewee_consents_to_be_contacted [select_one] Interviewee consents to be contacted?
    Interviewee_consents_to_be_contacted: undefined | Option<'Interviewee_consents_to_be_contacted'>
    // group_dc9af43/group_mw5wy59/Other_information_pr_valuable_and_helpful [text] Other information provided that might be valuable and helpful
    Other_information_pr_valuable_and_helpful: string | undefined
    // group_dc9af43/group_mw5wy59/Flag_any_other_relev_ments_and_assessment [text] Flag any other relevant information, red flags, overall comments and assessment
    Flag_any_other_relev_ments_and_assessment: string | undefined
    // group_dc9af43/group_mq5kh61/Office_address [text] Office address
    Office_address: string | undefined
    // group_dc9af43/group_mq5kh61/Website [text] Website
    Website: string | undefined
    // group_dc9af43/group_mq5kh61/Social_media [text] Social media
    Social_media: string | undefined
    // group_dc9af43/group_mq5kh61/Is_the_organization_registered [select_one] Is the organization registered
    Is_the_organization_registered: undefined | Option<'Is_the_organization_registered'>
    // group_dc9af43/group_mq5kh61/Date_of_registration [date] Date of registration
    Date_of_registration: Date | undefined
    // group_dc9af43/group_xi0yh25/IATI_code [text] IATI code
    IATI_code: string | undefined
    // group_dc9af43/group_xi0yh25/USREOU_code [text] USREOU code
    USREOU_code: string | undefined
    // group_dc9af43/Is_there_an_ongoing_relationsh [select_one] Is there an ongoing relationship between DRC and this organization?
    Is_there_an_ongoing_relationsh: undefined | Option<'Is_there_an_ongoing_relationsh'>
    // group_dc9af43/If_other_detail_001 [text] If other, detail
    If_other_detail_001: string | undefined
    // group_dc9af43/What_is_the_organization_s_mission [text] What is the organization's mission?
    What_is_the_organization_s_mission: string | undefined
    // group_dc9af43/Provide_a_short_desc_on_about_the_partner [text] Provide a short description about the partner
    Provide_a_short_desc_on_about_the_partner: string | undefined
    // group_dc9af43/Year_starting_humanitarian_work [date] Year starting humanitarian work
    Year_starting_humanitarian_work: Date | undefined
    // group_oh0eh63/group_zc7md99/Which_oblasts_does_t_t_and_has_experience [select_multiple] Which oblasts does the organization work (is present and has experience)?
    Which_oblasts_does_t_t_and_has_experience: undefined | Option<'Oblast_001'>[]
    // group_oh0eh63/group_zc7md99/Comment_on_areas_of_operation [text] Comment on areas of operation
    Comment_on_areas_of_operation: string | undefined
    // group_oh0eh63/group_zc7md99/Is_coordination_done_with_othe [select_one] Is coordination done with other actors?
    Is_coordination_done_with_othe: undefined | Option<'Is_coordination_done_with_othe'>
    // group_oh0eh63/group_zc7md99/If_yes_which_types_of_actors [select_multiple] If yes, which types of actors?
    If_yes_which_types_of_actors: undefined | Option<'If_yes_which_types_of_actors'>[]
    // group_oh0eh63/group_zc7md99/Established_partnership_cooper [select_one] Established partnership/cooperation with other CSOs/local partners
    Established_partnership_cooper: undefined | Option<'Established_partnership_cooper'>
    // group_oh0eh63/group_zc7md99/If_yes_please_name_the_organizations [text] If yes, please name the organizations
    If_yes_please_name_the_organizations: string | undefined
    // group_oh0eh63/group_zc7md99/Nature_of_partnership_cooperation [text] Nature of partnership/cooperation
    Nature_of_partnership_cooperation: string | undefined
    // group_oh0eh63/group_zc7md99/Cooperation_with_private_secto [select_one] Cooperation with private sector bodies
    Cooperation_with_private_secto: undefined | Option<'Cooperation_with_private_secto'>
    // group_oh0eh63/group_zc7md99/If_yes_which_002 [text] If yes, which
    If_yes_which_002: string | undefined
    // group_oh0eh63/group_zc7md99/Cooperation_with_UN_Agencies_a [select_one] Cooperation with UN Agencies and INGOs
    Cooperation_with_UN_Agencies_a: undefined | Option<'Cooperation_with_UN_Agencies_a'>
    // group_oh0eh63/group_zc7md99/If_yes_which [select_multiple] If yes, which
    If_yes_which: undefined | Option<'If_yes_which_001'>[]
    // group_oh0eh63/group_zc7md99/If_other_detail_002 [text] If other, detail
    If_other_detail_002: string | undefined
    // group_oh0eh63/group_zc7md99/Participation_in_Humanitarian_ [select_one] Participation in Humanitarian Cluster System (Shelter, Protection, WASH Cluster etc.)
    Participation_in_Humanitarian_: undefined | Option<'Participation_in_Humanitarian_'>
    // group_oh0eh63/group_zc7md99/If_yes_which_003 [text] If yes, which
    If_yes_which_003: string | undefined
    // group_oh0eh63/group_qb9rk01/Number_of_offices [integer] Number of offices
    Number_of_offices: number | undefined
    // group_oh0eh63/group_qb9rk01/group_ts4rc87 [begin_repeat] Offices details
    group_ts4rc87:
      | {
          Oblast: undefined | Option<'Oblast_001'>[] | undefined
          Settlement: string | undefined | undefined
          Google_maps_link: string | undefined | undefined
        }[]
      | undefined
    // group_oh0eh63/group_pa1fo23/Which_sectors_does_the_organiz [select_multiple] Which sectors does the organization have experience with?
    Which_sectors_does_the_organiz: undefined | Option<'Sectors_funded'>[]
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_beneficiary_number [text] Examples of projects with NFI (if possible with beneficiary number)
    Examples_of_projects_h_beneficiary_number: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_beneficiary_number_001 [text] Examples of projects with WaSH (if possible with beneficiary number)
    Examples_of_projects_h_beneficiary_number_001: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_beneficiary_number_002 [text] Examples of projects with Protection (if possible with beneficiary number)
    Examples_of_projects_h_beneficiary_number_002: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_benefic_001 [text] Examples of projects with PSS (if possible with beneficiary number)
    Examples_of_projects_h_benefic_001: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_beneficiary_number_003 [text] Examples of projects with Education (if possible with beneficiary number)
    Examples_of_projects_h_beneficiary_number_003: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_beneficiary_number_004 [text] Examples of projects with Livelihoods (if possible with beneficiary number)
    Examples_of_projects_h_beneficiary_number_004: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_benefic_016 [text] Examples of projects with MPCA (if possible with beneficiary number)
    Examples_of_projects_h_benefic_016: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_beneficiary_number_005 [text] Examples of projects with Food Security (if possible with beneficiary number)
    Examples_of_projects_h_beneficiary_number_005: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_beneficiary_number_006 [text] Examples of projects with Health (if possible with beneficiary number)
    Examples_of_projects_h_beneficiary_number_006: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_beneficiary_number_007 [text] Examples of projects with Nutrition (if possible with beneficiary number)
    Examples_of_projects_h_beneficiary_number_007: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_beneficiary_number_008 [text] Examples of projects with Shelter (if possible with beneficiary number)
    Examples_of_projects_h_beneficiary_number_008: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_beneficiary_number_009 [text] Examples of projects with Evacuations (if possible with beneficiary number)
    Examples_of_projects_h_beneficiary_number_009: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_beneficiary_number_010 [text] Examples of projects with GBV (if possible with beneficiary number)
    Examples_of_projects_h_beneficiary_number_010: string | undefined
    // group_oh0eh63/group_pa1fo23/Examples_of_projects_h_benefic [text] Examples of projects with EORE (if possible with beneficiary number)
    Examples_of_projects_h_benefic: string | undefined
    // group_oh0eh63/group_pa1fo23/Is_rapid_volunteer_mobilization_possible [select_one] Is rapid volunteer mobilization possible?
    Is_rapid_volunteer_mobilization_possible: undefined | Option<'Is_rapid_volunteer_mobilization_possible'>
    // group_oh0eh63/group_pa1fo23/Is_access_possible_by_the_orga [select_one] Is access possible by the organization to areas of typically restricted access (hard-to-reach)?
    Is_access_possible_by_the_orga: undefined | Option<'Is_access_possible_by_the_orga'>
    // group_oh0eh63/group_pa1fo23/If_yes_how [select_multiple] If yes, how?
    If_yes_how: undefined | Option<'If_yes_how'>[]
    // group_oh0eh63/group_pa1fo23/If_other_detail_003 [text] If other, detail
    If_other_detail_003: string | undefined
    // group_oh0eh63/group_pa1fo23/General_comments_on_experience [text] General comments on experience
    General_comments_on_experience: string | undefined
    // group_oh0eh63/group_ld5nr49/Select_if_the_organi_inorities_in_Ukraine [select_multiple] Select if the organization has projects specifically targeting specific vulnerable communities or minorities in Ukraine
    Select_if_the_organi_inorities_in_Ukraine: undefined | Option<'Minority_group'>[]
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_015 [text] Examples of projects with Children (if possible with beneficiary number)
    Examples_of_projects_h_benefic_015: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_018 [text] Examples of projects with Elderly (if possible with beneficiary number)
    Examples_of_projects_h_benefic_018: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_019 [text] Examples of projects with People with disabilities (if possible with beneficiary number)
    Examples_of_projects_h_benefic_019: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_002 [text] Examples of projects with IDPs from a particular location (if possible with beneficiary number)
    Examples_of_projects_h_benefic_002: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_003 [text] Examples of projects with Armenians (if possible with beneficiary number)
    Examples_of_projects_h_benefic_003: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_004 [text] Examples of projects with Greeks (if possible with beneficiary number)
    Examples_of_projects_h_benefic_004: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_005 [text] Examples of projects with Jews (if possible with beneficiary number)
    Examples_of_projects_h_benefic_005: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_006 [text] Examples of projects with Turkic-speaking Urums (if possible with beneficiary number)
    Examples_of_projects_h_benefic_006: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_007 [text] Examples of projects with Roma (if possible with beneficiary number)
    Examples_of_projects_h_benefic_007: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_008 [text] Examples of projects with People of African descent (if possible with beneficiary number)
    Examples_of_projects_h_benefic_008: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_009 [text] Examples of projects with Russians and Russian speakers (if possible with beneficiary number)
    Examples_of_projects_h_benefic_009: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_010 [text] Examples of projects with Refugees and asylum seekers in Ukraine (if possible with beneficiary number)
    Examples_of_projects_h_benefic_010: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_011 [text] Examples of projects with LGBTQIA+ (if possible with beneficiary number)
    Examples_of_projects_h_benefic_011: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_012 [text] Examples of projects with Stateless persons and persons at risk of statelessness (if possible with beneficiary number)
    Examples_of_projects_h_benefic_012: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_013 [text] Examples of projects with HIV+ (if possible with beneficiary number)
    Examples_of_projects_h_benefic_013: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_017 [text] Examples of projects which are focused on women's rights (if possible with beneficiary number)
    Examples_of_projects_h_benefic_017: string | undefined
    // group_oh0eh63/group_ld5nr49/If_other_please_pro_f_what_type_of_other [text] If other, please provide a simple word or short description of what type of other
    If_other_please_pro_f_what_type_of_other: string | undefined
    // group_oh0eh63/group_ld5nr49/Examples_of_projects_h_benefic_014 [text] Examples of projects with Other (if possible with beneficiary number)
    Examples_of_projects_h_benefic_014: string | undefined
    // group_oh0eh63/group_pr3kz40/Own_vehicles [select_multiple] Own vehicles
    Own_vehicles: undefined | Option<'Own_vehicles'>[]
    // group_oh0eh63/group_pr3kz40/Own_warehouse_belonging_to_th [select_one] Own warehouse (belonging to the organization)
    Own_warehouse_belonging_to_th: undefined | Option<'Own_warehouse_belonging_to_th'>
    // group_oh0eh63/group_pr3kz40/If_not_how_are_items_stored [select_multiple] If not, how are items stored?
    If_not_how_are_items_stored: undefined | Option<'If_not_how_are_items_stored'>[]
    // group_oh0eh63/group_pr3kz40/Other_warehouse_details [text] Other warehouse details
    Other_warehouse_details: string | undefined
    // group_oh0eh63/group_qr64f57/Safety_security_management_i [select_multiple] Safety & security management items in place
    Safety_security_management_i: undefined | Option<'Safety_security_management_i'>[]
    // group_oh0eh63/group_qr64f57/Safety_security_trainings_co [select_multiple] Safety & security trainings conducted
    Safety_security_trainings_co: undefined | Option<'Safety_security_trainings_co'>[]
    // group_oh0eh63/group_qr64f57/If_other_specify [text] If other, specify
    If_other_specify: string | undefined
    // group_oh0eh63/group_qr64f57/Safety_equipment_available [select_multiple] Safety & security equipment available
    Safety_equipment_available: undefined | Option<'Safety_equipment_available'>[]
    // group_oh0eh63/group_qr64f57/If_other_specify_001 [text] If other, specify
    If_other_specify_001: string | undefined
    // group_oh0eh63/group_qr64f57/Are_different_standa_d_paid_staff_members [select_one] Are different standards applied between volunteers and paid staff members?
    Are_different_standa_d_paid_staff_members: undefined | Option<'Are_different_standa_d_paid_staff_members'>
    // group_oh0eh63/group_qr64f57/Comments_on_safety [text] Comments on safety
    Comments_on_safety: string | undefined
    // group_oh0eh63/group_un96z00/The_organization_is_g_type_of_activities [select_multiple] The organization is recommended for the following type of activities
    The_organization_is_g_type_of_activities: undefined | Option<'The_organization_is_g_type_of_activities'>[]
    // group_oh0eh63/group_un96z00/Are_recommendation_letters_fro [select_one] Are recommendation letters from other INGOs available?
    Are_recommendation_letters_fro: undefined | Option<'Are_recommendation_letters_fro'>
    // group_oh0eh63/group_un96z00/If_yes_detail [text] If yes, detail
    If_yes_detail: string | undefined
    // group_oh0eh63/group_tp2um88/Operational_challenges [select_multiple] Operational challenges
    Operational_challenges: undefined | Option<'Operational_challenges'>[]
    // group_oh0eh63/group_tp2um88/If_other_specify_002 [text] If other, specify
    If_other_specify_002: string | undefined
    // group_oh0eh63/group_tp2um88/Provide_details_coordination [text] Provide details (coordination)
    Provide_details_coordination: string | undefined
    // group_oh0eh63/group_tp2um88/Provide_details_communication [text] Provide details (communication)
    Provide_details_communication: string | undefined
    // group_oh0eh63/group_tp2um88/Provide_details_access_physical [text] Provide details (access, physical)
    Provide_details_access_physical: string | undefined
    // group_oh0eh63/group_tp2um88/Provide_details_access_information [text] Provide details (access, information)
    Provide_details_access_information: string | undefined
    // group_oh0eh63/group_tp2um88/Provide_details_logistics_supply_chain [text] Provide details (logistics, supply chain)
    Provide_details_logistics_supply_chain: string | undefined
    // group_oh0eh63/group_tp2um88/Provide_details_risk_mitigation [text] Provide details (risk mitigation)
    Provide_details_risk_mitigation: string | undefined
    // group_oh0eh63/group_tp2um88/Provide_details_HR_administrative [text] Provide details (HR, administrative)
    Provide_details_HR_administrative: string | undefined
    // group_oh0eh63/group_tp2um88/Provide_details_other [text] Provide details (other)
    Provide_details_other: string | undefined
    // group_oh0eh63/group_tp2um88/Which_assistance_would_the_CSO [select_multiple] Which assistance would the CSO require to increase its efficiency in the provision of urgent humanitarian assistance?
    Which_assistance_would_the_CSO: undefined | Option<'Which_assistance_would_the_CSO'>[]
    // group_oh0eh63/group_tp2um88/If_other_specify_003 [text] If other, specify
    If_other_specify_003: string | undefined
    // group_oh0eh63/group_tp2um88/Are_partner_staff_me_social_support_PSS [select_one] Are partner staff members receiving psycho-social support (PSS)?
    Are_partner_staff_me_social_support_PSS: undefined | Option<'Are_partner_staff_me_social_support_PSS'>
    // group_oh0eh63/group_tp2um88/Is_staff_trained_on_gical_first_aid_PFA [select_one] Is staff trained on psychological first aid (PFA)?
    Is_staff_trained_on_gical_first_aid_PFA: undefined | Option<'Is_staff_trained_on_gical_first_aid_PFA'>
    // group_oh0eh63/group_tp2um88/Has_the_partner_participated_i [select_one] Has the partner participated in capacity-building trainings, sessions, workshops etc. after 24 February 2022?
    Has_the_partner_participated_i: undefined | Option<'Has_the_partner_participated_i'>
    // group_oh0eh63/group_tp2um88/If_yes_please_menti_members_participated [text] If yes, please mention what kind of training sessions and which topics were provided, when and how many partner staff members participated
    If_yes_please_menti_members_participated: string | undefined
    // group_oh0eh63/group_tp2um88/What_kind_of_capacity_needs_to [select_multiple] What kind of capacity needs to be addressed?
    What_kind_of_capacity_needs_to: undefined | Option<'What_kind_of_capacity_needs_to'>[]
    // group_oh0eh63/group_tp2um88/If_other_specify_004 [text] If other, specify
    If_other_specify_004: string | undefined
    // group_es8rb83/Number_of_agreements_with_DRC [integer] Number of agreements with DRC
    Number_of_agreements_with_DRC: number | undefined
    // group_es8rb83/group_vi2hh32 [begin_repeat] SGA information
    group_vi2hh32:
      | {
          SGA_number: number | undefined | undefined
          Partnership_type: undefined | Option<'Partnership_type'> | undefined
          Is_it_an_equitable_partnership: undefined | Option<'Is_it_an_equitable_partnership'> | undefined
          SGA_start_date: Date | undefined | undefined
          SGA_end_date: Date | undefined | undefined
          Amount_UAH: number | undefined | undefined
          Amount_USD: number | undefined | undefined
          Funding_provided_in_ding_activities_USD: number | undefined | undefined
          Funding_provided_in_in_kind_support_USD: number | undefined | undefined
          group_ii6wz51_header: string | undefined
          group_ii6wz51_header_note: string | undefined
          group_ii6wz51_header_column: string | undefined
          group_ii6wz51_salaries_1: string | undefined
          group_ii6wz51_salaries_1_note: string | undefined
          group_ii6wz51_salaries_1_column: string | undefined | undefined
          group_ii6wz51_programme_supplies_1: string | undefined
          group_ii6wz51_programme_supplies_1_note: string | undefined
          group_ii6wz51_programme_supplies_1_column: string | undefined | undefined
          group_ii6wz51_programme_supplies_2: string | undefined
          group_ii6wz51_programme_supplies_2_note: string | undefined
          group_ii6wz51_programme_supplies_2_column: string | undefined | undefined
          group_ii6wz51_equipment_1: string | undefined
          group_ii6wz51_equipment_1_note: string | undefined
          group_ii6wz51_equipment_1_column: string | undefined | undefined
          group_ii6wz51_visibility_1: string | undefined
          group_ii6wz51_visibility_1_note: string | undefined
          group_ii6wz51_visibility_1_column: string | undefined | undefined
          group_ii6wz51_support_1: string | undefined
          group_ii6wz51_support_1_note: string | undefined
          group_ii6wz51_support_1_column: string | undefined | undefined
          Only_show_the_2_ques_end_date_30_days: string | undefined
          group_ol5wn75: string | undefined
          Date_received_letter_Request_for_Payment: Date | undefined | undefined
          Date_payment_confirmed: Date | undefined | undefined
          Amount_UAH_001: number | undefined | undefined
          Tranches_received_: number | undefined | undefined
          Funding_reported_on_: number | undefined | undefined
          Donor: undefined | Option<'Donor'> | undefined
          Project_code: number | undefined | undefined
          Total_budget_of_the_project_USD: number | undefined | undefined
          Sectors_funded: undefined | Option<'Sectors_funded'>[] | undefined
          Oblasts: undefined | Option<'Oblast_001'>[] | undefined
          group_zn5zo38: string | undefined
          Number_of_beneficiaries_planned: number | undefined | undefined
          Number_of_beneficiaries_PwD_planned: number | undefined | undefined
          group_zn5zo38_001: string | undefined
          Number_of_beneficiaries_reached_001: number | undefined | undefined
          Number_of_beneficiaries_PwD_reached_001: number | undefined | undefined
          group_eq2ox56_header: string | undefined
          group_eq2ox56_header_note: string | undefined
          group_eq2ox56_header_column: string | undefined
          group_eq2ox56_header_column_1: string | undefined
          group_eq2ox56_row: string | undefined
          group_eq2ox56_row_note: string | undefined
          group_eq2ox56_row_column: string | undefined | undefined
          group_eq2ox56_row_column_1: string | undefined | undefined
          group_eq2ox56_row_1: string | undefined
          group_eq2ox56_row_1_note: string | undefined
          group_eq2ox56_row_1_column: string | undefined | undefined
          group_eq2ox56_row_1_column_1: string | undefined | undefined
          group_eq2ox56_row_2: string | undefined
          group_eq2ox56_row_2_note: string | undefined
          group_eq2ox56_row_2_column: string | undefined | undefined
          group_eq2ox56_row_2_column_1: string | undefined | undefined
          group_hw2qn61: string | undefined
          Oblast_001: undefined | Option<'Oblast_001'>[] | undefined
          Type: undefined | Option<'Type'> | undefined
          Minority_group: undefined | Option<'Minority_group'>[] | undefined
          group_th3ei68_header: string | undefined
          group_th3ei68_header_note: string | undefined
          group_th3ei68_header_column: string | undefined
          group_th3ei68_header_column_1: string | undefined
          group_th3ei68_row: string | undefined
          group_th3ei68_row_note: string | undefined
          group_th3ei68_row_column: string | undefined | undefined
          group_th3ei68_row_column_1: string | undefined | undefined
          group_th3ei68_row_1: string | undefined
          group_th3ei68_row_1_note: string | undefined
          group_th3ei68_row_1_column: string | undefined | undefined
          group_th3ei68_row_1_column_1: string | undefined | undefined
          group_th3ei68_row_2: string | undefined
          group_th3ei68_row_2_note: string | undefined
          group_th3ei68_row_2_column: string | undefined | undefined
          group_th3ei68_row_2_column_1: string | undefined | undefined
          group_hg5yh63: string | undefined
          Activity_summary: string | undefined | undefined
          group_xo3ho32_header: string | undefined
          group_xo3ho32_header_note: string | undefined
          group_xo3ho32_header_column: string | undefined
          group_xo3ho32_header_column_1: string | undefined
          group_xo3ho32_row: string | undefined
          group_xo3ho32_row_note: string | undefined
          group_xo3ho32_row_column: string | undefined | undefined
          group_xo3ho32_row_column_1: string | undefined | undefined
          group_xo3ho32_row_1: string | undefined
          group_xo3ho32_row_1_note: string | undefined
          group_xo3ho32_row_1_column: string | undefined | undefined
          group_xo3ho32_row_1_column_1: string | undefined | undefined
          group_xo3ho32_row_2: string | undefined
          group_xo3ho32_row_2_note: string | undefined
          group_xo3ho32_row_2_column: string | undefined | undefined
          group_xo3ho32_row_2_column_1: string | undefined | undefined
          group_bj8rq59_header: string | undefined
          group_bj8rq59_header_note: string | undefined
          group_bj8rq59_header_column: string | undefined
          group_bj8rq59_header_column_1_1: string | undefined
          group_bj8rq59_row: string | undefined
          group_bj8rq59_row_note: string | undefined
          group_bj8rq59_row_column: string | undefined | undefined
          group_bj8rq59_row_column_1_1: string | undefined | undefined
          group_bj8rq59_row_1: string | undefined
          group_bj8rq59_row_1_note: string | undefined
          group_bj8rq59_row_1_column: string | undefined | undefined
          group_bj8rq59_row_1_column_1_1: string | undefined | undefined
          group_bj8rq59_row_2: string | undefined
          group_bj8rq59_row_2_note: string | undefined
          group_bj8rq59_row_2_column: string | undefined | undefined
          group_bj8rq59_row_2_column_1_1: string | undefined | undefined
          Cost_per_beneficiary_automatic_planned: string | undefined
          Cost_per_beneficiary_automatic_reached: string | undefined
          Was_reporting_done_in_a_timely_way: undefined | Option<'Was_reporting_done_in_a_timely_way'> | undefined
          Scale_in_which_furth_ation_is_recommended: string | undefined
          Comments: string | undefined | undefined
        }[]
      | undefined
    // group_es8rb83/Add_sum_in_USD_of_ho_have_even_given_them [note] Sum (USD) with all SGAs
    Add_sum_in_USD_of_ho_have_even_given_them: string
    // group_es8rb83/Add_sum_of_beneficiaries_reached [note] Sum (beneficiaries) with all SGAs
    Add_sum_of_beneficiaries_reached: string
    // group_zl5aj86/Has_vetting_been_conducted [select_one] Has vetting been conducted?
    Has_vetting_been_conducted: undefined | Option<'Has_vetting_been_conducted'>
    // group_zl5aj86/Are_results_positive [select_one] Are results positive?
    Are_results_positive: undefined | Option<'Are_results_positive'>
    // group_zl5aj86/Is_the_match_declared_openly_u [select_one] Is the match declared openly unfounded?
    Is_the_match_declared_openly_u: undefined | Option<'Is_the_match_declared_openly_u'>
    // group_zl5aj86/Select_the_reasoning_applied [select_one] Select the reasoning applied
    Select_the_reasoning_applied: undefined | Option<'Select_the_reasoning_applied'>
    // group_zl5aj86/Date_of_last_vetting_check [date] Date of last vetting check
    Date_of_last_vetting_check: Date | undefined
    // group_aw9ex77/Sub_Grant_Funding_Threshold [select_one] Sub-Grant Funding Threshold
    Sub_Grant_Funding_Threshold: undefined | Option<'Sub_Grant_Funding_Threshold'>
    // group_aw9ex77/Has_due_diligence_been_finaliz [select_one] Has due diligence been finalized?
    Has_due_diligence_been_finaliz: undefined | Option<'Has_due_diligence_been_finaliz'>
    // group_aw9ex77/Overall_Residual_Risk [select_one] Overall Residual Risk
    Overall_Residual_Risk: undefined | Option<'Overall_Residual_Risk'>
    // group_aw9ex77/group_xw8gy82/group_it0ge61/Accountability_risks [select_one] Accountability risks
    Accountability_risks: undefined | Option<'Accountability_risks'>
    // group_aw9ex77/group_xw8gy82/group_it0ge61/Code_of_Conduct_risks [select_one] Code of Conduct risks
    Code_of_Conduct_risks: undefined | Option<'Code_of_Conduct_risks'>
    // group_aw9ex77/group_xw8gy82/group_it0ge61/PSEAH_risks [select_one] PSEAH risks
    PSEAH_risks: undefined | Option<'PSEAH_risks'>
    // group_aw9ex77/group_xw8gy82/group_it0ge61/Corruption_and_Fraud_risks [select_one] Corruption and Fraud risks
    Corruption_and_Fraud_risks: undefined | Option<'Corruption_and_Fraud_risks'>
    // group_aw9ex77/group_xw8gy82/group_it0ge61/Human_Resources_risks [select_one] Human Resources risks
    Human_Resources_risks: undefined | Option<'Human_Resources_risks'>
    // group_aw9ex77/group_xw8gy82/group_xt04d46/Experience_risks [select_one] Experience risks
    Experience_risks: undefined | Option<'Experience_risks'>
    // group_aw9ex77/group_xw8gy82/group_xt04d46/Needs_assessments_risks [select_one] Needs assessments risks
    Needs_assessments_risks: undefined | Option<'Needs_assessments_risks'>
    // group_aw9ex77/group_xw8gy82/group_xt04d46/Monitoring_risks [select_one] Monitoring risks
    Monitoring_risks: undefined | Option<'Monitoring_risks'>
    // group_aw9ex77/group_xw8gy82/group_xt04d46/Involved_of_PoC_risks [select_one] Involved of PoC risks
    Involved_of_PoC_risks: undefined | Option<'Involved_of_PoC_risks'>
    // group_aw9ex77/group_xw8gy82/group_xt04d46/Coordination_risks [select_one] Coordination risks
    Coordination_risks: undefined | Option<'Coordination_risks'>
    // group_aw9ex77/group_xw8gy82/group_hu5fe25/Financial_policies_risks [select_one] Financial policies risks
    Financial_policies_risks: undefined | Option<'Financial_policies_risks'>
    // group_aw9ex77/group_xw8gy82/group_hu5fe25/Procurement_policies_risks [select_one] Procurement policies risks
    Procurement_policies_risks: undefined | Option<'Procurement_policies_risks'>
    // group_aw9ex77/group_xw8gy82/group_hu5fe25/Unverified_financial_accounts_risks [select_one] Unverified financial accounts risks
    Unverified_financial_accounts_risks: undefined | Option<'Unverified_financial_accounts_risks'>
    // group_aw9ex77/group_xw8gy82/group_yf94n47/Security_procedures_risks [select_one] Security procedures risks
    Security_procedures_risks: undefined | Option<'Security_procedures_risks'>
    // group_aw9ex77/group_xw8gy82/group_br6uz23/Support_to_partners_risks [select_one] Support to partners risks
    Support_to_partners_risks: undefined | Option<'Support_to_partners_risks'>
    // group_rg7co16/group_kd9el87 [begin_repeat] Staffing and financial growth per year
    group_kd9el87:
      | {
          Year: Date | undefined | undefined
          Annual_budget_USD: number | undefined | undefined
          Full_time_staff: number | undefined | undefined
          Part_time_staff: number | undefined | undefined
          Volunteers: number | undefined | undefined
          Total_team: string | undefined
          Total_staff: string | undefined
          Budget_per_team: string | undefined
          Budget_per_staff: string | undefined
          If_yes_which_001: undefined | Option<'If_yes_which_001'>[] | undefined
        }[]
      | undefined
    // group_rg7co16/group_rr27n40 [begin_repeat] Policies, Protocols and Written Procedures
    group_rr27n40:
      | {
          Year_001: Date | undefined | undefined
          Staffing_table_or_Organogram: undefined | Option<'Staffing_table_or_Organogram'> | undefined
          Statute: undefined | Option<'Statute'> | undefined
          Financial_policy: undefined | Option<'Financial_policy'> | undefined
          Procurement_policy: undefined | Option<'Safety_and_security_policy'> | undefined
          Safety_and_security_policy: undefined | Option<'Safety_and_security_policy'> | undefined
        }[]
      | undefined
  }
  export const options = {
    Type_of_organization: {
      national_ngo: `National NGO`,
      local_ngo: `Local NGO`,
      cso: `CSO`,
      volunteer_group: `Volunteer group`,
      activist: `Activist`,
      municipal_organization_or_othe: `Government-run entity`,
      other: `Other`,
    },
    Is_this_a_women_led_organization: {
      yes: `Yes`,
      no: `No`,
    },
    Is_this_a_youth_led_organization: {
      yes: `Yes`,
      no: `No`,
    },
    Assessment_conducted_with_the_: {
      yes: `Yes`,
      no: `No`,
    },
    Interviewee_consents_to_be_contacted: {
      yes: `Yes`,
      no: `No`,
    },
    Is_the_organization_registered: {
      yes: `Yes`,
      no: `No`,
    },
    Is_there_an_ongoing_relationsh: {
      no_relationship_visited_ongoing_grant_re: `No relationship`,
      option_2: `Visited`,
      ongoing_grant: `Ongoing grant`,
      relationship_terminated: `Relationship terminated`,
      prior_relationship_but_not_now: `Prior relationship but not now`,
      other: `Other`,
      request_for_cooperation_shared: `Request for cooperation shared but not assessed`,
    },
    Oblast_001: {
      cherkasy_oblast: `Cherkasy Oblast`,
      chernihiv_oblast: `Chernihiv Oblast`,
      chernivtsi_oblast: `Chernivtsi Oblast`,
      dnipropetrovsk_oblast: `Dnipropetrovsk Oblast`,
      donetsk_oblast: `Donetsk Oblast`,
      ivano_frankivsk_oblast: `Ivano-Frankivsk Oblast`,
      kharkiv_oblast: `Kharkiv Oblast`,
      kherson_oblast: `Kherson Oblast`,
      khmelnytskyi_oblast: `Khmelnytskyi Oblast`,
      kirovohrad_oblast: `Kirovohrad Oblast`,
      kyiv_oblast: `Kyiv Oblast`,
      luhansk_oblast: `Luhansk Oblast`,
      lviv_oblast: `Lviv Oblast`,
      mykolaiv_oblast: `Mykolaiv Oblast`,
      odesa_oblast: `Odesa Oblast`,
      poltava_oblast: `Poltava Oblast`,
      rivne_oblast: `Rivne Oblast`,
      sumy_oblast: `Sumy Oblast`,
      ternopil_oblast: `Ternopil Oblast`,
      vinnytsia_oblast: `Vinnytsia Oblast`,
      volyn_oblast: `Volyn Oblast`,
      zakarpattia_oblast: `Zakarpattia Oblast`,
      zaporizhzhia_oblast: `Zaporizhzhia Oblast`,
      zhytomyr_oblast: `Zhytomyr Oblast`,
    },
    Is_coordination_done_with_othe: {
      yes: `Yes`,
      no: `No`,
    },
    If_yes_which_types_of_actors: {
      volunteer_groups: `Volunteer groups`,
      national_partners: `National partners`,
      international_partners: `International partners`,
      police_and_other_law_enforcement_agencie: `Police and other law enforcement agencies`,
      local_self_government_bodies__local_coun: `Local self-government bodies (local councils)`,
      social_services: `Social services`,
      local_partners: `Oblast, rayon and city military administrations`,
      ministries_and_other_central_executive_b: `Ministries and other central executive bodies`,
      via_the_cluster_system: `Via the cluster system`,
    },
    Established_partnership_cooper: {
      yes: `Yes`,
      no: `No`,
    },
    Cooperation_with_private_secto: {
      yes: `Yes`,
      no: `No`,
    },
    Cooperation_with_UN_Agencies_a: {
      yes: `Yes`,
      no: `No`,
    },
    If_yes_which_001: {
      act_alliance___finn_church_aid: `ACT Alliance / Finn Church Aid`,
      action_medeor: `Action Medeor`,
      acted: `ACTED`,
      all_ukrainian_charitable_foundation__rig: `R2P All-Ukrainian Charitable Foundation "Right to Protection"`,
      arbeiter_samariter_bund_deutschland: `ASB Arbeiter-Samariter-Bund Deutschland`,
      bha_bureau_for_humanitarian_assistance: `BHA Bureau for Humanitarian Assistance`,
      care_germany: `Care Germany`,
      caritas_ukraine: `Caritas Ukraine`,
      danish_refugee_council: `DRC Danish Refugee Council`,
      echo_european_civil_protection_and_human: `ECHO European Civil Protection and Humanitarian Aid Operations`,
      east_europe_foundation: `East Europe Foundation`,
      food___agriculture_organization_of_the_u: `FAO Food & Agriculture Organization of the United Nations`,
      fcdo_foreign_and_commonwealth_office: `FCDO Foreign and Commonwealth Office`,
      halo_trust: `HALO Trust`,
      handicap_international___humanity___incl: `HI Handicap International - Humanity & Inclusion`,
      helpage_international: `HelpAge International`,
      helvetas_swiss_intercooperation: `Helvetas Swiss Intercooperation`,
      imc_worldwide: `IMC International Medical Corps`,
      international_organization_for_migration: `IOM International Organization for Migration`,
      international_planned_parenthood_federat: `IPPF International Planned Parenthood Federation`,
      international_rescue_committee: `IRC International Rescue Committee`,
      malteser_international_order_of_malta_wo: `Malteser International Order of Malta World Relief`,
      m_dicos_do_mundo: `MdM Médicos do Mundo`,
      nippon_international_cooperation_for_com: `Nippon International Cooperation for Community Development`,
      nonviolent_peaceforce: `NP Nonviolent Peaceforce`,
      norwegian_refugee_council: `NRC Norwegian Refugee Council`,
      peace_winds_japan: `Peace Winds Japan`,
      people_in_need: `PIN People in Need`,
      plan_international: `Plan International`,
      schools_association_for_formal_education: `Schools Association for Formal Education`,
      swiss_development_cooperation_swiss_huma: `SDC Swiss Development Cooperation/Swiss Humanitarian Aid`,
      sida_swedish_international_development_c: `SIDA Swedish International Development Cooperation Agency`,
      terre_des_hommes_international: `TdH Terre des Hommes International`,
      united_nations_children_s_fund: `United Nations Children's Fund`,
      united_nations_development_pro: `United Nations Development Programme`,
      united_nations_high_commission: `United Nations High Commissioner for Refugees`,
      united_nations_office_for_proj: `United Nations Office for Project Services`,
      united_nations_population_fund: `United Nations Population Fund`,
      usaid_united_states_agency_for_internati: `USAID United States Agency for International Development`,
      world_food_programme: `WFP World Food Programme`,
      world_health_organization: `WHO World Health Organization`,
      other: `Other`,
      own_funds: `Own funds`,
      private_donations: `Private donations`,
    },
    Participation_in_Humanitarian_: {
      yes: `Yes`,
      no: `No`,
    },
    Sectors_funded: {
      nfi: `NFI`,
      wash: `WaSH`,
      protection: `Protection`,
      pss: `PSS`,
      education: `Education`,
      livelihoods: `Livelihoods`,
      food_security: `Food security`,
      mpca: `MPCA`,
      health: `Health`,
      nutrition: `Nutrition`,
      shelter: `Shelter`,
      evacuations: `Evacuations`,
      gbv: `GBV`,
      eore: `EORE`,
    },
    Is_rapid_volunteer_mobilization_possible: {
      yes: `Yes`,
      no: `No`,
    },
    Is_access_possible_by_the_orga: {
      yes: `Yes`,
      no: `No`,
    },
    If_yes_how: {
      engagement_with_authorities: `Engagement with authorities`,
      volunteers_are_residents_for_which_acces: `Volunteers are residents for which access is guaranteed`,
      engagement_with_organizations_which_coor: `Engagement with organizations which coordinate permit requests`,
      other: `Other`,
    },
    Minority_group: {
      youth: `Youth`,
      children: `Children`,
      elderly: `Elderly`,
      women_and_girls: `Women and girls`,
      people_with_disabilities: `People with disabilities`,
      idps_from_a_particular_location: `IDPs from a particular location`,
      armenians: `Armenians`,
      greeks: `Greeks`,
      jews: `Jews`,
      turkic_speaking_urums: `Turkic-speaking Urums`,
      roma: `Roma`,
      people_of_african_descent: `People of African descent`,
      people: `People of Asian descent`,
      russians_and_russian_speakers: `Russians and Russian speakers`,
      refugees_and_asylum_seekers_in_ukraine: `Refugees and asylum seekers in Ukraine`,
      lgbtqia: `LGBTQIA+`,
      stateless_persons_and_persons_at_risk_of: `Stateless persons and persons at risk of statelessness`,
      hiv: `HIV+`,
      indigenous_people: `Indigenous people`,
      option_18: `Crimean Tatars`,
      people_from_rural_areas: `People from rural areas`,
      military_and_ex_military: `Military and ex-military / family of military`,
      people_from_care_systems: `People from social care systems`,
      ukrainian_speakers: `Ukrainian speakers`,
      other: `Other`,
    },
    Own_vehicles: {
      owned_by_the_partner: `Owned by the partner`,
      owned_by_partner_staff_or_volunteers: `Owned by partner staff or volunteers`,
      rented: `Rented`,
      no_vehicle_access: `No vehicle access`,
    },
    Own_warehouse_belonging_to_th: {
      yes: `Yes`,
      no: `No`,
      not_relevant: `Not relevant`,
    },
    If_not_how_are_items_stored: {
      _joint_storage_with_other_csos: `Joint storage with other CSOs/NGOs`,
      rented_warehouse: `Rented warehouse`,
      using_rent_free_warehouse__sto: `Using rent-free warehouse/ storage space (from municipality etc.)`,
      other: `Other`,
    },
    Safety_security_management_i: {
      following_inso_guidelines: `Following INSO guidelines`,
      connected_to_local_authorities_for_safet: `Connected to local authorities for safety & security information`,
      connected_to_local_activities_or_volunte: `Connected to local activities or volunteer groups for safety & security information`,
      information_for_telegram_or_similar: `Information for Telegram or similar`,
      safety_equipment_available__on_loan: `Safety equipment available (on loan)`,
      safety_equipment_available__owned: `Safety equipment available (owned)`,
      shelter_are_pre_identified_before_any_tr: `Shelter are pre-identified before any trip`,
      regular_vehicle_maintenance: `Regular vehicle maintenance`,
      safety___security_policy_and_measures_in: `Safety & security policy and measures in place`,
      digital_security_policy_and_measures_in_: `Digital security policy and measures in place`,
      safety___security_training: `Safety & security training`,
    },
    Safety_security_trainings_co: {
      past: `PAST`,
      heat: `HEAT`,
      eore: `EORE`,
      first_aid: `First aid`,
      cpr: `CPR`,
      gps: `GPS`,
      other: `Other`,
    },
    Safety_equipment_available: {
      ballistic_vests_and_plate_carriers: `Ballistic vests and Plate carriers`,
      helmet: `Helmet`,
      visor: `Visor or eye protection`,
      neck_protection: `Neck protection`,
      shoulder_protection: `Shoulder protection`,
      gloves: `Gloves`,
      groin_protection: `Groin protection`,
      masks: `Masks`,
      hazmat_suits: `Hazmat suits`,
      first_aid_kit: `First aid or medical kit`,
      radio_or_alternative_communication_equip: `Radio, satellite or alternative communication equipment`,
      emergency_water: `Emergency water`,
      grab_bags: `Grab bags`,
      high_visibility_clothing: `High-visibility clothing`,
      spare_fuel: `Spare fuel`,
      spare_tire: `Spare tire`,
      other: `Other`,
    },
    Are_different_standa_d_paid_staff_members: {
      yes: `Yes`,
      no: `No`,
    },
    The_organization_is_g_type_of_activities: {
      frontline_response: `Frontline response`,
      long_term_programming: `Long term programming`,
      capacity_building: `Capacity building`,
      work_in_rural_areas: `Work in rural areas`,
      not_assessed: `Not assessed`,
      not_recommended: `Not recommended`,
    },
    Are_recommendation_letters_fro: {
      yes: `Yes`,
      no: `No`,
    },
    Operational_challenges: {
      coordination: `Coordination`,
      communication: `Communication`,
      _access__to_target_groups: `Access (to target groups)`,
      access_to_information: `Access to Information`,
      logistics_supply_chain: `Logistics/Supply Chain`,
      risk_mitigation__management: `Risk mitigation, management`,
      hr_administrative: `HR/Administrative`,
      other: `Other`,
    },
    Which_assistance_would_the_CSO: {
      equipment: `Equipment`,
      financial_resources: `Financial resources`,
      infrastructure__warehouse_etc: `Infrastructure (warehouse etc)`,
      trainings__capacity_developmen: `Trainings (capacity development)`,
      other: `Other`,
    },
    Are_partner_staff_me_social_support_PSS: {
      yes: `Yes`,
      no: `No`,
    },
    Is_staff_trained_on_gical_first_aid_PFA: {
      yes: `Yes`,
      no: `No`,
    },
    Has_the_partner_participated_i: {
      yes: `Yes`,
      no: `No`,
    },
    What_kind_of_capacity_needs_to: {
      core_humanitarian_standards: `Core Humanitarian Standards`,
      monitoring__evaluation__accountability__: `Monitoring, Evaluation, Accountability, Learning`,
      communication_and_networking: `Communication and Networking`,
      advocacy: `Advocacy`,
      financial_management: `Financial Management`,
      risk_management__safety__heat: `Risk Management, Safety, HEAT`,
      fundraising__proposal_writing: `Fundraising, Proposal Writing`,
      hr_management__volunteers_management: `HR Management, Volunteers Management`,
      humanitarian_logistics: `Humanitarian Logistics`,
      pss: `PSS, PFA`,
      protection_mainstreaming: `Protection Mainstreaming`,
      other: `Other`,
    },
    Partnership_type: {
      strategic_partnership: `Strategic partnership`,
      project_based_partnership: `Project-based partnership`,
      transactional_relationship: `Transactional relationship`,
    },
    Is_it_an_equitable_partnership: {
      yes: `Yes`,
      no: `No`,
      partially: `Partially`,
    },
    Donor: {
      echo: `ECHO`,
      bha: `BHA`,
      uhf: `UHF`,
      unhcr: `UNHCR`,
      danish_mfa: `Danish MFA`,
      danida: `DANIDA`,
      pooled_funds: `Pooled Funds`,
    },
    Type: {
      idp: `IDP`,
      host_community: `Host community`,
      option_3: `Minority group`,
    },
    Was_reporting_done_in_a_timely_way: {
      yes: `Yes`,
      sometimes: `Sometimes`,
      no: `No`,
    },
    Has_vetting_been_conducted: {
      yes: `Yes`,
      no: `No`,
      ongoing: `Ongoing`,
    },
    Are_results_positive: {
      yes: `Yes`,
      no: `No`,
    },
    Is_the_match_declared_openly_u: {
      yes: `Yes`,
      no: `No`,
    },
    Select_the_reasoning_applied: {
      the_match_is_not_the_same_entity_type_as: `The match is not the same entity/type as the vetted person`,
      the_match_does_not_have_the_same_gender: `The match does not have the same gender`,
      year_of_birth_for_the_match_is_not_inclu: `Year of birth for the match is not included or birth month, or birth place differ`,
      nationality_and_location_of_the_vetted_p: `Nationality and location of the vetted person does not correspond with the address of the match`,
      the_match_is_noted_as_alledgedly_decease: `The match is noted as alledgedly deceased or imprisoned`,
      possible_photos_differ: `Possible photos differ`,
    },
    Sub_Grant_Funding_Threshold: {
      under_dkk_25_000: `Under DKK 25,000`,
      dkk_25_000___dkk_100_000: `DKK 25,000 - DKK 100,000`,
      dkk_100_000___dkk_500_000: `DKK 100,000 - DKK 500,000`,
      dkk_500_000___dkk_2_000_000: `DKK 500,000 - DKK 2,000,000`,
      over_dkk_2_000_000: `Over DKK 2,000,000`,
    },
    Has_due_diligence_been_finaliz: {
      yes: `Yes`,
      no: `No`,
      ongoing: `Ongoing`,
    },
    Overall_Residual_Risk: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
    },
    Accountability_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Code_of_Conduct_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    PSEAH_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Corruption_and_Fraud_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Human_Resources_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Experience_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Needs_assessments_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Monitoring_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Involved_of_PoC_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Coordination_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Financial_policies_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Procurement_policies_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Unverified_financial_accounts_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Security_procedures_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Support_to_partners_risks: {
      very_low: `Very Low`,
      low: `Low`,
      medium: `Medium`,
      high: `High`,
      very_high: `Very High`,
      not_applicable: `Not applicable`,
    },
    Staffing_table_or_Organogram: {
      yes: `Yes`,
      no: `No`,
    },
    Statute: {
      yes: `Yes`,
      no: `No`,
    },
    Financial_policy: {
      yes: `Yes`,
      option_2: `No`,
    },
    Safety_and_security_policy: {
      yes: `Yes`,
      option_2: `No`,
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
      Date_of_assessment: _.Date_of_assessment ? new Date(_.Date_of_assessment) : undefined,
      Date_of_registration: _.Date_of_registration ? new Date(_.Date_of_registration) : undefined,
      Year_starting_humanitarian_work: _.Year_starting_humanitarian_work
        ? new Date(_.Year_starting_humanitarian_work)
        : undefined,
      Which_oblasts_does_t_t_and_has_experience: _.Which_oblasts_does_t_t_and_has_experience?.split(' '),
      If_yes_which_types_of_actors: _.If_yes_which_types_of_actors?.split(' '),
      If_yes_which: _.If_yes_which?.split(' '),
      Number_of_offices: _.Number_of_offices ? +_.Number_of_offices : undefined,
      group_ts4rc87: _['group_ts4rc87']?.map(extractQuestionName).map((_: any) => {
        _['Oblast'] = _.Oblast?.split(' ')
        return _
      }),
      Which_sectors_does_the_organiz: _.Which_sectors_does_the_organiz?.split(' '),
      If_yes_how: _.If_yes_how?.split(' '),
      Select_if_the_organi_inorities_in_Ukraine: _.Select_if_the_organi_inorities_in_Ukraine?.split(' '),
      Own_vehicles: _.Own_vehicles?.split(' '),
      If_not_how_are_items_stored: _.If_not_how_are_items_stored?.split(' '),
      Safety_security_management_i: _.Safety_security_management_i?.split(' '),
      Safety_security_trainings_co: _.Safety_security_trainings_co?.split(' '),
      Safety_equipment_available: _.Safety_equipment_available?.split(' '),
      The_organization_is_g_type_of_activities: _.The_organization_is_g_type_of_activities?.split(' '),
      Operational_challenges: _.Operational_challenges?.split(' '),
      Which_assistance_would_the_CSO: _.Which_assistance_would_the_CSO?.split(' '),
      What_kind_of_capacity_needs_to: _.What_kind_of_capacity_needs_to?.split(' '),
      Number_of_agreements_with_DRC: _.Number_of_agreements_with_DRC ? +_.Number_of_agreements_with_DRC : undefined,
      group_vi2hh32: _['group_vi2hh32']?.map(extractQuestionName).map((_: any) => {
        _['SGA_number'] = _.SGA_number ? +_.SGA_number : undefined
        _['SGA_start_date'] = _.SGA_start_date ? new Date(_.SGA_start_date) : undefined
        _['SGA_end_date'] = _.SGA_end_date ? new Date(_.SGA_end_date) : undefined
        _['Amount_UAH'] = _.Amount_UAH ? +_.Amount_UAH : undefined
        _['Amount_USD'] = _.Amount_USD ? +_.Amount_USD : undefined
        _['Funding_provided_in_ding_activities_USD'] = _.Funding_provided_in_ding_activities_USD
          ? +_.Funding_provided_in_ding_activities_USD
          : undefined
        _['Funding_provided_in_in_kind_support_USD'] = _.Funding_provided_in_in_kind_support_USD
          ? +_.Funding_provided_in_in_kind_support_USD
          : undefined
        _['Date_received_letter_Request_for_Payment'] = _.Date_received_letter_Request_for_Payment
          ? new Date(_.Date_received_letter_Request_for_Payment)
          : undefined
        _['Date_payment_confirmed'] = _.Date_payment_confirmed ? new Date(_.Date_payment_confirmed) : undefined
        _['Amount_UAH_001'] = _.Amount_UAH_001 ? +_.Amount_UAH_001 : undefined
        _['Tranches_received_'] = _.Tranches_received_ ? +_.Tranches_received_ : undefined
        _['Funding_reported_on_'] = _.Funding_reported_on_ ? +_.Funding_reported_on_ : undefined
        _['Project_code'] = _.Project_code ? +_.Project_code : undefined
        _['Total_budget_of_the_project_USD'] = _.Total_budget_of_the_project_USD
          ? +_.Total_budget_of_the_project_USD
          : undefined
        _['Sectors_funded'] = _.Sectors_funded?.split(' ')
        _['Oblasts'] = _.Oblasts?.split(' ')
        _['Number_of_beneficiaries_planned'] = _.Number_of_beneficiaries_planned
          ? +_.Number_of_beneficiaries_planned
          : undefined
        _['Number_of_beneficiaries_PwD_planned'] = _.Number_of_beneficiaries_PwD_planned
          ? +_.Number_of_beneficiaries_PwD_planned
          : undefined
        _['Number_of_beneficiaries_reached_001'] = _.Number_of_beneficiaries_reached_001
          ? +_.Number_of_beneficiaries_reached_001
          : undefined
        _['Number_of_beneficiaries_PwD_reached_001'] = _.Number_of_beneficiaries_PwD_reached_001
          ? +_.Number_of_beneficiaries_PwD_reached_001
          : undefined
        _['Oblast_001'] = _.Oblast_001?.split(' ')
        _['Minority_group'] = _.Minority_group?.split(' ')
        return _
      }),
      Date_of_last_vetting_check: _.Date_of_last_vetting_check ? new Date(_.Date_of_last_vetting_check) : undefined,
      group_kd9el87: _['group_kd9el87']?.map(extractQuestionName).map((_: any) => {
        _['Year'] = _.Year ? new Date(_.Year) : undefined
        _['Annual_budget_USD'] = _.Annual_budget_USD ? +_.Annual_budget_USD : undefined
        _['Full_time_staff'] = _.Full_time_staff ? +_.Full_time_staff : undefined
        _['Part_time_staff'] = _.Part_time_staff ? +_.Part_time_staff : undefined
        _['Volunteers'] = _.Volunteers ? +_.Volunteers : undefined
        _['If_yes_which_001'] = _.If_yes_which_001?.split(' ')
        return _
      }),
      group_rr27n40: _['group_rr27n40']?.map(extractQuestionName).map((_: any) => {
        _['Year_001'] = _.Year_001 ? new Date(_.Year_001) : undefined
        return _
      }),
    }) as T
}
