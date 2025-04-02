export namespace Ecrec_msmeGrantSelection {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aQkWZkWjVpJsqZ3tYtuwFZ
  export interface T {
    start: string
    end: string
    // date_payment [date] Дата оплати
    date_payment: Date | undefined
    // not_beginning [note] Дякуємо за інтерес до нашої програмі, що реалізується за підтримки Бюро з гуманітарної допомоги (BHA) Агентства США з міжнародного розвитку (USAID). Ця анкета допоможе нам оцінити ваш бізнес-план та визначити його відповідність критеріям грантової програми підтримки малого і середнього бізнесу. Заповнення анкети займе декілька хвилин. Будь ласка, надайте вичерпні та достовірні відповіді на всі питання. Дякуємо за ваш час!
    not_beginning: string
    // date [date] Дата
    date: Date | undefined
    // ben_first_name [text] Ім'я
    ben_first_name: string | undefined
    // ben_first_patr [text] По батькові
    ben_first_patr: string | undefined
    // ben_last_name [text] Прізвище
    ben_last_name: string | undefined
    // lh_restoration_id [text] Livelihoods Restoration / Програма екстреної підтримки малого та середнього бізнесу  ID
    lh_restoration_id: string | undefined
    // business_details/interest_number [text] Номер форми вираження зацікавленості
    interest_number: string | undefined
    // business_details/name_business [text] Яка назва вашого бізнесу відповідно до державного реєстру?
    name_business: string | undefined
    // business_details/nol_location [note] #####Де розташований ваш бізнес?
    nol_location: string
    // business_details/ben_det_oblast [select_one] Область
    ben_det_oblast: undefined | Option<'ben_det_oblast'>
    // business_details/ben_det_raion [select_one] Район
    ben_det_raion: undefined | string
    // business_details/ben_det_hromada [select_one] Громада
    ben_det_hromada: undefined | string
    // business_details/ben_det_settlement [select_one_from_file] Населений пункт
    ben_det_settlement: string
    // business_details/tax_id_num [text] Ідентифікаційний номер (ІПН)
    tax_id_num: string | undefined
    // business_details/ben_enterprise_tax_id [integer] Код ЄДРПОУ / або ІПН якщо ви ФОП
    ben_enterprise_tax_id: number | undefined
    // business_plan/description_business_plan [text] Опис бізнес-ідеї, яка буде реалізовано за рахунок гранту
    description_business_plan: string | undefined
    // business_plan/much_need_grant [integer] Яка сума гранту в гривнях необхідна для реалізації Вашої ідеї?
    much_need_grant: number | undefined
    // business_plan/timeframe_spend_grant_money [text] У який термін ви зможете витратити кошти гранту на основі поданого вами бізнес-плану?
    timeframe_spend_grant_money: string | undefined
    // business_plan/conflict_created_barrier [text] Будь ласка, опишіть, яким чином ескалація конфлікту створила бар'єри на шляху до відновлення або розширення вашої бізнес-діяльності
    conflict_created_barrier: string | undefined
    // business_plan/main_goods_services [select_multiple] Напрямки вашої діяльності
    main_goods_services: undefined | Option<'main_goods_services'>[]
    // business_plan/main_goods_services_other [text] Якщо «Інше», будь ласка, вкажіть
    main_goods_services_other: string | undefined
    // business_plan/experience_activities [select_one] Чи маєте ви досвід в цій сфері?
    experience_activities: undefined | Option<'plan_additional_jobs'>
    // business_plan/experience_activities_describe [text] Опишіть ваш досвід
    experience_activities_describe: string | undefined
    // business_plan/experience_activities_how [select_one] Скільки у вас досвіду у цій сфері?
    experience_activities_how: undefined | Option<'experience_activities_how'>
    // business_plan/there_paid_employees [select_one] Чи є зараз у вас наймані працівники?
    there_paid_employees: undefined | Option<'plan_additional_jobs'>
    // business_plan/there_paid_employees_quantity [select_one] Будь ласка, уточніть скількі
    there_paid_employees_quantity: undefined | Option<'there_paid_employees_quantity'>
    // business_plan/there_paid_employees_salary [integer] Середньомісячна заробітна плата
    there_paid_employees_salary: number | undefined
    // market_research/market_demand [text] Які дані свідчать про те, що існує ринковий попит на запропонований вами бізнес-продукт/послуги?
    market_demand: string | undefined
    // market_research/target_consumers [text] Цільові споживачі
    target_consumers: string | undefined
    // market_research/have_competitors [select_one] Чи є у вас конкуренти?
    have_competitors: undefined | Option<'have_competitors'>
    // market_research/have_competitors_many [integer] Скільки у вас конкурентів?
    have_competitors_many: number | undefined
    // market_research/have_competitors_who [text] Хто ваші конкуренти?
    have_competitors_who: string | undefined
    // market_research/merits_product_competitors [text] Які переваги вашого продукту/послуги/бізнесу перед конкурентами?
    merits_product_competitors: string | undefined
    // funding_business_plan/goods_services [text] Будь ласка, надайте перелік товарів та послуг (включаючи їх орієнтовну вартість), які будуть придбані за кошти гранту
    goods_services: string | undefined
    // funding_business_plan/months_investment_profit [integer] Через який час (місяці) після інвестицій ви очікуєте збільшення прибутку?
    months_investment_profit: number | undefined
    // funding_business_plan/net_monthly_business_revenue [integer] Поточний чистий щомісячний дохід від бізнесу
    net_monthly_business_revenue: number | undefined
    // funding_business_plan/net_monthly_business_expenditures [integer] Поточні чисті щомісячні витрати на бізнес
    net_monthly_business_expenditures: number | undefined
    // funding_business_plan/net_monthly_implementation [text] Прогнозоване зростання чистого щомісячного доходу після реалізації проекту за грантові кошти
    net_monthly_implementation: string | undefined
    // funding_business_plan/monthly_profit_anticipated [text] Очікуваний щомісячний прибуток від реалізації проекту за грантові кошти
    monthly_profit_anticipated: string | undefined
    // funding_business_plan/receive_assistance_returnee [select_one] Якщо ви отримаєте грант, чи працевлаштуєте ви офіційно принаймні одну особу, яка постраждала від конфлікту, наприклад, ВПО або репатріанта, щонайменше на 6 місяців?
    receive_assistance_returnee: undefined | Option<'plan_additional_jobs'>
    // returnee_jobs [begin_repeat] Робочі місця
    returnee_jobs:
      | {
          returnee_name_position: string | undefined | undefined
          returnee_quantity: number | undefined | undefined
          returnee_monthly_salary: number | undefined | undefined
          returnee_length_contract: string | undefined | undefined
          returnee_type_employment: undefined | Option<'additional_type_employment'> | undefined
        }[]
      | undefined
    // plan_additional_jobs [select_one] Чи плануєте ви створити додаткові робочі місця, окрім обов'язкових, в рамках реалізації гранту?
    plan_additional_jobs: undefined | Option<'plan_additional_jobs'>
    // additional_jobs [begin_repeat] Робочі місця
    additional_jobs:
      | {
          additional_name_position: string | undefined | undefined
          additional_quantity: number | undefined | undefined
          additional_monthly_salary: number | undefined | undefined
          additional_length_contract: string | undefined | undefined
          additional_type_employment: undefined | Option<'additional_type_employment'> | undefined
        }[]
      | undefined
    // business_consultancy_needs/area_preference_work [text] За яким напрямком ви б хотіли отримувати до 5 годин бізнес-консультацій?
    area_preference_work: string | undefined
    // business_consultancy_needs/result_preference_work [text] Який результат ви очікуєте отримати після консультацій?
    result_preference_work: string | undefined
    // business_consultancy_needs/comments [text] Додаткові коментарі
    comments: string | undefined
  }
  export const options = {
    main_goods_services: {
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
      sewing_repair: `Пошиття / ремонт одягу та взуття`,
      small_manufacturing: `Виробництво`,
      hairdressing_barber: `Перукарня/салон краси`,
      it: `ІТ`,
      other: `Інше`,
    },
    plan_additional_jobs: {
      yes: `Так`,
      no: `Ні`,
    },
    have_competitors: {
      yes: `Так`,
      no: `Ні`,
      dk: `Я не знаю`,
    },
    experience_activities_how: {
      under_two: `До двох років`,
      over_two: `Більше двох років`,
    },
    there_paid_employees_quantity: {
      '0_5_people': `0-5 осіб`,
      '5_10_people': `5-10 осіб`,
      '10_15_people': `10-15 осіб`,
      '15_20_people': `15-20 осіб`,
      '20_more_people': `20+ осіб`,
    },
    undefined: {
      own_funding: `Власне фінансування`,
      grant: `Грант`,
      other: `Інше`,
    },
    additional_type_employment: {
      full: `Повний робочий день`,
      part: `Неповний робочий день`,
      casual: `Тимчасова`,
    },
    ben_det_oblast: {
      dnipropetrovska: `Дніпропетровська`,
      khersonska: `Херсонська`,
      mykolaivska: `Миколаївська`,
      zaporizka: `Запорізька`,
      lvivska: `Львівська`,
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
      date_payment: _.date_payment ? new Date(_.date_payment) : undefined,
      date: _.date ? new Date(_.date) : undefined,
      ben_enterprise_tax_id: _.ben_enterprise_tax_id ? +_.ben_enterprise_tax_id : undefined,
      much_need_grant: _.much_need_grant ? +_.much_need_grant : undefined,
      main_goods_services: _.main_goods_services?.split(' '),
      there_paid_employees_salary: _.there_paid_employees_salary ? +_.there_paid_employees_salary : undefined,
      have_competitors_many: _.have_competitors_many ? +_.have_competitors_many : undefined,
      months_investment_profit: _.months_investment_profit ? +_.months_investment_profit : undefined,
      net_monthly_business_revenue: _.net_monthly_business_revenue ? +_.net_monthly_business_revenue : undefined,
      net_monthly_business_expenditures: _.net_monthly_business_expenditures
        ? +_.net_monthly_business_expenditures
        : undefined,
      returnee_jobs: _['returnee_jobs']?.map(extractQuestionName).map((_: any) => {
        _['returnee_quantity'] = _.returnee_quantity ? +_.returnee_quantity : undefined
        _['returnee_monthly_salary'] = _.returnee_monthly_salary ? +_.returnee_monthly_salary : undefined
        return _
      }),
      additional_jobs: _['additional_jobs']?.map(extractQuestionName).map((_: any) => {
        _['additional_quantity'] = _.additional_quantity ? +_.additional_quantity : undefined
        _['additional_monthly_salary'] = _.additional_monthly_salary ? +_.additional_monthly_salary : undefined
        return _
      }),
    }) as T
}
