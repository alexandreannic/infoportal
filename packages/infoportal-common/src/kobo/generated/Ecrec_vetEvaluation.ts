export namespace Ecrec_vetEvaluation {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: a4iDDoLpUJHbu6cwsn2fnG
  export interface T {
    start: string
    end: string
    // general_information/id_form_vet [text] 1.1 ID кандидата на отримання навчальних грантів
    id_form_vet: string | undefined
    // general_information/back_office [select_one] 1.2 Оберіть офіс
    back_office: undefined | Option<'back_office'>
    // general_information/back_enum [select_multiple] 1.3 Переписувач
    back_enum: undefined | Option<'back_enum'>[]
    // general_information/date_interview [date] 1.4 Дата співбесіди
    date_interview: Date | undefined
    // general_information/place_address [text] 1.5 Місце проведення співбесіди, адреса:
    place_address: string | undefined
    // general_information/name_and_settlement [text] 1.7 ПІБ потенційного бенефіціара та його адреса
    name_and_settlement: string | undefined
    // general_information/tax_id [integer] 1.8 Податковий номер потенційного бенефіціара
    tax_id: number | undefined
    // training_needs/name_training [text] 2.1 Назва курсу, який кандидат бажає отримати
    name_training: string | undefined
    // training_needs/length_training [integer] 2.2 Тривалість навчання (місяців)
    length_training: number | undefined
    // training_needs/provider_training [text] 2.3 Можливий надавач послуг із навчання
    provider_training: string | undefined
    // training_needs/provide_formal_agreement [select_one] 2.4 Чи може навчальний заклад надати офіційну угоду та рахунки-фактури, що можуть підтвердити сплату за навчання у два етапи?
    provide_formal_agreement: undefined | Option<'hh_char_preg'>
    // training_needs/modality_training [select_one] 2.5 Формат навчання
    modality_training: undefined | Option<'modality_training'>
    // training_needs/technical_capacity [select_one] 2.6 Чи є у вас технічні можливості проходити онлайн навчання? Наприклад, ноутбук, планшет, телефон, стабільний інтернет, тощо
    technical_capacity: undefined | Option<'hh_char_preg'>
    // training_needs/travel_training [select_one] 2.7 Чи є у вас можливість їздити на навчання?
    travel_training: undefined | Option<'hh_char_preg'>
    // training_needs/cost_training [integer] 2.8 Загальна вартість навчання (грн).
    cost_training: number | undefined
    // training_needs/grant_amount [integer] 2.9 Необхідна сума гранту (грн).
    grant_amount: number | undefined
    // candidates_evaluation/motivation_training [text] 3.1 Ваша мотивація щодо проходження курсу професійної підготовки ?
    motivation_training: string | undefined
    // candidates_evaluation/motivation_training_rate [select_one] 3.1.1 Оцінка
    motivation_training_rate: undefined | Option<'training_benefit_individual_rate'>
    // candidates_evaluation/experience_field_training [text] 3.2 Досвід роботи в сфері обраного навчання
    experience_field_training: string | undefined
    // candidates_evaluation/experience_field_training_rate [select_one] 3.2.1 Оцінка
    experience_field_training_rate: undefined | Option<'training_benefit_individual_rate'>
    // candidates_evaluation/purpose_training [text] 3.3 Мета навчання (працевлаштування/самозайнятість)
    purpose_training: string | undefined
    // candidates_evaluation/purpose_training_rate [select_one] 3.3.1 Оцінка
    purpose_training_rate: undefined | Option<'training_benefit_individual_rate'>
    // candidates_evaluation/outline_new_skills [text] 3.4 Опишіть, як саме отримані нові навички підвищать конкурентоспроможність на ринку праці або допоможуть започаткувати власну справу
    outline_new_skills: string | undefined
    // candidates_evaluation/understand_market_demand [text] 3.5 Опишіть, як ви бачите попит на ринку праці на послуги, які ви плануєте надавати після закінчення курсу
    understand_market_demand: string | undefined
    // candidates_evaluation/primary_barriers_employment [text] 3.6 Основні бар'єри, що перешкоджають працевлаштуванню/самозайнятості
    primary_barriers_employment: string | undefined
    // candidates_evaluation/primary_barriers_employment_rate [select_one] 3.6.1 Оцінка
    primary_barriers_employment_rate: undefined | Option<'training_benefit_individual_rate'>
    // candidates_evaluation/assets_employment_skills [text] 3.7 Наявні активи для самозайнятості/працевлаштування, такі як навички, бізнес-план, обладнання, обігові кошти тощо
    assets_employment_skills: string | undefined
    // candidates_evaluation/assets_employment_skills_rate [select_one] 3.7.1 Оцінка
    assets_employment_skills_rate: undefined | Option<'training_benefit_individual_rate'>
    // candidates_evaluation/obstacles_covering_course [text] 3.8 Перешкоди для покриття витрат на навчання власним коштом
    obstacles_covering_course: string | undefined
    // candidates_evaluation/obstacles_covering_course_rate [select_one] 3.8.1 Оцінка
    obstacles_covering_course_rate: undefined | Option<'training_benefit_individual_rate'>
    // candidates_evaluation/similar_programs_ngo [text] 3.9 Участь у подібних програмах інших недержавних громадських організацій (які саме і коли)
    similar_programs_ngo: string | undefined
    // candidates_evaluation/similar_programs_ngo_rate [select_one] 3.9.1 Оцінка
    similar_programs_ngo_rate: undefined | Option<'training_benefit_individual_rate'>
    // candidates_evaluation/training_benefit_individual [text] 3.10 Як ця навчальна програма допоможе отримати стабільну роботу?
    training_benefit_individual: string | undefined
    // candidates_evaluation/training_benefit_individual_rate [select_one] 3.10.1 Оцінка
    training_benefit_individual_rate: undefined | Option<'training_benefit_individual_rate'>
    // candidates_evaluation/confirm_able_regularly_training [select_one] 3.11 Будь ласка, підтвердіть, що ви зможете регулярно відвідувати заняття навчального курсу протягом усього терміну його проведення
    confirm_able_regularly_training: undefined | Option<'hh_char_preg'>
    // candidates_evaluation/training_costs_yourself [select_one] 3.12 Якщо вам потрібно буде добиратися до місця проведення тренінгу, чи зможете ви самостійно покрити витрати на транспорт та/або проживання?
    training_costs_yourself: undefined | Option<'hh_char_preg'>
    // candidates_evaluation/estimated_transportations_costs [integer] 3.13 Якою буде орієнтовна сума транспортних витрат протягом усього курсу?
    estimated_transportations_costs: number | undefined
    // hh_char/ben_det_hh_size [integer] 4.1 Вкажіть загальну кількість людей у вашому домогосподарстві, включаючи голову домогосподарства
    ben_det_hh_size: number | undefined
    // hh_char/info [note] Ця інформація збирається для того, щоб зібрати більше відомостей про рівень вразливості Вас і вашого домогосподарства
    info: string
    // hh_char/hh_char_hh_det [begin_repeat] 4.2 Члени домогосподарства
    hh_char_hh_det:
      | {
          hh_char_hh_det_gender: undefined | Option<'hh_char_hh_det_gender'> | undefined
          hh_char_hh_det_age: number | undefined | undefined
          hh_char_hh_det_dis_select: undefined | Option<'hh_char_hh_det_dis_select'>[] | undefined
          hh_char_hh_det_dis_level: undefined | Option<'hh_char_hh_det_dis_level'> | undefined
          'calc_female_1-6': string | undefined
          calc_female_7_17: string | undefined
          calc_female_18_25: string | undefined
          calc_female_26_49: string | undefined
          calc_female_50_59: string | undefined
          calc_female_over_60: string | undefined
          'calc_male_1-6': string | undefined
          calc_male_7_17: string | undefined
          calc_male_18_25: string | undefined
          calc_male_26_49: string | undefined
          calc_male_50_59: string | undefined
          calc_male_over_60: string | undefined
          calc_det_dis_level: string | undefined
          calc_preg: string | undefined
        }[]
      | undefined
    // hh_char/calc_tot_female_1-6 [calculate] Загальна кількість жінок у віці від 1 до 6 років
    'calc_tot_female_1-6': string
    // hh_char/calc_tot_female_7_17 [calculate] Загальна кількість жінок у віці від 7 до 17 років
    calc_tot_female_7_17: string
    // hh_char/calc_tot_female_18_25 [calculate] Загальна кількість жінок у віці від 18 до 25 років
    calc_tot_female_18_25: string
    // hh_char/calc_tot_female_26_49 [calculate] Загальна кількість жінок у віці від 26 до 49 років
    calc_tot_female_26_49: string
    // hh_char/calc_tot_female_50_59 [calculate] Загальна кількість жінок у віці від 50 до 59 років
    calc_tot_female_50_59: string
    // hh_char/calc_tot_female_over_60 [calculate] Загальна кількість жінок у віці понад 59 років
    calc_tot_female_over_60: string
    // hh_char/calc_tot_male_1-6 [calculate] Загальна кількість чоловіків у віці від 1 до 6 років
    'calc_tot_male_1-6': string
    // hh_char/calc_tot_male_7_17 [calculate] Загальна кількість чоловіків у віці від 7 до 17 років
    calc_tot_male_7_17: string
    // hh_char/calc_tot_male_18_25 [calculate] Загальна кількість чоловіків у віці від 18 до 25 років
    calc_tot_male_18_25: string
    // hh_char/calc_tot_male_26_49 [calculate] Загальна кількість чоловіків у віці від 26 до 49 років
    calc_tot_male_26_49: string
    // hh_char/calc_tot_male_50_59 [calculate] Загальна кількість чоловіків у віці від 50 до 59 років
    calc_tot_male_50_59: string
    // hh_char/calc_tot_male_over_60 [calculate] Загальна кількість чоловіків у віці понад 59 років
    calc_tot_male_over_60: string
    // hh_char/calc_tot_female [calculate] Загальна кількість жінок
    calc_tot_female: string
    // hh_char/calc_tot_male [calculate] Загальна кількість чоловіків
    calc_tot_male: string
    // hh_char/calc_tot_1-6 [calculate] Загальна кількість осіб у віці від 1 до 6 років
    'calc_tot_1-6': string
    // hh_char/calc_tot_7_17 [calculate] Загальна кількість осіб у віці від 7 до 17 років
    calc_tot_7_17: string
    // hh_char/calc_tot_18_25 [calculate] Загальна кількість осіб у віці від 18 до 25 років
    calc_tot_18_25: string
    // hh_char/calc_tot_26_49 [calculate] Загальна кількість осіб у віці від 26 до 49 років
    calc_tot_26_49: string
    // hh_char/calc_tot_50_59 [calculate] Загальна кількість осіб у віці від 50 до 59 років
    calc_tot_50_59: string
    // hh_char/calc_tot_over_60 [calculate] Загальна кількість осіб у віці старше 59 років
    calc_tot_over_60: string
    // hh_char/calc_tot_dis_level [calculate] Загальна кількість людей з інвалідністю
    calc_tot_dis_level: string
    // hh_char/beneficiarys_status [select_one] 4.3 Сімейний стан бенефіціара
    beneficiarys_status: undefined | Option<'beneficiarys_status'>
    // hh_char/beneficiarys_age [integer] 4.4 Вік потенційного бенефіціара
    beneficiarys_age: number | undefined
    // hh_char/you_breadwinner [select_one] 4.5 Ви є годувальником у вашому домогосподарстві?
    you_breadwinner: undefined | Option<'hh_char_preg'>
    // hh_char/hh_char_preg [select_one] 4.6 Хтось із жінок у вашому домогосподарстві вагітний або годує грудьми?
    hh_char_preg: undefined | Option<'hh_char_preg'>
    // hh_char/numb_hh_char_preg [integer] 4.6.1 Кількість жінок у вашому домогосподарстві вагітних або годуючих грудью?
    numb_hh_char_preg: number | undefined
    // hh_char/hh_char_chh [note] Це домогосподарство очолює дитина (високоризиковий випадок захисту), будь ласка, негайно зверніться до колег із DRC Protection та заповніть внутрішню форму перенаправлення.
    hh_char_chh: string
    // income/type_income [select_multiple] 5.1 Загальний дохід домогосподарства (грн).
    type_income: undefined | Option<'type_income'>[]
    // income/income_profit_business [integer] 5.1.1 Сума прибутку від бізнесу або самозайнятості
    income_profit_business: number | undefined
    // income/income_formal_employment [integer] 5.1.2 Сума доходу від офіційної зайнятості
    income_formal_employment: number | undefined
    // income/income_informal_employment [integer] 5.1.3 Сума доходу від неофіційної зайнятості
    income_informal_employment: number | undefined
    // income/income_pensions [integer] 5.1.4 Сума нарахованої пенсії
    income_pensions: number | undefined
    // income/income_government_idp [integer] 5.1.5 Сума нарахованої державної допомоги для ВПО
    income_government_idp: number | undefined
    // income/income_social_benefits_idp [integer] 5.1.6 Сума нарахованих соціальних виплат, крім пенсій чи державної допомоги для ВПО
    income_social_benefits_idp: number | undefined
    // income/income_remittances [integer] 5.1.7 Сума отриманих грошових переказів
    income_remittances: number | undefined
    // income/income_private [integer] 5.1.8 Сума прибутку від пасивного доходу, такий як оренда, прибуток з капіталу тощо
    income_private: number | undefined
    // income/income_borrow_money [integer] 5.1.9 Сума грошей взятих у борг у родини або знайомих
    income_borrow_money: number | undefined
    // income/income_savings [integer] 5.1.10 Сума заощадження
    income_savings: number | undefined
    // income/type_income_other [text] 5.1.11 У разі якщо “Інше”, будь ласка, зазначте
    type_income_other: string | undefined
    // income/income_other [integer] 5.1.11.1 Сума доходу від “Іншого”
    income_other: number | undefined
    // income/total_income [calculate] Загальний дохід домогосподарства (грн).
    total_income: string
    // income/disp_total_income [note] Загальний дохід домогосподарства : ${total_income} грн.
    disp_total_income: string
    // income/family_impacted_conflict [select_multiple] 5.2 Як конфлікт вплинув на вас та/або на вашу родину?
    family_impacted_conflict: undefined | Option<'family_impacted_conflict'>[]
    // income/family_impacted_conflict_other [text] 5.2.1 Якщо ви обрали інший вплив конфлікту, вкажіть його, будь ласка
    family_impacted_conflict_other: string | undefined
    // fin_det/total_score [calculate] undefined
    total_score: string
    // fin_det/disp_total_score [note] undefined
    disp_total_score: string
    // fin_det/detailed_household [text] 6.1 Детальний опис ситуації в домогосподарстві:
    detailed_household: string | undefined
  }
  export const options = {
    hh_char_preg: {
      yes: `Так`,
      no: `Ні`,
    },
    modality_training: {
      online: `Онлайн`,
      offline: `Офлайн`,
      hybrid: `Змішана форма навчання`,
    },
    training_benefit_individual_rate: {
      one: `1`,
      two: `2`,
      three: `3`,
      four: `4`,
      five: `5`,
    },
    beneficiarys_status: {
      married: `Одружений/Одружена`,
      not_married: `Не одружений/Не одружена`,
    },
    type_income: {
      profit_business: `Прибуток від бізнесу або самозайнятості`,
      formal_employment: `Офіційна зайнятість`,
      informal_employment: `Неофіційна зайнятість`,
      pensions: `Пенсія`,
      government_idp: `Державна допомога для ВПО`,
      social_benefits_idp: `Соціальні виплати, крім пенсій або державної допомоги для ВПО`,
      remittances: `Грошові перекази`,
      private_income: `Пасивний дохід, такий як оренда, прибуток з капіталу тощо`,
      borrow_money: `Гроші взяті у борг у родини або знайомих`,
      savings: `Заощадження`,
      other: `Інше`,
    },
    hh_char_hh_det_dis_select: {
      diff_see: `Важко бачити, навіть в окулярах`,
      diff_hear: `Важко чути навіть зі слуховим апаратом`,
      diff_walk: `Важко ходити та підніматися сходами`,
      diff_rem: `Важко запам'ятовувати та зосереджуватися`,
      diff_care: `Важко митися, одягатися та виконувати інші дії через обмеження у рухах, розумових здібностях або інші фізичні причини`,
      diff_comm: `Складно спілкуватися, розуміти та бути зрозумілим`,
      diff_none: `Ні один з зазначених пунктів не стосується члена домогосподарства`,
    },
    hh_char_hh_det_dis_level: {
      zero: `Жодних складнощів`,
      one: `Трохи складно`,
      two: `Дуже складно`,
      fri: `Зовсім не можу впоратися`,
    },
    hh_char_hh_det_gender: {
      male: `Чоловік`,
      female: `Жінка`,
    },
    back_office: {
      dnk: `Dnipro (DNK)`,
      nlv: `Mykloaiv (NLV)`,
    },
    back_enum: {
      alina_bondarenko: `Аліна Бондаренко`,
      maksym_mykytas: `Максим Микитась`,
      vita_zolotarevska: `Віта Золотаревська`,
      olha_sakharnova: `Ольга Сахарнова`,
      andrii_matvieiev: `Андрій Матвєєв`,
      sofiia_berezhna: `Софія Бережна`,
      illia_kutsenko: `Ілля Куценко`,
      tetiana_tsapii: `Тетяна Цапій`,
      nataliia_lanina: `Наталія Ланіна`,
      svitlana_labunska: `Світлана Лабунська`,
      olena_suhoniak: `Олена Сухоняк`,
      mykola_marchenko: `Микола Марченко`,
      oleksii_marchenko: `Олексій Марченко`,
      nikita_zubenko: `Нікіта Зубенко`,
    },
    undefined: {
      yes: `Так`,
      no_option: `Немає можливості`,
    },
    family_impacted_conflict: {
      being_internally_displaced: `Отримання статусу ВПО`,
      house_damaged_destroyed: `Житло було пошкоджено або зруйновано`,
      lost_job_income: `Втрата роботи або іншого джерела доходу через конфлікт`,
      loss_business: `Втрата бізнесу через пов'язані з конфліктом ринкові зміни`,
      injury_loss_breadwinner: `Поранення/травма або втрата годувальника`,
      hosing_idp: `Розміщення ВПО у себе безкоштовно`,
      being_returnee: `Ви стали особою, що повернулась`,
      living_area_conflict_affected: `Проживання на території, визначеній урядом як постраждала від конфлікту`,
      other: `Інший вплив конфлікту`,
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
      back_enum: _.back_enum?.split(' '),
      date_interview: _.date_interview ? new Date(_.date_interview) : undefined,
      tax_id: _.tax_id ? +_.tax_id : undefined,
      length_training: _.length_training ? +_.length_training : undefined,
      cost_training: _.cost_training ? +_.cost_training : undefined,
      grant_amount: _.grant_amount ? +_.grant_amount : undefined,
      estimated_transportations_costs: _.estimated_transportations_costs
        ? +_.estimated_transportations_costs
        : undefined,
      ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
      hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
        _['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
        _['hh_char_hh_det_dis_select'] = _.hh_char_hh_det_dis_select?.split(' ')
        return _
      }),
      beneficiarys_age: _.beneficiarys_age ? +_.beneficiarys_age : undefined,
      numb_hh_char_preg: _.numb_hh_char_preg ? +_.numb_hh_char_preg : undefined,
      type_income: _.type_income?.split(' '),
      income_profit_business: _.income_profit_business ? +_.income_profit_business : undefined,
      income_formal_employment: _.income_formal_employment ? +_.income_formal_employment : undefined,
      income_informal_employment: _.income_informal_employment ? +_.income_informal_employment : undefined,
      income_pensions: _.income_pensions ? +_.income_pensions : undefined,
      income_government_idp: _.income_government_idp ? +_.income_government_idp : undefined,
      income_social_benefits_idp: _.income_social_benefits_idp ? +_.income_social_benefits_idp : undefined,
      income_remittances: _.income_remittances ? +_.income_remittances : undefined,
      income_private: _.income_private ? +_.income_private : undefined,
      income_borrow_money: _.income_borrow_money ? +_.income_borrow_money : undefined,
      income_savings: _.income_savings ? +_.income_savings : undefined,
      income_other: _.income_other ? +_.income_other : undefined,
      family_impacted_conflict: _.family_impacted_conflict?.split(' '),
    }) as T
}
