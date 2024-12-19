import {Kobo} from 'kobo-sdk'
import {useKoboColumnDef} from '@/shared/koboEdit/KoboSchemaWrapper'
import React from 'react'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {Skeleton} from '@mui/material'
import {KeyOf} from '@alexandreannic/ts-utils'
import {useKoboUpdateContext} from '@/core/context/KoboUpdateContext'

export const KoboEditAnswer = <T extends Record<string, any>, K extends KeyOf<T>>({
  value,
  onChange,
  formId,
  columnName,
  answerId,
}: {
  value?: T[K]
  onChange?: (_: T[K]) => void,
  formId: Kobo.FormId,
  columnName: K
  answerId: Kobo.SubmissionId
}) => {
  const ctx = useKoboUpdateContext()

  const {columnDef, schema, loading} = useKoboColumnDef({formId, columnName})

  if (loading) return <Skeleton/>
  if (!columnDef || !schema) return <></>

  const handleChange = async (newValue: any) => {
    await ctx.asyncUpdateById.answer.call({
      answerIds: [answerId],
      answer: newValue,
      question: columnName,
      formId,
    })
  }

  switch (columnDef.type) {
    case 'select_one': {
      return (
        <IpSelectSingle
          value={value as any}
          onChange={handleChange}
          options={schema.helper.choicesIndex[columnDef.select_from_list_name!].map(_ =>
            ({value: _.name, children: schema.translate.choice(columnName, _.name)})
          )}
        />
      )
    }
    default:
      return <></>
    // case 'select_multiple': {
    //   return (
    //     <ScRadioGroup dense multiple value={value?.split(' ')} onChange={_ => setValue(_.join(' '))}>
    //       {schema.schemaHelper.choicesIndex[columnDef.select_from_list_name!].map(_ =>
    //         <ScRadioGroupItem dense key={_.name} value={_.name} description={_.name} title={schema.translate.choice(columnName, _.name)}/>
    //       )}
    //     </ScRadioGroup>
    //   )
    // }
    // case 'text': {
    //   return <IpInput multiline maxRows={9} fullWidth value={value} onChange={e => setValue(e.target.value)}/>
    // }
    // case 'integer':
    // case 'decimal': {
    //   return <IpInput type="number" fullWidth value={value} onChange={e => setValue(e.target.value)}/>
    // }
    // case 'datetime':
    // case 'date': {
    //   return <IpDatepicker value={value} onChange={setValue}/>
    // }
  }
}