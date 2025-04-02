export namespace Ecrec_msmeGrantEoi {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: awYf9G3sZB4grG8S4w3Wt8
  export interface T {
    start: string
    end: string
    // background/date [date] Дата
    date: Date | undefined
    // background/coaching_completed_date [date] Дата завершення тренування
    coaching_completed_date: Date | undefined
    // background/oblast_business [select_one] Область, де розташований ваш бізнес
    oblast_business: undefined | Option<'ben_det_prev_oblast'>
    // background/not_induc_lviv [note] Данська рада у справах біженців (DRC) є однією з найбільших міжнародних гуманітарних організацій Європи. Представництво в Україні було відкрите у 2014 році, а у 2022-му DRC значно масштабувала свою діяльність у відповідь на гуманітарну кризу, викликану війною. Нині DRC надає допомогу постраждалим від війни та переміщення по всій країні.  Щоб підтримати створення нових бізнесів, додаткових робочих місць та покращити можливості працевлаштування внутрішньо переміщених осіб у Дрогобицькому та Стрийському районах Львівської області, DRC запускає нову програму підтримки для бізнесів та підприємців.    Програма передбачає надання бізнес-грантів для створення або відновлення бізнесу (до 5000 євро).   #####Хто може отримати допомогу:  Приймаємо заявки від діючих та майбутніх підприємців, які планують розпочати власну справу, маючи чітку бізнес-- ідею. Програма діє лише у Дрогобицькому та Стрийському районах Львівської області.   У пріоритеті підприємства та ФОПи, які відчули негативні наслідки війни та планують реалізовувати чи виробляти товари або надавати послуги для покриття базових потреб населення.   #####Грант може піти на покриття різноманітних витрат:    придбання обладнання;   оплата оренди приміщення;  відновлення раніше діючого бізнесу;  інші актуальні потреби бізнесу.   #####Початкові критерії відбору:  місцеві та внутрішньо переміщені особи, які проживають та планують розвивати свій бізнес у Дрогобицькому та Стрийському районі;  особи, які вже мають діючий бізнес та планують його розширювати відкриваючи нові робочі місця для внутрішньо переміщених осіб;  особи, які планують створювати власну справу маючи чіткі бізнес-ідеї;  особи, які досягли 18-річного віку;  взяти участь у проєкті від однієї сім’ї може лише одна особа.   #####Умови участі:    Потрібно заповнити аплікаційну форму.  Після подання заявниками аплікаційної форми, команда DRC розгляне їх та відбере осіб, що відповідають критеріям відбору.  Переможцям відбору буде запропоновано укласти з DRC угоду про надання бізнес-гранту.  У встановлені терміни вам потрібно надати звіт про те, як отримані кошти були використані на цілі, визначені програмою та відповідним договором.   ####КІНЦЕВИЙ ТЕРМІН ПОДАННЯ АПЛІКАЦІЙНОЇ ФОРМИ: 05 липня 2024 р.   Ваші звернення та скарги направляйте на пошту: UKR-feedback@drc.ngo або телефонуйте 0 800 33 95 18 (пн-пт 9:00-17:00).
    not_induc_lviv: string
    // background/back_consent_lviv [select_one] Згода
    back_consent_lviv: undefined | Option<'business_plan_submitted'>
    // background/not_induc [note] Ця програма має на меті допомогти малим та середнім підприємствам та підприємцям подолати наслідки війни. Ми прагнемо застосувати найкращі бізнес-практики, щоб підприємства та підприємці могли підвищити свою продуктивність та ефективність. Крім того, ціллю програми є створення робочих місць для людей, які постраждали від конфлікту. Данська рада у справах біженців приймає заявки від підприємств та підприємців, розташованих у Дніпропетровській, Херсонській, Миколаївській та Запорізькій областях.
    not_induc: string
    // background/back_consent [select_one] Згода
    back_consent: undefined | Option<'business_plan_submitted'>
    // background/back_consen_no_reas [text] Вкажіть, будь ласка, причину, з якої Ви не погоджуєтеся заповнити анкету?
    back_consen_no_reas: string | undefined
    // background/back_consent_no_note [note] Щиро дякуємо за ваш час, ми не будемо продовжувати заповнення анкети без вашої згоди.
    back_consent_no_note: string
    // ben_det/ben_det_surname [text] 2.1 Ваше прізвище (як вказано в паспорті)?
    ben_det_surname: string | undefined
    // ben_det/ben_det_first_name [text] 2.2 Ваше ім'я (як зазначено в паспорті)?
    ben_det_first_name: string | undefined
    // ben_det/ben_det_pat_name [text] 2.3 По батькові?
    ben_det_pat_name: string | undefined
    // ben_det/ben_det_oblast [select_one] 2.4.1 Оберіть область, де розташований ваш бізнес
    ben_det_oblast: undefined | Option<'ben_det_prev_oblast'>
    // ben_det/ben_det_raion [select_one] 2.4.2 Оберіть район, де розташовани  ваш бізнес
    ben_det_raion: undefined | string
    // ben_det/ben_det_hromada [select_one] 2.4.3 Оберіть громаду, в якій розташований ваш бізнес
    ben_det_hromada: undefined | string
    // ben_det/ben_det_res_stat [select_one] 2.5 Будь ласка, оберіть свій статус проживання
    ben_det_res_stat: undefined | Option<'ben_det_res_stat'>
    // ben_det/ben_det_res_stat_other [text] 2.5.1 Якщо "Інше", будь ласка, вкажіть
    ben_det_res_stat_other: string | undefined
    // ben_det/ben_det_prev_oblast [select_one] 2.5.2 З якого регіону ви переїхали? (Виберіть область)
    ben_det_prev_oblast: undefined | Option<'ben_det_prev_oblast'>
    // ben_det/ben_det_prev_oblast_other [text] 2.5.2.1 Якщо "Інше", будь ласка, вкажіть
    ben_det_prev_oblast_other: string | undefined
    // ben_det/ben_det_gender [select_one] 2.6 Ваша стать?
    ben_det_gender: undefined | Option<'hh_char_hh_det_gender'>
    // ben_det/ben_det_age [integer] 2.7 Ваш вік?
    ben_det_age: number | undefined
    // ben_det/ben_det_ph_number [integer] 2.8 Ваш контактний номер телефону?
    ben_det_ph_number: number | undefined
    // ben_det/ben_det_email [text] 2.9 Ваша електронна адреса для зворотнього зв'язку?
    ben_det_email: string | undefined
    // ben_det/ben_det_tax_id_num [text] 2.10 Ваш ідентифікаційний номер (ІПН)
    ben_det_tax_id_num: string | undefined
    // ben_det/ben_enterprise_tax_id [text] 2.11 Код ЄДРПОУ / або ІПН якщо ви ФОП
    ben_enterprise_tax_id: string | undefined
    // ben_det/ben_det_hh_size [integer] 2.12 Кількість членів домогосподарства (включно з вами)
    ben_det_hh_size: number | undefined
    // hh_char/info [note] Інформація про першого члена домогосподарства має бути власником бізнесу
    info: string
    // hh_char/hh_char_hh_det [begin_repeat] 3.1  Члени домогосподарства
    hh_char_hh_det:
      | {
          hh_char_hh_det_gender: undefined | Option<'hh_char_hh_det_gender'> | undefined
          hh_char_hh_det_age: number | undefined | undefined
          hh_char_hh_det_dis_select: undefined | Option<'hh_char_hh_det_dis_select'>[] | undefined
          hh_char_hh_det_dis_level: undefined | Option<'hh_char_hh_det_dis_level'> | undefined
          calc_u18: string | undefined
          calc_o60: string | undefined
          calc_ed_age: string | undefined
          calc_baby_age: string | undefined
          calc_preg: string | undefined
          calc_det_dis_level: string | undefined
        }[]
      | undefined
    calc_tot_chi: string
    calc_tot_ed_age: string
    calc_tot_eld: string
    calc_dis_level: string
    // hh_char/head_your_household [select_one] 3.2 Ви є головою домогосподарства?
    head_your_household: undefined | Option<'business_plan_submitted'>
    // hh_char/hh_char_civ_stat [select_one] 3.2 Який цивільно-правовий статус голови домогосподарства?
    hh_char_civ_stat: undefined | Option<'hh_char_civ_stat'>
    calc_char_civ_stat: string
    // hh_char/hh_char_preg [select_one] 3.3 Хтось із жінок у вашому домогосподарстві вагітний або годує грудьми?
    hh_char_preg: undefined | Option<'business_plan_submitted'>
    // hh_char/hh_char_chh [note] Це домогосподарство, яке очолює дитина (випадок захисту з високим рівнем ризику), будь ласка, негайно зверніться до відділу із захисту дітей.
    hh_char_chh: string
    // business_details/name_business_entrepreneur [text] 4.1 Назва бізнесу
    name_business_entrepreneur: string | undefined
    // business_details/address_business [text] 4.2 Адреса розташування бізнесу
    address_business: string | undefined
    // business_details/business_owned_you [select_one] 4.3 Цей бізнес належить виключно вам?
    business_owned_you: undefined | Option<'business_plan_submitted'>
    // business_details/business_owned_you_partner [select_one] 4.3.1 Чи є у вас партнер(и)?
    business_owned_you_partner: undefined | Option<'business_plan_submitted'>
    // business_details/date_registration [date] 4.4 Дата реєстрації
    date_registration: Date | undefined
    // business_details/experience_business [select_one] 4.5.1 Скільки у вас досвіду ведення бізнесу в цій сфері?
    experience_business: undefined | Option<'experience_business'>
    // business_details/organization_business [select_one] 4.5.2 Організаційно-правова форма господарювання
    organization_business: undefined | Option<'organization_business'>
    // business_details/organization_business_other [text] 4.5.1 Якщо "Інше", будь ласка, вкажіть
    organization_business_other: string | undefined
    // business_details/many_people_employ [select_one] 4.6 Скільки людей у вас працює?
    many_people_employ: undefined | Option<'many_people_employ'>
    // business_details/business_currently_operational [select_one] 4.7 Чи працює ваш бізнес зараз?
    business_currently_operational: undefined | Option<'business_plan_submitted'>
    // business_details/long_business_operation [select_one] 4.7.1.1 Як довго працює ваш бізнес?
    long_business_operation: undefined | Option<'long_business_operation'>
    // business_details/staus_business_operation [select_one] 4.7.1.2 Який його статус?
    staus_business_operation: undefined | Option<'staus_business_operation'>
    // business_details/business_currently_operational_no [text] 4.7.2.1 Чому ваш бізнес зараз не працює?
    business_currently_operational_no: string | undefined
    // business_details/main_business_activities [select_multiple] 4.8 Вкажіть основні напрямки діяльності вашого бізнесу на сьогоднішній день
    main_business_activities: undefined | Option<'main_business_activities'>[]
    // business_details/main_business_activities_other [text] 4.8.1 Якщо "Інше", будь ласка, вкажіть
    main_business_activities_other: string | undefined
    // business_details/current_monthly_business [integer] 4.9 Який річний дохід вашого бізнесу?
    current_monthly_business: number | undefined
    // business_details/ben_det_income [integer] 4.11 Яка загальна сума усіх надходжень, отриманих Вашим домогосподарством за останній місяць у гривнях?
    ben_det_income: number | undefined
    // business_details/who_buyers_products [text] 4.12 Хто є покупцями Вашої продукції / замовниками Ваших послуг?
    who_buyers_products: string | undefined
    // business_details/business_main_income_household [select_one] 4.13 Чи є цей бізнес основним джерелом доходу для Вашого домогосподарства?
    business_main_income_household: undefined | Option<'business_plan_submitted'>
    // business_details/major_income_family [text] 4.13.1 Вкажіть, будь ласка, основне джерело доходу Вашої сім'ї?
    major_income_family: string | undefined
    // business_details/principal_means_production [text] 4.14 Якими основними активами володіє ваше підприємство? (наприклад, нерухомість, транспортні засоби, обладнання)
    principal_means_production: string | undefined
    // business_details/basic_means_production [text] 4.15 Орендовані основні засоби виробництва (нерухомість, транспортні засоби, обладнання).
    basic_means_production: string | undefined
    // business_details/major_barriers_business [select_multiple] 4.14 Які основні бар'єри для відновлення та/або розширення Вашого бізнесу?
    major_barriers_business: undefined | Option<'major_barriers_business'>[]
    // business_details/major_barriers_business_other [text] 4.16.1 Якщо "Інше", будь ласка, вкажіть
    major_barriers_business_other: string | undefined
    // business_details/barrier_escalation_conflict [select_one] 4.17 Чи був цей бар'єр створений ескалацією конфлікту?
    barrier_escalation_conflict: undefined | Option<'barrier_escalation_conflict'>
    // business_details/significant_mentorship_needs [select_multiple] 4.18 У яких напрямках вашої підприємницької діяльності ви відчуваєте найбільшу потребу в консультативній підтримці, щоб відновити або розширити вашу справу?
    significant_mentorship_needs: undefined | Option<'significant_mentorship_needs'>[]
    // business_details/significant_mentorship_needs_other [text] 4.19.1 Якщо "Інше", будь ласка, вкажіть
    significant_mentorship_needs_other: string | undefined
    // business_details/recruiting_idp_6mout [select_one] 4.20 Чи готові ви, відповідно до умов отримання гранту на відновлення та/або розширення вашої бізнес-діяльності, працевлаштувати принаймні на 6 місяців особу, яка постраждала від конфлікту (наприклад, ВПО або людину що що повернулася)?
    recruiting_idp_6mout: undefined | Option<'business_plan_submitted'>
    // business_details/business_plan_grant [select_one] 4.21 Чи є у вас бізнес-план на суму гранту, яку ви отримаєте?
    business_plan_grant: undefined | Option<'business_plan_submitted'>
    // business_details/plan_inoformed_market_research [select_one] 4.21.1 Чи ваш бізнес-план ґрунтувався на маркетингових дослідженнях?
    plan_inoformed_market_research: undefined | Option<'business_plan_submitted'>
    // business_details/received_any_assistance_ngo [select_one] 4.22 Чи отримував ваш бізнес будь-яку допомогу від NGO або уряду за останні два роки?
    received_any_assistance_ngo: undefined | Option<'business_plan_submitted'>
    // business_details/recruiting_person_idp [select_one] 4.22a Чи готові ви створити додаткове робоче місце для людини яка постраждала від війни (наприклад, ВПО або людину, яка повернулася), якщо отримаєте грант?
    recruiting_person_idp: undefined | Option<'business_plan_submitted'>
    // business_details/skills_currently_labour_market [text] 4.23 Виходячи з вашого власного досвіду та знання місцевої економіки, які навички зараз найбільш затребувані на ринку праці?
    skills_currently_labour_market: string | undefined
    // fin_det/fin_det_res [text] 5.1 Чи є ще якісь коментарі або інформація, якою ви хотіли б поділитися?
    fin_det_res: string | undefined
    // fin_det/source_hear_programme [select_one] 5.2 З якого джерела ви дізналися про нашу програму?
    source_hear_programme: undefined | Option<'source_hear_programme'>
    // fin_det/source_hear_programme_other [text] 5.2.1 Якщо "Інше", будь ласка, вкажіть
    source_hear_programme_other: string | undefined
    // fin_det/business_plan_submitted [select_one] 5.3 Поданий бізнес-план?
    business_plan_submitted: undefined | Option<'business_plan_submitted'>
    // fin_det/business_plan_submitted_comment [text] 5.3.1 Коментарі
    business_plan_submitted_comment: string | undefined
  }
  export const options = {
    undefined: {
      lwo: `Lviv (LWO)`,
      chj: `Chernihiv (CHJ)`,
      dnk: `Dnipro (DNK)`,
      hrk: `Kharkiv (HRK)`,
      nlv: `Mykloaiv (NLV)`,
      khe: `Kherson`,
      zap: `Zaporizia`,
      umy: `Sumy(UMY)`,
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
      nataliia_lanina: `Наталія Ланіна`,
      nikita_zubenko: `Нікіта Зубенко`,
      mykola_marchenko: `Микола Марченко`,
      olena_suhoniak: `Олена Сугоняк`,
      oleksii_marchenko: `Олексій Марченко`,
      svitlana_labunska: `Світлана Лабунська`,
      nlv_ex1: `Додатковий 1`,
      nlv_ex2: `Додатковий 1`,
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
      maksym_mykytas: `Максим Микитась`,
      vita_zolotarevska: `Віта Золотаревська`,
      olha_sakharnova: `Ольга Сахарнова`,
      andrii_matvieiev: `Андрій Матвєєв`,
      sofiia_berezhna: `Софія Бережна`,
      illia_kutsenko: `Ілля Кутценко`,
      dnk_ex1: `Додатковий 1`,
      dnk_ex2: `Додатковий 1`,
      yurii_volkov: `Юрій Волков`,
      andrii_zagoruiev: `Андрій Загоруєв`,
      olena_sydorenko: `Олена Сидоренко`,
      svitlana_smyrnova: `Світлана Смирнова`,
      tetiana_konovshii: `Тетяна Коновшій`,
      bohdan_taranushchenko: `Богдан Таранущенко`,
      olena_buglo: `Олена Бугло`,
      vitalii_shapoval: `Віталій Шаповал`,
      hrk_ex1: `Додатковий 1`,
      hrk_ex2: `Додатковий 1`,
      dmytro_chernukha: `Чернуха Дмитро`,
      anastasiia_reshynska: `Анастасія Решинська`,
      nataliia_pushenko: `Пушенко Наталія`,
      tetiana_gorbatiuk: `Горбатюк Тетяна`,
      oleksandr_lukomets: `Лукомець Олександр`,
      katerina_severin: `Северін Катерина`,
      maksim_sedun: `Седун Максим`,
      surzhyk_oleksandr: `Суржик Олександр`,
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
      inna_mishchenko: `Інна Міщенко`,
      umy_ex1: `Додатковий 1`,
      umy_ex2: `Додатковий 2`,
      umy_ex3: `Додатковий 3`,
      umy_ex4: `Додатковий 4`,
      ukr000348_bha: `BHA (UKR-000348)`,
      prot: `A = Захист`,
      legal: `B = Юридичний`,
      shelter: `C = Відновлення житла`,
      yes: `Так;`,
      no_had_no_need_to_use_this_coping_strategy: `Ні, не було потреби використовувати цю стратегію подолання труднощів;`,
      no_have_already_exhausted_this_coping_strategy_and_cannot_use_it_again: `Ні, ми вже вичерпали цю стратегію виживання та не можемо використовувати її знову;`,
      not_applicable_this_coping_strategy_is_not_available_to_me: `Не застосовно / Для мене ця стратегія недоступна;`,
      prefer_not_to_answer: `Не хочу відповідати`,
    },
    business_plan_submitted: {
      yes: `A = Так`,
      no: `B = Ні`,
    },
    ben_det_res_stat: {
      idp: `A = Внутрішньо-переміщена особа (ВПО)`,
      long_res: `B = Довгостроковий мешканець`,
      ret: `C = Особа, яка повернулася`,
      ref_asy: `D = Біженець/особа, що потребує прихистку`,
      other: `Інший`,
    },
    hh_char_hh_det_gender: {
      male: `A = Чоловік`,
      female: `B = Жінка`,
    },
    hh_char_civ_stat: {
      single: `A = Неодружений(-а) (ніколи не був(-ла) одружений(-а))`,
      dom_part: `B = Неодружений(-а), але живе у сімейному партнерстві`,
      married: `C = Одружений(-а)`,
      div_sep: `D = Розлучений(-а)/ проживає окремо`,
      widow: `E = Удівець/ вдова`,
    },
    hh_char_hh_det_dis_select: {
      diff_see: `A = Маєте труднощі із зором, навіть якщо носите окуляри`,
      diff_hear: `B = Маєте проблеми зі слухом, навіть якщо користуєтеся слуховим апаратом`,
      diff_walk: `C = Маєте труднощі з ходьбою або підйомом по сходах`,
      diff_rem: `D = Маєте труднощі з запам'ятовуванням або концентрацією уваги`,
      diff_care: `E = Мають труднощі з самообслуговуванням, наприклад, з миттям або одяганням`,
      diff_comm: `F = Маєте труднощі у спілкуванні, наприклад, у розумінні чи розумінні інших людей`,
      diff_none: `G = Ніщо з перерахованого вище не стосується`,
    },
    hh_char_hh_det_dis_level: {
      zero: `A = Ні, труднощі відсутні`,
      one: `B = Так, є деякі труднощі`,
      two: `C = Так, багато труднощів`,
      fri: `D = Взагалі не можу(-е) робити`,
    },
    organization_business: {
      private_entrepreneur: `Фізична особа — підприємець`,
      private_enterprise: `Приватне підприємство`,
      limited_company: `Товариство з обмеженою відповідальністю (ТОВ)`,
      farming_enterprise: `Фермерське господарство`,
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
      sewing_repair: `Пошиття/ремонт одягу та взуття`,
      small_manufacturing: `Мале виробництво`,
      hairdressing_barber: `Перукарня/барбер`,
      it: `ІТ`,
      other: `Інше`,
    },
    long_business_operation: {
      under_two: `До двох років`,
      over_two: `Більше двох років`,
    },
    many_people_employ: {
      '0_5_people': `0-5 осіб`,
      '5_10_people': `5-10 осіб`,
      '10_15_people': `10-15 осіб`,
      '15_20_people': `15-20 осіб`,
      '20_more_people': `20+ осіб`,
    },
    major_barriers_business: {
      access_finance: `Доступ до фінансування`,
      skills_work: `Розрив у навичках робочої сили`,
      lack_skilled: `Нестача кваліфікованої робочої сили`,
      increased_prices: `Зростання цін на сировину та матеріали`,
      infrastructure_disruptions: `Інфраструктурні та/або транспортні проблеми`,
      market_access: `Доступ до ринку та конкуренція`,
      legal_regulatory_environment: `Правове та регуляторне середовище`,
      instability_concerns: `Нестабільність/занепокоєння щодо безпеки`,
      lack_support: `Відсутність підтримки розвитку бізнесу`,
      lack_equipment: `Нестача обладнання`,
      limited_business_activities: `Обмежена ділова активність`,
      destruction_damage_equipment: `Руйнування/пошкодження приміщень та/або обладнання`,
      other: `Інше`,
    },
    significant_mentorship_needs: {
      business_stratege_development: `Розробка бізнес-стратегії`,
      financial_management: `Фінансовий менеджмент`,
      marketing_sales: `Маркетинг та продажі`,
      operational_efficiency: `Оптимізація процесів`,
      human_resourse: `Людські ресурси`,
      technology_adoption: `Впровадження технологій`,
      legal_regulatory_compliance: `Дотримання правових та регуляторних норм`,
      industry_connections: `Нетворкінг та галузеві зв'язки`,
      leadership_management: `Лідерство та управління`,
      adaptation_change: `Адаптація до змін`,
      customer_relationship: `Управління взаємовідносинами з клієнтами`,
      social_responsibility: `Соціальна відповідальність та сталий розвиток`,
      other: `Інше`,
    },
    staus_business_operation: {
      fully: `Повністю в робочому стані`,
      partially: `Частково працює`,
    },
    barrier_escalation_conflict: {
      yes: `Так`,
      no: `Ні`,
      partially: `Частково`,
    },
    source_hear_programme: {
      drc_staff: `Персонал DRC`,
      local_authorities: `Місцеві органи влади`,
      employment_centre: `Центр зайнятості`,
      other: `Інші`,
    },
    experience_business: {
      one_two_years: `1-2 роки`,
      three_five_years: `3-5 років`,
      more_five_years: `5+ років`,
    },
    ben_det_prev_oblast: {
      dnipropetrovska: `Дніпропетровська`,
      donetska: `Донецька`,
      zaporizka: `Запорізька`,
      luhanska: `Луганська`,
      mykolaivska: `Миколаївська`,
      odeska: `Одеська`,
      kharkivska: `Харківська`,
      khersonska: `Херсонська`,
      lvivska: `Львівська`,
      chernihivska: `Чернігівська`,
      sumska: `Сумська`,
      other: `Інша`,
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
      date: _.date ? new Date(_.date) : undefined,
      coaching_completed_date: _.coaching_completed_date ? new Date(_.coaching_completed_date) : undefined,
      ben_det_age: _.ben_det_age ? +_.ben_det_age : undefined,
      ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
      ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
      hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
        _['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
        _['hh_char_hh_det_dis_select'] = _.hh_char_hh_det_dis_select?.split(' ')
        return _
      }),
      date_registration: _.date_registration ? new Date(_.date_registration) : undefined,
      main_business_activities: _.main_business_activities?.split(' '),
      current_monthly_business: _.current_monthly_business ? +_.current_monthly_business : undefined,
      ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
      major_barriers_business: _.major_barriers_business?.split(' '),
      significant_mentorship_needs: _.significant_mentorship_needs?.split(' '),
    }) as T
}
