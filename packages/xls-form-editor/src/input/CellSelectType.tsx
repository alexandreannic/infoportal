import {skippedQuestionTypes} from '../core/useStore'
import {CellPointer, useCell} from '../core/useCell'
import {BoxProps, useTheme} from '@mui/material'
import {Obj, Seq, seq} from '@axanc/ts-utils'
import {Icon} from '@infoportal/client-datatable'
import {Api} from '@infoportal/api-sdk'
import * as Core from '@infoportal/client-core'
import {questionTypeMuiIcon} from '@infoportal/form-helper'

type QType = Exclude<Api.Form.QuestionType, (typeof skippedQuestionTypes)[number]>

const separators: Seq<QType> = seq(['end_repeat', 'select_multiple', 'datetime'])

const options: Core.SelectOption<QType>[] = seq(Obj.keys(questionTypeMuiIcon) as QType[])
  .filter(_ => !skippedQuestionTypes.includes(_ as any))
  .map(qType => {
    return {
      'data-value': qType,
      key: qType,
      value: qType,
      children: (
        <
          // sx={{borderBottom: separators.has(qType) ? '1px solid silver' : undefined}}
        >
          <Icon
            data-value={qType}
            children={questionTypeMuiIcon[qType]}
            sx={{color: t => t.vars.palette.text.secondary, ml: -0.5, mr: 1}}
          />{' '}
          {qType}
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
