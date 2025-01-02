export namespace Ecrec_msme_bha388 {
export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
	// Form id: aoJppKLX7QvSkMYokUfEjB
	export interface T {
	    'start': string,
	    'end': string,
	  // shortlisted [select_one] Відібрано до шорт-листу
  'shortlisted': undefined | Option<'shortlisted'>,
	  // vetting_status [select_one] Статус перевірки
  'vetting_status': undefined | Option<'vetting_status'>,
	  // validation_visit [select_one] Валідаційний візит
  'validation_visit': undefined | Option<'validation_visit'>,
	  // committee_decision [select_one] Рішення комітету
  'committee_decision': undefined | Option<'committee_decision'>,
	  // grant_agreement_upload [file] Завантаження договору про надання гранту
  'grant_agreement_upload': string,
	  // status_first_tranche [select_one] Статус виконання першого траншу
  'status_first_tranche': undefined | Option<'status_first_tranche'>,
	  // date_first_tranche [date] Дата першого траншу
  'date_first_tranche': Date | undefined,
	  // status_second_tranche [select_one] Статус виконання другого траншу
  'status_second_tranche': undefined | Option<'status_second_tranche'>,
	  // date_second_tranche [date] Дата другого траншу
  'date_second_tranche': Date | undefined,
	  // business_consultancy [select_one] Бізнес консультації
  'business_consultancy': undefined | Option<'business_consultancy'>,
	  // post_distribution [select_one] Подальший супровід після дистрибуції
  'post_distribution': undefined | Option<'post_distribution'>,
	  // comments_case_management [text] Коментарі
  'comments_case_management': string | undefined,
	  // note_hello [note] Дякуємо за інтерес до бізнес-програми Данської ради у справах біженців (ДРБ). Ця програма має на меті допомогти малим і середнім підприємствам та підприємцям подолати наслідки ескалації війни, щоб вони могли відновити або продовжити свою діяльність. Ми приймаємо заявки від підприємств та підприємців з Дніпропетровської, Херсонської, Миколаївської, Запорізької, Харківської, Сумської та Чернігівської областей. Будь ласка, заповнюйте аплікаційну форму повністю і правдиво. Ми не розглядатимемо заявки від третіх осіб або осіб, які не мають прямого відношення до бізнесу, що звертається за підтримкою. Якщо вам потрібна допомога у заповненні заявки або якщо вам щось незрозуміло, будь ласка, звертайтеся за підтримкою безпосередньо до ДРБ (контактна інформація вказана нижче). **Критерії прийнятності** Щоб претендувати на отримання бізнес-гранту, ви повинні бути зареєстрованим підприємством з макс. 20 працівників; мати щонайменше два роки досвіду роботи у вашій сфері бізнесу; сплачувати податки протягом останніх шести місяців (навіть якщо ви не мали змоги зробити це останнім часом). Вам також потрібно буде подати чіткий бізнес-план з детальним описом того, як ви будете використовувати грант, продемонструвати, що ваші продукти/послуги відповідають ринковому попиту, а також продемонструвати деякі маркетингові дослідження для обґрунтування використання гранту. Підприємство також не повинно мати жодних юридичних перешкод для отримання гранту і не повинно отримувати подібну допомогу протягом останніх шести місяців. Сума гранту залежить від розміру та бізнес-плану кожного підприємства, але не може перевищувати 5 000 доларів США. **Процес подання заявки** Будь ласка, скористайтеся можливістю повністю висловити свою мотивацію подати заявку на отримання бізнес-гранту та заповнити всю інформацію правдиво і повністю. Ваша детальна заявка дозволить нам краще зрозуміти ваші прагнення та прийняти обґрунтоване рішення. Ми маємо обмежену кількість грантів, і посилання на реєстрацію може бути закрите, якщо буде досягнуто максимальної кількості місць. Будь ласка, зверніть увагу, що подання заявки не означає, що ви автоматично отримаєте бізнес-грант, а лише те, що ваша заявка буде оцінена на основі критеріїв відбору для цієї програми. Команда DRC зв'яжеться з підприємствами, що потрапили до короткого списку, для проходження наступних етапів процесу відбору.  DRC високо цінує будь-який зворотній зв'язок щодо наших програм. **Ваші скарги, звернення та пропозиції направляйте на пошту: UKR-feedback@drc.ngo або телефонуйте 0 800 33 95 18 (пн-пт 9:00-17:00).** Програма реалізується завдяки щедрій підтримці американського народу, наданій через Бюро з гуманітарної допомоги Агентства США з міжнародного розвитку (USAID).
  'note_hello': string,
	  // consent_personal_data/date [date] Дата реєстрації
  'date': Date | undefined,
	  // consent_personal_data/consent [select_one] Чи надаєте Ви згоду на обробку ДРБ Ваших персональних даних?
  'consent': undefined | Option<'company_engages_socially'>,
	  // consent_personal_data/business_owner [select_one] Ви є власником бізнесу, на який подаєте заявку?
  'business_owner': undefined | Option<'company_engages_socially'>,
	  // consent_personal_data/business_owner_no [select_one] Якщо «Ні», то чи належите Ви до однієї з наступних категорій?
  'business_owner_no': undefined | Option<'business_owner_no'>,
	  // consent_personal_data/res_describe_role [text] Будь ласка, опишіть вашу роль
  'res_describe_role': string | undefined,
	  // business_owner_details/surname [text] Ваше прізвище?
  'surname': string | undefined,
	  // business_owner_details/first_name [text] Ваше ім'я?
  'first_name': string | undefined,
	  // business_owner_details/pat_name [text] По батькові?
  'pat_name': string | undefined,
	  // business_owner_details/oblast [select_one] Область
  'oblast': undefined | Option<'oblast'>,
	  // business_owner_details/raion [select_one] Район
  'raion': undefined | Option<'raion'>,
	  // business_owner_details/hromada [select_one] Громада
  'hromada': undefined | string,
	  // business_owner_details/settlement [select_one_from_file] Населений пункт
  'settlement': string,
	  // business_owner_details/res_stat [select_one] Статус проживання
  'res_stat': undefined | Option<'res_stat'>,
	  // business_owner_details/res_stat_other [text] Якщо «Інше», будь ласка, вкажіть Ваш статус
  'res_stat_other': string | undefined,
	  // business_owner_details/idp_certificate [select_one] Чи маєте Ви дійсну довідку ВПО?
  'idp_certificate': undefined | Option<'company_engages_socially'>,
	  // business_owner_details/gender [select_one] Ваша стать?
  'gender': undefined | Option<'hh_char_hh_det_gender'>,
	  // business_owner_details/date_birth [date] Дата народження
  'date_birth': Date | undefined,
	  // business_owner_details/age [integer] Вік
  'age': number | undefined,
	  // business_owner_details/ph_number [integer] Будь ласка, вкажіть Ваш номер телефону
  'ph_number': number | undefined,
	  // business_owner_details/email [text] Будь ласка, вкажіть свою електронну адресу
  'email': string | undefined,
	  // business_owner_details/tax_id_num [text] Індивідуальний податковий номер (ІПН)
  'tax_id_num': string | undefined,
	    'tax_length': string,
	  // family_details/household_income [integer] Який ваш загальний щомісячний дохід домогосподарства в гривнях?
  'household_income': number | undefined,
	  // family_details/number_people [integer] Будь ласка, вкажіть скільки людей проживає у Вашому домогосподарстві (включно з Вами)
  'number_people': number | undefined,
	  // family_details/not_idicate_member [note] **Будь ласка, надайте інформацію про членів вашої вашому домогосподарстві**
  'not_idicate_member': string,
	  // family_details/hh_member [begin_repeat] Члени домогосподарства
  'hh_member': {'hh_char_tax_id_yn': undefined | Option<'company_engages_socially'> | undefined,'hh_char_tax_id_num': string | undefined | undefined,'taxid_weightedsum': string | undefined,'taxid_roundedsum': string | undefined,'hh_char_hh_det_gender': undefined | Option<'hh_char_hh_det_gender'> | undefined,'hh_char_hh_det_age': number | undefined | undefined}[] | undefined,
	  // family_details/dis_select [select_multiple] Будь ласка, оберіть будь-який з наведених варіантів, який стосується власника бізнесу
  'dis_select': undefined | Option<'dis_select'>[],
	  // family_details/dis_level [select_one] Який рівень складності обраних варіантів відповідей на попередні запитання?
  'dis_level': undefined | Option<'dis_level'>,
	  // family_details/impact_ability_household [select_one] Чи впливає щось з перерахованого вище на здатність Вашого домогосподарства займатися діяльністю, що забезпечує засоби до існування?
  'impact_ability_household': undefined | Option<'company_engages_socially'>,
	  // family_details/household_contain_excombatants [select_one] Чи є у Вашому домогосподарстві колишні учасники бойових дій?
  'household_contain_excombatants': undefined | Option<'company_engages_socially'>,
	  // family_details/many_excombatants [integer] Будь ласка, вкажіть, кількість таких осіб
  'many_excombatants': number | undefined,
	  // family_details/certification_status_excombatants [select_one] Чи мають вони посвідчення, що підтверджують їхній статус учасника бойових дій?
  'certification_status_excombatants': undefined | Option<'company_engages_socially'>,
	  // family_details/household_chronic_diseases [select_one] Чи є у Вашому домогосподарстві люди з хронічними захворюваннями, які роблять їх непрацездатними або які потребують постійного догляду?
  'household_chronic_diseases': undefined | Option<'company_engages_socially'>,
	  // family_details/many_chronic_diseases [integer] Будь ласка, вкажіть, кількість таких осіб
  'many_chronic_diseases': number | undefined,
	  // family_details/household_pregnant_that_breastfeeding [select_one] Чи є у Вашому домогосподарстві вагітні або жінки, які годують груддю?
  'household_pregnant_that_breastfeeding': undefined | Option<'company_engages_socially'>,
	  // family_details/many_pregnant_that_breastfeeding [integer] Будь ласка, вкажіть, кількість таких осіб
  'many_pregnant_that_breastfeeding': number | undefined,
	  // family_details/business_primary_source_income [select_one] Чи є підприємницька діяльність основним джерелом доходу домогосподарства?
  'business_primary_source_income': undefined | Option<'company_engages_socially'>,
	  // family_details/business_primary_source_income_no [text] Якщо «Ні», будь ласка, вкажіть, які ще джерела доходу має Ваше домогосподарство
  'business_primary_source_income_no': string | undefined,
	  // business_details/business_name [text] Назва бізнесу
  'business_name': string | undefined,
	  // business_details/business_type [select_one] Тип реєстрації підприємства
  'business_type': undefined | Option<'business_type_validation'>,
	  // business_details/business_type_other [text] Якщо «Інше», будь ласка, вкажіть
  'business_type_other': string | undefined,
	  // business_details/enterprise_tax_id [text] Податковий номер підприємства (ЄДРПОУ)
  'enterprise_tax_id': string | undefined,
	  // business_details/many_owners_business [integer] Скільки власників має підприємство?
  'many_owners_business': number | undefined,
	  // business_details/business_owners [begin_repeat] Власники підприємства
  'business_owners': {'tax_id_owner': number | undefined | undefined,'taxid_owner_length': string | undefined}[] | undefined,
	  // business_details/confirm_receive_grant [select_one] Будь ласка, підтвердіть, яка особа буде отримувати грант
  'confirm_receive_grant': undefined | Option<'confirm_receive_grant'>,
	  // business_details/legal_address_business [text] Юридична адреса підприємства
  'legal_address_business': string | undefined,
	  // business_details/date_business_registration [date] Дата реєстрації підприємства
  'date_business_registration': Date | undefined,
	  // business_details/business_currently_operational [select_one] Чи працює Ваше підприємство зараз?
  'business_currently_operational': undefined | Option<'company_engages_socially'>,
	  // business_details/business_currently_operational_no [text] Будь ласка, надайте додаткову інформацію, чому Ваше підприємство зараз не працює
  'business_currently_operational_no': string | undefined,
	  // business_details/reason_pause_activity [select_multiple] Будь ласка, вкажіть причину призупинення діяльності
  'reason_pause_activity': undefined | Option<'reason_pause_activity'>[],
	  // business_details/reason_pause_activity_other [text] Якщо «Інше», будь ласка, вкажіть
  'reason_pause_activity_other': string | undefined,
	  // business_details/key_business_activities [select_multiple] Будь ласка, вкажіть основні види діяльності Вашого підприємства
  'key_business_activities': undefined | Option<'key_business_activities'>[],
	  // business_details/key_business_activities_other [text] Якщо «Інше», будь ласка, вкажіть
  'key_business_activities_other': string | undefined,
	  // business_details/years_experience_business [integer] Який Ваш загальний стаж роботи в обраному Вами виді діяльності?
  'years_experience_business': number | undefined,
	  // business_details/number_employees_business [integer] Будь ласка, вкажіть кількість працівників на Вашому підприємстві
  'number_employees_business': number | undefined,
	  // business_details/turnover_past12 [integer] Яким був оборот від вашої бізнес-діяльності за останні 12 місяців у гривнях?
  'turnover_past12': number | undefined,
	  // business_details/income_past12 [integer] Яким був дохід від Вашої підприємницької діяльності за останні 12 місяців у гривнях?
  'income_past12': number | undefined,
	  // business_details/turnover_past12_scale_invasion [integer] Яким був Ваш обіг за 12 місяців до повномасштабного вторгнення?
  'turnover_past12_scale_invasion': number | undefined,
	  // business_details/income_past12_scale_invasion [integer] Яким був ваш дохід за 12 місяців до повномасштабного вторгнення?
  'income_past12_scale_invasion': number | undefined,
	  // business_details/monthly_business_expenditure [integer] Які ваші середньомісячні витрати на ведення бізнесу в гривнях?
  'monthly_business_expenditure': number | undefined,
	  // business_details/have_debt_repayment [select_one] Чи є у вас боргові зобов'язання або зобов'язання з погашення кредиту?
  'have_debt_repayment': undefined | Option<'company_engages_socially'>,
	  // business_details/repayment_debt_loan [select_one] Будь ласка, вкажіть, чи є у Вас затримка з виплатами за цим боргом або кредитом
  'repayment_debt_loan': undefined | Option<'company_engages_socially'>,
	  // business_details/access_business_loans [select_one] Чи маєте Ви доступ до бізнес-позик або кредитів?
  'access_business_loans': undefined | Option<'company_engages_socially'>,
	  // business_details/not_access_business_loans [select_one] Якщо «Ні», то чому?
  'not_access_business_loans': undefined | Option<'not_access_business_loans'>,
	  // business_details/not_access_business_loans_other [text] Якщо «Інше», будь ласка, вкажіть
  'not_access_business_loans_other': string | undefined,
	  // business_details/your_main_customers [text] Хто є Вашими основними клієнтами?
  'your_main_customers': string | undefined,
	  // business_details/asset_business_own [text] Якими активами володіє Ваш бізнес?
  'asset_business_own': string | undefined,
	  // business_details/main_barriers_business [select_multiple] Які існують основні перешкоди для відновлення або продовження Вашого підприємства?
  'main_barriers_business': undefined | Option<'main_barriers_business'>[],
	  // business_details/main_barriers_business_other [text] Якщо «Інше», будь ласка, вкажіть
  'main_barriers_business_other': string | undefined,
	  // business_plan/escalation_conflict_affected_business [select_multiple] Як ескалація конфлікту вплинула на Ваше підприємство?
  'escalation_conflict_affected_business': undefined | Option<'escalation_conflict_affected_business'>[],
	  // business_plan/escalation_conflict_affected_business_other [text] Якщо «Інше», будь ласка, вкажіть
  'escalation_conflict_affected_business_other': string | undefined,
	  // business_plan/escalation_conflict_detail [text] Будь ласка, надайте більш детальну інформацію про це
  'escalation_conflict_detail': string | undefined,
	  // business_plan/current_strategy_business [text] Будь ласка, опишіть поточну стратегію, яку Ви маєте для Вашого підприємства?
  'current_strategy_business': string | undefined,
	  // business_plan/grant_purpose_use [select_one] Якщо Ви відповідатимете критеріям для отримання бізнес-гранту від ДРБ, на які цілі Ви плануєте його використати?
  'grant_purpose_use': undefined | Option<'grant_purpose_use'>,
	  // business_plan/grant_purpose_use_describe [text] Будь ласка, опишіть, як ви плануєте витратити грант, якщо ви отримаєте право на його отримання?
  'grant_purpose_use_describe': string | undefined,
	  // business_plan/amount_implement_plan [integer] Будь ласка, вкажіть суму в гривнях, необхідну для реалізації цього бізнес-плану?
  'amount_implement_plan': number | undefined,
	  // business_plan/able_spend_grant_6m [select_one] Зважаючи на характер проєкту, Ви повинні бути в змозі витратити грант протягом 6 місяців після його отримання, але не пізніше кінця серпня 2025 року. Чи можете Ви підтвердити, що зможете це зробити?
  'able_spend_grant_6m': undefined | Option<'company_engages_socially'>,
	  // business_plan/about_market_research [text] Розкажіть, будь ласка, трохи більше про дослідження ринку, яке ви провели для підтримки вашого бізнес-плану? Це має включати інформацію про (потенційних) конкурентів
  'about_market_research': string | undefined,
	  // business_plan/creating_additional_jobs [select_one] Чи плануєте ви створити додаткові робочі місця в рамках Вашого бізнес-плану?
  'creating_additional_jobs': undefined | Option<'company_engages_socially'>,
	  // business_plan/received_previous_support [select_one] Чи отримував ваш бізнес будь-яку раніше підтримку від уряду, неурядових організацій або інших суб'єктів?
  'received_previous_support': undefined | Option<'company_engages_socially'>,
	  // business_plan/who_previous_support [select_one] Хто надавав цю підтримку?
  'who_previous_support': undefined | Option<'who_previous_support'>,
	  // business_plan/who_previous_support_other [text] Якщо «Інше», будь ласка, вкажіть
  'who_previous_support_other': string | undefined,
	  // business_plan/amount_previous_support [integer] Якою була її сума?
  'amount_previous_support': number | undefined,
	  // business_plan/when_previous_support [date] Коли вона була надана?
  'when_previous_support': Date | undefined,
	  // business_consultancy_001/topic_business_consultancy [select_multiple] Частина грантової підтримки, що надається обраним підприємствам, включає 5 годин бізнес-консультацій. Будь ласка, вкажіть тему(и), якій(им) ви надаєте перевагу під час консультації. Будь ласка, зверніть увагу, що ви не зможете отримати консультацію на обрану вами тему, і що, швидше за все, ви зможете отримати консультацію лише в одній конкретній сфері.
  'topic_business_consultancy': undefined | Option<'topic_business_consultancy'>[],
	  // business_consultancy_001/topic_business_consultancy_other [text] Якщо «Інше», будь ласка, вкажіть
  'topic_business_consultancy_other': string | undefined,
	  // comments_documents/file_tax_statement [file] Будь ласка, додайте податкову декларацію, яка показує податкові платежі (як мінімум) за останні шість місяців
  'file_tax_statement': string,
	  // comments_documents/file_business_document [file] Свідоцтво про державну реєстрацію бізнесу або виписка з Єдиного державного реєстру
  'file_business_document': string,
	  // comments_documents/have_other_documents [select_one] Чи є у вас ще якісь документи, якими ви хотіли б поділитися з нами?
  'have_other_documents': undefined | Option<'company_engages_socially'>,
	  // comments_documents/other_documents1 [file] Додайте більше фотографій/документів
  'other_documents1': string,
	  // comments_documents/other_documents2 [file] Додайте більше фотографій/документів
  'other_documents2': string,
	  // comments_documents/other_documents3 [file] Додайте більше фотографій/документів
  'other_documents3': string,
	  // comments_documents/other_documents4 [file] Додайте більше фотографій/документів
  'other_documents4': string,
	  // comments_documents/other_documents5 [file] Додайте більше фотографій/документів
  'other_documents5': string,
	  // comments_documents/comments [text] Чи є у Вас інші коментарі або інформація, якою ви хотіли б поділитися з ДРБ? Ми були б особливо зацікавлені почути, чи працевлаштовуєте ви людей з високим рівнем вразливості, наприклад, людей з інвалідністю або колишніх комбатантів
  'comments': string | undefined,
	  // comments_documents/hear_program [select_one] Як ви дізналися про цю програму?
  'hear_program': undefined | Option<'hear_program'>,
	  // comments_documents/hear_program_other [text] Якщо «Інше», будь ласка, вкажіть
  'hear_program_other': string | undefined,
	  // not_thank [note] **Дякуємо, що знайшли час, щоб надати цю інформацію. Якщо ви натиснете кнопку «Надіслати», ми успішно отримаємо вашу заявку. Ми повідомимо вас про результат і будь-які подальші кроки (якщо такі будуть) протягом трьох місяців.  (але, сподіваємось, раніше)**
  'not_thank': string,
	  // verification_information/date_visit [date] Дата візиту
  'date_visit': Date | undefined,
	  // verification_information/enumerator_name [text] Відповідальна особа
  'enumerator_name': string | undefined,
	  // verification_information/business_name_validation [text] Назва підприємства
  'business_name_validation': string | undefined,
	  // verification_information/business_type_validation [select_one] Тип бізнесу
  'business_type_validation': undefined | Option<'business_type_validation'>,
	  // verification_information/business_type_validation_other [text] Якщо інше, будь ласка, поясніть
  'business_type_validation_other': string | undefined,
	  // verification_information/validation_visit_001 [select_one] Як проходив перевірочний візит:
  'validation_visit_001': undefined | Option<'validation_visit_001'>,
	  // verification_information/business_premises [select_one] Чи має підприємство приміщення?
  'business_premises': undefined | Option<'company_engages_socially'>,
	  // verification_information/business_premises_no [select_one] Якщо ні, то чому?
  'business_premises_no': undefined | Option<'business_premises_no'>,
	  // verification_information/business_premises_no_other [text] Якщо інше, будь ласка, поясніть
  'business_premises_no_other': string | undefined,
	  // verification_information/primary_goods_services [select_multiple] Основні товари або послуги, які пропонує бізнес
  'primary_goods_services': undefined | Option<'primary_goods_services'>[],
	  // verification_information/primary_goods_services_other [text] Якщо інше, будь ласка, поясніть
  'primary_goods_services_other': string | undefined,
	  // verification_information/ownership_details [text] Інформація про власника
  'ownership_details': string | undefined,
	  // verification_information/years_experience [integer] Роки досвіду роботи
  'years_experience': number | undefined,
	  // verification_information/number_employees [integer] Кількість співробітників
  'number_employees': number | undefined,
	  // verification_information/currently_operational [select_one] Наразі працює
  'currently_operational': undefined | Option<'company_engages_socially'>,
	  // verification_information/business_have_assets [select_one] Якщо бізнес не працює, чи збереглися його активи?
  'business_have_assets': undefined | Option<'company_engages_socially'>,
	  // verification_information/protection_risk_employees [select_one] Ризик захисту працівників?
  'protection_risk_employees': undefined | Option<'company_engages_socially'>,
	  // verification_information/confirm_not_working_sectors [select_multiple] Якщо можливо, підтвердіть, що вони не працюють у наступних секторах, які не можуть розглядатися для виділення грантів.
  'confirm_not_working_sectors': undefined | Option<'confirm_not_working_sectors'>[],
	  // verification_information/photos_premises1 [image] Фотографії приміщень
  'photos_premises1': string,
	  // verification_information/photos_premises2 [image] Фотографії приміщень
  'photos_premises2': string,
	  // verification_information/photos_premises3 [image] Фотографії приміщень
  'photos_premises3': string,
	  // verification_information/photos_premises4 [image] Фотографії приміщень
  'photos_premises4': string,
	  // verification_information/photos_premises5 [image] Фотографії приміщень
  'photos_premises5': string,
	  // verification_information/photos_premises6 [image] Фотографії приміщень
  'photos_premises6': string,
	  // verification_information/photos_premises7 [image] Фотографії приміщень
  'photos_premises7': string,
	  // verification_information/photos_premises8 [image] Фотографії приміщень
  'photos_premises8': string,
	  // verification_information/photos_premises9 [image] Фотографії приміщень
  'photos_premises9': string,
	  // verification_information/photos_premises10 [image] Фотографії приміщень
  'photos_premises10': string,
	  // verification_information/company_engages_socially [select_one] На основі вашого візиту на підприємство, чи вважаєте ви, що ця компанія займається соціально та екологічно відповідальним підприємництвом?
  'company_engages_socially': undefined | Option<'company_engages_socially'>,
	  // verification_information/comments_001 [text] Будь-які інші коментарі/зауваження
  'comments_001': string | undefined,
	  // verification_information/comments_authorities_community [text] Будь-які коментарі/спостереження з боку органів влади або членів громади щодо підприємства
  'comments_authorities_community': string | undefined,
	}
export const options = {
shortlisted: {
	'yes': `✅ Так`,
	'no': `❌ Ні`,
	'deduplication': `⚠️ Дедуплікація`,
	'pending': `🕓 Очікує на розгляд`
},
vetting_status: {
	'completed': `✅ Завершено`,
	'ongoing': `🕓 Триває`,
	'rejected': `❌ Відхилено`
},
validation_visit: {
	'completed': `✅ Завершено`,
	'rejected': `❌ Відхилено`,
	'follow_up_required': `🕓 Потрібні подальші дії`
},
committee_decision: {
	'approved': `✅ Затверджено`,
	'rejected': `❌ Відхилено`,
	'waiting_list': `🕓 Очікується лист`
},
status_first_tranche: {
	'done': `✅ Виконано`,
	'pending': `🕓 На розгляді`,
	'only_first_tranche': `❎ Тільки перший транш`
},
status_second_tranche: {
	'done': `✅ Виконано`,
	'pending': `🕓 На розгляді`,
	'na': `❎ N/A`
},
business_consultancy: {
	'done': `✅ Виконано`,
	'ongoing': `🕓 Триває`,
	'rejected': `❌ Відхилено`
},
post_distribution: {
	'completed': `✅ Завершено`,
	'ongoing': `🕓 Триває`
},
company_engages_socially: {
	'yes': `Так`,
	'no': `Ні`
},
business_owner_no: {
	'family_member': `Член сім'ї власника бізнесу`,
	'third_party_agency': `Стороннє агентство`,
	'accountant_business': `Бухгалтер/ка бізнесу`,
	'director_business': `Директор/ка бізнесу`,
	'no': `Ні`
},
res_stat: {
	'idp': `Внутрішньо-переміщена особа (ВПО)`,
	'long_res': `Довгостроковий мешканець`,
	'ret': `Особа, яка повернулася`,
	'other': `Інший`
},
dis_select: {
	'diff_see': `Маєте труднощі із зором, навіть якщо носите окуляри`,
	'diff_hear': `Маєте проблеми зі слухом, навіть якщо користуєтеся слуховим апаратом`,
	'diff_walk': `Маєте труднощі з ходьбою або підйомом по сходах`,
	'diff_rem': `Маєте труднощі з запам'ятовуванням або концентрацією уваги`,
	'diff_care': `Маєте труднощі з самообслуговуванням, наприклад, з миттям або одяганням`,
	'diff_comm': `Маєте труднощі у спілкуванні, наприклад, у розумінні чи розумінні інших людей`,
	'diff_none': `Ніщо з перерахованого вище не стосується`
},
dis_level: {
	'zero': `Ні, труднощі відсутні`,
	'one': `Так, є деякі труднощі`,
	'two': `Так, багато труднощів`,
	'fri': `Взагалі не можу(-е) робити`
},
confirm_receive_grant: {
	'myself': `Я`,
	'someone_else': `Хтось інший`
},
business_type_validation: {
	'fop1': `ФОП 1`,
	'fop2': `ФОП 2`,
	'fop3': `ФОП 3`,
	'fop4': `ФОП 4`,
	'entrepreneurs': `Підприємці на загальній системі оподаткування`,
	'llc': `ТОВ`,
	'farming_enterprise': `Фермерське господарство`,
	'family_farming_enterprise': `Сімейне фермерське господарство`,
	'other': `Інше`
},
reason_pause_activity: {
	'relocation_business': `Географічне переміщення бізнесу`,
	'mine_contamination': `Мінне забруднення`,
	'damaged_assets': `Пошкодження або знищення активів внаслідок обстрілів`,
	'other': `Інше`
},
key_business_activities: {
	'retail': `Роздрібна торгівля`,
	'construction': `Будівництво`,
	'it': `ІТ`,
	'transportation': `Транспорт`,
	'telecommunication': `Телекомунікації`,
	'education': `Освіта`,
	'healthcare': `Охорона здоров'я`,
	'finance_legal_services': `Фінансові та юридичні послуги`,
	'marketing_services': `Маркетингові послуги`,
	'agriculture': `Сільське господарство`,
	'petty_trade': `Дрібна торгівля`,
	'wholesale_trade': `Оптова торгівля`,
	'food_service': `Харчова промисловість`,
	'small_manufacturing': `Мале виробництво`,
	'beauty_services': `Косметичні послуги`,
	'sewing_tailoring': `Шиття та кравецькі послуги`,
	'car_repairs_maintanence': `Ремонт та обслуговування автомобілів`,
	'utility_services': `Комунальні послуги`,
	'other': `Інші`
},
not_access_business_loans: {
	'rate_high': `Занадто висока процентна ставка`,
	'lack_assets': `Брак активів`,
	'lack_information': `Брак інформації`,
	'other': `Інші`
},
main_barriers_business: {
	'access_financial_aid': `Доступ до фінансової допомоги для підприємницької діяльності`,
	'lack_skilled_workers': `Брак кваліфікованих працівників`,
	'increased_prices_materials': `Зростання цін на матеріали`,
	'infrastructure_transportation': `Інфраструктурні та транспортні бар'єри`,
	'inability_compete_competitors': `Неможливість конкурувати з конкурентами`,
	'monopolization_business': `Монополізація цієї сфери підприємницької діяльності`,
	'legal_regulatory_environment': `Законодавче та регуляторне середовище`,
	'lack_customers': `Відсутність клієнтів`,
	'safety_concerns_related': `Занепокоєння щодо безпеки, пов'язані з ескалацією конфлікту`,
	'lack_governmental_support': `Відсутність державної підтримки власників малого та середнього бізнесу`,
	'lack_financial_resource': `Відсутність фінансового ресурсу для облаштування підприємницької діяльності`,
	'damage_business_premises': `Руйнування або пошкодження приміщення підприємства та/або обладнання`,
	'other': `Інше`
},
escalation_conflict_affected_business: {
	'loss_customers': `Втрата клієнтів`,
	'increased_prices_materials': `Зростання цін на матеріали`,
	'disrupted_supply_chain': `Порушення ланцюжка поставок`,
	'decreased_purchasing_customer': `Зниження купівельної спроможності клієнтів`,
	'relocation_escalation_security': `Переїзд у зв'язку з погіршення безпеки в регіоні`,
	'damage': `Пошкодження або знищення внаслідок обстрілів приміщень та/або обладнання`,
	'other': `Інше`
},
grant_purpose_use: {
	'restoration': `Відновлення бізнесу`,
	'continuation': `Продовження бізнесу`,
	'expansion': `Розширення бізнесу`
},
who_previous_support: {
	'government': `Уряд`,
	'ngo': `Неурядова організація`,
	'other': `Інше`
},
topic_business_consultancy: {
	'marketing_sales': `Маркетинг і продажі (включаючи інтернет-маркетинг)`,
	'customer_relationships_management': `Управління взаємовідносинами з клієнтами (CRM-системи)`,
	'legal_regulatory_compliance': `Дотримання правових та регуляторних норм`,
	'human_resources': `Управління персоналом`,
	'financial_including_pricing': `Управління фінансами (включаючи ціноутворення)`,
	'issues_development_professional': `Актуальні питання щодо розвитку (специфічні професійні питання)`,
	'attracting_additional_financing': `Залучення подальшого фінансування (залучення додаткового фінансування)`,
	'export': `Експорт`,
	'other': `Інше`
},
hh_char_hh_det_gender: {
	'female': `Жінка`,
	'male': `Чоловік`,
	'other_pns': `Інша / Не бажаю відповідати`
},
hear_program: {
	'drc_staff': `Персонал ДРБ`,
	'local_authorities': `Місцеві органи влади`,
	'employment_centre': `Центр зайнятості`,
	'other': `Інші`
},
primary_goods_services: {
	'agro_processing': `Переробка сільськогосподарської продукції`,
	'agriculture': `Сільське господарство (рослинництво та/або тваринництво)`,
	'transport_services': `Транспортні послуги`,
	'construction': `Будівництво`,
	'food_services': `Харчові послуги`,
	'electrical': `Електрика`,
	'mechanics': `Механіка`,
	'plumber': `Сантехнік`,
	'petty_trade': `Дрібна торгівля`,
	'retail_wholesale': `Роздрібна та оптова торгівля`,
	'sewing_shoe_repair': `Пошиття / ремонт взуття`,
	'small_manufacturing': `Мале виробництво`,
	'hairdressing': `Перукарня/барбер`,
	'it': `ІТ`,
	'other': `Інше`
},
confirm_not_working_sectors: {
	'weapons_ammunition': `Виробництво або торгівля зброєю та боєприпасами`,
	'alcoholic_beverages': `Виробництво або торгівля алкогольними напоями (за винятком супермаркетів або продуктових магазинів, які продають алкоголь серед інших товарів)`,
	'tobacco_products': `Виробництво або торгівля тютюновими виробами (за винятком супермаркетів або продуктових магазинів, які продають тютюнові вироби серед інших товарів)`,
	'radioactive_materials': `Виробництво або торгівля радіоактивними матеріалами`,
	'unbound_asbestos_fibres': `Виробництво, торгівля або використання незв'язаних азбестових волокон.`,
	'pesticides_herbicides': `Виробництво або торгівля пестицидами/гербіцидами`,
	'illegal_harmful_activities': `Компанії підтримують будь-яку незаконну та/або шкідливу діяльність і сприяють забрудненню навколишнього середовища.`
},
validation_visit_001: {
	'in_person': `Особисто`,
	'remotely': `Дистанційно`
},
business_premises_no: {
	'relocated': `Підприємство змінило місцезнаходження`,
	'online': `Підприємство працює онлайн`,
	'other': `Інше`
},
oblast: {
	'dnipropetrovska': `Дніпропетровська`,
	'donetska': `Донецька`,
	'zaporizka': `Запорізька`,
	'luhanska': `Луганська`,
	'mykolaivska': `Миколаївська`,
	'odeska': `Одеська`,
	'kharkivska': `Харківська`,
	'khersonska': `Херсонська`,
	'lvivska': `Львівська`,
	'chernihivska': `Чернігівська`,
	'sumska': `Сумська`,
	'other': `Інша`
},
raion: {
	'zvenyhorodskyi': `Звенигородський`,
	'zolotoniskyi': `Золотоніський`,
	'umanskyi': `Уманський`,
	'cherkaskyi': `Черкаський`,
	'koriukivskyi': `Корюківський`,
	'nizhynskyi': `Ніжинський`,
	'novhorod-siverskyi': `Новгород-Сіверський`,
	'prylutskyi': `Прилуцький`,
	'chernihivskyi': `Чернігівський`,
	'vyzhnytskyi': `Вижницький`,
	'dnistrovskyi': `Дністровський`,
	'cnernivetskyi': `Чернівецький`,
	'dniprovskyi': `Дніпровський`,
	'kamianskyi': `Кам’янський`,
	'kryvorizkyi': `Криворізький`,
	'nikopolskyi': `Нікопольський`,
	'novomoskovskyi': `Новомосковський`,
	'pavlohradskyi': `Павлоградський`,
	'synelnykivskyi': `Синельниківський`,
	'bakhmutskyi': `Бахмутський`,
	'volnovaskyi': `Волноваський`,
	'horlivskyi': `Горлівський`,
	'donetskyi': `Донецький`,
	'kalmiuskyi': `Кальміуський`,
	'kramatorskyi': `Краматорський`,
	'mariupolskyi': `Маріупольський`,
	'pokrovskyi': `Покровський`,
	'verkhovynskyi': `Верховинський`,
	'ivano-frankivskyi': `Івано-Франківський`,
	'kaluskyi': `Калуський`,
	'kolomyiskyi': `Коломийський`,
	'kosivskyi': `Косівський`,
	'nadvirnianskyi': `Надвірнянський`,
	'bohodukhivskyi': `Богодухівський`,
	'iziumskyi': `Ізюмський`,
	'krasnohradskyi': `Красноградський`,
	'kupianskyi': `Куп'янський`,
	'lozivskyi': `Лозівський`,
	'kharkivskyi': `Харківський`,
	'chuhuivskyi': `Чугуївський`,
	'beryslavskyi': `Бериславський`,
	'henicheskyi': `Генічеський`,
	'kakhovskyi': `Каховський`,
	'skadovskyi': `Скадовський`,
	'khersonskyi': `Херсонський`,
	'kamianets-podilskyi': `Кам'янець-Подільський`,
	'khmelnytskyi': `Хмельницький`,
	'shepetivskyi': `Шепетівський`,
	'holovanivskyi': `Голованівський`,
	'kropyvnytskyi': `Кропивницький`,
	'novoukrainskyi': `Новоукраїнський`,
	'oleksandriiskyi': `Олександрійський`,
	'chornobylska zona vidchuzhennia': `Чорнобильська зона відчуження`,
	'bilotserkivskyi': `Білоцерківський`,
	'boryspilskyi': `Бориспільський`,
	'brovarskyi': `Броварський`,
	'buchanskyi': `Бучанський`,
	'vyshhorodskyi': `Вишгородський`,
	'obukhivskyi': `Обухівський`,
	'fastivskyi': `Фастівський`,
	'kyivska': `Київська`,
	'alchevskyi': `Алчевський`,
	'dovzhanskyi': `Довжанський`,
	'luhanskyi': `Луганський`,
	'rovenkivskyi': `Ровеньківський`,
	'svativskyi': `Сватівський`,
	'sievierodonetskyi': `Сєвєродонецький`,
	'starobilskyi': `Старобільський`,
	'shchastynskyi': `Щастинський`,
	'drohobytskyi': `Дрогобицький`,
	'stryiskyi': `Стрийський`,
	'bashtanskyi': `Баштанський`,
	'voznesenskyi': `Вознесенський`,
	'mykolaivskyi': `Миколаївський`,
	'pervomaiskyi': `Первомайський`,
	'berezivskyi': `Березівський`,
	'bilhorod-dnistrovskyi': `Білгород-Дністровський`,
	'bolhradskyi': `Болградський`,
	'izmailskyi': `Ізмаїльський`,
	'odeskyi': `Одеський`,
	'podilskyi': `Подільський`,
	'rozdilnianskyi': `Роздільнянський`,
	'kremenchutskyi': `Кременчуцький`,
	'lubenskyi': `Лубенський`,
	'myrhorodskyi': `Миргородський`,
	'poltavskyi': `Полтавський`,
	'varaskyi': `Вараський`,
	'dubenskyi': `Дубенський`,
	'rivnenskyi': `Рівненський`,
	'sarnenskyi': `Сарненський`,
	'sevastopilska': `Севастопільська`,
	'konotopskyi': `Конотопський`,
	'okhtyrskyi': `Охтирський`,
	'romenskyi': `Роменський`,
	'sumskyi': `Сумський`,
	'shostkynskyi': `Шосткинський`,
	'kremenetskyi': `Кременецький`,
	'ternopilskyi': `Тернопільський`,
	'chortkivskyi': `Чортківський`,
	'vinnytskyi': `Вінницький`,
	'haisynskyi': `Гайсинський`,
	'zhmerynskyi': `Жмеринський`,
	'mohyliv-podilskyi': `Могилів-Подільський`,
	'tulchynskyi': `Тульчинський`,
	'khmilnytskyi': `Хмільницький`,
	'volodymyr-volynskyi': `Володимир-Волинський`,
	'kamin-kashyrskyi': `Камінь-Каширський`,
	'kovelskyi': `Ковельський`,
	'lutskyi': `Луцький`,
	'berehivskyi': `Берегівський`,
	'mukachivskyi': `Мукачівський`,
	'rakhivskyi': `Рахівський`,
	'tiachivskyi': `Тячівський`,
	'uzhhorodskyi': `Ужгородський`,
	'khustskyi': `Хустський`,
	'berdianskyi': `Бердянський`,
	'vasylivskyi': `Василівський`,
	'zaporizkyi': `Запорізький`,
	'melitopolskyi': `Мелітопольський`,
	'polohivskyi': `Пологівський`,
	'berdychivskyi': `Бердичівський`,
	'zhytomyrskyi': `Житомирський`,
	'korostenskyi': `Коростенський`,
	'novohrad-volynskyi': `Новоград-Волинський`
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
	date_first_tranche: _.date_first_tranche ? new Date(_.date_first_tranche) : undefined,
	date_second_tranche: _.date_second_tranche ? new Date(_.date_second_tranche) : undefined,
	date: _.date ? new Date(_.date) : undefined,
	date_birth: _.date_birth ? new Date(_.date_birth) : undefined,
	age: _.age ? +_.age : undefined,
	ph_number: _.ph_number ? +_.ph_number : undefined,
	household_income: _.household_income ? +_.household_income : undefined,
	number_people: _.number_people ? +_.number_people : undefined,
	hh_member: _['hh_member']?.map(extractQuestionName).map((_: any) => {
		_['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
		return _	
}),
	dis_select: _.dis_select?.split(' '),
	many_excombatants: _.many_excombatants ? +_.many_excombatants : undefined,
	many_chronic_diseases: _.many_chronic_diseases ? +_.many_chronic_diseases : undefined,
	many_pregnant_that_breastfeeding: _.many_pregnant_that_breastfeeding ? +_.many_pregnant_that_breastfeeding : undefined,
	many_owners_business: _.many_owners_business ? +_.many_owners_business : undefined,
	business_owners: _['business_owners']?.map(extractQuestionName).map((_: any) => {
		_['tax_id_owner'] = _.tax_id_owner ? +_.tax_id_owner : undefined
		return _	
}),
	date_business_registration: _.date_business_registration ? new Date(_.date_business_registration) : undefined,
	reason_pause_activity: _.reason_pause_activity?.split(' '),
	key_business_activities: _.key_business_activities?.split(' '),
	years_experience_business: _.years_experience_business ? +_.years_experience_business : undefined,
	number_employees_business: _.number_employees_business ? +_.number_employees_business : undefined,
	turnover_past12: _.turnover_past12 ? +_.turnover_past12 : undefined,
	income_past12: _.income_past12 ? +_.income_past12 : undefined,
	turnover_past12_scale_invasion: _.turnover_past12_scale_invasion ? +_.turnover_past12_scale_invasion : undefined,
	income_past12_scale_invasion: _.income_past12_scale_invasion ? +_.income_past12_scale_invasion : undefined,
	monthly_business_expenditure: _.monthly_business_expenditure ? +_.monthly_business_expenditure : undefined,
	main_barriers_business: _.main_barriers_business?.split(' '),
	escalation_conflict_affected_business: _.escalation_conflict_affected_business?.split(' '),
	amount_implement_plan: _.amount_implement_plan ? +_.amount_implement_plan : undefined,
	amount_previous_support: _.amount_previous_support ? +_.amount_previous_support : undefined,
	when_previous_support: _.when_previous_support ? new Date(_.when_previous_support) : undefined,
	topic_business_consultancy: _.topic_business_consultancy?.split(' '),
	date_visit: _.date_visit ? new Date(_.date_visit) : undefined,
	primary_goods_services: _.primary_goods_services?.split(' '),
	years_experience: _.years_experience ? +_.years_experience : undefined,
	number_employees: _.number_employees ? +_.number_employees : undefined,
	confirm_not_working_sectors: _.confirm_not_working_sectors?.split(' '),
}) as T
}