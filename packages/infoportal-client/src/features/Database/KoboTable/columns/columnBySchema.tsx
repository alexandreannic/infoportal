import {
  KoboCustomDirective,
  KoboFlattenRepeatedGroup,
  KoboSchemaHelper,
  KoboSubmissionMetaData,
  removeHtml,
} from 'infoportal-common'
import {useI18n} from '@/core/i18n/I18n'
import {fnSwitch, map, seq} from '@alexandreannic/ts-utils'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import React from 'react'
import {DatatableHeadIcon, DatatableHeadIconByType} from '@/shared/Datatable/DatatableHead'
import {alpha, IconProps, Theme} from '@mui/material'
import {IpBtn, TableEditCellBtn, Txt} from '@/shared'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {getKoboAttachmentUrl, KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {formatDate, formatDateTime, Messages} from '@/core/i18n/localization/en'
import {KoboExternalFilesIndex} from '@/features/Database/KoboTable/DatabaseKoboContext'
import DOMPurify from 'dompurify'
import {Kobo} from 'kobo-sdk'

export const MissingOption = ({value}: {value?: string}) => {
  const {m} = useI18n()
  return (
    <span title={value}>
      <TableIcon color="disabled" tooltip={m._koboDatabase.valueNoLongerInOption} sx={{mr: 1}} children="error" />
      {value}
    </span>
  )
}

const ignoredColType: Set<Kobo.Form.QuestionType> = new Set(['begin_group'])

const noEditableColsId: Set<string> = new Set<keyof KoboSubmissionMetaData>([
  'start',
  'end',
  'version',
  // 'date',
  'uuid',
  'validationStatus',
  'validatedBy',
  'lastValidatedTimestamp',
  'geolocation',
  'tags',
])

const editableColsType: Set<Kobo.Form.QuestionType> = new Set([
  'select_one',
  'calculate',
  'select_multiple',
  'text',
  'integer',
  'decimal',
  'date',
  'datetime',
])

export namespace DirectiveTemplate {
  export type Template = {
    icon: string
    color: string
    label: (q: Kobo.Form.Question, m: Messages) => string
  }
  const make = <T extends KoboCustomDirective.Name>(directive: T, template: Template): Record<T, Template> =>
    ({
      [directive]: template,
    }) as any

  export const render = {
    ...make(KoboCustomDirective.Name.TRIGGER_EMAIL, {
      icon: 'forward_to_inbox',
      color: '#A335EE',
      label: (q, m) => {
        const directiveName = q.name.replace(KoboCustomDirective.make('TRIGGER_EMAIL'), '')
        if (directiveName === '') return m._koboDatabase.autoEmail
        return directiveName.replaceAll('_', ' ')
      },
    }),
  }
}

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

type Data = Record<string, any>
type Row = KoboFlattenRepeatedGroup.Data

export type ColumnBySchemaGeneratorProps = {
  m: Messages
  getRow?: (_: Data) => Row
  schema: KoboSchemaHelper.Bundle
  formId: Kobo.FormId
  onEdit?: (name: string) => void
  externalFilesIndex?: KoboExternalFilesIndex
  onRepeatGroupClick?: (_: {name: string; row: Row; event: any}) => void
  t: Theme
}

export const colorRepeatedQuestionHeader = (t: Theme) => alpha(t.palette.info.light, 0.22)

export const columnBySchemaGenerator = ({
  getRow = (_) => _ as Row,
  onEdit,
  formId,
  externalFilesIndex,
  schema,
  onRepeatGroupClick,
  m,
  t,
}: ColumnBySchemaGeneratorProps) => {
  const getCommon = (
    q: Kobo.Form.Question,
  ): Pick<
    DatatableColumn.Props<any>,
    'id' | 'groupLabel' | 'group' | 'typeIcon' | 'typeLabel' | 'head' | 'subHeader'
  > => {
    return {
      id: q.name,
      typeLabel: q.type,
      ...map(q.$xpath.split('/')[0], (value) => ({groupLabel: schema.translate.question(value), group: value})),
      ...(onEdit && editableColsType.has(q.type) && !noEditableColsId.has(q.name)
        ? {
            subHeader: <TableEditCellBtn onClick={() => onEdit(q.name)} />,
          }
        : {
            typeIcon: <DatatableHeadTypeIconByKoboType children={q.type} />,
          }),
      head: removeHtml(schema.translate.question(q.name)?.replace(/^#*/, '')),
    }
  }

  const getValue = (row: Row, name: string): any => {
    return getRow(row)[name]
  }

  const getRepeatGroup = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'string',
      styleHead: {
        background: colorRepeatedQuestionHeader(t),
      },
      render: (row: Row) => {
        const value = getValue(row, name) as any[]
        return {
          export: value?.length,
          value: value?.length,
          label: value && (
            <IpBtn
              children={value.length}
              style={{padding: '0 4px'}}
              onClick={(event) => {
                onRepeatGroupClick?.({
                  name,
                  row,
                  event,
                })
              }}
            />
          ),
        }
      },
    }
  }

  const getImage = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'string',
      render: (row: Row) => {
        const value = getValue(row, name) as string
        return {
          value,
          tooltip: value,
          export: getKoboAttachmentUrl({formId, answerId: row.id, attachments: row.attachments, fileName: value}),
          label: <KoboAttachedImg answerId={row.id} formId={formId} attachments={row.attachments} fileName={value} />,
        }
      },
    }
  }

  const getFile = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'string',
      render: (row: Row) => {
        const fileName = getValue(row, name) as string
        const url = getKoboAttachmentUrl({formId, answerId: row.id, fileName, attachments: row.attachments})
        return {
          export: url,
          value: fileName ?? DatatableUtils.blank,
          label: (
            <Txt link>
              <a href={url} target="_blank">
                {fileName}
              </a>
            </Txt>
          ),
          // label: <Txt link><a href={koboImgHelper({fileName, attachments: row.attachments}).fullUrl} target="_blank">{fileName}</a></Txt>
        }
      },
    }
  }

  // const getCalculate = (name: string) => {
  //   const q = schema.helper.questionIndex[name]
  //   return {
  //     ...getCommon(q),
  //     type: 'select_one',
  //     options: () => seq(data).map(_ => getRow(_)[name]).distinct(_ => _).map(_ => ({label: _ as string, value: _ as string})),
  //     renderQuick: (row: Row) => getValue(row, name) as string,
  //   }
  // }

  const getIpTriggerEmail = (name: string) => {
    const q = schema.helper.questionIndex[name]
    const template = DirectiveTemplate.render.TRIGGER_EMAIL
    const x: DatatableColumn.Props<any> = {
      ...getCommon(q),
      styleHead: {
        color: template.color,
      },
      head: template.label(q, m),
      type: 'string',
      typeIcon: (
        <TableIcon
          fontSize="small"
          sx={{marginRight: 'auto', color: template.color}}
          tooltip={
            <>
              <div style={{marginBottom: t.spacing(1)}}>{m._koboDatabase.autoEmailDesc}</div>
              <div
                style={{
                  background: t.palette.background.paper,
                  color: t.palette.text.primary,
                  marginBottom: t.spacing(0.5),
                  padding: t.spacing(0.5),
                  borderRadius: t.shape.borderRadius - 3,
                }}
              >
                <div style={{fontWeight: 'bold', marginBottom: t.spacing(1)}}>{q.label?.[0]}</div>
                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(q.hint?.[0] ?? '')}} />
              </div>
            </>
          }
        >
          {template.icon}
        </TableIcon>
      ),
      render: (row: Row) => {
        const value = getValue(row, name)
        return {
          label: value,
          value: value,
        }
      },
    }
    return x
  }

  const getSelectOneFromFile = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'string',
      renderQuick: (row: Row) => {
        return externalFilesIndex?.[q.file!]?.[row[name] as string]?.label ?? getValue(row, name)
      },
    }
  }

  const getText = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'string',
      width: q.appearance === 'multiline' ? 240 : undefined,
      renderQuick: (row: Row) => getValue(row, name) as string,
    }
  }

  const getInteger = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'number',
      renderQuick: (row: Row) => getValue(row, name) as number,
    }
  }

  const getNote = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'string',
      renderQuick: (row: Row) => getValue(row, name) as string,
    }
  }

  const getDate = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'date',
      render: (row: Row) => {
        const _ = getValue(row, name) as Date | undefined
        const time = formatDateTime(_)
        return {
          label: formatDate(_),
          value: _,
          tooltip: time,
          export: time,
        }
      },
    }
  }

  const getSelectOne = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'select_one',
      render: (row: Row) => {
        const v = getValue(row, name) as string | undefined
        const render = schema.translate.choice(name, v)
        return {
          export: render,
          value: v,
          tooltip: render ?? m._koboDatabase.valueNoLongerInOption,
          label: render ?? <MissingOption value={v} />,
        }
      },
    }
  }

  const getSelectMultiple = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'select_multiple',
      options: () =>
        schema.helper.choicesIndex[q.select_from_list_name!].map((_) => ({
          value: _.name,
          label: schema.translate.choice(name, _.name),
        })),
      render: (row: Row) => {
        const v = getValue(row, name) as string[] | undefined
        try {
          const label = v?.map((_) => schema.translate.choice(name, _)).join(' | ')
          return {
            label,
            export: label,
            tooltip: label,
            value: v,
          }
        } catch (e: any) {
          console.warn('Cannot translate')
          const fixedV = JSON.stringify(v)
          return {
            label: fixedV,
            value: [fixedV],
          }
        }
      },
    }
  }

  const getGeopoint = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'string',
      renderQuick: (row: Row) => JSON.stringify(getValue(row, name)),
    }
  }

  const getDefault = (name: string) => {
    const q = schema.helper.questionIndex[name]
    return {
      ...getCommon(q),
      type: 'string',
      renderQuick: (row: Row) => JSON.stringify(getValue(row, name)),
    }
  }

  const getBy = {
    image: getImage,
    file: getFile,
    calculate: getText,
    select_one_from_file: getSelectOneFromFile,
    username: getText,
    text: getText,
    deviceid: getText,
    decimal: getInteger,
    integer: getInteger,
    note: getNote,
    end: getDate,
    start: getDate,
    datetime: getDate,
    today: getDate,
    date: getDate,
    begin_repeat: getRepeatGroup,
    select_one: getSelectOne,
    select_multiple: getSelectMultiple,
    geopoint: getGeopoint,
  }

  const getByQuestion = (q: Kobo.Form.Question): undefined | DatatableColumn.Props<any> => {
    if (ignoredColType.has(q.type)) return
    if (q.name?.startsWith(KoboCustomDirective.make('TRIGGER_EMAIL'))) {
      return getIpTriggerEmail(q.name)
    }
    const fn = (getBy as any)[q.type]
    return fn ? fn(q.name) : getDefault(q.name)
  }

  const getByQuestions = (questions: Kobo.Form.Question[]): DatatableColumn.Props<any>[] => {
    return seq(questions).map(getByQuestion).compact()
  }

  const getId = (): DatatableColumn.Props<any> => {
    return {
      type: 'id',
      id: 'id',
      head: 'ID',
      typeIcon: <DatatableHeadIconByType type="id" />,
      className: 'td-id',
      style: (row) => {
        const data = getRow(row) as KoboFlattenRepeatedGroup.Data
        if (data[KoboFlattenRepeatedGroup.INDEX_COL]! > 0) {
          return {
            opacity: '.5',
          }
        }
        return {}
      },
      renderQuick: (row: Row) => {
        const data = getRow(row) as KoboFlattenRepeatedGroup.Data
        const childIndex = data[KoboFlattenRepeatedGroup.INDEX_COL]
        return (data.id ?? '') + (childIndex !== undefined ? '#' + (childIndex + 1) : '')
      },
    }
  }

  const getSubmissionTime = (): DatatableColumn.Props<any> => {
    return {
      head: m.submissionTime,
      id: 'submissionTime',
      type: 'date',
      typeIcon: <DatatableHeadIconByType type="date" />,
      render: (row: Row) => {
        const _ = getRow(row)
        const time = formatDateTime(_.submissionTime)
        return {
          label: formatDate(_.submissionTime),
          value: _.submissionTime,
          tooltip: time,
          export: time,
        }
      },
    }
  }

  const getAll = (): DatatableColumn.Props<any>[] => {
    return [getId(), getSubmissionTime(), ...getByQuestions(schema.schemaFlatAndSanitized)]
  }

  return {
    getId,
    getSubmissionTime,
    getBy,
    getAll,
    getByQuestion,
    getByQuestions,
  }
}
