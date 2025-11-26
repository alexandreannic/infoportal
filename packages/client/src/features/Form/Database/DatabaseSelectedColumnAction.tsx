import React, {useMemo} from 'react'
import {Box, Icon, SxProps, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import {Obj} from '@axanc/ts-utils'
import {Ip} from '@infoportal/api-sdk'
import * as Core from '@infoportal/client-core'
import {SelectOption, StatusIcon} from '@infoportal/client-core'
import {SchemaInspector} from '@infoportal/form-helper'
import * as Datatable from '@infoportal/client-datatable'
import {UseQuerySubmission} from '@/core/query/form/useQuerySubmission'
import {editableColsType} from '@infoportal/database-column'

export type KoboBulkUpdateType = typeof editableColsType extends Set<infer U> ? U : never

export const DatabaseSelectedColumnAction = ({
  workspaceId,
  formId,
  rowIds,
  commonValue,
  columnId,
  inspector,
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  rowIds: string[]
  commonValue?: any
  columnId: string
  inspector: SchemaInspector
}) => {
  const validationColumnId: keyof Ip.Submission = 'validationStatus'
  if (columnId === validationColumnId)
    return (
      <BulkUpdateValidation
        value={commonValue}
        workspaceId={workspaceId}
        formId={formId}
        answerIds={rowIds as Ip.SubmissionId[]}
      />
    )
  const question = inspector.lookup.questionIndex[columnId]
  if (!question) return
  if (editableColsType.has(question.type))
    return (
      <BulkUpdateAnswer
        value={commonValue}
        workspaceId={workspaceId}
        formId={formId}
        question={question}
        answerIds={rowIds as Ip.SubmissionId[]}
        inspector={inspector}
      />
    )
  return <ReadonlyAction />
}

export const BulkUpdateAnswer = ({
  inspector,
  question,
  value,
  ...props
}: {
  value?: any
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  question: Ip.Form.Question
  answerIds: Ip.SubmissionId[]
  inspector: SchemaInspector
}) => {
  const query = UseQuerySubmission.update()
  const {workspaceId, formId, answerIds} = props
  return (
    <Datatable.AsyncInputWrapper
      value={value}
      isSuccess={query.isSuccess}
      isPending={query.isPending}
      label={inspector.translate.question(question.name)}
      errorMsg={query.error?.message}
      onConfirm={answer => {
        return query.mutateAsync({workspaceId, formId, answerIds, question: question.name, answer}).then(() => {
          return {editedCount: answerIds.length}
        })
      }}
      renderInput={({value, onChange}) => (
        <Input
          value={value}
          onChange={onChange}
          type={question.type as any}
          options={
            question
              ? inspector?.lookup.choicesIndex[question.select_from_list_name!]?.map(_ => ({
                  value: _.name,
                  children: inspector.translate.choice(question.name, _.name),
                }))
              : undefined
          }
        />
      )}
    />
  )
}
export const BulkUpdateValidation = ({
  value,
  ...props
}: {
  value?: Ip.Submission.Validation
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  answerIds: Ip.SubmissionId[]
}) => {
  const query = UseQuerySubmission.updateValidation()
  const {workspaceId, formId, answerIds} = props
  const {m} = useI18n()
  return (
    <Datatable.AsyncInputWrapper
      value={value}
      isSuccess={query.isSuccess}
      isPending={query.isPending}
      label={m.validation}
      errorMsg={query.error?.message}
      onConfirm={status =>
        query
          .mutateAsync({
            formId,
            status,
            answerIds,
            workspaceId,
          })
          .then(() => {
            return {editedCount: answerIds.length}
          })
      }
      renderInput={({value, onChange}) => (
        <Input
          value={value}
          onChange={onChange}
          type="select_one"
          options={Obj.values(Ip.Submission.Validation).map(_ => ({
            value: _,
            children: (
              <>
                <StatusIcon sx={{alignSelf: 'center', mr: 1}} type={Ip.Submission.validationToStatus[_]} />
                {_}
              </>
            ),
          }))}
        />
      )}
    />
  )
}

const inputSx: SxProps = {my: -0.5, flex: 1, '& fieldset': {border: 'none'}, '& .MuiInputBase-root': {paddingLeft: 0}}
const Input = ({
  type,
  value,
  onChange,
  options,
}: {
  value?: any
  onChange: (_: any) => void
  options?: string[] | SelectOption[]
  type?: KoboBulkUpdateType
}) => {
  const _options: Core.SelectOption[] = useMemo(() => {
    if (!options) return []
    const harmonized: SelectOption[] = options.map(o => (typeof o === 'string' ? {value: o, children: o} : o))
    const resetOption: SelectOption = {value: null as any as string, children: 'BLANK'}
    return [resetOption, ...harmonized].map(_ => ({
      value: _.value!,
      children: _.children,
      disabled:
        type === 'select_multiple' && _.value !== null && ((value ?? []) as SelectOption[]).some(_ => _ === null),
    }))
  }, [options, value])

  switch (type) {
    case 'select_one': {
      return (
        <Core.SelectSingle
          autoWidthPopover
          hideNullOption
          value={value}
          slotProps={{}}
          sx={inputSx}
          onChange={onChange}
          // disabled={(innerValue as KoboEditModalOption['innerValue']) === null}
          options={_options}
        />
      )
    }
    case 'select_multiple': {
      return (
        <Core.SelectMultiple
          autoWidthPopover
          value={value ?? []}
          options={_options}
          sx={inputSx}
          onChange={newValue => {
            if (newValue?.some(_ => _ === null)) {
              onChange([null])
            } else {
              onChange(newValue)
            }
          }}
        />
      )
    }
    case 'note':
    case 'text':
    case 'calculate': {
      return (
        <Core.Input
          helperText={null}
          multiline
          sx={inputSx}
          maxRows={9}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )
    }
    case 'integer':
    case 'decimal': {
      return (
        <Core.Input
          type="number"
          helperText={null}
          sx={inputSx}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )
    }
    case 'datetime':
    case 'date': {
      return <Core.Datepicker sx={inputSx} value={value} onChange={onChange} />
    }
  }
}

export function ReadonlyAction() {
  const {m} = useI18n()
  const t = useTheme()
  return (
    <Box display="flex" alignItems="center" sx={{color: t.vars!.palette.text.disabled}}>
      <Icon sx={{mr: 1}}>lock</Icon>
      {m.readonly}
    </Box>
  )
}
