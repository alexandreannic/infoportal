import {KoboSchemaHelper, nullValuesToUndefined} from 'infoportal-common'
import React, {ReactElement, useCallback, useMemo} from 'react'
import {Core} from '@/shared'
import {Autocomplete, Box, Chip, createFilterOptions, Icon} from '@mui/material'
import {Controller, useForm} from 'react-hook-form'
import {map, seq} from '@axanc/ts-utils'
import {useI18n} from '@infoportal/client-i18n'
import {AccessForm, IAccessForm} from '@/features/Access/AccessForm'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {UseQueryFormAccess} from '@/core/query/useQueryFormAccess'
import {Ip} from 'infoportal-api-sdk'
import {KoboTypeIcon} from '@infoportal/database-column'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'

interface Form extends IAccessForm {
  question?: string
  questionAnswer?: string[]
}

export const DatabaseAccessForm = ({
  formId,
  children,
  form,
  workspaceId,
  onAdded,
}: {
  onAdded?: () => void
  children: ReactElement
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  form: Ip.Form.Schema
}) => {
  const langIndex = 0
  const survey = form.survey

  const {m} = useI18n()
  const queryAccessCreate = UseQueryFormAccess.create({workspaceId, formId})

  const accessForm = useForm<Form>()

  const {indexQuestion, indexOptionsByListName, indexOptionsByName} = useMemo(() => {
    return {
      indexQuestion: seq(survey)
        .compactBy('name')
        .groupByFirst(_ => _.name),
      indexOptionsByListName: seq(form.choices).groupBy(_ => _.list_name),
      indexOptionsByName: seq(form.choices).groupByFirst(_ => _.name),
    }
  }, [form])

  const filterOptions = useCallback(
    (
      index: Record<
        string,
        {
          name: string
          label?: string[]
        }
      >,
    ) =>
      createFilterOptions({
        stringify: (optionName: string) => KoboSchemaHelper.getLabel(index[optionName], langIndex),
      }),
    [form],
  )

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
                  schema={form}
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
              if (questionName === '') return
              const question = indexQuestion[questionName]
              if (!question) return
              switch (question.type) {
                case 'select_one':
                case 'select_multiple': {
                  const listName = question?.select_from_list_name
                  const options = indexOptionsByListName[listName!]
                  return (
                    <Controller
                      name="questionAnswer"
                      control={accessForm.control}
                      render={({field}) => (
                        <Autocomplete
                          {...field}
                          onReset={() => accessForm.setValue('questionAnswer', [])}
                          freeSolo
                          filterOptions={filterOptions(indexOptionsByName)}
                          multiple
                          onChange={(e, _) => _ && field.onChange(_)}
                          disableCloseOnSelect
                          options={options?.map(_ => _.name) ?? []}
                          // options={options?.map(_ => ({children: KoboSchemaHelper.getLabel(_, langIndex), value: _.name}))}
                          renderInput={({InputProps, ...props}) => (
                            <Core.Input
                              {...InputProps}
                              {...props}
                              label={m.answer}
                              error={!!accessForm.formState.errors.questionAnswer}
                              helperText={accessForm.formState.errors.questionAnswer && m.required}
                            />
                          )}
                          renderTags={(value: string[], getTagProps) =>
                            value.map((option: string, index: number) => (
                              // eslint-disable-next-line react/jsx-key
                              <Chip size="small" variant="outlined" label={option} {...getTagProps({index})} />
                            ))
                          }
                          renderOption={(props, option) => (
                            <Box component="li" {...props} key={option}>
                              <div>
                                <Core.Txt block>
                                  {KoboSchemaHelper.getLabel(indexOptionsByName[option], langIndex).replace(
                                    /<[^>]+>/g,
                                    '',
                                  ) ?? option}
                                </Core.Txt>
                                <Core.Txt color="disabled">{option}</Core.Txt>
                              </div>
                            </Box>
                          )}
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
