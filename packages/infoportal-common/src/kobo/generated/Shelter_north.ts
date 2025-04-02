export namespace Shelter_north {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aCPdwVnnsYeReynJ7YnLGH
  export interface T {
    start: string
    end: string
    // group_cp32s44/back_office [select_one] Офіс
    back_office: undefined | Option<'back_office'>
    // group_cp32s44/damage_level [select_one] Рівень пошкодження
    damage_level: undefined | Option<'damage_level'>
    // group_cp32s44/__007 [select_one] Ім'я регістратора
    __007: undefined | Option<'__007'>
    // group_cp32s44/there_contract [select_one] Чи заключений договорі для відновлення житла?
    there_contract: undefined | Option<'physical_family'>
    // group_cp32s44/donor_repair [select_one] Якій донор проводить допомогу по відновленню житла ?
    donor_repair: undefined | Option<'donor_repair'>
    // group_cp32s44/group_va3uo30/fp1 [image] Фото пошкоджень (1)
    fp1: string
    // group_cp32s44/group_va3uo30/fp2 [image] Фото пошкоджень (2)
    fp2: string
    // group_cp32s44/group_va3uo30/fp3 [image] Фото пошкоджень (3)
    fp3: string
    // group_cp32s44/group_va3uo30/fp4 [image] Фото пошкоджень (4)
    fp4: string
    // group_cp32s44/group_va3uo30/fp5 [image] Фото пошкоджень (5)
    fp5: string
    // group_cp32s44/group_va3uo30/fp6 [image] Фото пошкоджень (6)
    fp6: string
    // group_cp32s44/group_va3uo30/fp7 [image] Фото пошкоджень (7)
    fp7: string
    // group_cp32s44/group_va3uo30/fp8 [image] Фото пошкоджень (8)
    fp8: string
    // group_cp32s44/group_va3uo30/fp9 [image] Фото пошкоджень (9)
    fp9: string
    // group_cp32s44/group_va3uo30/fp10 [image] Фото пошкоджень (10)
    fp10: string
    // group_cp32s44/group_va3uo30/fp11 [image] Фото пошкоджень (11)
    fp11: string
    // group_cp32s44/group_va3uo30/fp12 [image] Фото пошкоджень (12)
    fp12: string
    // group_cp32s44/group_va3uo30/fp13 [image] Фото пошкоджень (13)
    fp13: string
    // group_cp32s44/group_va3uo30/fp14 [image] Фото пошкоджень (14)
    fp14: string
    // group_cp32s44/group_va3uo30/fp15 [image] Фото пошкоджень (15)
    fp15: string
    // group_sk5ss08/group_xf3tq10/_Number_of_damaged_windows [integer] Кількість пошкоджених вікон
    _Number_of_damaged_windows: number | undefined
    // group_sk5ss08/group_xf3tq10/ppvi [text] Площа пошкоджень вікон
    ppvi: string | undefined
    // group_sk5ss08/group_xf3tq10/__027 [integer] Кількість пошкоджених склопакетів
    __027: number | undefined
    // group_sk5ss08/group_xf3tq10/ppskv [text] Площа пошкоджень склопакетів
    ppskv: string | undefined
    // group_sk5ss08/group_uc1cp22/_Number_of_damaged_balcony [integer] Кількість пошкоджених балконів
    _Number_of_damaged_balcony: number | undefined
    // group_sk5ss08/group_uc1cp22/opbal [text] Об'єм пошкоджень балконів
    opbal: string | undefined
    // group_sk5ss08/group_uc1cp22/__028 [integer] Кількість пошкоджених склопакетів балконів
    __028: number | undefined
    // group_sk5ss08/group_uc1cp22/ppsb [text] Площа пошкоджених склопакетів балконів
    ppsb: string | undefined
    // group_sk5ss08/group_mn8qs18/Nodd [integer] Кількість пошкоджених дверей
    Nodd: number | undefined
    // group_sk5ss08/group_mn8qs18/kpd [text] Коментар до пошкоджених дверей
    kpd: string | undefined
    // group_sk5ss08/group_lb53s88/_Is_there_damage_to_the_ [select_one] Чи є пошкодження даху
    _Is_there_damage_to_the_: undefined | Option<'physical_family'>
    // group_sk5ss08/group_lb53s88/kpos [integer] Кількість пошкоджених скатів
    kpos: number | undefined
    // group_sk5ss08/group_lb53s88/kpbd [integer] Кількість пошкоджених балок даху
    kpbd: number | undefined
    // group_sk5ss08/group_lb53s88/ppda [integer] Площа пошкоджень даху
    ppda: number | undefined
    // group_sk5ss08/group_lb53s88/tm [select_one] Тип матеріала
    tm: undefined | Option<'tm'>
    // group_sk5ss08/group_ds2kc34/_Is_there_damage_water_p [select_one] Чи потрібне відновлення водопроводу
    _Is_there_damage_water_p: undefined | Option<'physical_family'>
    // group_sk5ss08/group_ds2kc34/kdv [text] Коментар до водопроводу
    kdv: string | undefined
    // group_sk5ss08/group_hh6un87/_Is_there_damage_electri [select_one] Чи потрібне відновлення електромережі
    _Is_there_damage_electri: undefined | Option<'physical_family'>
    // group_sk5ss08/group_hh6un87/kde [text] Коментар до електромережі
    kde: string | undefined
    // group_sk5ss08/group_as7hj54/__006 [select_one] Чи потрібне відновлення опалення
    __006: undefined | Option<'physical_family'>
    // group_sk5ss08/group_as7hj54/__023 [text] Коментар до опалення
    __023: string | undefined
    // group_sk5ss08/group_ex5kv65/__004 [select_one] Чи є незначні неструктурні пошкодження стін
    __004: undefined | Option<'physical_family'>
    // group_sk5ss08/group_ex5kv65/kdnnps [text] Коментар до незначних неструктурних пошкоджень стін
    kdnnps: string | undefined
    // group_sk5ss08/group_ko3fd97/__005 [select_one] Чи потрібен незначний ремонт тріщин у зовнішніх цегляних стінах
    __005: undefined | Option<'physical_family'>
    // group_sk5ss08/group_ko3fd97/kdnt [text] Коментар до незначних тріщин у зовнішніх цегляних стінах
    kdnt: string | undefined
    // group_nq8ia42/__009 [text] ПІБ Бенефіціара(Заявник)
    __009: string | undefined
    // group_nq8ia42/__008 [select_one] Вкажіть ваш статус
    __008: undefined | Option<'__008'>
    // group_nq8ia42/stv [select_one] Стать заявника(ВПО)
    stv: undefined | Option<'sph10k'>
    // group_nq8ia42/vtv [integer] Вік заявника (ВПО)
    vtv: number | undefined
    // group_nq8ia42/stb [select_one] Стать заявника(що постраждав від конфлікту)
    stb: undefined | Option<'sph10k'>
    // group_nq8ia42/vtb [integer] Вік заявника(що постраждав від конфлікту)
    vtb: number | undefined
    // group_nq8ia42/__016 [integer] Номер телефону
    __016: number | undefined
    // group_nq8ia42/aph [integer] Додатковий номер телефону
    aph: number | undefined
    // group_nq8ia42/ben_det_oblast [select_one] Виберіть область, де буде проходити реєстрація
    ben_det_oblast: undefined | Option<'ben_det_oblast'>
    // group_nq8ia42/ben_det_raion [select_one] Виберіть район, де буде проходити реєстрація
    ben_det_raion: undefined | Option<'ben_det_raion'>
    // group_nq8ia42/ben_det_hromada [select_one] Виберіть громаду, де відбувається реєстрація
    ben_det_hromada: undefined | Option<'ben_det_hromada'>
    // group_nq8ia42/ben_det_city [select_one] Виберіть місто, де відбувається реєстрація
    ben_det_city: undefined | Option<'ben_det_city'>
    // group_nq8ia42/__012 [text] Адреса пошкодження(вулиця)
    __012: string | undefined
    // group_nq8ia42/__013 [text] Номер будинку і корпус
    __013: string | undefined
    // group_nq8ia42/__014 [text] Номер квартири
    __014: string | undefined
    // group_nq8ia42/pas [text] Паспорт
    pas: string | undefined
    // group_nq8ia42/ipn [text] ІПН
    ipn: string | undefined
    // group_nq8ia42/__017 [text] Адреса за реєстрацією
    __017: string | undefined
    // group_nq8ia42/fd1 [image] Фото документів
    fd1: string
    // group_nq8ia42/fd2 [image] Фото документів
    fd2: string
    // group_nq8ia42/fd3 [image] Фото документів
    fd3: string
    // group_nq8ia42/fd4 [image] Фото документів
    fd4: string
    // group_nq8ia42/fd5 [image] Фото документів
    fd5: string
    // group_nq8ia42/fd6 [image] Фото документів
    fd6: string
    // group_nq8ia42/fd7 [image] Фото документів
    fd7: string
    // group_nq8ia42/fd8 [image] Фото документів
    fd8: string
    // group_nq8ia42/fd9 [image] Фото документів
    fd9: string
    // group_nq8ia42/fd10 [image] Фото документів
    fd10: string
    // group_nq8ia42/__018 [select_one] Тип об'єкту
    __018: undefined | Option<'__018'>
    // group_nq8ia42/_ [select_one] Ви були тимчасово переміщені і повернулися до свого приміщення?
    _: undefined | Option<'physical_family'>
    // group_nq8ia42/__019 [select_one] Скільки часу пройшло з вашого повернення
    __019: undefined | Option<'__019'>
    // group_nq8ia42/__001 [select_one] Чи є ви законним власником приміщення
    __001: undefined | Option<'physical_family'>
    // group_nq8ia42/kspp1 [image] Копія свідоцтва про право власності, договір купівлі-продажу, свідоцтво про право на спадщину (1)
    kspp1: string
    // group_nq8ia42/kspp2 [image] Копія свідоцтва про право власності, договір купівлі-продажу, свідоцтво про право на спадщину (2)
    kspp2: string
    // group_nq8ia42/kspp3 [image] Копія свідоцтва про право власності, договір купівлі-продажу, свідоцтво про право на спадщину (3)
    kspp3: string
    // group_nq8ia42/__002 [select_one] Чи є у вас договір оренди з орендодавцем
    __002: undefined | Option<'physical_family'>
    // group_nq8ia42/kdo1 [image] Копія договору оренди (1)
    kdo1: string
    // group_nq8ia42/kdo2 [image] Копія договору оренди (2)
    kdo2: string
    // group_nq8ia42/__021 [text] Ім'я, адреса, контакт (телефон/пошта) законного орендаря
    __021: string | undefined
    // group_nq8ia42/__010 [select_one] Чи є довіреність представляти власника
    __010: undefined | Option<'physical_family'>
    // group_nq8ia42/kdov1 [image] Копія довіреності (1)
    kdov1: string
    // group_nq8ia42/kdov2 [image] Копія довіреності (2)
    kdov2: string
    // group_nq8ia42/__020 [text] Ім'я, адреса, контакт (телефон/пошта) законного орендаря
    __020: string | undefined
    // group_nq8ia42/ovd [select_one] Отримували ви допомогу від іншої ГО за останні 3 місяці
    ovd: undefined | Option<'physical_family'>
    // group_nq8ia42/kovd [text] Коментар стосовно допомоги від іншої ГО за останні 3 місяці
    kovd: string | undefined
    // vpo/__022 [integer] Кількість людей в сім'ї, без  врахування заявника(ВПО)
    __022: number | undefined
    // vpo/sph1 [select_one] Стать першого члена сім'ї(ВПО)
    sph1: undefined | Option<'sph10k'>
    // vpo/vph1 [integer] Вік (кількість повних років) першого члена сім'ї(ВПО)
    vph1: number | undefined
    // vpo/sph2 [select_one] Стать другого члена сім'ї(ВПО)
    sph2: undefined | Option<'sph10k'>
    // vpo/vph2 [integer] Вік (кількість повних років) другого члена сім'ї(ВПО)
    vph2: number | undefined
    // vpo/sph3 [select_one] Стать третього члена сім'ї(ВПО)
    sph3: undefined | Option<'sph10k'>
    // vpo/vph3 [integer] Вік (кількість повних років) третього члена сім'ї(ВПО)
    vph3: number | undefined
    // vpo/sph4 [select_one] Стать четвертого члена сім'ї(ВПО)
    sph4: undefined | Option<'sph10k'>
    // vpo/vph4 [integer] Вік (кількість повних років) четвертого члена сім'ї(ВПО)
    vph4: number | undefined
    // vpo/sph5 [select_one] Стать п'ятого члена сім'ї(ВПО)
    sph5: undefined | Option<'sph10k'>
    // vpo/vph5 [integer] Вік (кількість повних років) п'ятого члена сім'ї(ВПО)
    vph5: number | undefined
    // vpo/sph6 [select_one] Стать шостого члена сім'ї(ВПО)
    sph6: undefined | Option<'sph10k'>
    // vpo/vph6 [integer] Вік (кількість повних років) шостого члена сім'ї(ВПО)
    vph6: number | undefined
    // vpo/sph7 [select_one] Стать сьомого члена сім'ї(ВПО)
    sph7: undefined | Option<'sph10k'>
    // vpo/vph7 [integer] Вік (кількість повних років) сьомого члена сім'ї(ВПО)
    vph7: number | undefined
    // vpo/sph8 [select_one] Стать восьмого члена сім'ї(ВПО)
    sph8: undefined | Option<'sph10k'>
    // vpo/vph8 [integer] Вік (кількість повних років) восьмого члена сім'ї(ВПО)
    vph8: number | undefined
    // vpo/sph9 [select_one] Стать дев'ятого члена сім'ї(ВПО)
    sph9: undefined | Option<'sph10k'>
    // vpo/vph9 [integer] Вік (кількість повних років) дев'ятого члена сім'ї(ВПО)
    vph9: number | undefined
    // vpo/sph10 [select_one] Стать деcятого члена сім'ї(ВПО)
    sph10: undefined | Option<'sph10k'>
    // vpo/vph10 [integer] Вік (кількість повних років) деcятого члена сім'ї(ВПО)
    vph10: number | undefined
    // conflict/__026 [integer] Кількість людей в сім'ї, без  врахування заявника(що постраждали від конфлікту)
    __026: number | undefined
    // conflict/sph1k [select_one] Стать першого члена сім'ї(що постраждали від конфлікту)
    sph1k: undefined | Option<'sph10k'>
    // conflict/vph1k [integer] Вік (кількість повних років) першого члена сім'ї(що постраждали від конфлікту)
    vph1k: number | undefined
    // conflict/sph2k [select_one] Стать другого члена сім'ї(що постраждали від конфлікту)
    sph2k: undefined | Option<'sph10k'>
    // conflict/vph2k [integer] Вік (кількість повних років) другого члена сім'ї(що постраждали від конфлікту)
    vph2k: number | undefined
    // conflict/sph3k [select_one] Стать третього члена сім'ї(що постраждали від конфлікту)
    sph3k: undefined | Option<'sph10k'>
    // conflict/vph3k [integer] Вік (кількість повних років) третього члена сім'ї(що постраждали від конфлікту)
    vph3k: number | undefined
    // conflict/sph4k [select_one] Стать четвертого члена сім'ї(що постраждали від конфлікту)
    sph4k: undefined | Option<'sph10k'>
    // conflict/vph4k [integer] Вік (кількість повних років) четвертого члена сім'ї(що постраждали від конфлікту)
    vph4k: number | undefined
    // conflict/sph5k [select_one] Стать п'ятого члена сім'ї(що постраждали від конфлікту)
    sph5k: undefined | Option<'sph10k'>
    // conflict/vph5k [integer] Вік (кількість повних років) п'ятого члена сім'ї(що постраждали від конфлікту)
    vph5k: number | undefined
    // conflict/sph6k [select_one] Стать шостого члена сім'ї(що постраждали від конфлікту)
    sph6k: undefined | Option<'sph10k'>
    // conflict/vph6k [integer] Вік (кількість повних років) шостого члена сім'ї(що постраждали від конфлікту)
    vph6k: number | undefined
    // conflict/sph7k [select_one] Стать сьомого члена сім'ї(що постраждали від конфлікту)
    sph7k: undefined | Option<'sph10k'>
    // conflict/vph7k [integer] Вік (кількість повних років) сьомого члена сім'ї(що постраждали від конфлікту)
    vph7k: number | undefined
    // conflict/sph8k [select_one] Стать восьмого члена сім'ї(що постраждали від конфлікту)
    sph8k: undefined | Option<'sph10k'>
    // conflict/vph8k [integer] Вік (кількість повних років) восьмого члена сім'ї(що постраждали від конфлікту)
    vph8k: number | undefined
    // conflict/sph9k [select_one] Стать дев'ятого члена сім'ї(що постраждали від конфлікту)
    sph9k: undefined | Option<'sph10k'>
    // conflict/vph9k [integer] Вік (кількість повних років) дев'ятого члена сім'ї(що постраждали від конфлікту)
    vph9k: number | undefined
    // conflict/sph10k [select_one] Стать десятого члена сім'ї(що постраждали від конфлікту)
    sph10k: undefined | Option<'sph10k'>
    // conflict/vph10k [integer] Вік (кількість повних років) десятого члена сім'ї(що постраждали від конфлікту)
    vph10k: number | undefined
    // criteria_scoring/cs_sh [select_multiple] Пов'язані з прихистком
    cs_sh: undefined | Option<'cs_sh'>[]
    // criteria_scoring/cs_se [select_multiple] Соціально-економічні
    cs_se: undefined | Option<'cs_se'>[]
    // criteria_scoring/cs_val [select_multiple] Вразливості
    cs_val: undefined | Option<'cs_val'>[]
    cal_sh: string
    cal_se: string
    cal_val: string
    cal_tol: string
    // criteria_scoring/ncal [note] Кількість критеріїв: ${cal_tol}
    ncal: string
    // result/cs_prot [select_one] У домогосподарства є ризики, пов`язані з соціально-правовим захистом
    cs_prot: undefined | Option<'physical_family'>
    // result/cs_prye [select_one] Ви надаєте свою згоду для передачі інформації іншим відділам
    cs_prye: undefined | Option<'physical_family'>
    // result/physical_family [select_one] Чи є фізично постраждалі в сім’ї в наслідок ракетного удару 19 серпня?
    physical_family: undefined | Option<'physical_family'>
    // result/form_help [select_one] В який формі вам більш приємливо отримати допомогу (на ланий час розглядається на дання коштів на ремонт)?
    form_help: undefined | Option<'form_help'>
    // result/__024 [date] Дата заповнення анкети
    __024: Date | undefined
    // result/__025 [text] Коментарі
    __025: string | undefined
    // result/__029 [geopoint] Мітка геолокації
    __029: string
  }
  export const options = {
    back_office: {
      cej: `Чернігів(CEJ)`,
      umy: `Суми(UMY)`,
    },
    damage_level: {
      light: `Light`,
      medium: `Medium`,
      heavy: `Heavy`,
    },
    __007: {
      MM: `Максим Мордовець`,
      AG: `Анастасія Железко`,
      KG: `Катерина Гарнага`,
      LS: `Людмила Шубіна`,
      DP: `Дмитро Петрусевич`,
      OP: `Олександр Плющ`,
      IR: `Ігор Ребенко`,
      OM: `Олександр Малахов`,
      AX: `Андрій Химченко`,
      PT: `Paul Thibault`,
      anna_potapenko: `Анна Потапенко`,
      VN: `Валерій Нечепоренко`,
      Omu: `Олександр Чикунов`,
      dp: `Dmytro Prokopenko`,
      AS: `Andrii Stovpchenko`,
      VS: `Viktoriia Stepanenko`,
    },
    physical_family: {
      yes: `Так`,
      no: `Ні`,
    },
    donor_repair: {
      unhcr: `UNHCR 2023`,
      echo: `ECHO`,
      bha: `BHA`,
      uhf6: `UHF 6`,
    },
    tm: {
      m1: `Шифер`,
      m2: `Металочерепиця`,
      m3: `Профнастил`,
      m4: `Ондулін`,
      m5: `М'яка (бітумна) черепиця`,
      m6: `Фальцева`,
    },
    __008: {
      idp: `ВПО`,
      conflict: `Людина, що постраждала від конфлікту`,
    },
    sph10k: {
      male: `Чоловіча`,
      female: `Жіноча`,
    },
    ben_det_oblast: {
      chernihivska: `Чернігівська`,
      sumyskaya: `Сумська`,
    },
    ben_det_raion: {
      chernihivskyi: `Чернігівський`,
      koriukivskyi: `Корюківський`,
      nizhynskyi: `Ніжинський`,
      'novhorod-siverskyi': `Новгород-Сіверський`,
      prylutskyi: `Прилуцький`,
      zarechnoye: `Зарічне`,
      sumy: `Сумський`,
      konotop: `Конотопський`,
      okhtyrka: `Охтирський`,
      romny: `Роменський`,
      shostka: `Шосткинський`,
    },
    ben_det_hromada: {
      zarechnoy: `Зарічне`,
      chernihivska_i: `Чернігівська`,
      ivanivska_i: `Іванівська`,
      kyinska: `Киїнська`,
      bakhmatska: `Бахмацька`,
      kyselivska: `Киселівська`,
      baturynska: `Батуринська`,
      bereznianska: `Березнянська`,
      bobrovytska: `Бобровицька`,
      borznianska: `Борзнянська`,
      desnianska: `Деснянська`,
      dmytrivska_2: `Дмитрівська`,
      dobrianska: `Добрянська`,
      honcharivska: `Гончарівська`,
      horodnianska: `Городнянська`,
      ichnianska: `Ічнянська`,
      kholmynska: `Холминська`,
      kiptivska: `Кіптівська`,
      komarivska: `Комарівська`,
      koriukivska: `Корюківська`,
      koropska: `Коропська`,
      kozeletska: `Козелецька`,
      krutivska: `Крутівська`,
      kulykivska: `Куликівська`,
      ladanska: `Ладанська`,
      liubetska: `Любецька`,
      losynivska: `Лосинівська`,
      lynovytska: `Линовицька`,
      makiivska: `Макіївська`,
      malodivytska: `Малодівицька`,
      menska: `Менська`,
      mrynska: `Мринська`,
      'mykhailo-kotsiubynska': `Михайло-Коцюбинська`,
      nizhynska: `Ніжинська`,
      nosivska: `Носівська`,
      'novhorod-siverska': `Новгород-Сіверська`,
      novobasanska: `Новобасанська`,
      novobilouska: `Новобілоуська`,
      olyshivska: `Олишівська`,
      osterska: `Остерська`,
      parafiivska: `Парафіївська`,
      plyskivska: `Плисківська`,
      ponornytska: `Понорницька`,
      prylutska: `Прилуцька`,
      ripkynska: `Ріпкинська`,
      sednivska: `Седнівська`,
      semenivska: `Семенівська`,
      snovska: `Сновська`,
      sosnytska: `Сосницька`,
      sribnianska: `Срібнянська`,
      sukhopolovianska: `Сухополов'янська`,
      talalaivska: `Талалаївська`,
      talalaivska_2: `Талалаївська`,
      tupychivska: `Тупичівська`,
      varvynska: `Варвинська`,
      vertiivska: `Вертіївська`,
      vysochanska: `Височанська`,
      yablunivska: `Яблунівська`,
      Sumyh: `Сумська`,
      Lebedynskah: `Лебединська`,
      Bezdrytskah: `Бездрицька`,
      Bilopilskah: `Білопільська`,
      'Verkhnyaya Syrovatskayah': `Верхньосироватська`,
      Vorozhbianskayah: `Ворожбянська`,
      Krasnopolskayah: `Краснопільська`,
      Mykolaivskah: `Миколаївська`,
      Miropilskah: `Миропільська`,
      Nyzhnosyrovatskah: `Нижньосироватська`,
      Sadovskayah: `Садівська`,
      Khotinskayah: `Хотінська`,
      Yunakivskah: `Юнаківська`,
      Konotopskayah: `Конотопська`,
      Putivlskayah: `Путивльська`,
      Bochechkovskayah: `Бочечківська`,
      Novoslobodskayah: `Новослобідська`,
      Popovskayah: `Попівська`,
      Dubovyazovskayah: `Дубов'язівська`,
      Okhtyrkah: `Охтирська`,
      Trostyanetskah: `Тростянецька`,
      Boromlyanskayah: `Боромлянська`,
      Kirikivskah: `Кириківська`,
      Velykopysarivskah: `Великописарівська`,
      Komyshanskah: `Комишанська`,
      Chernechchynskah: `Чернеччинська`,
      Chupakhivskah: `Чупахівська`,
      Shostkinskayah: `Шосткинська`,
      Hlukhivskah: `Глухівська`,
      'Znob-Novgorodskayah': `Зноб-Новгородська`,
      Esmanskayah: `Есманська`,
      Druzhbivskah: `Дружбівська`,
      'Seredina-Budskayah': `Середино-Будська`,
      Shalyginskayah: `Шалигинська`,
      Romenskah: `Роменська`,
      Nedryhaylivskah: `Недригайлівська`,
    },
    ben_det_city: {
      desnianka: `Деснянка`,
      dovzhyk: `Довжик`,
      khaliavyn: `Халявин`,
      khmilnytsia: `Хмільниця`,
      koshivka: `Кошівка`,
      kuvechychi: `Кувечичі`,
      mokhnatyn: `Мохнатин`,
      'novyi bilous': `Новий Білоус`,
      polubotky: `Полуботки`,
      redkivka: `Редьківка`,
      riabtsi: `Рябці`,
      rivnopillia: `Рівнопілля`,
      rohoshchi: `Рогощі`,
      roishche: `Роїще`,
      rudka: `Рудка`,
      ryzhyky: `Рижики`,
      'selianska sloboda': `Селянська Слобода`,
      shevchenka: `Шевченка`,
      'staryi bilous': `Старий Білоус`,
      tabaivka: `Табаївка`,
      unuchky: `Унучки`,
      yurivka: `Юр'ївка`,
      Sumyc: `Суми`,
      Bytitsac: `Битиця`,
      Vilshankac: `Вільшанка`,
      Lebedync: `Лебедин`,
      VelykyiVystorop: `Великий Вистороп`,
      SmallVystorop: `Малий Вистороп`,
      Bishkin: `Бішкінь`,
      Divination: `Ворожба`,
      Stalks: `Стеблянки`,
      Okhtyrkac: `Охтирка`,
      Shostkac: `Шостка`,
      Voronezhc: `Вороніж`,
      Sobychevec: `Собичеве`,
      Trostyanetsc: `Тростянець`,
      Bilkac: `Білка`,
      Stanovac: `Станова`,
      Buymerc: `Буймер`,
      Artemiastivkac: `Артеморястівка`,
      Skryahivkac: `Скрягівка`,
      "Soldier'sc": `Солдатське`,
      Kamenkac: `Кам'янка`,
      Nikitovkac: `Микитівка`,
      Novoselovkac: `Новоселівка`,
      Oleksinoc: `Олексино`,
      Semenkic: `Семереньки`,
      Putivlc: `Путивль`,
      Peresypkyc: `Пересипки`,
      Konotopc: `Конотоп`,
      Pidlypnec: `Підлипне`,
      Boromlyac: `Боромля`,
      Kirikivkac: `Кириківка`,
      zarechno: `Зарічне`,
      kyinka: `Киїнка`,
      hushchyn: `Гущин`,
      zhavinka: `Жавинка`,
      pavlivka: `Павлівка`,
      'trisviatska Sloboda': `Трисвятська Слобода`,
      shestovytsia: `Шестовиця`,
      kyselivka: `Киселівка`,
      berezanka: `Березанка`,
      brusyliv: `Брусилів`,
      kobylianka: `Кобилянка`,
      morgulychi: `Моргуличі`,
      petrovo: `Петрове`,
      snovianka: `Снов'янка`,
      boromyky: `Боромики`,
      petrushyn: `Петрушин`,
      malynivka: `Малинівка`,
      stasi: `Стаси`,
      tovstolis: `Товстоліс`,
      terekhivka: `Терехівка`,
      novoselivka: `Новоселівка`,
      voznesenskoye: `Вознесенське`,
      ivanivka: `Іванівка`,
      ladynka: `Ладинка`,
      krasne: `Красне`,
      kolychivka: `Количівка`,
      sloboda: `Слобода`,
      anisiv: `Анисів`,
      sands: `Піски`,
      budy: `Буди`,
      yahidne: `Ягідне`,
      drucke: `Друцьке`,
      zolotynka: `Золотинка`,
      skorinets: `Скорінець`,
      viktorivka: `Вікторівка`,
      drachivshchyna: `Драчівщина`,
      lukashivka: `Лукашівка`,
      yenkiv: `Єньків`,
      pidhirne: `Підгірне`,
      chernihiv: `Чернігів`,
    },
    __018: {
      appa: `Квартира`,
      ph: `Будинок`,
    },
    __019: {
      '3_m': `Повернувся за останні 3 місяці`,
      '3-6_m': `Повернувся через 3-6 місяців`,
      '6_m': `Повернувся більше 6 місяців`,
    },
    cs_sh: {
      lm: `Легкий, середній, тяжкий тип пошкоджень`,
      pl: `Погані житлові умови через пошкодження`,
      dp: `Пошкоджене майно - єдине майно сім'ї`,
      tm: `2 або більше сімей живуть в одному будинку, квартирі`,
    },
    cs_se: {
      il: `Рівень доходу менше ніж 5400 грн на людину на місяць`,
      hf: `У глави сім'ї немає можливості отримати роботу (передпенсійний вік, особисті обставини)`,
    },
    cs_val: {
      fc: `У сім'ї є діти`,
      fp: `У сім'ї є вагітна жінка або, яка годує груддю`,
      fe: `У сім'ї є люди похилого віку 60+`,
      hp: `У сім'ї є інваліди`,
      sp: `Самотня людина`,
      fm: `У сім'ї є член(и) сім'ї з хронічними захворюваннями, що вимагають серйозних щомісячних витрат`,
      spa: `Одинокий батько/мати, опікун/опікунка`,
    },
    form_help: {
      hco: `Підрядник`,
      hfu: `Кошти`,
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
      _Number_of_damaged_windows: _._Number_of_damaged_windows ? +_._Number_of_damaged_windows : undefined,
      __027: _.__027 ? +_.__027 : undefined,
      _Number_of_damaged_balcony: _._Number_of_damaged_balcony ? +_._Number_of_damaged_balcony : undefined,
      __028: _.__028 ? +_.__028 : undefined,
      Nodd: _.Nodd ? +_.Nodd : undefined,
      kpos: _.kpos ? +_.kpos : undefined,
      kpbd: _.kpbd ? +_.kpbd : undefined,
      ppda: _.ppda ? +_.ppda : undefined,
      vtv: _.vtv ? +_.vtv : undefined,
      vtb: _.vtb ? +_.vtb : undefined,
      __016: _.__016 ? +_.__016 : undefined,
      aph: _.aph ? +_.aph : undefined,
      __022: _.__022 ? +_.__022 : undefined,
      vph1: _.vph1 ? +_.vph1 : undefined,
      vph2: _.vph2 ? +_.vph2 : undefined,
      vph3: _.vph3 ? +_.vph3 : undefined,
      vph4: _.vph4 ? +_.vph4 : undefined,
      vph5: _.vph5 ? +_.vph5 : undefined,
      vph6: _.vph6 ? +_.vph6 : undefined,
      vph7: _.vph7 ? +_.vph7 : undefined,
      vph8: _.vph8 ? +_.vph8 : undefined,
      vph9: _.vph9 ? +_.vph9 : undefined,
      vph10: _.vph10 ? +_.vph10 : undefined,
      __026: _.__026 ? +_.__026 : undefined,
      vph1k: _.vph1k ? +_.vph1k : undefined,
      vph2k: _.vph2k ? +_.vph2k : undefined,
      vph3k: _.vph3k ? +_.vph3k : undefined,
      vph4k: _.vph4k ? +_.vph4k : undefined,
      vph5k: _.vph5k ? +_.vph5k : undefined,
      vph6k: _.vph6k ? +_.vph6k : undefined,
      vph7k: _.vph7k ? +_.vph7k : undefined,
      vph8k: _.vph8k ? +_.vph8k : undefined,
      vph9k: _.vph9k ? +_.vph9k : undefined,
      vph10k: _.vph10k ? +_.vph10k : undefined,
      cs_sh: _.cs_sh?.split(' '),
      cs_se: _.cs_se?.split(' '),
      cs_val: _.cs_val?.split(' '),
      __024: _.__024 ? new Date(_.__024) : undefined,
    }) as T
}
