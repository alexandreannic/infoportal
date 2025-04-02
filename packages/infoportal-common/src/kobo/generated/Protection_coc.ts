export namespace Protection_coc {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aRBEzakmsMPpw8VoJG8Gpk
  export interface T {
    start: string
    end: string
    // begin_group_qS00qeNhn/date [date] Date
    date: Date | undefined
    // begin_group_qS00qeNhn/faciliator_name_1 [text] Training faciliator name
    faciliator_name_1: string | undefined
    // begin_group_qS00qeNhn/faciliator_position_1 [text] Training faciliator position
    faciliator_position_1: string | undefined
    // begin_group_qS00qeNhn/faciliator_name_2 [text] Training faciliator name
    faciliator_name_2: string | undefined
    // begin_group_qS00qeNhn/faciliator_position_2 [text] Training faciliator position
    faciliator_position_2: string | undefined
    // begin_group_qS00qeNhn/date_training [date] Date of training
    date_training: Date | undefined
    // begin_group_qS00qeNhn/office_staff_trained [select_one] Area/base office where the staff trained are based
    office_staff_trained: undefined | Option<'office_staff_trained'>
    // begin_group_qS00qeNhn/office_staff_trained_other [text] If “Other” - Please, specify
    office_staff_trained_other: string | undefined
    // begin_group_qS00qeNhn/modality_training [select_one] Modality of training
    modality_training: undefined | Option<'modality_training'>
    // begin_group_qS00qeNhn/training_topic [select_one] Training topic
    training_topic: undefined | Option<'training_topic'>
    // begin_group_qS00qeNhn/training_topic_other [text] If “Other” - Please, specify
    training_topic_other: string | undefined
    // begin_group_qS00qeNhn/duration_training [select_one] Duration of training
    duration_training: undefined | Option<'duration_training'>
    // begin_group_qS00qeNhn/num_part [integer] Number of training participants
    num_part: number | undefined
    // training_participants [begin_repeat] Training participants
    training_participants:
      | {
          staff_email: string | undefined
          staff_name: string | undefined | undefined
          staff_position: string | undefined | undefined
          staff_gender: undefined | Option<'staff_gender'> | undefined
        }[]
      | undefined
  }
  export const options = {
    office_staff_trained: {
      lviv: `Lviv`,
      dnipro: `Dnipro`,
      kharkiv: `Kharkiv`,
      sloviansk: `Sloviansk`,
      mykolaiv: `Mykolaiv`,
      kyiv: `Kyiv`,
      ivankiv: `Ivankiv`,
      kherson: `Kherson`,
      sumy: `Sumy`,
      chernihiv: `Chernihiv`,
      ichna: `Ichna`,
      other: `Other`,
    },
    modality_training: {
      online: `Online`,
      inperson: `In-person`,
    },
    training_topic: {
      pseah: `PSEAH`,
      pseah_safeguarding: `PSEAH + Safeguarding`,
      safeguarding: `Safeguarding`,
      code_conduct: `Code of Conduct`,
      code_conduct_pseah_safeguarding: `Code of Conduct + PSEAH/Safeguarding`,
      other: `Other`,
    },
    duration_training: {
      '2_hour': `2 hour`,
      '3_hour': `3 hour`,
      half_day: `Half day`,
      full_day: `Full day`,
    },
    staff_gender: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
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
      date_training: _.date_training ? new Date(_.date_training) : undefined,
      num_part: _.num_part ? +_.num_part : undefined,
      training_participants: _['training_participants']?.map(extractQuestionName).map((_: any) => {
        return _
      }),
    }) as T
}
