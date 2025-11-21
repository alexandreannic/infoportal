import {CellPointer, skippedQuestionTypes, useCell, XlsSurveyRow} from '../core/useStore'
import {BoxProps, SxProps, Theme, useTheme} from '@mui/material'
import {Obj, Seq, seq} from '@axanc/ts-utils'
import {Icon} from '@infoportal/client-datatable'
import {Ip} from '@infoportal/api-sdk'
import * as Core from '@infoportal/client-core'
import {styleUtils} from '@infoportal/client-core'

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

const options: Core.SelectOption<QType>[] = seq(Obj.entries(mapping)).map(([k, v]) => {
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
export const SelectType = ({
  value,
  onChange,
  MenuProps,
  ...props
}: {
  value?: QType
  onChange: (_: QType) => void
} & Omit<Core.IpSelectSingleProps, 'options' | 'value' | 'onChange'>) => {
  return (
    <Core.SelectSingle<QType>
      options={options}
      MenuProps={{
        ...MenuProps,
        PaperProps: {
          ...MenuProps?.PaperProps,
          sx: {
            ...MenuProps?.PaperProps?.sx,
            ...separators.reduceObject(_ => [`& [data-value="${_}"]`, {borderBottom: '1px solid silver'}]),
          },
        },
      }}
      hideNullOption
      // renderValue={_ => (mapping[_]?.icon ? <Icon>{mapping[_]?.icon}</Icon> : undefined)}
      value={value}
      onChange={(value, e) => onChange(value)}
      {...(props as any)}
    />
  )
}

export const CellSelectType = ({
  cellPointer,
  sx,
}: Pick<BoxProps, 'sx'> & {
  cellPointer: CellPointer
}) => {
  const t = useTheme()
  const cell = useCell<QType>(cellPointer)
  return (
    <SelectType
      value={cell.value}
      onChange={cell.onChange}
      slotProps={{
        root: {
          sx: {
            height: '100%',
          },
        },
      }}
      sx={{
        borderRadius: 50,
        background: t.vars.palette.action.selected,
        verticalAlign: 'middle',
        height: 'calc(100% - 4px)',
        margin: '2px 8px',
        ...sx,
      }}
    />
  )
}
