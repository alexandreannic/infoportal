import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@/core/i18n'
import {KoboAnswerHistory} from '@/core/sdk/server/kobo/answerHistory/KoboAnswerHistory'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {AppAvatar} from '@/shared/AppAvatar'
import {Core, Datatable} from '@/shared'
import {Page} from '@/shared/Page'
import {fnSwitch, map} from '@axanc/ts-utils'
import {Icon, useTheme} from '@mui/material'
import {useEffect} from 'react'
import {createRoute} from '@tanstack/react-router'
import {useFetcher} from '@axanc/react-hooks'

export const databaseHistoryRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'history',
  component: DatabaseHistory,
})

function DatabaseHistory() {
  const {schema, workspaceId, form} = useFormContext()
  const t = useTheme()
  const {m, formatDateTime, formatLargeNumber, formatDate} = useI18n()
  const {api} = useAppSettings()
  const fetcher = useFetcher(() => api.kobo.answerHistory.search({formId: form.id}))

  useEffect(() => {
    fetcher.fetch()
  }, [])

  const getAnswerTranslation = (row: KoboAnswerHistory, fn: (_: KoboAnswerHistory) => string) =>
    map(row.property, property => {
      const value: any = fn(row)
      if (!schema) return value
      const questionSchema = schema.helper.questionIndex[property]
      if (!questionSchema) return value
      switch (questionSchema.type) {
        case 'select_multiple': {
          const label = value
            ?.split(' ')
            .map((_: string) => schema.translate.choice(property, _))
            .join(' | ')
          return label
        }
        case 'select_one': {
          const render = schema.translate.choice(property, value)
          return (
            render ?? (
              <span title={value}>
                <Datatable.Icon
                  color="disabled"
                  tooltip={m._koboDatabase.valueNoLongerInOption}
                  sx={{mr: 1}}
                  children="error"
                />
                {value}
              </span>
            )
          )
        }
        default: {
          return value
        }
      }
    })

  return (
    <Page width="lg">
      <Core.Panel>
        <Datatable.Component
          getRowKey={_ => _.id}
          // showExportBtn
          loading={fetcher.loading}
          data={fetcher.get?.data}
          contentProps={{sx: {maxHeight: 'calc(100vh - 156px)'}}}
          id={`kobo-answer-history${form.id}`}
          columns={[
            // {
            //   type: 'string',
            //   id: 'ID',
            //   head: m.id,
            //   renderQuick: _ => _.id,
            // },
            {
              type: 'date',
              id: 'date',
              width: 80,
              head: m.date,
              render: _ => {
                return {
                  value: _.date,
                  label: formatDate(_.date),
                  tooltip: formatDateTime(_.date),
                }
              },
            },
            {
              type: 'number',
              id: 'answerIdCount',
              width: 40,
              head: '#',
              align: 'right',
              render: _ => {
                return {
                  label: formatLargeNumber(_.answerIds.length),
                  value: _.answerIds.length,
                }
              },
            },
            {
              type: 'string',
              id: 'answerId',
              typeIcon: <Datatable.HeadIconByType type="id" />,
              className: 'td-id',
              width: 140,
              head: m.id,
              renderQuick: _ => _.answerIds?.join(' '),
            },
            {
              type: 'select_one',
              id: 'author',
              width: 140,
              head: m.by,
              render: _ => {
                return {
                  value: _.by,
                  label: (
                    <span style={{display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle'}}>
                      <AppAvatar size={24} sx={{verticalAlign: 'middle', mr: 0.5}} email={_.by} />
                      <div>{_.by}</div>
                    </span>
                  ),
                }
              },
            },
            // {
            //   type: 'select_one',
            //   id: 'type',
            //   head: m.type,
            //   render: _ => {
            //     return {
            //       value: _.type,
            //       label: fnSwitch(_.type, {
            //         delete: (
            //           <Core.Txt color="error" bold>
            //             {m._koboDatabase.deleted}
            //           </Core.Txt>
            //         ),
            //         answer: m._koboDatabase.koboQuestion,
            //         tag: m._koboDatabase.customColumn,
            //       }),
            //     }
            //   },
            // },
            {
              type: 'select_one',
              id: 'question',
              head: m.column,
              width: 150,
              render: _ => {
                return {
                  value: _.property,
                  label: _.property ? schema?.translate.question(_.property) : undefined,
                }
              },
            },
            {
              type: 'select_one',
              id: 'xml',
              head: 'XML',
              width: 90,
              render: _ => {
                return {
                  value: _.property,
                  label: (
                    <code style={{background: t.vars.palette.background.default, color: t.vars.palette.text.secondary}}>
                      {_.property}
                    </code>
                  ),
                }
              },
            },
            {
              type: 'string',
              id: 'oldValue',
              head: m._koboDatabase.oldValue,
              styleHead: {borderRight: 0},
              style: () => ({borderRight: 0}),
              render: row => {
                const label = getAnswerTranslation(row, _ => _.oldValue)
                return {
                  label: label && (
                    <span
                      style={{
                        borderRadius: 4,
                        padding: '0 4px',
                        background: Core.alphaVar(t.vars.palette.error.light, 0.16),
                        color: t.vars.palette.error.main,
                      }}
                    >
                      {label}
                    </span>
                  ),
                  value: row.oldValue,
                }
              },
            },
            {
              id: 'arrow_icon',
              width: 0,
              align: 'center',
              styleHead: {borderRight: 0},
              style: () => ({borderRight: 0}),
              renderQuick: _ => _.oldValue && <Icon color="disabled">arrow_forward</Icon>,
            },
            {
              type: 'string',
              id: 'newVranslate',
              head: m._koboDatabase.newValue,
              render: row => {
                if (!row.newValue) return {label: undefined, value: undefined}
                const label = getAnswerTranslation(row, _ => _.newValue)
                return {
                  label: (
                    <span
                      style={{
                        borderRadius: 4,
                        padding: '0 4px',
                        background: Core.alphaVar(t.vars.palette.success.light, 0.16),
                        color: t.vars.palette.success.main,
                      }}
                    >
                      {label}
                    </span>
                  ),
                  value: row.newValue,
                }
              },
            },
          ]}
        />
      </Core.Panel>
    </Page>
  )
}
