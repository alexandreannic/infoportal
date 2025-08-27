import {fnSwitch} from '@axanc/ts-utils'
import React from 'react'
import {IconProps} from '@mui/material'
import {Kobo} from 'kobo-sdk'
import {DatatableHeadIcon} from '@/DatatableHead.js'

export const DatatableHeadTypeIconByKoboType = ({
  children,
  ...props
}: {
  children: Kobo.Form.QuestionType
} & Pick<IconProps, 'sx' | 'color'>) => {
  return (
    <DatatableHeadIcon children={fnSwitch(children, koboIconMap, () => 'short_text')} tooltip={children} {...props} />
  )
}

export const koboIconMap: Record<Kobo.Form.QuestionType, string> = {
  image: 'image',
  file: 'description',
  calculate: 'functions',
  select_one_from_file: 'attach_file',
  username: 'short_text',
  text: 'short_text',
  decimal: 'tag',
  integer: 'tag',
  note: 'info',
  end: 'event',
  start: 'event',
  datetime: 'event',
  today: 'event',
  date: 'event',
  begin_repeat: 'repeat',
  select_one: 'radio_button_checked',
  select_multiple: 'check_box',
  geopoint: 'location_on',
  begin_group: '',
  deviceid: '',
  end_group: '',
  end_repeat: '',
}
