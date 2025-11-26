import {Theme} from '@mui/material'
import * as Datatable from '@infoportal/client-datatable'
import {CellSelectType} from '../input/CellSelectType'
import {selectsQuestionTypes} from '../core/settings'
import {CellSelectListName} from '../input/CellSelectListName'
import {CellText} from '../input/CellText'
import {CellBoolean} from '../input/CellBoolean'
import {CellFormula} from '../input/CellFormula'
import {CellSelectAppearance} from '../input/CellSelectAppearance'
import {Api} from '@infoportal/api-sdk'

export const simpleSelectsQuestionTypes = ['select_one', 'select_multiple']
export const simpleSelectsQuestionTypesSet = new Set(selectsQuestionTypes)

export function getSurveyColumns({
  t,
  translations,
}: {
  t: Theme
  translations: string[]
}): Datatable.Column.Props<Api.Form.Question>[] {
  return [
    {
      id: 'type',
      head: 'type',
      type: 'select_one',
      width: 190,
      render: row => {
        return {
          value: row.type,
          label: <CellSelectType cellPointer={{table: 'survey', rowKey: row.$kuid, field: 'type'}} />,
          option: row.type,
        }
      },
    },
    {
      id: 'select_from_list_name',
      head: 'select_from_list_name',
      type: 'select_one',
      render: row => {
        return {
          value: row.select_from_list_name,
          label: simpleSelectsQuestionTypesSet.has(row.type) ? (
            <CellSelectListName cellPointer={{table: 'survey', rowKey: row.$kuid, field: 'select_from_list_name'}} />
          ) : undefined,
          option: row.select_from_list_name,
        }
      },
    },
    {
      id: 'name',
      head: 'name',
      type: 'string',
      render: row => {
        return {
          value: row.name,
          label: (
            <CellText
              cellPointer={{table: 'survey', rowKey: row.$kuid, field: 'name'}}
              sx={{
                color: t.vars.palette.text.secondary,
                fontFamily: 'monospace',
              }}
            />
          ),
          option: row.name,
        }
      },
    },
    {
      id: 'required',
      head: 'required',
      type: 'select_one',
      width: 40,
      align: 'center',
      render: row => {
        return {
          value: '' + row.required,
          label: <CellBoolean cellPointer={{table: 'survey', rowKey: row.$kuid, field: 'required'}} />,
          option: '' + row.required,
        }
      },
    },
    ...translations.map((lang, i) => {
      return Datatable.Column.make<Api.Form.Question>({
        id: 'label:' + lang,
        head: 'label' + ':' + lang,
        width: 260,
        type: 'string',
        render: row => {
          const value = row.label?.[i]
          return {
            value: value,
            label: <CellText cellPointer={{table: 'survey', rowKey: row.$kuid, field: 'label', fieldIndex: i}} />,
            option: value,
          }
        },
      })
    }),
    ...translations.map((lang, i) => {
      return Datatable.Column.make<Api.Form.Question>({
        id: 'hint:' + lang,
        head: 'hint' + ':' + lang,
        type: 'string',
        width: 280,
        render: row => {
          const value = row.hint?.[i]
          return {
            value: value,
            label: (
              <CellText
                cellPointer={{table: 'survey', rowKey: row.$kuid, fieldIndex: i, field: 'hint'}}
                sx={{color: t.vars.palette.text.secondary}}
              />
            ),
            option: value,
          }
        },
      })
    }),
    {
      id: 'relevant',
      head: 'relevant',
      type: 'string',
      render: row => {
        return {
          value: row.relevant,
          label: <CellFormula cellPointer={{table: 'survey', rowKey: row.$kuid, field: 'relevant'}} />,
        }
      },
    },
    {
      id: 'calculation',
      head: 'calculation',
      type: 'string',
      render: row => {
        return {
          value: row.calculation,
          label: <CellFormula cellPointer={{table: 'survey', rowKey: row.$kuid, field: 'calculation'}} />,
        }
      },
    },
    {
      id: 'appearance',
      head: 'appearance',
      type: 'string',
      render: row => {
        return {
          value: row.appearance,
          label: (
            <CellSelectAppearance
              questionType={row.type}
              cellPointer={{table: 'survey', rowKey: row.$kuid, field: 'appearance'}}
            />
          ),
        }
      },
    },
    {
      id: 'default',
      head: 'default',
      type: 'string',
      render: row => {
        return {
          value: row.default,
          label: <CellText cellPointer={{table: 'survey', rowKey: row.$kuid, field: 'default'}} />,
        }
      },
    },
    {
      id: 'constraint',
      head: 'constraint',
      type: 'string',
      render: row => {
        return {
          value: row.constraint,
          label: <CellFormula cellPointer={{table: 'survey', rowKey: row.$kuid, field: 'constraint'}} />,
        }
      },
    },
    ...translations.map((lang, i) => {
      return Datatable.Column.make<Api.Form.Question>({
        id: 'constraint_message:' + lang,
        head: 'constraint_message' + ':' + lang,
        type: 'string',
        render: row => {
          const value = row.constraint_message?.[i]
          return {
            value: value,
            label: (
              <CellText
                cellPointer={{
                  fieldIndex: i,
                  table: 'survey',
                  rowKey: row.$kuid,
                  field: 'constraint_message',
                }}
                sx={{color: t.vars.palette.text.secondary}}
              />
            ),
            option: value,
          }
        },
      })
    }),
    {
      id: 'choice_filter',
      head: 'choice_filter',
      type: 'string',
      render: row => {
        return {
          value: row.choice_filter,
          label: selectsQuestionTypes.includes(row.type) && (
            <CellText cellPointer={{table: 'survey', rowKey: row.$kuid, field: 'choice_filter'}} />
          ),
        }
      },
    },
  ]
}
