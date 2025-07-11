import {BasicDialog} from '@/shared/BasicDialog'
import React, {ReactNode, useMemo, useState} from 'react'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Alert, Box, Collapse} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {IpInput} from '@/shared/Input/Input'
import {IpDatepicker} from '@/shared/Datepicker/IpDatepicker'
import {KoboUpdateAnswers, KoboUpdateValidation} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {IpBtn} from '@/shared/Btn'
import {useKoboColumnDef} from '@/shared/koboEdit/KoboSchemaWrapper'
import {Txt} from '@/shared/Txt'
import {ArrayValues, KoboValidation, UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {SelectStatusConfig, StateStatusIcon} from '@/shared/customInput/SelectStatus'
import {Obj} from '@axanc/ts-utils'
import {DialogProps} from '@toolpad/core'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {useQueryFormById} from '@/core/query/useQueryForm'

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

export type KoboUpdateModalType = ArrayValues<typeof editableColumnType>

export namespace KoboUpdateModal {
  const Custom = ({
    payload,
    onClose,
  }: DialogProps<{
    type?: KoboUpdateModalType
    subTitle?: string
    title?: string
    onConfirm: (_: any) => void
    error?: string
    options?: string[] | KoboEditModalOption[]
    loading?: boolean
  }>) => {
    const {m} = useI18n()
    const {title, error, onConfirm, loading, type, options, subTitle} = payload

    const [value, setValue] = useState<any>()
    const [updated, setUpdated] = useState(false)

    const _options = useMemo(() => {
      const harmonized: KoboEditModalOption[] | undefined = options?.map(o =>
        typeof o === 'string' ? {value: o, label: o} : o,
      )
      const resetOption: KoboEditModalOption = {value: null, label: 'BLANK', desc: ' '}
      return [resetOption, ...(harmonized ?? [])].map(_ => (
        <ScRadioGroupItem
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

    const _loading = loading
    return (
      <BasicDialog
        maxWidth="xs"
        open={true}
        onClose={() => onClose()}
        loading={_loading}
        cancelLabel={m.close}
        confirmDisabled={_loading || updated}
        onConfirm={() => onConfirm(value)}
        title={title}
      >
        <Txt truncate color="hint" block sx={{mb: 1, maxWidth: 400}}>
          {subTitle}
        </Txt>
        {error && <Alert color="error">{m.somethingWentWrong}</Alert>}
        {updated && (
          <Alert
            color="success"
            action={
              <>
                <IpBtn onClick={() => setUpdated(false)}>{m.change}</IpBtn>
              </>
            }
          >
            {m.successfullyEdited(-1)}
          </Alert>
        )}
        <Collapse in={!updated}>
          <Box sx={{minWidth: 340}}>
            {/*<Checkbox/>Delete answer and set as BLANK*/}
            {(() => {
              switch (type) {
                case 'select_one': {
                  return (
                    <ScRadioGroup
                      dense
                      value={value}
                      onChange={setValue}
                      disabled={(value as KoboEditModalOption['value']) === null}
                    >
                      {_options}
                    </ScRadioGroup>
                  )
                }
                case 'select_multiple': {
                  return (
                    <ScRadioGroup dense multiple value={value ?? []} onChange={_ => setValue(_)}>
                      {_options}
                    </ScRadioGroup>
                  )
                }
                case 'text':
                case 'calculate': {
                  return (
                    <IpInput multiline maxRows={9} fullWidth value={value} onChange={e => setValue(e.target.value)} />
                  )
                }
                case 'integer':
                case 'decimal': {
                  return <IpInput type="number" fullWidth value={value} onChange={e => setValue(e.target.value)} />
                }
                case 'datetime':
                case 'date': {
                  return <IpDatepicker value={value} onChange={setValue} />
                }
              }
            })()}
          </Box>
        </Collapse>
      </BasicDialog>
    )
  }

  export const Answer = ({
    payload,
    ...props
  }: DialogProps<{
    workspaceId: UUID
    formId: Kobo.FormId
    columnName: string
    answerIds: Kobo.SubmissionId[]
    onUpdated?: (params: KoboUpdateAnswers<any, any>) => void
  }>) => {
    const {workspaceId, formId, columnName, answerIds, onUpdated} = payload
    const {m} = useI18n()
    const queryForm = useQueryFormById({workspaceId, formId}).get
    const {columnDef, schema, loading: loadingSchema} = useKoboColumnDef({workspaceId, formId, columnName})
    const queryUpdate = useQueryAnswerUpdate().update

    return (
      <Custom
        {...props}
        payload={{
          loading: loadingSchema || queryUpdate.isPending,
          error: queryUpdate.error?.message,
          onConfirm: value => {
            queryUpdate.mutate({workspaceId, formId, answerIds, question: columnName, answer: value})
          },
          title: `${m.edit} (${answerIds.length}) - ${queryForm.data?.name}`,
          subTitle: schema?.translate.question(columnName),
          type: columnDef?.type as any,
          options: columnDef
            ? schema?.helper.choicesIndex[columnDef.select_from_list_name!]?.map(_ => ({
                value: _.name,
                desc: _.name,
                label: schema.translate.choice(columnName, _.name),
              }))
            : undefined,
        }}
      />
    )
  }

  export const Validation = ({
    payload,
    ...props
  }: DialogProps<{
    workspaceId: UUID
    formId: Kobo.FormId
    answerIds: Kobo.SubmissionId[]
    onUpdated?: (params: KoboUpdateValidation) => void
  }>) => {
    const {workspaceId, formId, answerIds, onUpdated} = payload
    const {m} = useI18n()
    const queryUpdate = useQueryAnswerUpdate().updateValidation

    return (
      <Custom
        {...props}
        payload={{
          loading: queryUpdate.isPending,
          error: queryUpdate.error?.message,
          onConfirm: value => {
            queryUpdate.mutate({
              formId,
              status: value,
              answerIds,
              workspaceId,
            })
          },
          title: `${m.edit} (${answerIds.length}) - ${m.validation}`,
          type: 'select_one',
          options: Obj.values(KoboValidation).map(_ => ({
            value: _,
            label: _,
            before: (
              <StateStatusIcon
                sx={{alignSelf: 'center', mr: 1}}
                type={SelectStatusConfig.customStatusToStateStatus.KoboValidation[_]}
              />
            ),
          })),
        }}
      />
    )
  }
}
