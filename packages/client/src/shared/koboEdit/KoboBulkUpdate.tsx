import React, {ReactNode, useMemo, useState} from 'react'
import {Alert, Box, Collapse} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import {useKoboColumnDef} from '@/shared/koboEdit/KoboSchemaWrapper'
import {ArrayValues} from 'infoportal-common'
import {SelectStatusConfig, StateStatusIcon} from '@/shared/customInput/SelectStatus'
import {Obj} from '@axanc/ts-utils'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {Ip} from 'infoportal-api-sdk'
import {Core} from '@/shared'

export type KoboEditModalOption = {
  value: string | null
  label: string
  desc?: string
  before?: ReactNode
}

export const editableColumnType = [
  'select_one',
  'calculate',
  'select_multiple',
  'text',
  'integer',
  'decimal',
  'date',
  'datetime',
]

export type KoboBulkUpdateType = ArrayValues<typeof editableColumnType>

export namespace KoboBulkUpdate {
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
                    <Core.Input
                      multiline
                      maxRows={9}
                      fullWidth
                      value={value}
                      onChange={e => setValue(e.target.value)}
                    />
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

  export const Answer = (props: {
    workspaceId: Ip.WorkspaceId
    formId: Ip.FormId
    question: string
    answerIds: Ip.SubmissionId[]
    onUpdated?: (params: Ip.Submission.Payload.Update) => void
  }) => {
    const {workspaceId, formId, question, answerIds, onUpdated} = props
    const {columnDef, schema, loading: loadingSchema} = useKoboColumnDef({workspaceId, formId, question})
    const queryUpdate = useQueryAnswerUpdate().update

    return (
      <Base
        {...props}
        loading={loadingSchema || queryUpdate.isPending}
        error={queryUpdate.error?.message}
        onConfirm={answer => {
          return queryUpdate.mutateAsync({workspaceId, formId, answerIds, question, answer}).then(() => {
            onUpdated?.({answerIds, workspaceId, formId, answer, question})
            return {editedCount: answerIds.length}
          })
        }}
        type={columnDef?.type as any}
        options={
          columnDef
            ? schema?.helper.choicesIndex[columnDef.select_from_list_name!]?.map(_ => ({
                value: _.name,
                desc: _.name,
                label: schema.translate.choice(question, _.name),
              }))
            : undefined
        }
      />
    )
  }

  export const Validation = (props: {
    workspaceId: Ip.WorkspaceId
    formId: Ip.FormId
    answerIds: Ip.SubmissionId[]
    onUpdated?: (params: Ip.Submission.Payload.UpdateValidation) => void
  }) => {
    const {workspaceId, formId, answerIds, onUpdated} = props
    const queryUpdate = useQueryAnswerUpdate().updateValidation

    return (
      <Base
        {...props}
        loading={queryUpdate.isPending}
        error={queryUpdate.error?.message}
        onConfirm={status =>
          queryUpdate
            .mutateAsync({
              formId,
              status,
              answerIds,
              workspaceId,
            })
            .then(() => {
              onUpdated?.({answerIds, workspaceId, formId, status})
              return {editedCount: answerIds.length}
            })
        }
        type="select_one"
        options={Obj.values(Ip.Submission.Validation).map(_ => ({
          value: _,
          label: _,
          before: (
            <StateStatusIcon
              sx={{alignSelf: 'center', mr: 1}}
              type={SelectStatusConfig.customStatusToStateStatus.KoboValidation[_]}
            />
          ),
        }))}
      />
    )
  }
}
