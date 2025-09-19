
export namespace Test { export type Type = { /** [date] Date (date)*/
'date': Date;
/** [select_one] RAIS+ deduplication status (status_dedub)*/
'status_dedub': Choice<'status_dedub'>;
/** [note] **1. ID/Case Number** (background/back_un_id)*/
'back_un_id': string;
/** [select_one] 1.1 Office (background/back_office)*/
'back_office': Choice<'office'>;
/** [select_one] 1.2 Enumerator (background/back_enum)*/
'back_enum': Choice<'enum'>;
/** [select_multiple] 1.3 Programme Type (background/back_prog_type)*/
'back_prog_type': Choice<'prog_type'>[];
/** [select_one] 1.3.1 Donor for MPCA (background/donor_mpca)*/
'donor_mpca': Choice<'donor'>;
/** [select_one] 1.3.2 Donor for NFI (background/donor_nfi)*/
'donor_nfi': Choice<'donor'>;
/** [select_one] 1.3.3 Donor for Emergency Shelter Kit (background/donor_esk)*/
'donor_esk': Choice<'donor'>;
/** [select_one] 1.3.4 Donor for Cash for Rent (background/donor_cfr)*/
'donor_cfr': Choice<'donor'>;
/** [select_one] 1.3.5 Donor for Cash for Fuel (background/donor_cff)*/
'donor_cff': Choice<'donor'>;
/** [select_one] 1.3.6 Donor for Cash for Education (background/donor_cfe)*/
'donor_cfe': Choice<'donor'>;
/** [select_one] 1.3.7 Donor for Infant Winterclothing Kit (background/donor_iwk)*/
'donor_iwk': Choice<'donor'>;
/** [select_one] 1.3.8 Donor for Infant Hygiene Kit (background/donor_ihk)*/
'donor_ihk': Choice<'donor'>;
/** [select_one] 1.3.9 Donor for Cash for Utilities (background/donor_cfu)*/
'donor_cfu': Choice<'donor'>;
/** [select_multiple] 1.4 Donors selected (background/back_donor)*/
'back_donor': Choice<'donor'>[];
/** [select_one] 1.5.1 Internal DRC Referral? (background/back_refer)*/
'back_refer': Choice<'yn'>;
/** [select_one] 1.5.2 Referral Department (background/back_refer_who)*/
'back_refer_who': Choice<'department'>;
/** [select_one] 1.6.1 Consent (background/back_consent)*/
'back_consent': Choice<'yn'>;
/** [text] 1.6.2 Reason for No Consent (background/back_consen_no_reas)*/
'back_consen_no_reas': string;
/** [note] Thank you very much for your time, we will not proceed with the questionnaire without your consent. (background/back_consent_no_note)*/
'back_consent_no_note': string;
/** [text] 2.1 Surname (ben_det/ben_det_surname)*/
'ben_det_surname': string;
/** [text] 2.2 First Name (ben_det/ben_det_first_name)*/
'ben_det_first_name': string;
/** [text] 2.3 Patronymic Name (ben_det/ben_det_pat_name)*/
'ben_det_pat_name': string;
/** [integer] 2.4 Phone Number (ben_det/ben_det_ph_number)*/
'ben_det_ph_number': number;
/** [select_one] 2.5.1 Registration Oblast (ben_det/ben_det_oblast)*/
'ben_det_oblast': Choice<'oblast'>;
/** [select_one] 2.5.2 Registration Raion (ben_det/ben_det_raion)*/
'ben_det_raion': string;
/** [select_one] 2.5.3 Registration Hromada (ben_det/ben_det_hromada)*/
'ben_det_hromada': string;
/** [select_one_from_file] 2.5.4 Registration Settlement (ben_det/ben_det_settlement)*/
'ben_det_settlement': string;
/** [select_one] 2.5.5 Residential Status (ben_det/ben_det_res_stat)*/
'ben_det_res_stat': Choice<'res_stat'>;
/** [select_one] 2.5.6 Area of Origin (ben_det/ben_det_prev_oblast)*/
'ben_det_prev_oblast': Choice<'oblast'>;
/** [select_one] 2.5.7 Internally Displaced Person(s) in Household (ben_det/ben_det_idp_time)*/
'ben_det_idp_time': Choice<'idp_time'>;
/** [integer] 2.6 Total Value of Resources Received (UAH) per month (ben_det/ben_det_income)*/
'ben_det_income': number;
/** [integer] 2.7 Household Size (ben_det/ben_det_hh_size)*/
'ben_det_hh_size': number;
/** [select_one] 3.1 Head of Household? (hh_char/hh_char_hhh)*/
'hh_char_hhh': Choice<'yn'>;
/** [select_one] 3.1.1 Gender of Respondent (hh_char/hh_char_res_gender)*/
'hh_char_res_gender': Choice<'gender'>;
/** [integer] 3.1.2 Age of Respondent (hh_char/hh_char_res_age)*/
'hh_char_res_age': number;
/** [select_multiple] 3.1.3 Respondent Characteristics (hh_char/hh_char_res_dis_select)*/
'hh_char_res_dis_select': Choice<'dis'>[];
/** [select_one] 3.1.4 Difficulty Level of Respondent Characteristics (hh_char/hh_char_res_dis_level)*/
'hh_char_res_dis_level': Choice<'dis_level'>;
/** [select_one] 3.2.1 Gender of Head of Household (hh_char/hh_char_hhh_gender)*/
'hh_char_hhh_gender': Choice<'gender'>;
/** [integer] 3.2.2 Age of Head of Household (hh_char/hh_char_hhh_age)*/
'hh_char_hhh_age': number;
/** [select_multiple] 3.2.3 Head of Household Characteristics (hh_char/hh_char_hhh_dis_select)*/
'hh_char_hhh_dis_select': Choice<'dis'>[];
/** [select_one] 3.2.4 Difficulty Level of Head of Household Characteristics (hh_char/hh_char_hhh_dis_level)*/
'hh_char_hhh_dis_level': Choice<'dis_level'>;
/** [calculate] calc_hhh_res_dis_level (hh_char/calc_hhh_res_dis_level)*/
'calc_hhh_res_dis_level': string;
/** [select_one] 3.1 Civil Status of Head of Household (hh_char/hh_char_civ_stat)*/
'hh_char_civ_stat': Choice<'civ_stat'>;
/** [select_one] 3.1.1 Pension Receiver in Household? (hh_char/hh_char_pensioner)*/
'hh_char_pensioner': Choice<'yn'>;
/** [select_one] 3.1.2 Pregnant/Lactating Females in Household? (hh_char/hh_char_preg)*/
'hh_char_preg': Choice<'yn'>;
/** [integer] 3.1.2.1 How many Pregnant/Lactating Females in Household? (hh_char/hh_char_preg_number)*/
'hh_char_preg_number': number;
/** [calculate] calc_char_civ_stat (hh_char/calc_char_civ_stat)*/
'calc_char_civ_stat': string;
/** [calculate] cal_head_tax (hh_char/cal_head_tax)*/
'cal_head_tax': string;
/** [begin_repeat] 3.2 HH Members (hh_char/hh_char_hh_det)*/
'hh_char_hh_det': { /** [note] **Should be respondant** (hh_char/hh_char_hh_det/hh_chart_note_resp)*/
'hh_chart_note_resp': string;
/** [select_one] Have individual tax number (TIN)? (hh_char/hh_char_hh_det/hh_char_tax_id_yn)*/
'hh_char_tax_id_yn': Choice<'yn'>;
/** [calculate] Individual tax number respondant (hh_char/hh_char_hh_det/head_tax_id)*/
'head_tax_id': string;
/** [text] Individual tax number (hh_char/hh_char_hh_det/hh_char_tax_id_num)*/
'hh_char_tax_id_num': string;
/** [date] Date of birth (hh_char/hh_char_hh_det/hh_char_date_birth)*/
'hh_char_date_birth': Date;
/** [calculate] taxid_weightedsum (hh_char/hh_char_hh_det/taxid_weightedsum)*/
'taxid_weightedsum': string;
/** [calculate] taxid_roundedsum (hh_char/hh_char_hh_det/taxid_roundedsum)*/
'taxid_roundedsum': string;
/** [select_one] Gender (hh_char/hh_char_hh_det/hh_char_hh_det_gender)*/
'hh_char_hh_det_gender': Choice<'gender'>;
/** [integer] Age (hh_char/hh_char_hh_det/hh_char_hh_det_age)*/
'hh_char_hh_det_age': number;
/** [select_one] Are you a student? (hh_char/hh_char_hh_det/hh_char_student)*/
'hh_char_student': Choice<'yn'>;
/** [select_multiple] Member Characteristics (hh_char/hh_char_hh_det/hh_char_hh_det_dis_select)*/
'hh_char_hh_det_dis_select': Choice<'dis'>[];
/** [select_one] Difficulty Level of Member Characteristics (hh_char/hh_char_hh_det/hh_char_hh_det_dis_level)*/
'hh_char_hh_det_dis_level': Choice<'dis_level'>;
/** [calculate] calc_u5 (hh_char/hh_char_hh_det/calc_u5)*/
'calc_u5': string;
/** [calculate] calc_u18 (hh_char/hh_char_hh_det/calc_u18)*/
'calc_u18': string;
/** [calculate] calc_o60 (hh_char/hh_char_hh_det/calc_o60)*/
'calc_o60': string;
/** [calculate] calc_ed_age (hh_char/hh_char_hh_det/calc_ed_age)*/
'calc_ed_age': string;
/** [calculate] calc_baby_age (hh_char/hh_char_hh_det/calc_baby_age)*/
'calc_baby_age': string;
/** [calculate] calc_preg (hh_char/hh_char_hh_det/calc_preg)*/
'calc_preg': string;
/** [calculate] calc_det_dis_level (hh_char/hh_char_hh_det/calc_det_dis_level)*/
'calc_det_dis_level': string;
/** [calculate] cal_student (hh_char/hh_char_hh_det/cal_student)*/
'cal_student': string;
/** [calculate] cal_scoring_difficulty_level (hh_char/hh_char_hh_det/cal_scoring_difficulty_level)*/
'cal_scoring_difficulty_level': string; }[];
/** [note] **Should be respondant** (hh_char/hh_char_hh_det/hh_chart_note_resp)*/
'hh_chart_note_resp': string;
/** [select_one] Have individual tax number (TIN)? (hh_char/hh_char_hh_det/hh_char_tax_id_yn)*/
'hh_char_tax_id_yn': Choice<'yn'>;
/** [calculate] Individual tax number respondant (hh_char/hh_char_hh_det/head_tax_id)*/
'head_tax_id': string;
/** [text] Individual tax number (hh_char/hh_char_hh_det/hh_char_tax_id_num)*/
'hh_char_tax_id_num': string;
/** [date] Date of birth (hh_char/hh_char_hh_det/hh_char_date_birth)*/
'hh_char_date_birth': Date;
/** [calculate] taxid_weightedsum (hh_char/hh_char_hh_det/taxid_weightedsum)*/
'taxid_weightedsum': string;
/** [calculate] taxid_roundedsum (hh_char/hh_char_hh_det/taxid_roundedsum)*/
'taxid_roundedsum': string;
/** [select_one] Gender (hh_char/hh_char_hh_det/hh_char_hh_det_gender)*/
'hh_char_hh_det_gender': Choice<'gender'>;
/** [integer] Age (hh_char/hh_char_hh_det/hh_char_hh_det_age)*/
'hh_char_hh_det_age': number;
/** [select_one] Are you a student? (hh_char/hh_char_hh_det/hh_char_student)*/
'hh_char_student': Choice<'yn'>;
/** [select_multiple] Member Characteristics (hh_char/hh_char_hh_det/hh_char_hh_det_dis_select)*/
'hh_char_hh_det_dis_select': Choice<'dis'>[];
/** [select_one] Difficulty Level of Member Characteristics (hh_char/hh_char_hh_det/hh_char_hh_det_dis_level)*/
'hh_char_hh_det_dis_level': Choice<'dis_level'>;
/** [calculate] calc_u5 (hh_char/hh_char_hh_det/calc_u5)*/
'calc_u5': string;
/** [calculate] calc_u18 (hh_char/hh_char_hh_det/calc_u18)*/
'calc_u18': string;
/** [calculate] calc_o60 (hh_char/hh_char_hh_det/calc_o60)*/
'calc_o60': string;
/** [calculate] calc_ed_age (hh_char/hh_char_hh_det/calc_ed_age)*/
'calc_ed_age': string;
/** [calculate] calc_baby_age (hh_char/hh_char_hh_det/calc_baby_age)*/
'calc_baby_age': string;
/** [calculate] calc_preg (hh_char/hh_char_hh_det/calc_preg)*/
'calc_preg': string;
/** [calculate] calc_det_dis_level (hh_char/hh_char_hh_det/calc_det_dis_level)*/
'calc_det_dis_level': string;
/** [calculate] cal_student (hh_char/hh_char_hh_det/cal_student)*/
'cal_student': string;
/** [calculate] cal_scoring_difficulty_level (hh_char/hh_char_hh_det/cal_scoring_difficulty_level)*/
'cal_scoring_difficulty_level': string;
/** [note] This is a child headed household (high risk protection case), please refer immediately to a DRC Protection colleague and complete internal referral form. (hh_char/hh_char_chh)*/
'hh_char_chh': string;
/** [calculate] calc_tot_baby_age (hh_char/calc_tot_baby_age)*/
'calc_tot_baby_age': string;
/** [calculate] calc_tot_calc_u5 (hh_char/calc_tot_calc_u5)*/
'calc_tot_calc_u5': string;
/** [calculate] calc_tot_chi (hh_char/calc_tot_chi)*/
'calc_tot_chi': string;
/** [calculate] calc_tot_ed_age (hh_char/calc_tot_ed_age)*/
'calc_tot_ed_age': string;
/** [calculate] calc_tot_eld (hh_char/calc_tot_eld)*/
'calc_tot_eld': string;
/** [calculate] calc_tot_student (hh_char/calc_tot_student)*/
'calc_tot_student': string;
/** [calculate] cal_tot_scoring_difficulty_level (hh_char/cal_tot_scoring_difficulty_level)*/
'cal_tot_scoring_difficulty_level': string;
/** [note] **3.4 Activities Difficulty (Members over 5)** (hh_char/hh_char_dis_note)*/
'hh_char_dis_note': string;
/** [select_multiple] 3.4.1 Activities Difficulty (hh_char/hh_char_dis_select)*/
'hh_char_dis_select': Choice<'dis'>[];
/** [select_one] 3.4.2 Difficulty Level of Activities (hh_char/hh_char_dis_level)*/
'hh_char_dis_level': Choice<'dis_level'>;
/** [calculate] calc_dis_level (hh_char/calc_dis_level)*/
'calc_dis_level': string;
/** [select_one] 3.5 Financial Assistance from Government or Agencies? (hh_char/receive_financial_assistance)*/
'receive_financial_assistance': Choice<'yn'>;
/** [select_one] 3.6 Housing Damage from Hostilities (hh_char/households_damaged)*/
'households_damaged': Choice<'yn'>;
/** [calculate] nfi_fam (nfi/nfi_fam)*/
'nfi_fam': string;
/** [note] **Based on minimum standards this house is eligible for:** (nfi/eligibility_summary_nfi)*/
'eligibility_summary_nfi': string;
/** [note] **${nfi_fam}** Family Hygiene Kit (HKMV) (nfi/nfi_fam_hy)*/
'nfi_fam_hy': string;
/** [note] **${nfi_fam}** Family NFI Kit (NFKF + KS) (nfi/nfi_fam_nfi)*/
'nfi_fam_nfi': string;
/** [note] **1** Baby Hygiene Kit (BK) (nfi/ihk_nfi)*/
'ihk_nfi': string;
/** [note] **1** Baby Winter Kit (WKB) (nfi/iwk_nfi)*/
'iwk_nfi': string;
/** [select_one] Household has received assistance (FAMILY NFI KIT/KITCHEN SET) in the last 6 months to cover household needs (nfi/fnk_ks_last_6months)*/
'fnk_ks_last_6months': Choice<'yn'>;
/** [select_one] Does your family need a Family kit/Kitchen set? (nfi/family_need_fnk_ks)*/
'family_need_fnk_ks': Choice<'yn'>;
/** [select_one] Did you distribute the NFI Kits at the point of registration (nfi/nfi_kit_disitrbuted)*/
'nfi_kit_disitrbuted': Choice<'yn'>;
/** [note] **How many of the following kits have been distributed?** (nfi/begin_group_LF3jyHrmq/nfi_dist_label)*/
'nfi_dist_label': string;
/** [integer] Family Hygiene Kits (HKF) (nfi/begin_group_LF3jyHrmq/nfi_dist_hkf)*/
'nfi_dist_hkf': number;
/** [select_one] Donor Family Hygiene Kits (HKF) (nfi/begin_group_LF3jyHrmq/nfi_dist_hkf_donor)*/
'nfi_dist_hkf_donor': Choice<'donor'>;
/** [integer] Family Hygiene Kits for IDPs on the Move distributed (HKMV) (nfi/begin_group_LF3jyHrmq/nfi_dist_hkmv)*/
'nfi_dist_hkmv': number;
/** [select_one] Donor Family Hygiene Kits for IDPs on the Move distributed (HKMV) (nfi/begin_group_LF3jyHrmq/nfi_dist_hkmv_donor)*/
'nfi_dist_hkmv_donor': Choice<'donor'>;
/** [integer] Family NFI kits distributed (NFKF + KS) (nfi/begin_group_LF3jyHrmq/nfi_dist_hkf_001)*/
'nfi_dist_hkf_001': number;
/** [select_one] Donor Family NFI kits distributed (NFKF + KS) (nfi/begin_group_LF3jyHrmq/nfi_dist_hkf_001_donor)*/
'nfi_dist_hkf_001_donor': Choice<'donor'>;
/** [integer] Baby Kits distributed (BK) (nfi/begin_group_LF3jyHrmq/nfi_dist_bk)*/
'nfi_dist_bk': number;
/** [integer] Baby Winter Kits S distributed (WKB1) (nfi/begin_group_LF3jyHrmq/nfi_dist_wkb1)*/
'nfi_dist_wkb1': number;
/** [integer] Baby Winter Kits M distributed (WKB2) (nfi/begin_group_LF3jyHrmq/nfi_dist_wkb2)*/
'nfi_dist_wkb2': number;
/** [integer] Baby Winter Kits L distributed (WKB3) (nfi/begin_group_LF3jyHrmq/nfi_dist_wkb3)*/
'nfi_dist_wkb3': number;
/** [integer] Baby Winter Kits XL distributed (WKB4) (nfi/begin_group_LF3jyHrmq/nfi_dist_wkb4)*/
'nfi_dist_wkb4': number;
/** [integer] NFI Kit for Collective Center distributed (nfi/begin_group_LF3jyHrmq/nfi_kit_cc)*/
'nfi_kit_cc': number;
/** [integer] Folding Beds distributed (nfi/begin_group_LF3jyHrmq/nfi_bed)*/
'nfi_bed': number;
/** [integer] Family kitchen set (FKS) (nfi/begin_group_LF3jyHrmq/nfi_fks)*/
'nfi_fks': number;
/** [select_one] Donor Family kitchen set (FKS) (nfi/begin_group_LF3jyHrmq/donor_nfi_fks)*/
'donor_nfi_fks': Choice<'donor'>;
/** [select_one] 4.1 Is there damage to your current shelter? (Section_4a_ESK/shelter_damage)*/
'shelter_damage': Choice<'shelter_damage'>;
/** [note] If there is heavy damage to this property, please refer to the shelter team immediately (Section_4a_ESK/note_heavy_damage)*/
'note_heavy_damage': string;
/** [integer] 4.2 Can you estimate the square meter or roof or window that is damaged? (Section_4a_ESK/estimate_sqm_damage)*/
'estimate_sqm_damage': number;
/** [note] Based upon the answers above, the household is eligible for the following: (Section_4a_ESK/eligibility_summary_esk)*/
'eligibility_summary_esk': string;
/** [note] This household is eligble for One Emergency Shelter kit (Section_4a_ESK/note_eligible_1)*/
'note_eligible_1': string;
/** [note] This household is eligble for Two Emergency Shelter Kits (Section_4a_ESK/note_eligible_2)*/
'note_eligible_2': string;
/** [calculate] Number of kits esk (Section_4a_ESK/cal_numb_esk_kit)*/
'cal_numb_esk_kit': string;
/** [image] Additional photos of esk activity (Section_4a_ESK/add_photo_esk1)*/
'add_photo_esk1': string;
/** [image] Additional photos of esk activity (Section_4a_ESK/add_photo_esk2)*/
'add_photo_esk2': string;
/** [image] Additional photos of esk activity (Section_4a_ESK/add_photo_esk3)*/
'add_photo_esk3': string;
/** [select_one] Are you currently receiving or expecting to receive financial assistance to cover your fuel/utilities payment needs? (casf_utilities_fuel/current_gov_assist_cff)*/
'current_gov_assist_cff': Choice<'current_gov_assist_cff'>;
/** [integer] What is the gap (UAH) between assistance received/ expected to receive and the amount to cover needs? (casf_utilities_fuel/gap_assistance_received)*/
'gap_assistance_received': number;
/** [select_one] What type of property are you living in? (casf_utilities_fuel/type_property_living)*/
'type_property_living': Choice<'type_property_living'>;
/** [select_one] This year, what is your primary source of heating (e.g. Piped gas, electric, community heating) or solid fuel (Wood, pellets, charcoal, coal etc) (casf_utilities_fuel/utilities_fuel)*/
'utilities_fuel': Choice<'utfu'>;
/** [text] If "Other", please specify (casf_utilities_fuel/utilities_fuel_other)*/
'utilities_fuel_other': string;
/** [image] Please provide a photo of this portable plug in heater or woodburner (casf_utilities_fuel/utilities_fuel_portable_plug_heater)*/
'utilities_fuel_portable_plug_heater': string;
/** [select_one] Is there a functioning fuel delivery/supplier in your area? (casf_utilities_fuel/functioning_fuel_delivery)*/
'functioning_fuel_delivery': Choice<'ynd'>;
/** [select_multiple] What is your main source of heating from mains utilities? (casf_utilities_fuel/mains_utilities)*/
'mains_utilities': Choice<'mains_utilities'>[];
/** [text] If "Other", please specify (casf_utilities_fuel/mains_utilities_other)*/
'mains_utilities_other': string;
/** [select_multiple] What is your primary source of solid fuel heating? (casf_utilities_fuel/mains_fuel)*/
'mains_fuel': Choice<'mains_fuel'>[];
/** [text] If "Other", please specify (casf_utilities_fuel/mains_fuel_other)*/
'mains_fuel_other': string;
/** [calculate] Calculation Scoring System (casf_utilities_fuel/cal_scoring_sfu)*/
'cal_scoring_sfu': string;
/** [select_one] 5.1 What is your current accommodation status? (cfr/cfr_curr_accom)*/
'cfr_curr_accom': Choice<'curr_accom'>;
/** [select_one] 5.2 Do you intend to continue renting your current accommodation? (cfr/cfr_rent_int)*/
'cfr_rent_int': Choice<'yn'>;
/** [select_one] 5.3 What is the status of your current rental accommodation? (cfr/cfr_rent_stat)*/
'cfr_rent_stat': Choice<'rent_stat'>;
/** [select_one] 5.4 What is your future accomodation intentions? (cfr/cfr_accom_int)*/
'cfr_accom_int': Choice<'accom_int'>;
/** [select_one] 5.5 Are you currently receiving rent support from another organisation? (cfr/cfr_prev_ass)*/
'cfr_prev_ass': Choice<'yn'>;
/** [integer] 5.6.1 In square metres, what is the total space of your accommodation? (cfr/cfr_accom_cond/cfr_accom_cond_occ_rat)*/
'cfr_accom_cond_occ_rat': number;
/** [select_one] 5.6.2 Is your dwelling water proof? (cfr/cfr_accom_cond/cfr_accom_cond_wat_pr)*/
'cfr_accom_cond_wat_pr': Choice<'yn'>;
/** [select_one] 5.6.3 Do you have access to running water (cfr/cfr_accom_cond/cfr_accom_cond_run_wat)*/
'cfr_accom_cond_run_wat': Choice<'serv_reg'>;
/** [select_one] 5.6.4 Do you have access to hot water (cfr/cfr_accom_cond/cfr_accom_cond_hot_wat)*/
'cfr_accom_cond_hot_wat': Choice<'serv_reg'>;
/** [select_one] 5.6.5 Do you have access to adequate washing facilities? (cfr/cfr_accom_cond/cfr_accom_cond_wash)*/
'cfr_accom_cond_wash': Choice<'serv_reg'>;
/** [select_one] 5.6.6 Do you have access to adequate sanitation facilities? (cfr/cfr_accom_cond/cfr_accom_cond_san)*/
'cfr_accom_cond_san': Choice<'serv_reg'>;
/** [select_one] 5.6.7 Do you have access to adequate heating? (cfr/cfr_accom_cond/cfr_accom_cond_heat)*/
'cfr_accom_cond_heat': Choice<'serv_reg'>;
/** [select_one] 5.6.8 Does your property have draft proofing? (cfr/cfr_accom_cond/cfr_accom_cond_draft)*/
'cfr_accom_cond_draft': Choice<'yn'>;
/** [select_one] 5.6.9 Is your property adequately insulated? (cfr/cfr_accom_cond/cfr_accom_cond_insul)*/
'cfr_accom_cond_insul': Choice<'yn'>;
/** [select_one] 5.6.10 Does your property have double-glazed windows? (cfr/cfr_accom_cond/cfr_accom_cond_glaz)*/
'cfr_accom_cond_glaz': Choice<'yn'>;
/** [select_one] 5.6.11 Does you have formal written agreement of tenancy with your landlord? (cfr/cfr_accom_cond/cfr_accom_cond_ten)*/
'cfr_accom_cond_ten': Choice<'yn'>;
/** [select_one] 5.6.12 Do you have access to external locked doors on your property? (cfr/cfr_accom_cond/cfr_accom_cond_lock_doors)*/
'cfr_accom_cond_lock_doors': Choice<'yn'>;
/** [select_one] 5.6.13 Does your houeshold have access to private space (space you don’t share with other households) (cfr/cfr_accom_cond/cfr_accom_cond_pri_sp)*/
'cfr_accom_cond_pri_sp': Choice<'yn'>;
/** [note] **Based upon your previous answers you will now be informed of your inclusion/exclusion in any cash based programs you have been assessed for.** (ass_inc/ass_inc_note)*/
'ass_inc_note': string;
/** [calculate] calc_vulnerability (ass_inc/ass_inc_mpca/calc_vulnerability)*/
'calc_vulnerability': string;
/** [calculate] calc_gen_mpca_inc (ass_inc/ass_inc_mpca/calc_gen_mpca_inc)*/
'calc_gen_mpca_inc': string;
/** [note] **You have met the critera for inclusion in the cash assistance programme. We will conduct further internal checks and revert to you with a final result.**
Do not read this out to the household (ass_inc/ass_inc_mpca/ass_inc_mpca_inc)*/
'ass_inc_mpca_inc': string;
/** [note] The provisional calculated total benefit for this household (HH Size × UAH 3,600 × 3 Months) will be UAH
Do not read this out to the household (ass_inc/ass_inc_mpca/ass_inc_mpca_ben)*/
'ass_inc_mpca_ben': string;
/** [note] **Unfortunately based upon our criteria, you do not qualify for the cash assistance program as you do not meet the threshold for vulnerability.** (ass_inc/ass_inc_mpca/ass_inc_mpca_not_vul)*/
'ass_inc_mpca_not_vul': string;
/** [note] Based upon your answers above, you are entitled to Cash for Education grant (ass_inc/ass_inc_cfe/ass_inc_cfe_inc)*/
'ass_inc_cfe_inc': string;
/** [note] You are entitled a Cash for Education Grant of UAH: (ass_inc/ass_inc_cfe/ass_inc_cfe_ben)*/
'ass_inc_cfe_ben': string;
/** [note] You are not entitled to a Cash for Education Grant. (ass_inc/ass_inc_cfe/ass_inc_cfe_not_inc)*/
'ass_inc_cfe_not_inc': string;
/** [calculate] calc_gen_cfr_vul (ass_inc/ass_inc_cfr/calc_gen_cfr_vul)*/
'calc_gen_cfr_vul': string;
/** [calculate] calc_gen_cfr_inc (ass_inc/ass_inc_cfr/calc_gen_cfr_inc)*/
'calc_gen_cfr_inc': string;
/** [note] You have met the criteria for inclusion in the cash for rent program (ass_inc/ass_inc_cfr/ass_inc_cfr_inc)*/
'ass_inc_cfr_inc': string;
/** [note] Your provisional cash for rent benefit will be a monthly payment of UAH: (ass_inc/ass_inc_cfr/ass_inc_cfr_ben)*/
'ass_inc_cfr_ben': string;
/** [note] You will also receive an additional one-off top-up grant of UAH: (ass_inc/ass_inc_cfr/ass_inc_cfr_top_up)*/
'ass_inc_cfr_top_up': string;
/** [note] Unfortunatley based upon our criteria, you not not meet the requirements for cash for rent support (ass_inc/ass_inc_cfr/ass_inc_cfr_not_inc)*/
'ass_inc_cfr_not_inc': string;
/** [calculate] calc_vulnerability_cff (ass_inc/ass_inc_cff/calc_vulnerability_cff)*/
'calc_vulnerability_cff': string;
/** [calculate] calc_gen_cff_inc (ass_inc/ass_inc_cff/calc_gen_cff_inc)*/
'calc_gen_cff_inc': string;
/** [note] **You have met the critera for inclusion in the cash for fuel assistance programme. We will conduct further internal checks and revert to you with a final result.**
Do not read this out to the household (ass_inc/ass_inc_cff/ass_inc_cff_inc)*/
'ass_inc_cff_inc': string;
/** [note] The provisional calculated total benefit for this household
Do not read this out to the household (ass_inc/ass_inc_cff/ass_inc_cff_ben)*/
'ass_inc_cff_ben': string;
/** [note] **Unfortunately based upon our criteria, you do not qualify for the cash for fuel assistance program as you do not meet the threshold for vulnerability.** (ass_inc/ass_inc_cff/ass_inc_cff_not_vul)*/
'ass_inc_cff_not_vul': string;
/** [calculate] calc_vulnerability_cfu (ass_inc/ass_inc_cfu/calc_vulnerability_cfu)*/
'calc_vulnerability_cfu': string;
/** [calculate] calc_gen_cfu_inc (ass_inc/ass_inc_cfu/calc_gen_cfu_inc)*/
'calc_gen_cfu_inc': string;
/** [note] **You have met the critera for inclusion in the cash for utilities assistance programme. We will conduct further internal checks and revert to you with a final result.**
Do not read this out to the household (ass_inc/ass_inc_cfu/ass_inc_cfu_inc)*/
'ass_inc_cfu_inc': string;
/** [note] The provisional calculated total benefit for this household
Do not read this out to the household (ass_inc/ass_inc_cfu/ass_inc_cfu_ben)*/
'ass_inc_cfu_ben': string;
/** [note] **Unfortunately based upon our criteria, you do not qualify for the cash for utilitie assistance program as you do not meet the threshold for vulnerability.** (ass_inc/ass_inc_cfu/ass_inc_cfu_not_vul)*/
'ass_inc_cfu_not_vul': string;
/** [select_one] 7.0 Thank you for answering the questions above, are you willing to provide your payment details? (pay_det/pay_consent)*/
'pay_consent': Choice<'yn'>;
/** [select_one] 7.1 Form of ID do you have? (pay_det/pay_det_s/pay_det_id_type)*/
'pay_det_id_type': Choice<'id_type'>;
/** [text] 7.1.1 Other form of ID do you have? (pay_det/pay_det_s/pay_det_id_type_oth)*/
'pay_det_id_type_oth': string;
/** [text] 7.2.1 Input Passport Series (pay_det/pay_det_s/pay_det_pass_ser)*/
'pay_det_pass_ser': string;
/** [text] 7.2.2 Number of ID (pay_det/pay_det_s/pay_det_pass_num)*/
'pay_det_pass_num': string;
/** [image] 7.2.3 Take a photo of the ID (pay_det/pay_det_s/pay_det_id_ph)*/
'pay_det_id_ph': string;
/** [select_one] 7.3.1 Have individual tax number (TIN)? (pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_yn)*/
'pay_det_tax_id_yn': Choice<'yn'>;
/** [text] 7.3.2 Individual tax number (pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_num)*/
'pay_det_tax_id_num': string;
/** [calculate] Organization (pay_det/pay_det_s/begin_group_vdIM9ogQb/cal_organization)*/
'cal_organization': string;
/** [calculate] Category (pay_det/pay_det_s/begin_group_vdIM9ogQb/cal_category)*/
'cal_category': string;
/** [calculate] Currency (pay_det/pay_det_s/begin_group_vdIM9ogQb/cal_currency)*/
'cal_currency': string;
/** [calculate] Amount (pay_det/pay_det_s/begin_group_vdIM9ogQb/cal_amount)*/
'cal_amount': string;
/** [calculate] Start (YYYYMMDD) (pay_det/pay_det_s/begin_group_vdIM9ogQb/cal_date_start)*/
'cal_date_start': string;
/** [calculate] End (YYYYMMDD) (pay_det/pay_det_s/begin_group_vdIM9ogQb/cal_date_end)*/
'cal_date_end': string;
/** [image] 7.3.3 Tax ID photo (pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_ph)*/
'pay_det_tax_id_ph': string;
/** [select_one] 7.3.4 Have a tax exemptions? (pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_exempt)*/
'pay_det_tax_exempt': Choice<'yn'>;
/** [image] 7.3.5 Proof of the tax of exemptions photo (pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_exempt_im)*/
'pay_det_tax_exempt_im': string;
/** [select_one] 7.4.1 Preferred Payment Method (pay_det/pay_det_s/pay_det_pay_meth)*/
'pay_det_pay_meth': Choice<'pay_meth'>;
/** [text] 7.4.2 IBAN Number (pay_det/pay_det_s/pay_det_iban)*/
'pay_det_iban': string;
/** [image] 7.4.3 Picture of IBAN Number (pay_det/pay_det_s/pay_det_iban_im)*/
'pay_det_iban_im': string;
/** [text] 7.4.4 Address (pay_det/pay_det_s/pay_address)*/
'pay_address': string;
/** [text] 7.4.5 ZIP Code (pay_det/pay_det_s/pay_zip)*/
'pay_zip': string;
/** [image] 7.4.6 Picture of Address Page of Passport (pay_det/pay_det_s/pay_det_add_im)*/
'pay_det_add_im': string;
/** [text] 7.4.7 Other Preferred Payment Methods (pay_det/pay_det_s/pay_det_pay_meth_oth)*/
'pay_det_pay_meth_oth': string;
/** [text] 7.4.8 Reason for Unsuitability of Payment Methods (pay_det/pay_det_s/pay_det_pay_meth_none)*/
'pay_det_pay_meth_none': string;
/** [note] **Thank you for answering our questions.  We will confirm the details of your registration, and confirm you are not receiving assistance from other parties, please note this could take up to 5-working days.  Once successfully registered, we will confirm if we are able to support you and what level of support you may expect to receive** (fin_det/not_thank_sfu)*/
'not_thank_sfu': string;
/** [text] 8.1 Other Comments from Respondent (fin_det/fin_det_res)*/
'fin_det_res': string;
/** [text] 8.2 Other Comments from Enumerator (fin_det/fin_det_enum)*/
'fin_det_enum': string;
/** [image] 8.3 Please take picture of any other relevant document (fin_det/fin_det_oth_doc_im)*/
'fin_det_oth_doc_im': string;
/** [image] 8.4 Please take picture of any other relevant document (fin_det/fin_det_oth_doc_im2)*/
'fin_det_oth_doc_im2': string; }
export type Choice<C extends keyof typeof choices> = (typeof choices)[C][number]
export const choices = { status_dedub: ['deduplicated','partially_deduplicated','not_deduplicated'],
office: ['lwo','chj','dnk','hrk','nlv','umy'],
enum: ['anna_artiukh','vitaliy_grinenko','maksim_sedun','umy_enum1','umy_enum2','umy_enum3','oleksandr_havrylov','ievgen_kylymenniy','oleksandr_shmunk','inna_kovalchuk','anna_pastushenko','maksym_savchenko','vasyl_voitsikhovskyi','dmytro_tsaruk','viktoria_ushan','artem_chernukha_1','henadii_petrychenko','lwo_ex1','lwo_ex2','polina_prusakova','mykyta_pokynboroda','nlv_ex1','nlv_ex2','oleh_vyshnevskyi','alina_bondarenko','serhii_dolzhenko','viktoria_klymenko','karina_korzh','serhii_nevmyvaka','olha_osmukha','halyna_diachenko','mariia_kozachko','oleksandr_narsieiev','dnk_ex1','dnk_ex2','dnk_ex3','dnk_ex4','yurii_volkov','andrii_zagoruiev','olena_sydorenko','svitlana_smyrnova','tetiana_konovshii','bohdan_taranushchenko','vitalii_shapoval','olena_buglo','nataliia_bykova','oleksii_pohorielov','nataliia_yermolova','ivan_prokopkin','hrk_ex1','hrk_ex2','dmytro_chernukha','anastasiia_reshynska','nataliia_pushenko','tetiana_gorbatiuk','oleksandr_lukomets','surzhyk_oleksandr','chj_ex1','chj_ex2','chj_enum1','chj_enum2','chj_enum3','chj_enum4','chj_enum5','chj_enum6','tetiana_kolot','andrii_zahoruyev','oleh_Ivanov','yevhenii_musiienko','veronika_kaliuzhna','halyna_lantukh','olena_osadcha','olena_sotnychenko','katerina_severin','viktoriia_lytvynova','valerii_vietrov','lesya_tsaruk','irina_gobchuk','irina_klimashevskaya','julia_bilyansk','danylo_zyrianov','oksana_podolianko','ivan_volynkin','nadiia_yudaieva','dmytro_ivanov','kostiantyn_yefimchuk','daria_kokalia'],
donor: ['ukr000360_novo2','ukr000314_uhf4','ukr000284_bha','ukr000269_echo','ukr000322_echo2','ukr000372_echo3','ukr000298_novo','ukr000309_okf','ukr000270_pf','ukr000342_pf2','ukr000345_bha','ukr000330_sdc2','ukr000267_danida','ukr000336_uhf6','ukr000352_uhf7','ukr000347_danida2','ukr000341_hoff','ukr000340_aug','ukr000329_sida','ukr000380_danida','ukr000390_uhf9','ukr000399_sdc3','ukr000386_pf3'],
idp_time: ['zero_one','two_three','over_3'],
prog_type: ['mpca','csf','nfi','cfr','cfe','iwk','ihk','esk','cfu'],
yn: ['yes','no'],
department: ['prot','legal','shelter','ecrec'],
utfu: ['mains_piped_gas','community_heating','portable_plug_heater','mains_electricity','fuel','other','utilities'],
mains_utilities: ['electric','gas','cohs','other'],
mains_fuel: ['wood','coal','charcoal','pellets','ofmf','other'],
ynd: ['yes','no','dk'],
current_gov_assist_cff: ['yes','yes_another_agency','yes_but','no'],
oblast: ['cherkaska','chernihivska','chernivetska','dnipropetrovska','donetska','ivano-frankivska','kharkivska','khersonska','khmelnytska','kirovohradska','kyivska','luhanska','lvivska','mykolaivska','odeska','poltavska','rivnenska','sevastopilska','sumska','ternopilska','vinnytska','volynska','zakarpatska','zaporizka','zhytomyrska'],
raion: ['zvenyhorodskyi','zolotoniskyi','umanskyi','cherkaskyi','koriukivskyi','nizhynskyi','novhorod-siverskyi','prylutskyi','chernihivskyi','vyzhnytskyi','dnistrovskyi','cnernivetskyi','dniprovskyi','kamianskyi','kryvorizkyi','nikopolskyi','novomoskovskyi','pavlohradskyi','synelnykivskyi','bakhmutskyi','volnovaskyi','horlivskyi','donetskyi','kalmiuskyi','kramatorskyi','mariupolskyi','pokrovskyi','verkhovynskyi','ivano-frankivskyi','kaluskyi','kolomyiskyi','kosivskyi','nadvirnianskyi','bohodukhivskyi','iziumskyi','krasnohradskyi','kupianskyi','lozivskyi','kharkivskyi','chuhuivskyi','beryslavskyi','henicheskyi','kakhovskyi','skadovskyi','khersonskyi','kamianets-podilskyi','khmelnytskyi','shepetivskyi','holovanivskyi','kropyvnytskyi','novoukrainskyi','oleksandriiskyi','chornobylska zona vidchuzhennia','bilotserkivskyi','boryspilskyi','brovarskyi','buchanskyi','vyshhorodskyi','obukhivskyi','fastivskyi','kyivska','alchevskyi','dovzhanskyi','luhanskyi','rovenkivskyi','svativskyi','sievierodonetskyi','starobilskyi','shchastynskyi','drohobytskyi','zolochivskyi','lvivskyi','sambirskyi','stryiskyi','chervonohradskyi','yavorivskyi','bashtanskyi','voznesenskyi','mykolaivskyi','pervomaiskyi','berezivskyi','bilhorod-dnistrovskyi','bolhradskyi','izmailskyi','odeskyi','podilskyi','rozdilnianskyi','kremenchutskyi','lubenskyi','myrhorodskyi','poltavskyi','varaskyi','dubenskyi','rivnenskyi','sarnenskyi','sevastopilska','konotopskyi','okhtyrskyi','romenskyi','sumskyi','shostkynskyi','kremenetskyi','ternopilskyi','chortkivskyi','vinnytskyi','haisynskyi','zhmerynskyi','mohyliv-podilskyi','tulchynskyi','khmilnytskyi','volodymyr-volynskyi','kamin-kashyrskyi','kovelskyi','lutskyi','berehivskyi','mukachivskyi','rakhivskyi','tiachivskyi','uzhhorodskyi','khustskyi','berdianskyi','vasylivskyi','zaporizkyi','melitopolskyi','polohivskyi','berdychivskyi','zhytomyrskyi','korostenskyi','novohrad-volynskyi'],
hromada: ['abrykosivska','abrykosivska_2','adzhamska','ahronomichna','alchevska','alupkynska','alushtynska','amurska','amvrosiivska','ananivska','andriiashivska','andriievo-ivanivska','andriivska','andriivska_2','andrivska','andrushivska','andrushkivska','antoninska','antonivska','antratsytivska','apostolivska','arbuzynska','armianska','aromatnenska','aromatnivska','artsyzka','askaniia-nova','avanhardivska','avdiivska','azovska','babanska','babchynetska','babynska','bahativska','baherivska','baikovetska','bakhchysaraiska','bakhmatska','bakhmutska','balakleivska','balakliiska','baltska','banylivska','baranivska','baranynska','barashivska','barska','barvinkivska','baryshivska','bashtanska','bashtechkivska','batalnenska','bativska','baturynska','bedevlianska','bekhterska','belzka','berdianska','berdychivska','berehivska','berehometska','berehova','berestechkivska','berestivska','berezanska','berezanska_2','berezdivska','berezhanska','berezivska','berezivska_2','berezivska_3','berezivska_4','berezivska_5','bereznehuvatska','berezniakivska','bereznianska','bereznivska','bershadska','beryslavska','bezdrytska','bezliudivska','bibrska','bielinska','bilche-zolotetska','bilenkivska','biletska','bilhorod-dnistrovska','biliaivska','biliaivska_2','bilkivska','bilmatska','biloberizka','bilobozhnytska','bilohirska','bilohirska_2','bilohorodska','bilokorovytska','bilokrynytska','bilokurakynska','bilolutska','bilopilska','bilotserkivska','bilotserkivska_2','bilovodska','bilozerska','bilozerska_2','bilozirska','bilshivtsivska','bilytska','biskovytska','blahodatnenska','blahovishchenska','blahovishchenska_2','blyzniukivska','bobrovytska','bobrynetska','bobrytska','bochechkivska','bohdanivska','bohdanska','bohodukhivska','bohorodchanska','bohuslavska','boianska','boiarska','boikivska','bokiimivska','bolekhivska','bolhradska','boratynska','boremelska','borivska','borodianska','borodinska','boromlianska','borozenska','borshchahivska','borshchivska','borsukivska','borynska','boryslavska','boryspilska','borznianska','botanichna','bozhedarivska','brahynivska','bratska','bratska_2','bratslavska','brodivska','bronykivska','broshniv-osadska','brovarska','brusnytska','brusylivska','buchanska','buchatska','budyshchenska','buhrynska','bukachivska','burshtynska','burynska','bushtynska','buska','butska','buzhanska','buzka','byshivska','chabanivska','chahorska','chaikynska','chapaievska','chaplynska','chasovoiarska','chechelnytska','cheliadinivska','chemerovetska','cherkaska_2','cherkaska_3','cherkaska_4','chernechchynska','chernechchynska_2','chernelytska','cherniakhivska','chernihivska_2','chernihivska_3','chernivetska_2','chernivetska_3','chernovska','chernyshivska','chervonenska','chervonohradska','chervonohryhorivska','chervonoslobidska','chkalovska','chkalovska_2','chkalovska_3','chmyrivska','chohodarivska','chopovytska','chopska','chornobaivska','chornobaivska_2','chornobylska zona vidchuzhennia_2','chornomorska','chornomorska_2','chornomorska_3','chornomorska_4','chornoostrivska','chornopilska','chornozemnenska','chornukhynska','chortkivska','chudeiska','chudniv','chuhuivska','chulakivska','chumakivska','chupakhivska','chutivska','chyhyrynska','chynadiivska','chystenska','chystiakivska','chystopilska','chyzhivska','dachnenska','dachnivska','dalekivska','dalnytska','darivska','dashivska','davydivska','debaltsivska','deliatynska','demydivska','derazhnenska','derazhnianska','derhachivska','desnianska','devladivska','diadkovytska','divychkivska','dmytrivska','dmytrivska_2','dmytrivska_3','dmytrivska_4','dmytrushkivska','dniprorudnenska','dniprovska','dobrianska','dobrivska','dobromylska','dobropilska','dobroslavska','dobrosynsko-maherivska','dobrotvirska','dobrovelychkivska','dobrushynska','dokuchaievska','dolmativska','dolynnenska','dolynska','dolynska_2','dolynska_3','dolynska_4','domanivska','donetska','donetska_2','donska','doroshivska','dorosynivska','dovbyska','dovzhanska','dovzhanska_2','drabivska','drabynivska','drahivska','drofynska','drohobytska','druzhbivska','druzhkivska','dubechnenska','dubenska','dubivska','dubivska_2','dubivska_3','dubovetska','duboviazivska','dubovykivska','dubrivska','dubrovytska','dubrynytska-malobereznianska','dunaievetska','dvorichanska','dykanska','dymerska','dyviziiska','dzhankoiska','dzhulynska','dzhurynska','dzvyniatska','enerhodarska','esmanska','fastivska','fedorivska','feodosiiska','feodosiivska','filativska','fontanska','foroska','frunzenska','fursivska','hadiatska','haisynska','haivoronska','halytska','halytsynivska','hannivska','hannopilska','hasprynska','hatnenska','helmiazivska','henicheska','heroiska','hertsaivska','hirska','hirska_2','hladkovytska','hlazivska','hleiuvatska','hlevakhivska','hlobynska','hlodoska','hlukhivska','hlukhovetska','hlybochytska','hlybotska','hlynianska','hnivanska','hnizdychivska','hoholivska','holobska','holoprystanska','holovanivska','holovnenska','holovynska','holubynska','honcharivska','horinchivska','horishnoplavnivska','horishnosherovetska','horlivska','hornostaivska','hornostaivska_2','horodenkivska','horodkivska','horodnenska','horodnianska','horodnytska','horodotska','horodotska_2','horodotska_3','horodotska_4','horodyshchenska','horodyshchenska_2','horokhivska','horokhivska_2','horondivska','horshchykivska','hoshchanska','hostomelska','hrabovetsko-dulibivska','hradyzka','hrebinkivska','hrebinkivska_2','hrechanopodivska','hresivska','hrodivska','hrunska','hrushivska','hrushivska_2','hrymailivska','hryshkovetska','hryshynska','hrytsivska','hubynyska','hukivska','huliaipilska','humenetska','hurivska','hurzufska','husiatynska','hvardiiska','hvardiiska_2','hvardiiska_3','hvizdetska','ichnianska','ilarionivska','illichivska','illichivska_2','illinetska','illinivska','illinska','ilovaiska','inhulska','irkliivska','irpinska','irshanska','irshavska','ishunska','ivane-pustenska','ivanivska','ivanivska_2','ivanivska_3','ivanivska_4','ivanivska_5','ivanivska_6','ivanivska_7','ivankivska_8','ivankivska_9','ivano-frankivska_2','ivano-frankivska_3','ivanovetska','ivanychivska','iziaslavska','iziumska','izmailska','izobilnenska','izobilnenska_2','izumrudnivska','kadiivska','kadubovetska','kaharlytska','kakhovska','kalanchatska','kalchytska','kalininska','kalininska_2','kalmiuska','kaluska','kalynivska','kalynivska_2','kalynivska_3','kalynivska_4','kalynivska_5','kalytianska','kamianetska','kamianets-podilska','kamianka-buzka','kamianomostivska','kamianopotokivska','kamianska','kamianska_2','kamianska_3','kamianska_4','kamiansko-dniprovska','kamin-kashyrska','kanivska','kanonytska','karapchivska','karlivska','karolino-buhazka','karpivska','kashtanivska','katerynivska','katerynopilska','kazankivska','kehychivska','kelmenetska','kerchenska','keretskivska','ketrysanivska','kharkivska_2','khartsyzka','kharytonivska','khersonska_2','khlibodarivska','khmelivska','khmelnytska_2','khmilnytska','khodorivska','kholmkivska','kholmynska','khorolska','khoroshivska','khorostkivska','khotinska','khotynska','khrestivska','khrestivska_2','khrustalnenska','khrystynivska','khustska','khyrivska','kiliiska','kindrashivska','kindrativska','kiptivska','kirovska','kirovska_2','kirovska_3','kistochkivska','kitsmanska','kivertsivska','klepyninska','klesivska','klevanska','klishkovetska','kobeliatska','koblivska','kochubeivska','kodymska','koktebelska','kolarivska','kolchuhynska','kolchynska','kolkivska','kolochavska','kolodiazhnenska','kolodiazianska','kolomatska','kolomatska_2','kolomyichyska','kolomyiska','koltsovska','kolyndianska','komarivska','komarnivska','komarska','kompaniivska','komyshanska','komyshnianska','komyshuvaska','komysh-zorianska','koniatynska','konoplianska','konotopska','kopachivska','kopaihorodska','kopychynetska','koreizka','koretska','koriukivska','kormivska','kornynska','kornynska_2','korolivska','koropetska','koropska','korostenska','korostyshivska','korovynska','korshivska','korsun-shevchenkivska','kosivska','kosmatska','kosonska','kostiantynivska','kostiantynivska_2','kostiantynivska_3','kostiantynivska_4','kostopilska','kostrynska','kostryzhivska','kotelevska','kotelnykivska','kotsiubynska','kovalivska','kovelska','kovylnivska','kozeletska','kozelshchynska','kozhanska','koziatynska','kozivska','kozivska_2','kozlivska','kozynska','kozynska_3','krainenska','kramatorska','krasnenska','krasnoarmiiska','krasnoflotska','krasnohirska','krasnohradska','krasnohvardiiska','krasnohvardiiska_2','krasnoiarska','krasnoilska','krasnokutska','krasnolutska','krasnomatska','krasnoperekopska','krasnopilska','krasnopilska_2','krasnopilska_3','krasnopolianska','krasnorichenska','krasnosilska','krasnoznamianska','krasylivska','kremenchutska','kremenetska','kreminska','krestianivska','krolevetska','kropyvnytskyi_2','krupetska','krupetska_2','krutivska','krymkivska','krymska','krymskorozivska','krynychanska','krynychnenska','krynychnenska_2','kryvoozerska','kryvorizka','kryvorizka_2','kryzhopilska','kubeiska','kuialnytska','kuibyshevska','kukushkinska','kulevchanska','kulykivska','kulykivska_2','kunievska','kunkivska','kupchynetska','kupianska','kurakhivska','kurisovska','kurnenska','kurska','kurylivska','kushuhumska','kutska','kutsurubska','kvitneva','kyinska','kyivska_2','kyrykivska','kyrylivska','kyselivska','kytaihorodska','kytaihorodska_2','ladanska','ladyzhynska','ladyzhynska_2','lanchynska','lannivska','lanovetska','lazurnenska','lebedynska','leninska','leninska_2','leninska_3','lenkovetska','leskivska','letychivska','lhovska','liashkivska','lipliavska','lisnivska','lisovohrynivetska','litynska','liubarska','liubashivska','liubeshivska','liubetska','liublynetska','liubomlska','liubotynska','liubymivska','liubymivska_2','liutenska','livadiiska','livynetska','lobanivska','lokachynska','lokhvytska','loknytska','lopatynska','lopushnenska','losynivska','lozivska','lozno-oleksandrivska','lozuvatska','lubenska','luchystivska','luhanska_2','luhanska_3','luhivska','luhynska','luka-meleshkivska','lukivska','lutska','lutuhynska','lvivska_2','lychkivska','lykhivska','lymanska','lymanska_2','lymanska_3','lynovytska','lypetska','lypianska','lypovetska','lypovodolynska','lysetska','lysianska','lystvynska','lysychanska','lytovezka','machukhivska','mahalska','mahazynska','mahdalynivska','maiakivska','maiska','makarivska','makhnivska','makiivska','makiivska_2','makivska','malobilozerska','malodanylivska','malodivytska','maloliubashanska','malomaiatska','malomykhailivska','malorichenska','malotokmachanska','malovilshanska','malovyskivska','malynivska','malynivska_2','malynska','malynska_2','mamaivska','mamalyhivska','manevytska','manhushska','mankivska','marazliivska','marfivska','marhanetska','marianivska','marianivska_2','marianivska_3','marinska','mariupolska','marivska','markivska','martynivska','masandrivska','mashivska','maslivska','mateievetska','matusivska','matviivska','mazanska','medenytska','medvedivska','medvedivska_2','medvedivska_3','medvynska','medzhybizka','melitopolska','melnychna','melnytse-podilska','menska','merefianska','mezhivska','mezhyritska','michurinska','milovska','mishkovo-pohorilivska','mizhhirska','mizhrichenska','mizhvodnenska','mizotska','mliivska','mlynivska','mohyliv-podilska','mohylivska','mokrokalyhirska','molochanska','molochnenska','molodizhnenska','molodohvardiiska','molohivska','monastyryshchenska','monastyryska','morshynska','morska','moshnivska','mostivska','mostyska','mrynska','mukachivska','murafska','muromska','murovanokurylovetska','murovanska','muzykivska','myhiivska','mykhailiutska','mykhailivska','mykhailivska_2','mykhailivska_3','mykhailivska_4','mykhailivska_5','mykhailo-kotsiubynska','mykhailo-lukashivska','mykolaivska','mykolaivska_2','mykolaivska_3','mykolaivska_4','mykolaivska_5','mykolaivska_6','mykolaivska_7','mykolaivska_8','mykolaivska_9','mykulynetska','myliatska','mylivska','myrhorodska','myrivska','myrnenska','myrnenska_2','myrnenska_3','myrnivska','myrnivska_2','myrnivska_3','myrnohradska','myrohoshchanska','myroliubnenska','myronivska','myropilska','myropilska_2','mysivska','mytiaivska','mytrofanivska','nabutivska','nadlatska','nadvirnianska','nahirianska','naidonivska','naraivska','narkevytska','narodytska','nasypnivska','natalynska','nechaianska','nedoboivska','nedryhailivska','nekhvoroshchanska','nekrasovska','nelipynska','nemishaivska','nemovytska','nemyrivska','nepolokovetska','neresnytska','nerubaiska','netishynska','nikolska','nikopolska','nizhynska','nosivska','novenska','novhorodkivska','novhorod-siverska','novoaidarska','novoandriivska','novoarkhanhelska','novoazovska','novobasanska','novobilouska','novobohdanivska','novoborivska','novoborysivska','novobuzka','novodmytrivska','novodnistrovska','novodonetska','novofedorivska','novohaleshchynska','novohrad-volynska','novohrodivska','novohryhorivska','novohuivynska','novoiarychivska','novoiavorivska','novoivanivska','novokakhovska','novokalchevska','novokalynivska','novokrymska','novolativska','novomarivska','novomoskovska','novomykolaivska','novomykolaivska_2','novomykolaivska_3','novomyrhorodska','novoodeska','novooleksandrivska','novooleksandrivska_2','novooleksandrivska_3','novoorzhytska','novoozernivska','novopavlivska','novopavlivska_2','novopilska','novopokrovska','novopokrovska_3','novopokrovska_4','novoprazka','novopskovska','novoraiska','novorozdilska','novosanzharska','novoselivska','novoselivska_2','novoselivska_3','novoselytska','novosilska','novoslobidska','novosvitska','novotroitska','novoukrainska','novounaievetska','novoushytska','novouspenivska','novovasylivska','novovodolazka','novovolynska','novovorontsovska','novozhylivska','novytska','nyvotrudivska','nyzhnoduvanska','nyzhnohirska','nyzhnosirohozka','nyzhnosyrovatska','nyzhnoteplivska','nyzhnoverbizka','nyzhnovoritska','obertynska','obodivska','obolonska','obroshynska','obukhivska','obukhivska_2','ochakivska','ocheretynska','odeska','okhotnykivska','okhotska','okhtyrska','oknianska','oktiabrska','oktiabrska_2','oktiabrska_3','okunivska','oleksandriiska','oleksandriiska_2','oleksandrivska','oleksandrivska_3','oleksandrivska_4','oleksandrivska_5','oleksandrivska_6','oleksiivska','oleksiivska_2','olenivska','oleshanska','oleshkivska','olevska','olhopilska','olhynska','oliivska','olshanska','olyshivska','olytska','omelianivska','omelnytska','onokivska','onufriivska','opishnianska','orativska','ordzhonikidzevska','orikhivska','orikhivska_2','orlivska','orynynska','orzhytska','oskilska','ostaninska','osterska','ostrovska','ostrozhetska','ostrozka','ostrytska','osypenkivska','otyniiska','ovadnivska','ovidiopolska','ovrutska','ozernianska','pakharivska','palanska','pantaivska','parafiivska','partenitska','partyzanska','pasichnianska','pavlivska','pavlivska_2','pavlivska_3','pavlohradska','pechenizhynska','pechenizka','perechynska','perehinska','perehonivska','pereiaslavсska','peremyshlianska','pererislianska','pereshchepynska','perovska','pershotravenska','pershotravnevska','pervomaiska','pervomaiska_2','pervomaiska_3','pervomaiska_4','pervomaiska_5','pervomaiska_6','pervozvanivska','petrivska','petrivska_2','petrivska_3','petrivsko-romenska','petro-mykhailivska','petropavlivska','petropavlivska_2','petropavlivska_3','petrovetska','petrovirivska','petrykivska','piadytska','piatykhatska','piatykhatska_2','pidberiztsivska','pidhaichykivska','pidhaietska','pidhaitsivska','pidhorodnenska','pidhorodnianska','pidkaminska','pidloztsivska','pidvolochyska','pidvysotska','pirnivska','pishchanivska','pishchanobridska','pishchanska','pishchanska_2','pishchanska_3','pishchanska_4','pishchanska_5','pishchivska','piskivska','pisochynska','pivdennomiska','plakhtiivska','plodivska','plodorodnenska','pluzhnenska','plyskivska','pobiednenska','pobuzka','pochaivska','pochetnenska','podilska','pohrebyshchenska','pokrovska','pokrovska_2','pokrovska_3','pokrovska_4','polianska','polianytska','poliska','polohivska','polonska','poltavska_2','poltavska_3','polytska','pomichnianska','pomorianska','poninkivska','ponornytska','popasnianska','popelnastivska','popilnianska','popivska','poromivska','poshtivska','potiivska','povchanska','povorska','pozharska','pravdivska','preobrazhenska','prostornenska','prudivska','pryazovska','prybuzhanivska','prybuzka','pryiutivska','prylisnenska','prylutska','prymorska','prymorska_2','pryozernivska','pryshybska','prystolychna','prysyvaska','pryvilnenska','pryvilnenska_2','pryvitnenska_3','pryvitnenska_4','pshenychnenska','pulynska','pushkinska','pustomytivska','putylska','putyvlska','pyiterfolvivska','pylypetska','pyriatynska','radekhivska','radomyshlska','radsadivska','radyvylivska','rafalivska','raihorodotska','raihorodska','raivska','rakhivska','ralivska','ratnivska','raukhivska','rava-ruska','reniiska','reshetylivska','richkivska','ripkynska','rivnenska_2','rivnenska_3','rivnianska','rivnivska','rodnykivska','rohanska','rohatynska','rokytnianska','rokytnivska','romanivska','romashkinska','romenska','romodanivska','roshchynska','rotmistrivska','rovenkivska','rozdilnianska','rozdolnenska','rozdolska','rozdorska','rozhniativska','rozhnivska','rozhyshchenska','rozivska','rozkishnenska','rozkvitivska','rozsoshanska','rozvadivska','rubanivska','rubizhanska','ruchivska','rudkivska','rukshynska','rusakivska','ruskopolianska','ruzhynska','rzhyshchivska','sadivska','sadova','safianivska','sahunivska','sakhnovetska','sakhnovshchynska','saksahanska','sakska','samarivska','sambirska','samhorodotska','saranchukivska','saratska','sarnenska','sartanska','sarybashivska','satanivska','savranska','savynska','sednivska','seliatynska','selydivska','selyshchenska','semenivska','semenivska_2','semenivska_3','semenivska_4','semydubska','semysotska','senchanska','serebrianska','serednianska','seredyno-budska','serekhovychivska','serhiivska','serhiivska_2','sevastopilska_2','sevastopilska_3','severynivska','shabivska','shakhivska','shakhtarska','shalyhynska','sharhorodska','shatska','shchastynska','shchebetovska','shcherbanivska','shcholkinska','shchyborivska','shchyretska','shehynivska','shepetivska','shevchenkivska','shevchenkivska_2','shevchenkivska_3','shkilnenska','shostkynska','shpanivska','shpolianska','shpykivska','shramkivska','shtormivska','shulhynska','shumska','shvaikivska','shyriaivska','shyrokivska','shyrokivska_2','shyrokivska_3','shyrokivska_4','shyrokivska_5','shyshatska','sievierodonetska','simeizka','simferopolska','siurtivska','siverska','skadovska','skala-podilska','skalatska','skalystivska','skhidnytska','skolivska','skorokhodivska','skorykivska','skvortsivska','skvyrska','slavhorodska','slavnivska','slavska','slavutska','slavutytska','slobidska','slobidsko-kulchiievetska','slobozhanska','slobozhanska_2','slovechanska','slovianska','slovianska_2','slovianska_3','smidynska','smilianska','smolinska','smotrytska','smyrnovska','smyzka','sniatynska','snihurivska','snizhnianska','snovska','sobolivska','sofiivska','sofiivska_2','sokalska','sokilnytska','sokolivska','sokyrianska','soledarska','solobkovetska','solonianska','solonkivska','solonytsivska','solotvynska','solotvynska_2','soniachnodolynska','sorokynska','soshychnenska','sosnivska','sosnytska','sovietska','sovkhoznenska','spaska','sribnianska','stakhanovska','stalnenska','stanislavchytska','stanislavska','stanychno-luhanska','stanyshivska','starobeshivska','starobilska','starobohorodchanska','starokostiantynivska','starokozatska','starokrymska','staromaiakivska','staromlynivska','staroostropilska','starosaltivska','starosambirska','starosiletska','starosilska','starosyniavska','staroushytska','starovirivska','starovyzhivska','stavchanska','stavnenska','stavyshchenska','steblivska','stepanetska','stepanivska','stepanivska_2','stepankivska','stepanska','stepivska','stepnenska','stepnivska','stepnohirska','storozhynetska','stovpivska','strilkivska','striukivska','stryiska','stryivska','stryzhavska','studenianska','studenykivska','subottsivska','suchevenska','sudatska','sudovovyshnianska','sudylkivska','sukhoielanetska','sukhopolovianska','sumska_3','sursko-lytovska','susaninska','sutyskivska','suvorovska','suvorovska_2','suvorovska_3','svaliavska','svativska','sveska','sviatohirska','sviatovasylivska','svitlivska','svitlodarska','svitlovodska','synelnykivska','synevyrska','syniukhynobridska','synivska','synytsynska','syzivska','tabachnenska','tabachnenska_2','tairovska','talalaivska','talalaivska_2','talnivska','tarakanivska','tarashanska','tarashchanska','tarutynska','tashanska','tatarbunarska','tavriiska','tavriiska_3','tavrychanska','teofipolska','teplodarska','teplytska','teplytska_2','tereblechenska','terebovlianska','tereshkivska','teresvianska','ternivska','ternivska_2','ternopilska_3','ternuvatska','terpinnivska','teterivska','tetiivska','tiachivska','tiahynska','tinystivska','tlumatska','tokarievska','tokmatska','tomakivska','tomashivska','tomashpilska','toporivska','torchynska','toretska','tovstenska','troitska','troitska_2','trostianetska','trostianetska_2','trostianetska_3','trudivska','truskavetska','trybukhivska','tsarychanska','tsebrykivska','tsilynna','tsumanska','tsvitochnenska','tsyblivska','tsyrkunivska','tulchynska','tupychivska','turbivska','turie-remetivska','turiiska','turkivska','tuzlivska','tyshkivska','tysmenytska','tyvrivska','udachnenska','uhlianska','uhlivska','uhrynivska','uiutnenska','ukrainska','ukrainska_2','ukromnivska','ulanivska','ulashanivska','umanska','urozhainivska','urozhainivska_2','usativska','ushomyrska','uspenivska','ust-chornianska','ust-putylska','ustyluzka','ustynivska','uvarivska','uvarivska_2','uzhhorodska','uzynska','vakulivska','valkivska','vanchykovetska','vapniarska','varaska','varkovytska','varvynska','vashkivetska','vashkovetska','vasylivska','vasylivska_2','vasylivska_3','vasylkivska_4','vasylkivska_5','vasylkovetska','vatutinska','vchoraishenska','velykoandrusivska','velykobahachanska','velykoberezka','velykobereznianska','velykoberezovytska','velykobilozerska','velykobirkivska','velykobudyshchanska','velykobuialytska','velykoburlutska','velykobychkivska','velykobyihanska','velykodalnytska','velykodederkalska','velykodobronska','velykodolynska','velykodymerska','velykohaivska','velykokhutirska','velykokopanivska','velykokuchurivska','velykolepetyska','velykoliubinska','velykoluchkivska','velykomezhyritska','velykomostivska','velykomykhailivska','velykomykhailivska_2','velykonovosilkivska','velykooleksandrivska','velykoomelianska','velykoploskivska','velykopysarivska','velykorublivska','velykoseverynivska','velykosorochynska','velymchenska','velytska','vendychanska','verbkivska','verbska','verenchanska','veresaievska','verkhivtsivska','verkhnianska','verkhnodniprovska','verkhnokoropetska','verkhnorohachytska','verkhnosyrovatska','verkhorichenska','verkhovynska','vertiivska','veselivska','veselivska_2','veselivska_3','veselynivska','vesnianska','viitovetska','viknianska','vilinska','vilkhivska','vilkhovetska','vilkhuvatska','vilnenska','vilnianska','vilnohirska','vilnozaporizka','vilshanska','vilshanska_2','vilshanska_3','vilshanska_4','vinkovetska','vinnytska_2','vladyslavivska','vodianska','vodianytska','voikovska','voikovska_2','voinska','voinylivska','volnovaska','volochyska','volodarska','volodymyretska','volodymyrivska','volodymyr-volynska','volokivska','volovetska','volytska','vorobiovska','vorokhtianska','voronkivska','voronovytska','vorozhbianska','voskhodnenska','voskresenska','voskresenska_2','vovchanska','vovkovynetska','vozdvyzhivska','voznesenska','voznesenska_2','vradiivska','vuhledarska','vuhlehirska','vyhodianska','vyhodska','vylkivska','vylotska','vynohradivska','vynohradivska_2','vynohradivska_3','vynohradnenska','vynohradska','vyrivska','vyshenska','vyshevytska','vyshhorodska','vyshkivska','vyshneva','vyshnivetska','vyshnivska','vyshnivska_2','vyshnivska_3','vysochanska','vysochanska_2','vysokivska','vysokopilska','vysotska','vytvytska','vyzhnytska','vyzyrska','yablunivska','yablunivska_2','yahotynska','yakushynetska','yakymivska','yakymivska_3','yaltynska','yamnytska','yampilska','yampilska_2','yampilska_3','yantarnenska','yaremchanska','yarkivska','yarkopolenska','yarkopolenska_2','yarmolynetska','yaroslavytska','yarunska','yaryshivska','yasinianska','yaskivska','yasnopolianska','yasynuvatska','yavorivska','yelanetska','yemilchynska','yenakiievska','yerkivska','yermakivska','yevpatoriiska','yezupilska','yunakivska','yurivska','yurkovetska','yuvileina','yuzhnenska','yuzhnoukrainska','zabolotivska','zabolottivska','zabolottsivska','zabrodivska','zachepylivska','zahvizdianska','zaitsivska','zakharivska','zakupnenska','zalishchytska','zaliznychnenska','zalozetska','zaozernenska','zaporizka_2','zarichanska','zarichnenska','zarichnenska_2','zasluchnenska','zastavnivska','zaturtsivska','zatyshanska','zatyshnianska','zavallivska','zavitnenska','zavitnenska_2','zavito-leninska','zavodska','zavodska_2','zazymska','zbarazka','zborivska','zdolbunivska','zdovbytska','zelenivska','zelenodolska','zelenohirska','zelenohirska_2','zelenopidska','zelenska','zemlianychnenska','zernivska','zernivska_2','zghurivska','zhashkivska','zhdanivska','zhdanivska_3','zhdeniivska','zheliabovska','zhemchuzhynska','zhmerynska','zhovkivska','zhovtanetska','zhovtovodska','zhuravlivska','zhuravnenska','zhuravska','zhvanetska','zhydachivska','zhytomyrska_2','zinkivska','zinkivska_2','zlynska','zmiivska','znamianska','znamianska_2','znob-novhorodska','zolochivska','zolochivska_2','zolochivska_3','zolotnykivska','zolotoniska','zolotopolenska','zolotopotitska','zorianska','zorivska','zorkinska','zuiska','zvanivska','zvenyhorodska','zybynska','zymnivska','zymnovodivska','zymohirivska','zymynska'],
res_stat: ['idp','long_res','ret','ref_asy'],
gender: ['male','female'],
civ_stat: ['single','dom_part','married','div_sep','widow','abandoned'],
dis: ['diff_see','diff_hear','diff_walk','diff_rem','diff_care','diff_comm','diff_none'],
dis_level: ['zero','one','two','fri'],
shelter_damage: ['no_damage','minor_damage','heavy_damage'],
curr_accom: ['rent','host','own_prop','coll_cen','homeless','other_accom'],
rent_stat: ['secure','unable_pay','dan_unable_pay','unsuit_accom','eviction'],
accom_int: ['remain','rent','not_sure'],
serv_reg: ['always','not_always','intermittent','rarely','never'],
id_type: ['nat_pass_card','nat_pass_book','nat_pass_diia','pass_ussr_red','pass_int','birth_certificate','driver_lic','pen_cert','oth_id','no_id'],
pay_meth: ['raiff_trans','ukrpost','bank_card','other_pay','none_pay'],
sfu_intervention: ['cash_fuel','cash_utilities'],
type_property_living: ['external_walls','damaged_windows','poor_insulation','substantial_repairs','none'] } as const }
