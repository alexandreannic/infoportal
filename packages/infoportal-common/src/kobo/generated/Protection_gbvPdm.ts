export namespace Protection_gbvPdm {
export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
	// Form id: aiKSgfpAqreCjd6P47GC42
	export interface T {
	    'start': string,
	    'end': string,
	  // introduction/date [date] Date of receiving of kit:
  'date': Date | undefined,
	  // introduction/name_interviewer [text] Name of the interviewer
  'name_interviewer': string | undefined,
	  // introduction/type_implementation [select_one] Type of implementation:
  'type_implementation': undefined | Option<'type_implementation'>,
	  // introduction/donor [select_one] Donor
  'donor': undefined | Option<'donor'>,
	  // introduction/back_office [select_one] Office responsible for the implementation of the project:
  'back_office': undefined | Option<'back_office'>,
	  // introduction/back_office_other [text] If "Other" Please specify:
  'back_office_other': string | undefined,
	  // introduction/partner [select_one] Implementing partner:
  'partner': undefined | Option<'partner'>,
	  // introduction/partner_other [text] If "Other" Please specify:
  'partner_other': string | undefined,
	  // introduction/ben_det_oblast [select_one] Please, select oblast of distribution:
  'ben_det_oblast': undefined | Option<'ben_det_oblast'>,
	  // introduction/ben_det_raion [select_one] Please, select rayon of distribution:
  'ben_det_raion': undefined | string,
	  // introduction/ben_det_hromada [select_one] Please, select hromada of distribution:
  'ben_det_hromada': undefined | string,
	  // introduction/ben_det_settlement [select_one_from_file] Please, select settlement of distribution:
  'ben_det_settlement': string,
	  // introduction/age [integer] 1. What is your age?
  'age': number | undefined,
	  // introduction/content_during_distribution [select_one] 2. Were you told about the content of what you were going to receive before or during distribution?
  'content_during_distribution': undefined | Option<'feel_staff_respect'>,
	  // introduction/items_received_kit [select_one] 3. Do you think the items you received in the dignity kit was as per the information you received about the content?
  'items_received_kit': undefined | Option<'feel_staff_respect'>,
	  // introduction/used_items_kit [select_one] 4. Have you used any of the items in the dignity kit?
  'used_items_kit': undefined | Option<'used_items_kit'>,
	  // introduction/satisfied_quantity_items [select_one] 5. How satisfied are you with the quantity of the items in the dignity kits you received from DRC?
  'satisfied_quantity_items': undefined | Option<'satisfied_quality_items'>,
	  // introduction/satisfied_quantity_items_bad [text] 5.1 If ‘partially dissatisfied’ or ‘dissatisfied’, could you please clarify:
  'satisfied_quantity_items_bad': string | undefined,
	  // introduction/satisfied_quality_items [select_one] 6. How satisfied are you with the quality of items in the dignity kits you received from DRC?
  'satisfied_quality_items': undefined | Option<'satisfied_quality_items'>,
	  // introduction/satisfied_quality_items_001 [text] 6.1 If ‘partially dissatisfied’ or ‘dissatisfied’, could you please clarify:
  'satisfied_quality_items_001': string | undefined,
	  // introduction/kit_received_relevant [select_one] 7. Was the kit you’ve received relevant to your needs?
  'kit_received_relevant': undefined | Option<'feel_staff_respect'>,
	  // introduction/kit_received_relevant_no [text] 7.1 If ‘no’, could you please specify why
  'kit_received_relevant_no': string | undefined,
	  // introduction/information_use_items [select_one] 8. Did you receive information on how to use the items in the dignity kits?
  'information_use_items': undefined | Option<'feel_staff_respect'>,
	  // introduction/safety_travelling [select_one] 9. Did you experience any safety concerns when travelling to the distribution or during the distribution?
  'safety_travelling': undefined | Option<'feel_staff_respect'>,
	  // introduction/how_give_your_complaint [select_one] 10. Where you told about how you can give your complaint/feedback or questions about the assistance?
  'how_give_your_complaint': undefined | Option<'feel_staff_respect'>,
	  // introduction/satisfied_assistance_provided [select_one] 11. Overall, are satisfied with the assistance provided by DRC?
  'satisfied_assistance_provided': undefined | Option<'feel_staff_respect'>,
	  // introduction/satisfied_assistance_provided_no [text] 11.1 If ‘no’, could you please specify
  'satisfied_assistance_provided_no': string | undefined,
	  // introduction/feel_staff_respect [select_one] 12. Did you feel that the DRC staff treated you with respect during the intervention?
  'feel_staff_respect': undefined | Option<'feel_staff_respect'>,
	  // introduction/feel_staff_respect_no [text] 12.1 If ‘no’, could you please specify
  'feel_staff_respect_no': string | undefined,
	  // introduction/feedback [text] Please provide any other feedback/comments:
  'feedback': string | undefined,
	}
export const options = {
back_office: {
	'lwo': `Lviv (LWO)`,
	'chj': `Chernihiv (CEJ)`,
	'dnk': `Dnipro (DNK)`,
	'hrk': `Kharkiv (HRK)`,
	'nlv': `Mykloaiv (NLV)`,
	'umy': `Sumy (UMY)`,
	'slo': `Slovyansk (SLO)`,
	'zap': `Zaporizhzhya (ZAP)`,
	'other': `Other`
},
donor: {
	'347_danida': `DANIDA UKR-000347`,
	'336_uhf6': `UHF VI UKR-000336`
},
partner: {
	'positive_women_zaporizhzhia': `Positive Women Zaporizhzhia`,
	'help_doing': `Help by doing`,
	'renaissance_nation': `Renaissance of the Nation`,
	'clear_paper': `Clear Paper`,
	'other': `Other`
},
type_implementation: {
	'drc': `DRC`,
	'ip': `Implementing partner`
},
feel_staff_respect: {
	'yes': `Yes`,
	'no': `No`,
	'pna': `Prefer not to answer`
},
used_items_kit: {
	'yes': `Yes`,
	'no': `No`,
	'not_yet': `Not yet, but plan to use the items`,
	'pna': `Prefer not to answer`
},
satisfied_quality_items: {
	'satisfied': `Satisfied`,
	'partially': `Partially satisfied`,
	'dissatisfied': `Dissatisfied`,
	'pna': `Prefer not to answer`
},
ben_det_oblast: {
	'crimea': `Autonomous Republic of Crimea`,
	'cherkaska': `Cherkasy`,
	'chernihivska': `Chernihiv`,
	'chernivetska': `Chernivtsi`,
	'dnipropetrovska': `Dnipropetrovsk`,
	'donetska': `Donetsk`,
	'ivano-frankivska': `Ivano-Frankivsk`,
	'kharkivska': `Kharkiv`,
	'khersonska': `Kherson`,
	'khmelnytska': `Khmelnytskyi`,
	'kirovohradska': `Kirovohrad`,
	'kyivska': `Kyiv`,
	'luhanska': `Luhansk`,
	'lvivska': `Lviv`,
	'mykolaivska': `Mykolaiv`,
	'odeska': `Odesa`,
	'poltavska': `Poltava`,
	'rivnenska': `Rivne`,
	'sumska': `Sumy`,
	'ternopilska': `Ternopil`,
	'vinnytska': `Vinnytsia`,
	'volynska': `Volyn`,
	'zakarpatska': `Zakarpattia`,
	'zaporizka': `Zaporizhzhia`,
	'zhytomyrska': `Zhytomyr`,
	'sevastopol': `Sevastopol`
}} as const

const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}

export const map = (_: Record<keyof T, any>): T => ({
	..._,
	date: _.date ? new Date(_.date) : undefined,
	age: _.age ? +_.age : undefined,
}) as T
}