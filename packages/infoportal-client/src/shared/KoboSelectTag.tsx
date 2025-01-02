import {KeyOf} from 'infoportal-common'
import React, {Dispatch, ReactNode, SetStateAction} from 'react'
import {Obj} from '@alexandreannic/ts-utils'
import {IpSelectSingle, IpSelectSingleProps} from '@/shared/Select/SelectSingle'
import {Kobo} from 'kobo-sdk'
import {useKoboUpdateContext} from '@/core/context/KoboUpdateContext'

export const KoboSelectTag = <
  TTag extends Record<string, any>,
  T extends {id: Kobo.SubmissionId, tags?: TTag},
  K extends string = string,
>({
  label,
  entry,
  tag,
  formId,
  answerId,
  enumerator,
  translate,
  setData,
  showUndefinedOption,
  disabled,
  ...props
}: {
  entry: T,
  showUndefinedOption?: boolean
  label?: string
  tag: KeyOf<TTag>
  formId: Kobo.FormId
  answerId: Kobo.SubmissionId
  enumerator: Record<K, string>
  translate?: Record<K, ReactNode>
  setData?: Dispatch<SetStateAction<T[] | undefined>>
  disabled?: boolean
} & Pick<IpSelectSingleProps<any>, 'sx'>) => {
  const ctxKoboUpdate = useKoboUpdateContext()
  const enumKeys = Obj.keys(enumerator)

  return (
    <IpSelectSingle
      hideNullOption={!showUndefinedOption}
      label={label}
      defaultValue={entry.tags?.[tag] ?? ''}
      onChange={(tagChange: any) => {
        ctxKoboUpdate.asyncUpdateById.tag.call({
          formId: formId,
          answerIds: [answerId],
          tag,
          value: tagChange,
        })
      }}
      options={enumKeys.map(_ => ({
        value: _, children: translate ? translate[_] : _,
      }) as any)}
      disabled={disabled}
      {...props}
    />
  )
}