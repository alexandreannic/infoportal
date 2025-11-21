import {SelectOption, SelectSingle} from '@infoportal/client-core'
import {CellPointer, skippedQuestionTypes, useCell, XlsSurveyRow} from '../core/useStore'
import {BoxProps} from '@mui/material'
import {Obj, Seq, seq} from '@axanc/ts-utils'
import {Icon} from '@infoportal/client-datatable'
import {Ip} from '@infoportal/api-sdk'

type QType = Exclude<Ip.Form.QuestionType, (typeof skippedQuestionTypes)[number]>

const separators: Seq<QType> = seq(['end_repeat', 'select_multiple', 'datetime'])

const mapping: Record<QType, {icon: string; label: string}> = {
  begin_group: {icon: 'folder_open', label: 'begin_group'},
  end_group: {icon: 'folder', label: 'end_group'},
  begin_repeat: {icon: 'repeat', label: 'begin_repeat'},
  end_repeat: {icon: 'repeat', label: 'end_repeat'},
  select_one: {icon: 'radio_button_checked', label: 'select_one'},
  select_one_from_file: {icon: 'upload_file', label: 'select_one_from_file'},
  select_multiple: {icon: 'checklist', label: 'select_multiple'},
  today: {icon: 'today', label: 'today'},
  date: {icon: 'calendar_month', label: 'date'},
  datetime: {icon: 'event', label: 'datetime'},
  text: {icon: 'short_text', label: 'text'},
  integer: {icon: 'pin', label: 'integer'},
  decimal: {icon: '123', label: 'decimal'},
  file: {icon: 'attach_file', label: 'file'},
  image: {icon: 'image', label: 'image'},
  geopoint: {icon: 'place', label: 'geopoint'},
  note: {icon: 'sticky_note_2', label: 'note'},
  calculate: {icon: 'functions', label: 'calculate'},
}

const options: SelectOption<QType>[] = seq(Obj.entries(mapping)).map(([k, v]) => {
  return {
    'data-value': k,
    key: k,
    value: k,
    children: (
      <
        // sx={{borderBottom: separators.has(k) ? '1px solid silver' : undefined}}
      >
        <Icon data-value={k} children={v.icon} sx={{color: t => t.vars.palette.text.secondary, ml: -0.5, mr: 1}} />{' '}
        {v.label}
      </>
    ),
  }
})

export const CellSelectType = ({
  cellPointer,
  sx,
  ...props
}: Pick<BoxProps, 'sx'> & {
  cellPointer: CellPointer
}) => {
  const cell = useCell<QType>(cellPointer)
  return (
    <SelectSingle<QType>
      options={options}
      MenuProps={{
        PaperProps: {
          sx: separators.reduceObject(_ => [`& [data-value="${_}"]`, {borderBottom: '1px solid silver'}]),
        },
      }}
      hideNullOption
      renderValue={_ => (mapping[_]?.icon ? <Icon>{mapping[_]?.icon}</Icon> : undefined)}
      value={cell.value}
      onChange={(value, e) => cell.onChange(value)}
    />
  )
}
