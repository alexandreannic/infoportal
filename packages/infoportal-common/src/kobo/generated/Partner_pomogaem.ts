export namespace Partner_pomogaem {
export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
	// Form id: awpFpKtZZYEDuaZbqPi944
	export interface T {
	    'start': string,
	    'end': string,
	  // date [date] Дата
  'date': Date | undefined,
	  // background/back_un_id [note] **Унікальний персональний код**
  'back_un_id': string,
	  // background/back_enum [select_one] 1.1 Переписувач
  'back_enum': undefined | Option<'back_enum'>,
	  // background/back_prog_type [select_one] 1.2 Тип програми
  'back_prog_type': undefined | Option<'back_prog_type'>,
	  // background/donor_cff [select_one] 1.2.1 Який донор для Cash for Fuel
  'donor_cff': undefined | Option<'donor_cfu'>,
	  // background/donor_cfu [select_one] 1.2.2 Який донор для Cash for Utilities
  'donor_cfu': undefined | Option<'donor_cfu'>,
	  // background/back_consent [select_one] 1.3.1 Згода
  'back_consent': undefined | Option<'pay_det_tax_exempt'>,
	  // background/back_consen_no_reas [text] 1.3.2 Зазначте, будь ласка, причину, з якої Ви не погоджуєтеся заповнити анкету?
  'back_consen_no_reas': string | undefined,
	  // background/back_consent_no_note [note] Щиро дякуємо за ваш час, ми не будемо продовжувати заповнення анкети без вашої згоди.
  'back_consent_no_note': string,
	  // ben_det/ben_det_surname [text] 2.1 Яке ваше прізвище (як вказано в паспорті)?
  'ben_det_surname': string | undefined,
	  // ben_det/ben_det_first_name [text] 2.2 Яке ваше ім'я (як зазначено в паспорті)?
  'ben_det_first_name': string | undefined,
	  // ben_det/ben_det_pat_name [text] 2.3 Яке ваше по-батькові?
  'ben_det_pat_name': string | undefined,
	  // ben_det/ben_det_ph_number [integer] 2.4 Ваш контактний номер телефону?
  'ben_det_ph_number': number | undefined,
	  // ben_det/ben_det_oblast [select_one] 2.5.1 Виберіть область, де буде проходити реєстрація
  'ben_det_oblast': undefined | Option<'ben_det_oblast'>,
	  // ben_det/ben_det_raion [select_one] 2.5.2 Виберіть район, де буде проходити реєстрація
  'ben_det_raion': undefined | Option<'ben_det_raion'>,
	  // ben_det/ben_det_hromada [select_one] 2.5.3 Виберіть громаду, де відбувається реєстрація
  'ben_det_hromada': undefined | Option<'ben_det_hromada'>,
	  // ben_det/ben_det_settlement [select_one] 2.5.4 Виберіть Поселення, де відбувається реєстрація
  'ben_det_settlement': undefined | Option<'ben_det_settlement'>,
	  // ben_det/ben_det_res_stat [select_one] 2.5.5 Виберіть статус проживання
  'ben_det_res_stat': undefined | Option<'ben_det_res_stat'>,
	  // ben_det/ben_det_income [integer] 2.6 Якою була загальна вартість у гривнях усіх ресурсів, отриманих Вашим домогосподарством за останній місяць?
  'ben_det_income': number | undefined,
	  // ben_det/ben_det_hh_size [integer] 2.7 Кількість членів домогосподарства (включно з головою домогосподарства)
  'ben_det_hh_size': number | undefined,
	  // ben_det/hh_iban [text] 2.8 Який у Вас IBAN-код?
  'hh_iban': string | undefined,
	    'iban_length': string,
	  // hh_char/hh_char_civ_stat [select_one] 3.1 Який цивільно-правовий статус голови домогосподарства?
  'hh_char_civ_stat': undefined | Option<'hh_char_civ_stat'>,
	  // hh_char/hh_char_pensioner [select_one] 3.1.1 Чи є в домогосподарстві кого-небудь, хто отримує пенсію?
  'hh_char_pensioner': undefined | Option<'pay_det_tax_exempt'>,
	  // hh_char/hh_char_preg [select_one] 3.1.2 Чи є у домогосподарстві жінки, які вагітні чи годують грудьми?
  'hh_char_preg': undefined | Option<'pay_det_tax_exempt'>,
	  // hh_char/hh_char_preg_number [integer] 3.1.2.1 Скільки вагітних/годуючих жінок у домогосподарстві?
  'hh_char_preg_number': number | undefined,
	  // hh_char/people_reduced_mobility [select_one] 3.1.3 Чи є в домогосподарстві маломобільні люди?
  'people_reduced_mobility': undefined | Option<'pay_det_tax_exempt'>,
	  // hh_char/family_status [select_one] 3.1.4 Чи є в вашому ДГ родина, яка має статус?
  'family_status': undefined | Option<'family_status'>,
	  // hh_char/damaged_result_hostilities [select_one] 3.1.5 Чи пошкоджене Ваше житло внаслідок військових дій?
  'damaged_result_hostilities': undefined | Option<'pay_det_tax_exempt'>,
	  // hh_char/family_complete [select_one] 3.1.6 Ваше родина є повною?
  'family_complete': undefined | Option<'pay_det_tax_exempt'>,
	  // hh_char/hh_char_hh_det [begin_repeat] 3.2  Члени домогосподарства
  'hh_char_hh_det': {'hh_char_tax_id_yn': undefined | Option<'pay_det_tax_exempt'> | undefined,'hh_char_tax_id_num': string | undefined | undefined,'hh_char_date_birth': Date | undefined | undefined,'taxid_weightedsum': string | undefined,'taxid_roundedsum': string | undefined,'hh_char_hh_det_gender': undefined | Option<'hh_char_hh_det_gender'> | undefined,'hh_char_hh_det_age': number | undefined | undefined,'hh_char_student': undefined | Option<'pay_det_tax_exempt'> | undefined,'hh_char_hh_det_dis_select': undefined | Option<'hh_char_hh_det_dis_select'>[] | undefined,'hh_char_hh_det_dis_level': undefined | Option<'hh_char_hh_det_dis_level'> | undefined,'calc_u5': string | undefined,'calc_u18': string | undefined,'calc_o60': string | undefined,'calc_ed_age': string | undefined,'calc_baby_age': string | undefined,'calc_preg': string | undefined,'calc_det_dis_level': string | undefined,'cal_student': string | undefined,'cal_scoring_difficulty_level': string | undefined}[] | undefined,
	  // hh_char/hh_char_chh [note] Це домогосподарство, яке очолює дитина (ситуація з високим рівнем ризику у сфері соціального захисту), будь ласка, негайно зверніться до колеги з відділу соцыально-правового захисту ДРБ та заповніть внутрішню форму перенаправлення .
  'hh_char_chh': string,
	    'calc_tot_baby_age': string,
	    'calc_tot_calc_u5': string,
	    'calc_tot_chi': string,
	    'calc_tot_ed_age': string,
	    'calc_tot_eld': string,
	    'calc_tot_student': string,
	    'cal_tot_scoring_difficulty_level': string,
	  // casf_utilities_fuel/current_gov_assist_cff [select_one] Чи отримуєте ви зараз або очікуєте отримати фінансову допомогу для покриття ваших потреб в оплаті палива/комунальних послуг?
  'current_gov_assist_cff': undefined | Option<'current_gov_assist_cff'>,
	  // casf_utilities_fuel/gap_assistance_received [integer] Яка різниця ( у грн) між отриманою/очікуваною допомогою та сумою, необхідною для покриття потреб?
  'gap_assistance_received': number | undefined,
	  // casf_utilities_fuel/type_property_living [select_one] В якому стані житло де ви живете?
  'type_property_living': undefined | Option<'type_property_living'>,
	  // casf_utilities_fuel/utilities_fuel [select_one] Яким було ваше основне джерело опалення в цьому році (наприклад, газ, електрика, централізоване опалення) чи від твердого палива (дрова, пелети, деревне вугілля, кам'яне вугілля тощо)?
  'utilities_fuel': undefined | Option<'utilities_fuel'>,
	  // casf_utilities_fuel/utilities_fuel_other [text] Якщо "Інше", будь ласка, вкажіть
  'utilities_fuel_other': string | undefined,
	  // casf_utilities_fuel/utilities_fuel_portable_plug_heater [image] Будь ласка, надайте фото цього портативного обігрівача або дров'яної печі
  'utilities_fuel_portable_plug_heater': string,
	  // casf_utilities_fuel/functioning_fuel_delivery [select_one] Чи є у вашому регіоні функціонуюча доставка/постачальник пального?
  'functioning_fuel_delivery': undefined | Option<'functioning_fuel_delivery'>,
	  // ass_inc/ass_inc_note [note] **На основі Ваших попередніх відповідей Ви дізнаєтеся про Ваше включення/ виключення з будь-яких програм грошової допомоги, для включення в які Вас оцінювали.**
  'ass_inc_note': string,
	    'calc_vulnerability_cff': string,
	    'calc_gen_cff_inc': string,
	  // ass_inc/ass_inc_cff/ass_inc_cff_inc [note] **Ви відповідаєте критеріям для включення в програму грошової допомоги на паливо. Ми проведемо подальші внутрішні перевірки та повідомимо Вам остаточний результат.**
  'ass_inc_cff_inc': string,
	  // ass_inc/ass_inc_cff/ass_inc_cff_ben [note] **Попередня розрахована загальна допомога для цього домогосподарства:  <span style="color: red">Не зачитуйте це домогосподарству</span>
  'ass_inc_cff_ben': string,
	  // ass_inc/ass_inc_cff/ass_inc_cff_not_vul [note] **На жаль, за нашими критеріями Ви не відповідаєте вимогам для участі у програмі грошової допомоги на паливо, оскільки рівень Ваш рівень не відповідає порогу вразливості.**
  'ass_inc_cff_not_vul': string,
	    'calc_vulnerability_cfu': string,
	    'calc_gen_cfu_inc': string,
	  // ass_inc/ass_inc_cfu/ass_inc_cfu_inc [note] **Ви відповідаєте критеріям для включення в програму грошової допомоги на комунальні послуги. Ми проведемо подальші внутрішні перевірки та повідомимо Вам остаточний результат.**
  'ass_inc_cfu_inc': string,
	  // ass_inc/ass_inc_cfu/ass_inc_cfu_ben [note] **Попередня розрахована загальна допомога для цього домогосподарства:  <span style="color: red">Не зачитуйте це домогосподарству</span>
  'ass_inc_cfu_ben': string,
	  // ass_inc/ass_inc_cfu/ass_inc_cfu_not_vul [note] **На жаль, за нашими критеріями Ви не відповідаєте вимогам для участі у програмі грошової допомоги на комунальні послуги, оскільки рівень Ваш рівень не відповідає порогу вразливості.**
  'ass_inc_cfu_not_vul': string,
	  // pay_det/pay_consent [select_one] 6.0 Дякуємо за відповіді на вищезазначені питання, чи готові ви надати свої платіжні реквізити?
  'pay_consent': undefined | Option<'pay_det_tax_exempt'>,
	  // pay_det/pay_det_s/pay_det_id_type [select_one] 6.1 Яка у Вас форма посвідчення особи?
  'pay_det_id_type': undefined | Option<'pay_det_id_type'>,
	  // pay_det/pay_det_s/pay_det_id_type_oth [text] 6.1.1 Яка інша форма посвідчення особи у Вас є?
  'pay_det_id_type_oth': string | undefined,
	  // pay_det/pay_det_s/pay_det_pass_ser [text] 6.2.1 Серія паспорта
  'pay_det_pass_ser': string | undefined,
	  // pay_det/pay_det_s/pay_det_pass_num [text] 6.2.2 Номер ID
  'pay_det_pass_num': string | undefined,
	  // pay_det/pay_det_s/pay_det_id_ph [image] 6.2.3 Сфотографуйте посвідчення особи
  'pay_det_id_ph': string,
	  // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_yn [select_one] 6.3.1 Чи має бенефіціар індивідуальний податковий номер (ІПН)?
  'pay_det_tax_id_yn': undefined | Option<'pay_det_tax_exempt'>,
	  // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_num [text] 6.3.2 Ідентифікаційний номер (ІПН) бенефіціара
  'pay_det_tax_id_num': string | undefined,
	  // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_ph [image] 6.3.3 Сфотографуйте посвідчення платника податків (ІПН)
  'pay_det_tax_id_ph': string,
	  // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_exempt [select_one] 6.3.4 Підтвердження відсутності ІПН
  'pay_det_tax_exempt': undefined | Option<'pay_det_tax_exempt'>,
	  // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_exempt_im [image] 6.3.5 Сфотографуйте пільговий документ
  'pay_det_tax_exempt_im': string,
	  // pay_det/pay_det_s/pay_det_pay_meth [select_one] 6.4.1 Який у Вас бажаний спосіб оплати?
  'pay_det_pay_meth': undefined | Option<'pay_det_pay_meth'>,
	  // pay_det/pay_det_s/pay_det_iban [text] 6.4.2 Який у Вас IBAN-код?
  'pay_det_iban': string | undefined,
	    'iban_hh_length': string,
	  // pay_det/pay_det_s/pay_det_iban_im [image] 6.4.3 Сфотографуйте IBAN-код
  'pay_det_iban_im': string,
	  // pay_det/pay_det_s/pay_address [text] 6.4.4 Яка Ваша адреса?
  'pay_address': string | undefined,
	  // pay_det/pay_det_s/pay_zip [text] 6.4.5 Яким іншим способам оплати Ви віддаєте перевагу?
  'pay_zip': string | undefined,
	  // pay_det/pay_det_s/pay_det_add_im [image] 6.4.6 Сфотографуйте сторінку з адресою в паспорті
  'pay_det_add_im': string,
	  // pay_det/pay_det_s/pay_det_pay_meth_oth [text] 6.4.7 Яким іншим способам оплати Ви віддаєте перевагу?
  'pay_det_pay_meth_oth': string | undefined,
	  // pay_det/pay_det_s/pay_det_pay_meth_none [text] 6.4.8 Чи можете Ви навести головну причину того, що жоден із цих способів оплати Вам не підходить?
  'pay_det_pay_meth_none': string | undefined,
	  // fin_det/not_thank_sfu [note] **Дякуємо, що відповіли на наші запитання.  Ми підтвердимо деталі вашої реєстрації та підтвердимо, що ви не отримуєте допомогу від інших сторін, будь ласка, зверніть увагу, що це може зайняти до 5 робочих днів.  Після успішної реєстрації ми підтвердимо, чи зможемо ми допомогти вам і на який рівень підтримки ви можете розраховувати**
  'not_thank_sfu': string,
	  // fin_det/fin_det_res [text] 7.1 Інші коментарі бенефеціара.
  'fin_det_res': string | undefined,
	  // fin_det/fin_det_enum [text] 7.2 Інші коментарі польового оператора.
  'fin_det_enum': string | undefined,
	  // fin_det/fin_det_oth_doc_im [image] 7.3 Сфотографуйте інший відповідний документ (за потреби)
  'fin_det_oth_doc_im': string,
	}
export const options = {
back_enum: {
	'KD': `Касьян Діана`,
	'OA': `Осіпова Анастасія`,
	'NO': `Нагорянська Ольга`,
	'PA': `Подать Анастасія`,
	'VG': `Вовк Ганна`
},
back_prog_type: {
	'csf': `Cash for Fuel`,
	'cfu': `Cash for Utilities`
},
donor_cfu: {
	'ukr000390_uhf9': `UKR-000390 UHF9`
},
pay_det_tax_exempt: {
	'yes': `Так`,
	'no': `Ні`
},
ben_det_oblast: {
	'dnipropetrovska': `Дніпропетровська`
},
ben_det_raion: {
	'nikopolskyi': `Нікопольський`
},
ben_det_hromada: {
	'nikopolska': `Нікопольська`
},
ben_det_settlement: {
	'nikopol': `місто Нікополь`
},
ben_det_res_stat: {
	'idp': `Внутрішньо-переміщена особа (ВПО)`,
	'long_res': `Місцевий`,
	'ret': `Особа, яка повернулася`,
	'ref_asy': `Біженець/особа, що потребує прихистку`
},
hh_char_civ_stat: {
	'single': `Неодружений(-а) (ніколи не був(-ла) одружений(-а))`,
	'dom_part': `Неодружений(-а), але живе у сімейному партнерстві`,
	'married': `Одружений(-а)`,
	'div_sep': `Розлучений(-а)/ проживає окремо`,
	'widow': `Удівець/ вдова`,
	'abandoned': `Покинутий(-а)`
},
family_status: {
	'the_foster': `Опікунська сімʼя`,
	'adopters': `Сім’я усиновлювачів`,
	'foster': `Прийомна сімʼя`,
	'childrens_home': `Дитячий будинок сімейного типу( ДБСТ)`,
	'large': `Багатодітна родина`
},
hh_char_hh_det_gender: {
	'male': `Чоловік`,
	'female': `Жінка`
},
hh_char_hh_det_dis_select: {
	'diff_see': `Маєте труднощі із зором, навіть якщо носите окуляри`,
	'diff_hear': `Маєте проблеми зі слухом, навіть якщо користуєтеся слуховим апаратом`,
	'diff_walk': `Маєте труднощі з ходьбою або підйомом по сходах`,
	'diff_rem': `Маєте труднощі з запам'ятовуванням або концентрацією уваги`,
	'diff_care': `Мають труднощі з самообслуговуванням, наприклад, з миттям або одяганням`,
	'diff_comm': `Маєте труднощі у спілкуванні, наприклад, у розумінні чи розумінні інших людей`,
	'diff_none': `Ніщо з перерахованого вище не стосується`
},
hh_char_hh_det_dis_level: {
	'zero': `Ні, труднощі відсутні`,
	'one': `Так, є деякі труднощі`,
	'two': `Так, багато труднощів`,
	'fri': `Взагалі не можу(-е) робити`
},
current_gov_assist_cff: {
	'yes': `Так, державна підтримка`,
	'yes_another_agency': `Так, від іншої гуманітарної організації або подібної`,
	'yes_but': `Так, але недостатньо для покриття потреб`,
	'no': `Ні`
},
type_property_living: {
	'external_walls': `Житло із зовнішніми стінами з дерева або спресованих ґрунтових блоків/саман/тин (може включати їх комбінацію)`,
	'damaged_windows': `Житло з одинарним склінням або пошкодженими вікнами`,
	'poor_insulation': `Житло з поганою ізоляцією, пошкодженим дахом або стінами`,
	'substantial_repairs': `Житло, що потребує значного ремонту, наприклад, з потрісканими або пошкодженими стінами, поганою ізоляцією та неефективною теплоізоляцією.`,
	'none': `Нічого з перерахованого вище`
},
utilities_fuel: {
	'mains_piped_gas': `Мережевий/трубопровідний газ`,
	'community_heating': `Громадське опалення`,
	'portable_plug_heater': `Портативний обігрівач, що вставляється в розетку`,
	'mains_electricity': `Мережева електрика`,
	'fuel': `Тверде паливо`
},
functioning_fuel_delivery: {
	'yes': `Так`,
	'no': `Ні`,
	'dk': `Не знаю`
},
pay_det_id_type: {
	'nat_pass_card': `Національний паспорт (карта)`,
	'nat_pass_book': `Національний паспорт (книжка)`,
	'nat_pass_diia': `Національний паспорт (додаток Дія)`,
	'pass_ussr_red': `Паспорт (Червона книга СРСР)`,
	'pass_int': `Закордонний паспорт`,
	'birth_certificate': `Свідоцтво про народження`,
	'driver_lic': `Водійські права`,
	'pen_cert': `Посвідчення пенсіонера`,
	'oth_id': `Інша форма ідентифікатора`,
	'no_id': `Немає іншого типу`
},
pay_det_pay_meth: {
	'raiff_trans': `Переказ через «Райффайзен Банк АВАЛЬ»`,
	'ukrpost': `Укрпошта`,
	'bank_card': `Банківська картка`,
	'other_pay': `Інший спосіб оплати`,
	'none_pay': `Жодний з перелічених способів мені не підходить`
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
	ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
	ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
	ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
	hh_char_preg_number: _.hh_char_preg_number ? +_.hh_char_preg_number : undefined,
	hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
		_['hh_char_date_birth'] = _.hh_char_date_birth ? new Date(_.hh_char_date_birth) : undefined
		_['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
		_['hh_char_hh_det_dis_select'] = _.hh_char_hh_det_dis_select?.split(' ')
		return _	
}),
	gap_assistance_received: _.gap_assistance_received ? +_.gap_assistance_received : undefined,
}) as T
}