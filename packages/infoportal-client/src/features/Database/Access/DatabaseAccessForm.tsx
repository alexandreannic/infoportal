import {useAppSettings} from '@/core/context/ConfigContext'
import {Kobo} from 'kobo-sdk'
import {KoboSchemaHelper, KoboCustomDirective, nullValuesToUndefined} from 'infoportal-common'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {ReactElement, useCallback, useMemo} from 'react'
import {Modal, Txt} from '@/shared'
import {Autocomplete, Box, Chip, createFilterOptions, Icon} from '@mui/material'
import {IpInput} from '@/shared/Input/Input'
import {Controller, useForm} from 'react-hook-form'
import {KoboDatabaseAccessParams} from '@/core/sdk/server/access/Access'
import {map, seq} from '@axanc/ts-utils'
import {useI18n} from '@/core/i18n'
import {useAsync} from '@/shared/hook/useAsync'
import {useIpToast} from '@/core/useToast'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {AccessForm, IAccessForm} from '@/features/Access/AccessForm'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {useFetcher} from '@/shared/hook/useFetcher'
import {DirectiveTemplate, koboIconMap} from '@/features/Database/KoboTable/columns/columnBySchema'

interface Form extends IAccessForm {
  question?: string
  questionAnswer?: string[]
}

export const DatabaseAccessForm = ({
  formId,
  children,
  form,
  onAdded,
}: {
  onAdded?: () => void
  children: ReactElement
  formId: Kobo.FormId
  form: Kobo.Form
}) => {
  const langIndex = 0
  const survey = form.content.survey

  const {m} = useI18n()
  const {toastHttpError} = useIpToast()
  const {api} = useAppSettings()

  const _addAccess = useAsync(api.access.create)
  const requestInConstToFixTsInference = (databaseId: Kobo.FormId) =>
    api.access
      .search({featureId: AppFeatureId.kobo_database})
      .then((_) => _.filter((_) => _.params?.koboFormId === databaseId))
  const _access = useFetcher(requestInConstToFixTsInference)

  useEffectFn(_addAccess.error, toastHttpError)
  useEffectFn(_access.error, toastHttpError)

  const accessForm = useForm<Form>()

  const {indexQuestion, indexOptionsByListName, indexOptionsByName} = useMemo(() => {
    return {
      indexQuestion: seq(survey)
        .compactBy('name')
        .groupByFirst((_) => _.name),
      indexOptionsByListName: seq(form.content.choices).groupBy((_) => _.list_name),
      indexOptionsByName: seq(form.content.choices).groupByFirst((_) => _.name),
    }
  }, [form])

  const questions = useMemo(() => {
    return map(survey, (schema) =>
      schema.filter(
        (_) => _.type === 'calculate' || _.type === 'text' || _.type === 'select_multiple' || _.type === 'select_one',
      ),
    )
  }, [survey])

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
    _addAccess
      .call({
        ...nullValuesToUndefined(f),
        featureId: AppFeatureId.kobo_database,
        params: KoboDatabaseAccessParams.create({
          koboFormId: formId,
          filters: question && questionAnswer ? {[question]: questionAnswer} : undefined,
        }),
      })
      .then(onAdded)
  }

  return (
    <Modal
      loading={_addAccess.loading}
      confirmDisabled={!accessForm.formState.isValid}
      onConfirm={(_, close) =>
        accessForm.handleSubmit((_) => {
          submit(_)
          close()
        })()
      }
      content={
        <Box sx={{width: 500}}>
          <AccessForm form={accessForm} />
          <AccessFormSection icon="filter_alt" label={m.filter}>
            <Controller
              name="question"
              control={accessForm.control}
              render={({field: {onChange, value, ...field}}) => (
                <Autocomplete
                  {...field}
                  value={value}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === 'reset') {
                      onChange('')
                    } else {
                      onChange(newInputValue)
                    }
                  }}
                  filterOptions={filterOptions(indexQuestion)}
                  onChange={(e, _) => {
                    if (_) {
                      onChange(_)
                      accessForm.setValue('questionAnswer', [])
                    }
                  }}
                  loading={!questions}
                  options={questions?.map((_) => _.name!) ?? []}
                  renderInput={({InputProps, ...props}) => (
                    <IpInput
                      {...InputProps}
                      {...props}
                      label={m.question}
                      error={!!accessForm.formState.errors.question}
                      helperText={accessForm.formState.errors.question && m.required}
                    />
                  )}
                  renderOption={(props, option) => {
                    if (indexQuestion[option].name.startsWith(KoboCustomDirective.make('TRIGGER_EMAIL'))) {
                      const template = DirectiveTemplate.render.TRIGGER_EMAIL
                      return (
                        <Box component="li" {...props} key={option} sx={{color: template.color}}>
                          <Icon color="disabled" sx={{mr: 1, color: template.color}}>
                            {template.icon}
                          </Icon>
                          <div>
                            <Txt bold block>
                              {template.label(indexQuestion[option], m)}
                            </Txt>
                            <Txt color="disabled">{option}</Txt>
                          </div>
                        </Box>
                      )
                    } else
                      return (
                        <Box component="li" {...props} key={option}>
                          <Icon color="disabled" sx={{mr: 1}}>
                            {koboIconMap[indexQuestion[option].type]}
                          </Icon>
                          <div>
                            <Txt block>
                              {KoboSchemaHelper.getLabel(indexQuestion[option], langIndex).replace(/<[^>]+>/g, '') ??
                                option}
                            </Txt>
                            <Txt color="disabled">{option}</Txt>
                          </div>
                        </Box>
                      )
                  }}
                />
              )}
            />
            {map(accessForm.watch('question'), (questionName) => {
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
                          loading={!questions}
                          disableCloseOnSelect
                          options={options?.map((_) => _.name) ?? []}
                          // options={options?.map(_ => ({children: KoboSchemaHelper.getLabel(_, langIndex), value: _.name}))}
                          renderInput={({InputProps, ...props}) => (
                            <IpInput
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
                                <Txt block>
                                  {KoboSchemaHelper.getLabel(indexOptionsByName[option], langIndex).replace(
                                    /<[^>]+>/g,
                                    '',
                                  ) ?? option}
                                </Txt>
                                <Txt color="disabled">{option}</Txt>
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
                      render={({field}) => <IpInput {...field} />}
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
    </Modal>
  )
}
