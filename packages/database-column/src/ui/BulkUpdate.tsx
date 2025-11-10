import React, {ReactNode, useMemo, useState} from 'react'
import {Alert, SxProps} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import {Obj} from '@axanc/ts-utils'
import {Ip} from 'infoportal-api-sdk'
import * as Core from '@infoportal/client-core'
import {StatusIcon, Txt} from '@infoportal/client-core'
import {editableColsType} from '../columns/common.js'
import {Query, Question} from '../columns/type.js'
import {KoboSchemaHelper} from '@infoportal/kobo-helper'

export type KoboEditModalOption = {
  value: string | null
  label: string
  desc?: string
  before?: ReactNode
}

export type KoboBulkUpdateType = typeof editableColsType extends Set<infer U> ? U : never

const inputSx: SxProps = {my: -0.5, flex: 1, '& fieldset': {border: 'none'}, '& .MuiInputBase-root': {paddingLeft: 0}}

const StartAdornmentLabel = ({label}: {label?: string}) => {
  return (
    <Txt bold sx={{mr: 1}} color="hint">
      {label}:
    </Txt>
  )
}

const Base = ({
  type,
  onConfirm,
  error,
  label,
  options,
  loading,
  answerIds,
}: {
  label?: string
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

  const _options: Core.SelectOption[] = useMemo(() => {
    const harmonized: KoboEditModalOption[] | undefined = options?.map(o =>
      typeof o === 'string' ? {value: o, label: o} : o,
    )
    const resetOption: KoboEditModalOption = {value: null, label: 'BLANK', desc: ' '}
    return [resetOption, ...(harmonized ?? [])].map(_ => ({
      value: _.value!,
      children: _.label,
      disabled:
        type === 'select_multiple' &&
        _.value !== null &&
        ((value ?? []) as KoboEditModalOption[]).some(_ => _ === null),
    }))
  }, [options, value])

  return (
    <>
      {error && (
        <Alert sx={{py: 0, flex: 1}} color="error">
          {m.somethingWentWrong}
        </Alert>
      )}
      {updatedCount ? (
        <Alert
          sx={{py: 0, flex: 1}}
          color="success"
          action={
            <Core.Btn size="small" color="success" onClick={() => setUpdatedCount(null)}>
              {m.change}
            </Core.Btn>
          }
        >
          {m.successfullyEditedRows(updatedCount)}
        </Alert>
      ) : (
        <>
          {/*<Checkbox/>Delete answer and set as BLANK*/}
          {(() => {
            switch (type) {
              case 'select_one': {
                return (
                  <Core.SelectSingle
                    startAdornment={<StartAdornmentLabel label={label} />}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          minWidth: 'unset !important',
                        },
                      },
                    }}
                    hideNullOption
                    value={value}
                    slotProps={{}}
                    sx={inputSx}
                    onChange={setValue}
                    // disabled={(value as KoboEditModalOption['value']) === null}
                    options={_options}
                  />
                )
              }
              case 'select_multiple': {
                return (
                  <Core.SelectMultiple
                    InputProps={{
                      startAdornment: <StartAdornmentLabel label={label} />,
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          minWidth: 'unset !important',
                        },
                      },
                    }}
                    value={value ?? []}
                    options={_options}
                    sx={inputSx}
                    onChange={newValue => {
                      if (newValue?.some(_ => _ === null)) {
                        setValue([null])
                      } else {
                        setValue(newValue)
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
                    startAdornment={<StartAdornmentLabel label={label} />}
                    helperText={null}
                    multiline
                    sx={inputSx}
                    maxRows={9}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                  />
                )
              }
              case 'integer':
              case 'decimal': {
                return (
                  <Core.Input
                    startAdornment={<StartAdornmentLabel label={label} />}
                    type="number"
                    helperText={null}
                    sx={inputSx}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                  />
                )
              }
              case 'datetime':
              case 'date': {
                return (
                  <Core.Datepicker
                    startAdornment={<StartAdornmentLabel label={label} />}
                    sx={inputSx}
                    value={value}
                    onChange={setValue}
                  />
                )
              }
            }
          })()}
          <Core.Btn
            icon="check"
            size="small"
            variant="outlined"
            loading={loading}
            disabled={!!updatedCount}
            onClick={() => onConfirm(value).then(_ => setUpdatedCount(_.editedCount))}
          >
            {m.save}&nbsp;
          </Core.Btn>
        </>
      )}
      {/*onClose={() => onClose()}*/}
      {/*loading={_loading}*/}
      {/*cancelLabel={m.close}*/}
      {/*confirmDisabled={_loading || updated}*/}
      {/*onConfirm={() => onConfirm(value)}*/}
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
      label={schema.translate.question(question.name)}
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
  const {m} = useI18n()
  return (
    <Base
      {...props}
      label={m.validation}
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
