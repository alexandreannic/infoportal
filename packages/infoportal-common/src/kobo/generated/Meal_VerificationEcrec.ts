export namespace Meal_verificationEcrec {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aEN2tkQhpsfX4G3i6Re7bi
  export interface T {
    start: string
    end: string
    // background/back_office [select_one] 1.1 Офіс
    back_office: undefined | Option<'back_office'>
    // background/back_enum [text] 1.2 Переписувач
    back_enum: string | undefined
    calc_city: string
    calc_nlv: string
    // background/back_donor [select_one] 1.3 Проект
    back_donor: undefined | Option<'back_donor'>
    // background/reg_drc [select_one] 1.4 Ви зареєструвалися в DRC для отримання грошової допомоги для забезпечення засобів до існування?
    reg_drc: undefined | Option<'received_previous_support'>
    calc_vet: string
    calc_vet_llh: string
    // background/which_support_registered [select_one] 1.4. Для отримання якої підтримки ви були зареєстровані?
    which_support_registered: undefined | Option<'which_support_registered'>
    // background/back_consent [select_one] 1.5.1 Згода
    back_consent: undefined | Option<'received_previous_support'>
    // background/back_consen_no_reas [text] 1.5.2 Зазначте, будь ласка, причину, з якої Ви не погоджуєтеся заповнити анкету?
    back_consen_no_reas: string | undefined
    // background/pay_det_tax_id_num [text] 1.6 Ідентифікаційний номер (ІПН) бенефіціара
    pay_det_tax_id_num: string | undefined
    // background/back_consent_no_note [note] Щиро дякуємо за ваш час, ми не будемо продовжувати заповнення анкети без вашої згоди.
    back_consent_no_note: string
    // ben_det/ben_det_surname [text] 2.1 Яке ваше прізвище (як вказано в паспорті)?
    ben_det_surname: string | undefined
    // ben_det/ben_det_first_name [text] 2.2 Яке ваше ім'я (як зазначено в паспорті)?
    ben_det_first_name: string | undefined
    // ben_det/ben_det_pat_name [text] 2.3 Яке ваше по-батькові?
    ben_det_pat_name: string | undefined
    // ben_det/ben_det_ph_number [integer] 2.4 Ваш контактний номер телефону?
    ben_det_ph_number: number | undefined
    // ben_det/ben_det_age [integer] 2.4.1 Який ваш вік?
    ben_det_age: number | undefined
    // ben_det/ben_det_oblast [select_one] 2.5.1 Виберіть область, де буде проходити реєстрація
    ben_det_oblast: undefined | Option<'ben_det_oblast'>
    // ben_det/ben_det_raion [select_one] 2.5.2 Виберіть район, де буде проходити реєстрація
    ben_det_raion: undefined | string
    // ben_det/ben_det_hromada [select_one] 2.5.3 Виберіть громаду, де відбувається реєстрація
    ben_det_hromada: undefined | string
    // ben_det/ben_det_settlement [select_one_from_file] 2.5.4 Виберіть Поселення, де відбувається реєстрація
    ben_det_settlement: string
    // ben_det/ben_det_settlement_other [text] 2.5.4.1 Якщо "Інше", будь ласка, вкажіть
    ben_det_settlement_other: string | undefined
    // ben_det/ben_det_res_stat [select_one] 2.5.5 Виберіть статус проживання
    ben_det_res_stat: undefined | Option<'ben_det_res_stat'>
    // ben_det/ben_det_income [integer] 2.6 Якою була загальна вартість у гривнях усіх ресурсів, отриманих Вашим домогосподарством за останній один місяць?
    ben_det_income: number | undefined
    // ben_det/ben_det_hh_size [integer] 2.7 Кількість членів домогосподарства (включно з головою домогосподарства)
    ben_det_hh_size: number | undefined
    // cash_farmers/know_contamination_farming [select_one] Чи знаєте ви про будь-яке можливе забруднення (наприклад, боєприпасами, що не розірвалися) на землі, яку ви обробляєте?
    know_contamination_farming: undefined | Option<'know_contamination_neighbour'>
    // cash_farmers/know_contamination_neighbour [select_one] Чи знаєте ви про будь-яке можливе забруднення (наприклад, нерозірваними боєприпасами) на землі сусіда або дрібного фермера, що знаходиться поблизу?
    know_contamination_neighbour: undefined | Option<'know_contamination_neighbour'>
    // cash_farmers/know_contamination_neighbour_yes [select_one] Чи знаєте ви, що ця/ці особи все ще продовжують обробляти свою землю?
    know_contamination_neighbour_yes: undefined | Option<'know_contamination_neighbour_yes'>
    // cash_farmers/has_agriculture_exp [select_one] Сільське господарство чи фермерство є основним джерелом засобів до існування для вашої родини?
    has_agriculture_exp: undefined | Option<'received_previous_support'>
    // cash_farmers/consume_majority [select_one] Чи споживає Ваше домогосподарство значну частину того, що ви вирощуєте:
    consume_majority: undefined | Option<'received_previous_support'>
    // cash_farmers/land_own [decimal] Скільки землі у власності Вашого домогосподарства:
    land_own: number | undefined
    // cash_farmers/land_cultivate [decimal] Скільки землі обробляє Ваше домогосподарство:
    land_cultivate: number | undefined
    // cash_farmers/depend_basic_needs [select_one] Чи залежите ви від сільського господарства для задоволення своїх основних потреб?
    depend_basic_needs: undefined | Option<'received_previous_support'>
    // cash_farmers/depend_basic_needs_uhf [select_one] Чи робить сільське господарство та/або тваринництво значний внесок у те, що домогосподарство може задовольнити свої основні потреби?
    depend_basic_needs_uhf: undefined | Option<'received_previous_support'>
    // cash_farmers/not_many_livestock [note] #### 🔘 Скільки у вас є такої худоби:
    not_many_livestock: string
    // cash_farmers/many_sheep_goat [integer] Вівці/кози:
    many_sheep_goat: number | undefined
    // cash_farmers/many_milking [integer] Доїльна/лактуюча корова:
    many_milking: number | undefined
    // cash_farmers/many_cow [integer] Суха корова:
    many_cow: number | undefined
    // cash_farmers/many_cattle [integer] Велика рогата худоба
    many_cattle: number | undefined
    // cash_farmers/many_pig [integer] Свиня:
    many_pig: number | undefined
    // cash_farmers/many_poultry [integer] Свійська птиця,кролик:
    many_poultry: number | undefined
    // cash_farmers/type_assistance [select_multiple] Будь ласка, вкажіть, яку підтримку ви отримали:
    type_assistance: undefined | Option<'type_assistance'>[]
    // cash_farmers/barriers_providing_sufficient [select_one] Чи стикаєтесь ви з бар'єрами у забезпеченні достатньої кількості та якості кормів для вашої худоби?
    barriers_providing_sufficient: undefined | Option<'received_previous_support'>
    // cash_farmers/barriers_providing_sufficient_yes [text] Якщо "Так", будь ласка, вкажіть
    barriers_providing_sufficient_yes: string | undefined
    // cash_businesses/organization_business [select_one] Організаційна форма ведення бізнесу
    organization_business: undefined | Option<'organization_business_001'>
    // cash_businesses/organization_business_other [text] Якщо "Інше", будь ласка, вкажіть
    organization_business_other: string | undefined
    // cash_businesses/main_business_activities [select_multiple] Вкажіть основні види діяльності домогосподарства на сьогоднішній день
    main_business_activities: undefined | Option<'main_business_activities'>[]
    // cash_businesses/main_business_activities_other [text] Якщо "Інше", будь ласка, вкажіть
    main_business_activities_other: string | undefined
    // cash_businesses/long_business_operational [select_one] Як довго працює ваш бізнес?
    long_business_operational: undefined | Option<'long_business_operational'>
    // cash_businesses/committed_one_person_idp [select_one] Чи зобов'язуєтеся ви найняти принаймні одну людину, яка постраждала від війни, наприклад, ВПО або репатріанта?
    committed_one_person_idp: undefined | Option<'received_previous_support'>
    // vet_training/you_currently_employed [select_one] 5.1 Чи працюєте ви зараз?
    you_currently_employed: undefined | Option<'received_previous_support'>
    // vet_training/you_currently_employed_no [select_one] 5.1.1 Як довго ви були безробітним?
    you_currently_employed_no: undefined | Option<'you_currently_employed_no'>
    // vet_training/registered_training_facility [select_one] 5.2 Чи знаєте ви про зареєстрований/офіційний навчальний заклад, який наразі працює і може забезпечити таке навчання?
    registered_training_facility: undefined | Option<'received_previous_support'>
    // vet_training/registered_training_facility_yes [text] 5.2.1 Якщо так, введіть тут інформацію про навчальний центр:
    registered_training_facility_yes: string | undefined
    // vet_training/training_activities_support [select_one] 5.3 За останні 2 роки Ви брали участь у будь-яких навчальних заходах з метою перекваліфікації або переходу до іншого сектору роботи?
    training_activities_support: undefined | Option<'received_previous_support'>
    // vet_training/training_activities_support_yes_paid [select_one] 5.3.1 Хто заплатив за це навчання?
    training_activities_support_yes_paid: undefined | Option<'training_activities_support_yes_paid'>
    // vet_training/training_activities_support_yes_consequence [select_one] 5.3.2 Чи отримали Ви роботу в результаті цього навчання?
    training_activities_support_yes_consequence: undefined | Option<'received_previous_support'>
    // alt_vet_training/current_employment_situation [select_one] Як би Ви описали Вашу поточну ситуацію з працевлаштуванням?
    current_employment_situation: undefined | Option<'current_employment_situation'>
    // alt_vet_training/long_unemployed [select_one] Як довго Ви перебуваєте без роботи?
    long_unemployed: undefined | Option<'long_unemployed'>
    // alt_vet_training/interested_formally_employed [select_one] Ви вказали, що офіційно працевлаштовані, тому, будь ласка, повідомте нам основну причину, чому ви зацікавлені в подачі заявки на курс професійного навчання
    interested_formally_employed: undefined | Option<'interested_formally_employed'>
    // alt_vet_training/interested_formally_employed_other [text] Якщо «Інше», будь ласка, вкажіть
    interested_formally_employed_other: string | undefined
    // alt_vet_training/aware_training_facility_operating [select_one] Чи знаєте ви про зареєстрований/офіційний навчальний заклад, який наразі працює і може проводити таке навчання?
    aware_training_facility_operating: undefined | Option<'received_previous_support'>
    // alt_vet_training/information_training_center [text] Якщо так, введіть інформацію про навчальний центр тут
    information_training_center: string | undefined
    // alt_vet_training/know_cost_training [select_one] Чи знаєте ви загальну вартість навчання, на яке ви хотіли б записатися?
    know_cost_training: undefined | Option<'received_previous_support'>
    // alt_vet_training/cost_training [integer] Якщо так, будь ласка, вкажіть загальну вартість навчання в гривнях.
    cost_training: number | undefined
    // alt_vet_training/format_training [select_one] Який формат навчання ви обрали
    format_training: undefined | Option<'format_training'>
    // alt_vet_training/access_computer_internet [select_one] Оскільки обраний вами курс містить онлайн-компоненти, будь ласка, підтвердіть, що у вас є доступ до ноутбука/комп'ютера та підключення до Інтернету, щоб мати можливість проходити цей курс
    access_computer_internet: undefined | Option<'access_computer_internet'>
    // alt_vet_training/ability_regularly_attend [select_one] Будь ласка, підтвердіть, що ви маєте можливість регулярно відвідувати навчальні курси протягом обраного вами курсу
    ability_regularly_attend: undefined | Option<'received_previous_support'>
    // alt_vet_training/enrolled_other_training [select_one] Чи брали Ви участь у будь-якій іншій навчальній програмі протягом останніх двох років?
    enrolled_other_training: undefined | Option<'received_previous_support'>
    // alt_vet_training/who_paid_training [select_one] Хто оплачував це навчання?
    who_paid_training: undefined | Option<'who_paid_training'>
    // msme/name_business_entrepreneur [text] 6.1 Назва бізнесу
    name_business_entrepreneur: string | undefined
    // msme/address_business [text] 6.2 Адреса розташування бізнесу
    address_business: string | undefined
    // msme/business_owned_you [select_one] 6.3 Цей бізнес належить виключно вам?
    business_owned_you: undefined | Option<'received_previous_support'>
    // msme/date_registration [date] 6.4 Дата реєстрації
    date_registration: Date | undefined
    // msme/experience_business [select_one] 6.5.1 Скільки у вас досвіду ведення бізнесу в цій сфері?
    experience_business: undefined | Option<'experience_business'>
    // msme/organization_business_001 [select_one] 6.5.2 Організаційно-правова форма господарювання
    organization_business_001: undefined | Option<'organization_business_001'>
    // msme/many_people_employ [select_one] 6.6 Скільки людей у вас працює?
    many_people_employ: undefined | Option<'many_people_employ'>
    // msme/business_currently_operational [select_one] 6.7 Чи працює ваш бізнес зараз?
    business_currently_operational: undefined | Option<'received_previous_support'>
    // msme/business_main_income_household [select_one] 6.8 Чи є цей бізнес основним джерелом доходу для Вашого домогосподарства?
    business_main_income_household: undefined | Option<'received_previous_support'>
    // msme/recruiting_idp_6mout [select_one] 6.9 Чи готові ви, відповідно до умов отримання гранту на відновлення та/або розширення вашої бізнес-діяльності, працевлаштувати принаймні на 6 місяців особу, яка постраждала від конфлікту (наприклад, ВПО або людину що що повернулася)?
    recruiting_idp_6mout: undefined | Option<'received_previous_support'>
    // msme/received_any_assistance_ngo [select_one] 6.10 Чи отримував ваш бізнес будь-яку допомогу від NGO або уряду за останні два роки?
    received_any_assistance_ngo: undefined | Option<'received_previous_support'>
    // msme_bha388/business_currently_operational_bha388 [select_one] Чи працює Ваше підприємство зараз?
    business_currently_operational_bha388: undefined | Option<'received_previous_support'>
    // msme_bha388/business_currently_operational_no [text] Будь ласка, надайте додаткову інформацію, чому Ваше підприємство зараз не працює
    business_currently_operational_no: string | undefined
    // msme_bha388/reason_pause_activity [select_multiple] Будь ласка, вкажіть причину призупинення діяльності
    reason_pause_activity: undefined | Option<'reason_pause_activity'>[]
    // msme_bha388/reason_pause_activity_other [text] Якщо «Інше», будь ласка, вкажіть
    reason_pause_activity_other: string | undefined
    // msme_bha388/years_experience_business [integer] Який Ваш загальний стаж роботи в обраному Вами виді діяльності?
    years_experience_business: number | undefined
    // msme_bha388/number_employees_business [integer] Будь ласка, вкажіть кількість працівників на Вашому підприємстві
    number_employees_business: number | undefined
    // msme_bha388/income_past12 [integer] Яким був дохід від Вашої підприємницької діяльності за останні 12 місяців у гривнях?
    income_past12: number | undefined
    // msme_bha388/monthly_business_expenditure [integer] Які ваші середньомісячні витрати на ведення бізнесу в гривнях?
    monthly_business_expenditure: number | undefined
    // msme_bha388/have_debt_repayment [select_one] Чи є у вас боргові зобов'язання або зобов'язання з погашення кредиту?
    have_debt_repayment: undefined | Option<'received_previous_support'>
    // msme_bha388/repayment_debt_loan [select_one] Будь ласка, вкажіть, чи є у Вас затримка з виплатами за цим боргом або кредитом
    repayment_debt_loan: undefined | Option<'received_previous_support'>
    // msme_bha388/received_previous_support [select_one] Чи отримував ваш бізнес будь-яку раніше підтримку від уряду, неурядових організацій або інших суб'єктів?
    received_previous_support: undefined | Option<'received_previous_support'>
    // msme_bha388/who_previous_support [select_one] Хто надавав цю підтримку?
    who_previous_support: undefined | Option<'who_previous_support'>
    // msme_bha388/who_previous_support_other [text] Якщо «Інше», будь ласка, вкажіть
    who_previous_support_other: string | undefined
    // msme_bha388/amount_previous_support [integer] Якою була її сума?
    amount_previous_support: number | undefined
    // msme_bha388/when_previous_support [date] Коли вона була надана?
    when_previous_support: Date | undefined
    // msme_bha388/grant_purpose_use [select_one] Якщо Ви відповідатимете критеріям для отримання бізнес-гранту від ДРБ, на які цілі Ви плануєте його використати?
    grant_purpose_use: undefined | Option<'grant_purpose_use'>
    // fin_det/fin_det_res [text] 7.1 Інші коментарі респондента
    fin_det_res: string | undefined
    // fin_det/fin_det_enum [text] 7.2 Інші коментарі особи, яка проводила оцінювання
    fin_det_enum: string | undefined
    // fin_det/fin_det_oth_doc_im [image] 7.3 Сфотографуйте будь-який інший відповідний документ
    fin_det_oth_doc_im: string
  }
  export const options = {
    back_office: {
      lwo: `Lviv (LWO)`,
      chj: `Chernihiv (CHJ)`,
      dnk: `Dnipro (DNK)`,
      hrk: `Kharkiv (HRK)`,
      nlv: `Mykloaiv (NLV)`,
      khe: `Kherson`,
      zap: `Zaporizia`,
      umy: `Sumy(UMY)`,
    },
    undefined: {
      oleksandr_havrylov: `Олександр Гаврилов`,
      ievgen_kylymenniy: `Євген Килименний`,
      oleksandr_shmunk: `Олександр Шмунк`,
      inna_kovalchuk: `Інна Ковальчук`,
      dmytro_ivanov: `Іванов Дмитро`,
      henadii_petrychenko: `Петриченко Геннадій`,
      nadiia_yudaieva: `Юдаєва Надія`,
      dmytro_tsaruk: `Царук Дмитро`,
      viktoria_ushan: `Ушань Вікторія`,
      kostiantyn_yefimchuk: `Єфімчук Костянтин`,
      viktoriia_lytvynova: `Вікторія Литвинова`,
      valerii_vietrov: `Валерій Вєтров`,
      daria_kokalia: `Кокаля Дар'я`,
      artem_chernukha_1: `Чернуха Артем`,
      lwo_ex1: `Додатковий 1`,
      lwo_ex2: `Додатковий 1`,
      polina_prusakova: `Поліна Прусакова`,
      nlv_ex1: `Додатковий 1`,
      nlv_ex2: `Додатковий 1`,
      oleh_vyshnevskyi: `Oleh Vyshevskyi`,
      alina_bondarenko: `Alina Bondarenko`,
      serhii_dolzhenko: `Serhii Dolzhenko`,
      viktoria_klymenko: `Viktoria Klymenko`,
      andrii_zahoruyev: `Андрій Загоруєв`,
      oleh_Ivanov: `Олег Іванов`,
      karina_korzh: `Каріна Корж`,
      serhii_nevmyvaka: `Сергій Невмивака`,
      olha_osmukha: `Ольга Осьмуха`,
      halyna_diachenko: `Галина Дьяченко`,
      mariia_kozachko: `Марія Козачко`,
      dnk_ex1: `Додатковий 1`,
      dnk_ex2: `Додатковий 1`,
      yurii_volkov: `Юрій Волков`,
      andrii_zagoruiev: `Андрій Загоруєв`,
      olena_sydorenko: `Олена Сидоренко`,
      svitlana_smyrnova: `Світлана Смирнова`,
      tetiana_konovshii: `Тетяна Коновшій`,
      bohdan_taranushchenko: `Богдан Таранущенко`,
      hrk_ex1: `Додатковий 1`,
      hrk_ex2: `Додатковий 1`,
      dmytro_chernukha: `Чернуха Дмитро`,
      anastasiia_reshynska: `Анастасія Решинська`,
      nataliia_pushenko: `Пушенко Наталія`,
      tetiana_gorbatiuk: `Горбатюк Тетяна`,
      oleksandr_lukomets: `Лукомець Олександр`,
      katerina_severin: `Северін Катерина`,
      maksim_sedun: `Седун Максим`,
      chj_ex1: `Додатковий 1`,
      chj_ex2: `Додатковийv2`,
      khe_ex1: `Додатковий 1`,
      khe_ex2: `Додатковий 2`,
      khe_ex3: `Додатковий 3`,
      khe_ex4: `Додатковий 4`,
      zap_ex1: `Додатковий 1`,
      zap_ex2: `Додатковий 2`,
      zap_ex3: `Додатковий 3`,
      zap_ex4: `Додатковий 4`,
      honcharov_oleksandr: `Гончаров Олександр`,
      vceronika_kaliuzhna: `Калюжна Вероніка`,
      margaryta_pustova: `Пустова Маргарита`,
      umy_ex1: `Додатковий 1`,
      umy_ex2: `Додатковий 2`,
      umy_ex3: `Додатковий 3`,
      umy_ex4: `Додатковий 4`,
      ecrec: `MPCA`,
      prot: `A = Захист`,
      legal: `B = Юридичний`,
      shelter: `C = Відновлення житла`,
      yes: `Так;`,
      no_had_no_need_to_use_this_coping_strategy: `Ні, не було потреби використовувати цю стратегію подолання труднощів;`,
      no_have_already_exhausted_this_coping_strategy_and_cannot_use_it_again: `Ні, ми вже вичерпали цю стратегію виживання та не можемо використовувати її знову;`,
      not_applicable_this_coping_strategy_is_not_available_to_me: `Не застосовно / Для мене ця стратегія недоступна;`,
      prefer_not_to_answer: `Не хочу відповідати`,
      to_access_or_pay_for_food: `Щоб отримати доступ до або оплатити харчування;`,
      to_access_or_pay_for_healthcare: `Щоб отримати доступ до медичних послуг або ліків або або оплатити їх;`,
      to_access_or_pay_for_shelter: `Щоб отримати доступ до житла або оплатити його;`,
      to_access_or_pay_for_education: `Щоб отримати доступ до навчання або оплатити його;`,
      other: `Інше`,
      dont_know: `Не знаю`,
      hay: `Сіно`,
      concentrated_feed: `Концентровані корми`,
      mineral_blocks: `Мінеральні блоки`,
      wheat_seeds: `Насіння пшениці`,
      barley_seeds: `Насіння ячменю`,
      bricks: `Цегла`,
      wood: `Дерево`,
      plywood: `Фанера`,
      metal_panel: `Металева панель`,
      roof_panel: `Покрівельна панель`,
      cement: `Цемент`,
      nails: `Цвяхи`,
      male: `A = Чоловік`,
      female: `B = Жінка`,
      single: `A = Неодружений(-а) (ніколи не був(-ла) одружений(-а))`,
      dom_part: `B = Неодружений(-а), але живе у сімейному партнерстві`,
      married: `C = Одружений(-а)`,
      div_sep: `D = Розлучений(-а)/ проживає окремо`,
      widow: `E = Удівець/ вдова`,
      abandoned: `F = Покинутий(-а)`,
      diff_see: `A = Маєте труднощі із зором, навіть якщо носите окуляри`,
      diff_hear: `B = Маєте проблеми зі слухом, навіть якщо користуєтеся слуховим апаратом`,
      diff_walk: `C = Маєте труднощі з ходьбою або підйомом по сходах`,
      diff_rem: `D = Маєте труднощі з запам'ятовуванням або концентрацією уваги`,
      diff_care: `E = Мають труднощі з самообслуговуванням, наприклад, з миттям або одяганням`,
      diff_comm: `F = Маєте труднощі у спілкуванні, наприклад, у розумінні чи розумінні інших людей`,
      diff_none: `G = Ніщо з перерахованого вище не стосується`,
      zero: `A = Ні, труднощі відсутні`,
      one: `B = Так, є деякі труднощі`,
      two: `C = Так, багато труднощів`,
      fri: `D = Взагалі не можу(-е) робити`,
      no_damage: `Відсутність структурних пошкоджень`,
      minor_damage: `незначні пошкодження (легкі або середні пошкодження, такі як розбиті вікна та двері, незначні пошкодження даху)`,
      heavy_damage: `сильні пошкодження`,
      rent: `B = Орендувати житло`,
      host: `B = Проживання з друзями/ родиною/ стороною, яка приймає`,
      own_prop: `C = Проживання у власному житлі`,
      coll_cen: `D = Проживання у центрі тимчасового розміщення`,
      homeless: `E = Безхатній(-я)`,
      other_accom: `F = Інше`,
      secure: `A = Забезпечення на середній/ довгий строк`,
      unable_pay: `B = Зараз не в змозі сплачувати орендну плату/ платити за центр тимчасового розміщення`,
      dan_unable_pay: `C = Існує небезпека неможливості сплачувати орендну плату/ платити за центр тимчасового розміщення`,
      unsuit_accom: `D = Житло, яке не відповідає моїм потребам`,
      eviction: `E = Виселення з інших причин`,
      remain: `A = Залишатися у поточному місці`,
      not_sure: `C = Не впевнений(-а)/ не знаю`,
      always: `A = Постійно`,
      not_always: `B = Не постійно, але щодня приходить`,
      intermittent: `C = Приходить у різні дні`,
      rarely: `D = Рідко`,
      never: `E = Ніколи`,
      nat_pass_card: `A = Національний паспорт (карта)`,
      nat_pass_book: `B = Національний паспорт (книжка)`,
      nat_pass_diia: `C = Національний паспорт (додаток Дія)`,
      pass_ussr_red: `D = Паспорт (Червона книга СРСР)`,
      pass_int: `E = Закордонний паспорт`,
      birth_certificate: `F = Свідоцтво про народження`,
      driver_lic: `G = Водійські права`,
      pen_cert: `H = Посвідчення пенсіонера`,
      oth_id: `I = Інша форма ідентифікатора`,
      no_id: `J = Немає іншого типу`,
      raiff_trans: `A = Переказ через «Райффайзен Банк АВАЛЬ»`,
      ukrpost: `B = Укрпошта`,
      bank_card: `C = Банківська картка`,
      other_pay: `D = Інший спосіб оплати`,
      none_pay: `E = Жодний з перелічених способів мені не підходить`,
      agricul: `Сільське господарство та/або тваринництво`,
      grocery: `Продукти, магазин`,
      smalls: `Невеликий магазин/кіоск`,
      carpentry: `Столярні, різьбярські або деревообробні роботи`,
      mechanic: `Механіка`,
      plumber: `Сантехнік`,
      electrical: `Електромонтажні роботи`,
      construct: `Будівельні роботи`,
      textiel: `Текстиль та пошиття одягу`,
      education: `Освітній центр`,
      heath: `Оздоровчий центр`,
      manufacturing: `Виробництво / робота на заводі`,
      computer: `Комп'ютер, технології`,
      administration: `Адміністрування,`,
      graphic: `Графічний дизайн`,
      transport: `Транспортне обслуговування`,
      hairdressing: `Перукарня/барбер`,
      pscoffe: `Надання послуг (наприклад, кава/чай, невеликий ресторан, кулінарія тощо)`,
      pscleaning: `Надання послуг (прибирання, охорона)`,
      ngo: `НУО / агенції ООН`,
      government: `Уряд`,
      seeds: `Насіння`,
      fertilizers: `Добрива`,
      irrigationp: `Зрошувальні труби (краплинні лінії)`,
      fuel: `Паливо (для сільськогосподарської техніки)`,
      agriculser: `Сільськогосподарські послуги (тракторний сервіс, збір врожаю)`,
      livestock: `Тваринництво (кури, свині, корови тощо)`,
      agricultool: `Сільськогосподарські інструменти (лопата, граблі тощо)`,
      livestockf: `Корми для худоби`,
      buildingm: `Будівельні матеріали,`,
    },
    back_donor: {
      uhf6: `UHF-6`,
      uhf7: `UHF-7`,
      uhf8: `UHF-8`,
      bha_llh_348: `BHA – LLH 348`,
      ukr000388_bha: `BHA-388`,
      danish_mfa_355: `Danish MFA 355`,
    },
    which_support_registered: {
      scf_iap: `Sectoral Cash for Farmers [Improving Agricultural Production]`,
      scfb_lr: `Sectoral Cash for Businesses [Livelihood Restoration]`,
      vet_training: `VET training for New Livelihood Development`,
      msme: `MSME Sectoral Cash for Businesses [Livelihood Restoration]`,
    },
    received_previous_support: {
      yes: `Так`,
      no: `Ні`,
    },
    know_contamination_neighbour: {
      yes: `Так`,
      no: `Ні`,
      unwilling: `Не бажають або не можуть відповісти`,
    },
    type_assistance: {
      cfas: `Готівка для притулку для тварин`,
      cfaf: `Готівка на корм для тварин`,
    },
    organization_business_001: {
      private_entrepreneur: `Приватний підприємець`,
      private_enterprise: `Приватне підприємство`,
      limited_company: `Товариство з обмеженою відповідальністю (ТОВ)`,
      farming_enterprise: `Фермерське господарство`,
      collective_enterprise: `Колективне підприємство`,
      other: `Інше`,
    },
    main_business_activities: {
      agro_processing: `Переробка сільськогосподарської продукції`,
      agriculture: `Сільське господарство (рослинництво та/або тваринництво)`,
      transport_services: `Транспортні послуги`,
      construction_Construction: `Будівництво`,
      food_services: `Харчові послуги`,
      electrical: `Електрика`,
      mechanics: `Механіка`,
      plumber: `Сантехнік`,
      petty_trade: `Дрібна торгівля`,
      retail_trade: `Роздрібна та оптова торгівля`,
      sewing_repair: `Пошиття / ремонт взуття`,
      small_manufacturing: `Мале виробництво`,
      hairdressing_barber: `Перукарня/барбер`,
      it: `ІТ`,
      other: `Інше`,
    },
    long_business_operational: {
      under_two: `До двох років`,
      over_two: `Більше двох років`,
    },
    you_currently_employed_no: {
      '0_3_mounths': `0-3 місяці`,
      '3_6_mounths': `3-6 місяців`,
      '6_12_mounths': `6-12 місяців`,
      '12_more_mounths': `12+ місяців`,
    },
    training_activities_support_yes_paid: {
      state_service: `Державна служба`,
      non_international: `Неурядова організація [міжнародна]`,
      non_national: `Неурядова організація [національна]`,
      private_actor: `Представник приватного сектору`,
    },
    experience_business: {
      one_two_years: `1-2 роки`,
      three_five_years: `3-5 років`,
      more_five_years: `5+ років`,
    },
    many_people_employ: {
      '0_5_people': `0-5 осіб`,
      '5_10_people': `5-10 осіб`,
      '10_15_people': `10-15 осіб`,
      '15_20_people': `15-20 осіб`,
      '20_more_people': `20+ осіб`,
    },
    know_contamination_neighbour_yes: {
      still: `Досі обробляє цю землю`,
      partially: `Частково обробляє землю`,
      stopped: `Припинили обробляти цю землю`,
      uu: `Не можу/не хочу відповісти`,
    },
    current_employment_situation: {
      unemployed: `Безробітний/а`,
      formally_employed: `Офіційно працевлаштований/а`,
      informaly_employed: `Неофіційно працевлаштований/а`,
    },
    long_unemployed: {
      less_3m: `0-3 місяці`,
      '3_6m': `3-6 місяців`,
      '6_12m': `6-12 місяців`,
      more_12m: `12+ місяців`,
    },
    interested_formally_employed: {
      work_part_time: `Я працюю неповний робочий день/частково і хочу працювати на повну ставку`,
      salary_minimum_wage: `Я отримую зарплату нижче мінімальної`,
      limited_prospects_progression: `Маю обмежені перспективи кар'єрного зростання`,
      job_uncertain_prospects: `Маю роботу з невизначеними перспективами`,
      other: `Інше`,
    },
    access_computer_internet: {
      yes: `Так`,
      no: `Ні`,
      not_relevant: `Не актуально`,
    },
    who_paid_training: {
      state_sevice: `Державна служба`,
      international_ngo: `Неурядова організація (міжнародна)`,
      national_ngo: `Неурядова організація (національна)`,
      private_sector_actor: `Суб'єкт приватного сектору`,
      private_person: `Приватна особа`,
    },
    format_training: {
      online: `Онлайн`,
      offline: `Офлайн`,
      mixed: `Змішаний`,
    },
    reason_pause_activity: {
      relocation_business: `Географічне переміщення бізнесу`,
      mine_contamination: `Мінне забруднення`,
      damaged_assets: `Пошкодження або знищення активів внаслідок обстрілів`,
      other: `Інше`,
    },
    who_previous_support: {
      government: `Уряд`,
      ngo: `Неурядова організація`,
      other: `Інше`,
    },
    grant_purpose_use: {
      restoration: `Відновлення бізнесу`,
      continuation: `Продовження бізнесу`,
      expansion: `Розширення бізнесу`,
    },
    ben_det_oblast: {
      cherkaska: `Черкаська`,
      chernihivska: `Чернігівська`,
      chernivetska: `Чернівецька`,
      dnipropetrovska: `Дніпропетровська`,
      donetska: `Донецька`,
      'ivano-frankivska': `Івано-Франківська`,
      kharkivska: `Харківська`,
      khersonska: `Херсонська`,
      khmelnytska: `Хмельницька`,
      kirovohradska: `Кіровоградська`,
      kyivska: `Київська`,
      luhanska: `Луганська`,
      lvivska: `Львівська`,
      mykolaivska: `Миколаївська`,
      odeska: `Одеська`,
      poltavska: `Полтавська`,
      rivnenska: `Рівненська`,
      sevastopilska: `Севастопільська`,
      sumska: `Сумська`,
      ternopilska: `Тернопільська`,
      vinnytska: `Вінницька`,
      volynska: `Волинська`,
      zakarpatska: `Закарпатська`,
      zaporizka: `Запорізька`,
      zhytomyrska: `Житомирська`,
    },
    ben_det_res_stat: {
      idp: `A = Внутрішньо-переміщена особа (ВПО)`,
      long_res: `B = Довгостроковий мешканець`,
      ret: `C = Особа, яка повернулася`,
      ref_asy: `D = Біженець/особа, що потребує прихистку`,
    },
  } as const

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
      ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
      ben_det_age: _.ben_det_age ? +_.ben_det_age : undefined,
      ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
      ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
      many_sheep_goat: _.many_sheep_goat ? +_.many_sheep_goat : undefined,
      many_milking: _.many_milking ? +_.many_milking : undefined,
      many_cow: _.many_cow ? +_.many_cow : undefined,
      many_cattle: _.many_cattle ? +_.many_cattle : undefined,
      many_pig: _.many_pig ? +_.many_pig : undefined,
      many_poultry: _.many_poultry ? +_.many_poultry : undefined,
      type_assistance: _.type_assistance?.split(' '),
      main_business_activities: _.main_business_activities?.split(' '),
      cost_training: _.cost_training ? +_.cost_training : undefined,
      date_registration: _.date_registration ? new Date(_.date_registration) : undefined,
      reason_pause_activity: _.reason_pause_activity?.split(' '),
      years_experience_business: _.years_experience_business ? +_.years_experience_business : undefined,
      number_employees_business: _.number_employees_business ? +_.number_employees_business : undefined,
      income_past12: _.income_past12 ? +_.income_past12 : undefined,
      monthly_business_expenditure: _.monthly_business_expenditure ? +_.monthly_business_expenditure : undefined,
      amount_previous_support: _.amount_previous_support ? +_.amount_previous_support : undefined,
      when_previous_support: _.when_previous_support ? new Date(_.when_previous_support) : undefined,
    }) as T
}
