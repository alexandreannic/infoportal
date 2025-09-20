import React, {ReactNode, useMemo, useState} from 'react'
import {Alert, Box, Collapse} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import {KoboSchemaHelper} from 'infoportal-common'
import {Obj} from '@axanc/ts-utils'
import {Ip} from 'infoportal-api-sdk'
import * as Core from '@infoportal/client-core'
import {StatusIcon} from '@infoportal/client-core'
import {editableColsType} from '../columns/common'
import {Query, Question} from '../columns/type'

export type KoboEditModalOption = {
  value: string | null
  label: string
  desc?: string
  before?: ReactNode
}

export type KoboBulkUpdateType = typeof editableColsType extends Set<infer U> ? U : never

const Base = ({
  type,
  onConfirm,
  error,
  options,
  loading,
  answerIds,
}: {
  answerIds: Ip.SubmissionId[]
  type?: KoboBulkUpdateType
  onConfirm: (_: any) => Promise<{editedCount: number}>
  error?: string
  options?: string[] | KoboEditModalOption[]
  loading?: boolean
}) => {
  const {m} = useI18n()
  const [value, setValue] = useState<any>()
  const [updatedCount, setUpdatedCount] = useState<null | number>(null)

  const _options = useMemo(() => {
    const harmonized: KoboEditModalOption[] | undefined = options?.map(o =>
      typeof o === 'string' ? {value: o, label: o} : o,
    )
    const resetOption: KoboEditModalOption = {value: null, label: 'BLANK', desc: ' '}
    return [resetOption, ...(harmonized ?? [])].map(_ => (
      <Core.RadioGroupItem
        dense
        disabled={
          type === 'select_multiple' &&
          _.value !== null &&
          ((value ?? []) as KoboEditModalOption[]).some(_ => _ === null)
        }
        key={_.value}
        value={_.value}
        before={_.before}
        description={_.desc}
        title={_.label}
      />
    ))
  }, [options, value])

  return (
    <>
      {error && <Alert color="error">{m.somethingWentWrong}</Alert>}
      {updatedCount && (
        <Alert
          color="success"
          sx={{mb: 1}}
          action={<Core.Btn onClick={() => setUpdatedCount(null)}>{m.change}</Core.Btn>}
        >
          {m.successfullyEdited(updatedCount)}
        </Alert>
      )}
      <Collapse in={!updatedCount}>
        <Box sx={{minWidth: 340, maxHeight: 400, overflowY: 'auto'}}>
          {/*<Checkbox/>Delete answer and set as BLANK*/}
          {(() => {
            switch (type) {
              case 'select_one': {
                return (
                  <Core.RadioGroup
                    dense
                    value={value}
                    onChange={setValue}
                    disabled={(value as KoboEditModalOption['value']) === null}
                  >
                    {_options}
                  </Core.RadioGroup>
                )
              }
              case 'select_multiple': {
                return (
                  <Core.RadioGroup dense multiple value={value ?? []} onChange={_ => setValue(_)}>
                    {_options}
                  </Core.RadioGroup>
                )
              }
              case 'note':
              case 'text':
              case 'calculate': {
                return (
                  <Core.Input multiline maxRows={9} fullWidth value={value} onChange={e => setValue(e.target.value)} />
                )
              }
              case 'integer':
              case 'decimal': {
                return <Core.Input type="number" fullWidth value={value} onChange={e => setValue(e.target.value)} />
              }
              case 'datetime':
              case 'date': {
                return <Core.Datepicker value={value} onChange={setValue} />
              }
            }
          })()}
        </Box>
      </Collapse>
      {/*onClose={() => onClose()}*/}
      {/*loading={_loading}*/}
      {/*cancelLabel={m.close}*/}
      {/*confirmDisabled={_loading || updated}*/}
      {/*onConfirm={() => onConfirm(value)}*/}
      <Core.Btn
        variant="outlined"
        loading={loading}
        disabled={!!updatedCount}
        onClick={() => onConfirm(value).then(_ => setUpdatedCount(_.editedCount))}
        sx={{mt: 1}}
      >
        {m.confirm}
      </Core.Btn>
    </>
  )
}

export const BulkUpdateAnswer = ({
  query,
  schema,
  question,
  ...props
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  question: Question
  answerIds: Ip.SubmissionId[]
  query: Query<Ip.Submission.Payload.Update, Ip.BulkResponse<Ip.SubmissionId>>
  schema: KoboSchemaHelper.Bundle
}) => {
  const {workspaceId, formId, answerIds} = props
  return (
    <Base
      {...props}
      loading={query.isPending}
      error={query.error?.message}
      onConfirm={answer => {
        return query.mutateAsync({workspaceId, formId, answerIds, question: question.name, answer}).then(() => {
          return {editedCount: answerIds.length}
        })
      }}
      type={question.type as any}
      options={
        question
          ? schema?.helper.choicesIndex[question.select_from_list_name!]?.map(_ => ({
              value: _.name,
              desc: _.name,
              label: schema.translate.choice(question.name, _.name),
            }))
          : undefined
      }
    />
  )
}

export const BulkUpdateValidation = ({
  query,
  ...props
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  answerIds: Ip.SubmissionId[]
  query: Query<Ip.Submission.Payload.UpdateValidation, Ip.BulkResponse<Ip.SubmissionId>>
}) => {
  const {workspaceId, formId, answerIds} = props

  return (
    <Base
      {...props}
      loading={query.isPending}
      error={query.error?.message}
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
      type="select_one"
      options={Obj.values(Ip.Submission.Validation).map(_ => ({
        value: _,
        label: _,
        before: <StatusIcon sx={{alignSelf: 'center', mr: 1}} type={Ip.Submission.validationToStatus[_]} />,
      }))}
    />
  )
}
