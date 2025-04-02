export namespace Meal_cfmInternal {
export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
	// Form id: aN3Y8JeH2fU3GthrWAs9FG
	export interface T {
	    'start': string,
	    'end': string,
	  // begin_group_8qtQfwiWw/benef_origin [select_one] Походження бенефіціара
  'benef_origin': undefined | Option<'benef_origin'>,
	  // begin_group_8qtQfwiWw/project_code [select_one] будь ласка, введіть код проєкту
  'project_code': undefined | Option<'project_code'>,
	  // begin_group_8qtQfwiWw/project_code_specify [text] Будь ласка уточніть
  'project_code_specify': string | undefined,
	  // begin_group_8qtQfwiWw/name [text] Ім'я
  'name': string | undefined,
	  // begin_group_8qtQfwiWw/gender [select_one] Стать
  'gender': undefined | Option<'gender'>,
	  // begin_group_8qtQfwiWw/date [date] Дата
  'date': Date | undefined,
	  // begin_group_8qtQfwiWw/phone [text] Контактний номер
  'phone': string | undefined,
	  // begin_group_8qtQfwiWw/email [text] Електронна адреса
  'email': string | undefined,
	  // begin_group_8qtQfwiWw/validation_at_least_one_contact [note] <span style="border-radius: 3px; padding: 4px; color: #a94442; font-weight: bold; background: rgb(242, 222, 222)">Будь ласка, введіть електронну адресу або номер телефону</span>
  'validation_at_least_one_contact': string,
	  // begin_group_8qtQfwiWw/ben_det_oblast [select_one] Виберіть область в якій проживаєте
  'ben_det_oblast': undefined | Option<'ben_det_oblast'>,
	  // begin_group_8qtQfwiWw/ben_det_raion [select_one] Виберіть район в якому проживаєте
  'ben_det_raion': undefined | string,
	  // begin_group_8qtQfwiWw/ben_det_hromada [select_one] Виберіть громаду в якій проживаєте
  'ben_det_hromada': undefined | string,
	  // begin_group_8qtQfwiWw/ben_det_settlement [text] Населений пункт в якому проживаєте
  'ben_det_settlement': string | undefined,
	  // begin_group_UTzxDVd8w/feedback_method [select_one] Який спосіб подання відгуку?
  'feedback_method': undefined | Option<'feedback_method'>,
	  // begin_group_UTzxDVd8w/feedback_method_other [text] Будь ласка уточніть
  'feedback_method_other': string | undefined,
	  // begin_group_UTzxDVd8w/feedback_type [select_one] До якої категорії відноситься Ваш відгук?
  'feedback_type': undefined | Option<'feedback_type'>,
	  // begin_group_UTzxDVd8w/sub_category [select_one] Буль ласка, уточніть підкатегорію
  'sub_category': undefined | Option<'sub_category'>,
	  // begin_group_UTzxDVd8w/feedback_coc_type [note] ⚠️ Будь ласка, переконайтеся, що повідомлено особу відповідальну за Кодекс поведінки
  'feedback_coc_type': string,
	  // begin_group_UTzxDVd8w/feedback [text] Будь ласка, напишіть Ваш відгук
  'feedback': string | undefined,
	}
export const options = {
undefined: {
	'yes': `Так`,
	'no': `Ні`
},
benef_origin: {
	'drc': `DRC`,
	'partner': `Партнер`,
	'none': `Жодного`
},
project_code: {
	'UKR_000284': `UKR-000284 BHA`,
	'UKR_000270': `UKR-000270 Pooled Funds`,
	'UKR_000298': `UKR-000298 Novo-Nordisk`,
	'UKR_000286': `UKR-000286 DMFA`,
	'UKR_000301': `UKR-000301 DANISH MoFA`,
	'UKR_000314': `UKR-000314 UHF4`,
	'UKR_000322': `UKR-000322 ECHO2`,
	'UKR_000308': `UKR-000308 UNHCR`,
	'UKR_000323': `UKR-000323 PFRU`,
	'UKR-000331': `UKR-000331 GFFO`,
	'UKR-000345': `UKR-000345 BHA2`,
	'UKR-000348': `UKR-000348 BHA3`,
	'UKR-000360': `UKR-000360 Novo-Nordisk`,
	'UKR-000336': `UKR-000336 UHF6`,
	'UKR-000352': `UKR-000352 UHF7`,
	'UKR-000226': `UKR-000226 SDC`,
	'UKR-000230': `UKR-000230 PM WRA`,
	'UKR-000231': `UKR-000231 PM WKA`,
	'UKR-000247': `UKR-000247 FCDO`,
	'UKR-000249': `UKR-000249 Finnish MFA`,
	'UKR-000255': `UKR-000255 EU IcSP`,
	'UKR-000267': `UKR-000267 DANIDA`,
	'UKR-000269': `UKR-000269 ECHO1`,
	'UKR-000270': `UKR-000270 Pooled Funds Old (MPCA)`,
	'UKR-000276': `UKR-000276 UHF3`,
	'UKR-000284': `UKR-000284 BHA`,
	'UKR-000290': `UKR-000290 SDC Shelter`,
	'UKR-000293': `UKR-000293 French MFA`,
	'UKR-000294': `UKR-000294 Dutch I`,
	'UKR-000304': `UKR-000304 PSPU`,
	'UKR-000306': `UKR-000306 Dutch II`,
	'UKR-000309': `UKR-000309 OKF`,
	'UKR-000316': `UKR-000316 UHF5`,
	'UKR-000322': `UKR-000322 ECHO2`,
	'UKR-000330': `UKR-000330 SDC2`,
	'UKR-000340': `UKR-000340 Augustinus Fonden`,
	'UKR-000341': `UKR-000341 Hoffmans & Husmans`,
	'UKR-000342': `UKR-000342 Pooled Funds`,
	'UKR-000347': `UKR-000347 DANIDA`,
	'UKR-000350': `UKR-000350 SIDA`,
	'UKR-000363': `UKR-000363 UHF8`,
	'UKR-000355': `UKR-000355 Danish MFA`,
	'UKR-000372': `UKR-000372 ECHO3`,
	'SIDA 518-570A': `SIDA 518-570A`,
	'UKR-000370': `UKR-000370 SIDA`,
	'UKR-000373': `UKR-000373 Novo-Nordilsk`,
	'UKR-000378': `UKR-000378 Danish MFA`,
	'UKR-000380': `UKR-000380 DANIDA`,
	'UKR-000385': `UKR-000385 Pooled Funds`,
	'UKR-000388': `UKR-000388 BHA`,
	'UKR-000390': `UKR-000390 UHF9`,
	'UKR-000396': `UKR-000396 Danish MFA`,
	'UKR-000397': `UKR-000397 GFFO`,
	'UKR-000399': `UKR-000399 SDC3`,
	'Other': `Інше`
},
feedback_type: {
	'apprec_com': `0. Appreciation or compliments`,
	'request_info': `1. Request for information`,
	'request_assistance': `2. Request for support or assistance`,
	'non_s_feedback': `3. Non-sensitive programmatic feedback`,
	'sen_feedback': `4. sensitive – protection issue reported`,
	'coc': `5. Sensitive CoC violation by DRC staff and representatives.`,
	'violation_other': `6. Sensitive- seriously violation by other humanitarian actor (non-drc staff)`,
	'sen_safety': `7. sensitive- safety and security threat.`
},
sub_category: {
	'activity': `1.1 Інформація про діяльність ДРБ як організацію`,
	'loc': `1.2 Інформація про місце або час наступної реєстрації або видачі`,
	'criteria': `1.3 Інформація про критерії програм допомоги`,
	'register': `1.4 Інформація щодо різних етапів реєстрації`,
	'payment': `1.5 Інформація про терміни виплат від ДРБ`,
	'refusal': `1.6 Інформація щодо причин відмови у наданні допомоги`,
	'deadline': `1.7 Інформація про строки та процедури проведення ремонтних робіт (у т.ч грошовий переказ)`,
	'ukrpost': `1.8 Інформація щодо діяльності Укрпошти (строки виплат, смс повідомлення, затримки)`,
	'personal': `1.9 Інформація про зміни особистих даних (ім'я, місцезнаходження, адреса, телефон, статус)`,
	'hh_change': `1.10 Інформація про зміни в домогосподарстві (кількість членів тощо)`,
	'other_ngo': `1.11 Інформація щодо контактів іншої НГО`,
	'cash': `2.1 Запит на грошову допомогу`,
	'nfi': `2.2 Запит на допомогу, пов'язану з непродовольчими товарами (NFI)`,
	'food': `2.3 Запит на допомогу, пов'язану з продовольчими товарами`,
	'medical': `2.4 Запит на допомогу, пов'язану із лікуванням, діагноситкою, лікарськиими зщасобами тощо`,
	'reconstruction': `2.5 Запит на допомогу у відновленні житла`,
	'business': `2.6 Запит на допомогу щодо грантів для бізнесу`,
	'education': `2.7 Запит щодо гранту на навчання`,
	'agriculture': `2.8 Запит щодо пфдтримки с/г активностей`,
	'legal': `2.9 Запит щодо надання правової допомоги`,
	'relocation': `2.10 Запит на переселення або евакуацію`,
	'other': `2.11 Запит на інші види підтримки, окрім запропонованої`,
	'area': `2.12 Запит на проведення заходів, які можуть бути реалізовані ДРБ у певній місцевості`,
	'proj_change': `2.13 Запит на внесення змін у реалізацію проєкту`,
	'criteria_select': `3.1 Незадоволеність критеріями відбору`,
	'not_listed': `3.2 Не були включені до списків для цільової допомоги`,
	'misuse': `3.3 Органи влади зловживають наділеними владними повноваженнями`,
	'quality': `3.4 Незадоволеність якістю отриманої допомоги`,
	'contractor': `3.5 Проблеми з підрядниками (відсутність контролю, неякісний ремонт)`,
	'house_reconstruction': `3.6 Проблеми з обсягом робіт для відновлення житла (не розуміють або не згодні з тим, що буде зроблено з їхнім житлом, хотіли б більш серйозного залучення)`,
	'event': `3.7 Нестача інформації про майбутні заходи (комунікація)`,
	'registration': `3.8 Проблеми, пов'язані з реєстрацією, видачею (організаційні проблеми)`,
	'delay': `3.9 Затримка з реагуванням (оперативність)`,
	'amount': `3.10 Зміни в кількості отриманої допомоги`,
	'location': `3.11 Пункт видачі або місце реєстрації знаходиться занадто далеко, занадто переповнене або небезпечне (доречність/відчуття безпеки)`,
	'time': `3.12 Час очікування на отримання допомоги був занадто довгим (оперативність/затримки)`,
	'communication': `3.13 Мова подачі інформації є неприйнятною та/або образливою (комунікація)`,
	'training': `3.14 Проблеми, пов'язані з організацією тренінгів`,
	'not_include': `3.15 Не були включені/запрошені до участі в тендерному процесі (комунікація/контракти)`,
	'shelling': `4.1 Постраждали від обстрілів/збройного конфлікту/вибуху`,
	'movement': `4.2 Обмеження свободи пересування (включаючи самоізоляцію)`,
	'trafficking': `4.3 Постраждали від торгівлі людьми`,
	'violence': `4.4 Фізичне та психологічне насильство, в тому числі побиття та знущання (не ГЗН)`,
	'torture': `4.5 Постраждалі від катування та/або свавільного утримання під вартою`,
	'justice': `4.6 Відмова у доступі до правосуддя`,
	'GBV': `4.7 Гендерно-зумовлене насильство (ГЗН) - у тому числі сексуальне, психологічне, фізичне, соціально-економічне`,
	'child': `4.8 Соцільно-правовий захист дітей`,
	'displacement': `4.9 Примусове переміщення`,
	'extortion': `4.10 Вимагання - особа погрожує насильством з метою отримання грошей`,
	'service': `4.11 Відмова в доступі до послуг`,
	'sexual': `4.12 Сексуальні домагання та сексуальна експлуатація`,
	'occupation': `4.13 Незаконне заволодіння житлом, землею та майном`,
	'confiscation': `4.14 Конфіскація майна та особистих речей`,
	'family': `4.15 Примусове розлучення сім'ї`,
	'discrimination': `4.16 Дискримінація та/або стигматизація`
},
gender: {
	'male': `Чоловік`,
	'female': `Жінка`,
	'other': `Інше`
},
ben_det_oblast: {
	'cherkaska': `Черкаська`,
	'chernihivska': `Чернігівська`,
	'chernivetska': `Чернівецька`,
	'dnipropetrovska': `Дніпропетровська`,
	'donetska': `Донецька`,
	'ivano-frankivska': `Івано-Франківська`,
	'kharkivska': `Харківська`,
	'khersonska': `Херсонська`,
	'khmelnytska': `Хмельницька`,
	'kirovohradska': `Кіровоградська`,
	'kyivska': `Київська`,
	'luhanska': `Луганська`,
	'lvivska': `Львівська`,
	'mykolaivska': `Миколаївська`,
	'odeska': `Одеська`,
	'poltavska': `Полтавська`,
	'rivnenska': `Рівненська`,
	'sevastopilska': `Севастопільська`,
	'sumska': `Сумська`,
	'ternopilska': `Тернопільська`,
	'vinnytska': `Вінницька`,
	'volynska': `Волинська`,
	'zakarpatska': `Закарпатська`,
	'zaporizka': `Запорізька`,
	'zhytomyrska': `Житомирська`
},
feedback_method: {
	'in_person_complaint': `Особиста скарга`,
	'feedback_or_complaints_suggestion_box': `Скринька для відгуків або скарг`,
	'community_committee': `Громадський комітет`,
	'phone': `Телефон`,
	'email': `Електронна пошта`,
	'facebook': `Facebook`,
	'other': `Інший`
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
}) as T
}