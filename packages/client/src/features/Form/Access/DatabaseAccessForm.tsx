import {nullValuesToUndefined} from 'infoportal-common'
import {SchemaInspector} from '@infoportal/kobo-helper'
import React, {ReactElement, useMemo} from 'react'
import {Core} from '@/shared'
import {Box} from '@mui/material'
import {Controller, useForm} from 'react-hook-form'
import {map, seq} from '@axanc/ts-utils'
import {useI18n} from '@infoportal/client-i18n'
import {AccessForm, IAccessForm} from '@/features/Access/AccessForm'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {UseQueryFormAccess} from '@/core/query/form/useQueryFormAccess'
import {Ip} from '@infoportal/api-sdk'
import {SelectQuestionInput} from '@/shared/customInput/SelectQuestionInput'
import {SelectChoiceInput} from '@/shared/customInput/SelectChoiceInput'

interface Form extends IAccessForm {
  question?: string
  questionAnswer?: string[]
}

export const DatabaseAccessForm = ({
  formId,
  children,
  inspector,
  workspaceId,
  onAdded,
}: {
  onAdded?: () => void
  children: ReactElement
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  inspector: SchemaInspector
}) => {
  const langIndex = 0
  const survey = inspector.schema.survey

  const {m} = useI18n()
  const queryAccessCreate = UseQueryFormAccess.create({workspaceId, formId})

  const accessForm = useForm<Form>()

  const questionIndex = useMemo(() => {
    return seq(survey)
      .compactBy('name')
      .groupByFirst(_ => _.name)
  }, [inspector])

  const submit = ({selectBy, question, questionAnswer, ...f}: Form) => {
    queryAccessCreate
      .mutateAsync({
        ...nullValuesToUndefined(f),
        workspaceId,
        filters: question && questionAnswer ? {[question]: questionAnswer} : undefined,
      })
      .then(onAdded)
  }

  return (
    <Core.Modal
      loading={queryAccessCreate.isPending}
      confirmDisabled={!accessForm.formState.isValid}
      onConfirm={(_, close) =>
        accessForm.handleSubmit(_ => {
          submit(_)
          close()
        })()
      }
      content={
        <Box sx={{width: 500}}>
          <AccessForm form={accessForm} workspaceId={workspaceId} />
          <AccessFormSection icon="filter_alt" label={m.filter}>
            <Controller
              name="question"
              control={accessForm.control}
              render={({field: {onChange, value, ...field}}) => (
                <SelectQuestionInput
                  {...field}
                  langIndex={langIndex}
                  inspector={inspector}
                  questionTypeFilter={['calculate', 'text', 'select_multiple', 'select_one']}
                  InputProps={{
                    label: m.question,
                    error: !!accessForm.formState.errors.question,
                    helperText: accessForm.formState.errors.question && m.required,
                  }}
                  onChange={(e, value) => {
                    onChange(value)
                    accessForm.setValue('questionAnswer', [])
                  }}
                  onInputChange={(e, value) => {
                    onChange(value)
                  }}
                />
              )}
            />
            {map(accessForm.watch('question'), questionName => {
              const question = questionIndex[questionName]
              if (!question) return
              switch (question.type) {
                case 'select_one':
                case 'select_multiple': {
                  return (
                    <Controller
                      name="questionAnswer"
                      control={accessForm.control}
                      render={({field}) => (
                        <SelectChoiceInput
                          {...field}
                          langIndex={langIndex}
                          schema={inspector.schema}
                          questionName={questionName}
                          onReset={() => accessForm.setValue('questionAnswer', [])}
                          onChange={(e, _) => _ && field.onChange(_)}
                          InputProps={{
                            label: m.answer,
                            error: !!accessForm.formState.errors.questionAnswer,
                            helperText: accessForm.formState.errors.questionAnswer && m.required,
                          }}
                        />
                      )}
                    />
                  )
                }
                default: {
                  return (
                    <Controller
                      name="questionAnswer"
                      control={accessForm.control}
                      render={({field}) => <Core.Input {...field} />}
                    />
                  )
                }
              }
            })}
          </AccessFormSection>
        </Box>
      }
    >
      {children}
    </Core.Modal>
  )
}
