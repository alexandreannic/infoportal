import {Page} from '@/shared/Page'
import {useAppSettings} from '@/core/context/ConfigContext'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {useParams} from 'react-router'
import {useFetcher} from '@/shared/hook/useFetcher'
import React, {useEffect} from 'react'
import {Datatable} from '@/shared/Datatable/Datatable'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {alpha, Icon, useTheme} from '@mui/material'
import {fnSwitch, map} from '@alexandreannic/ts-utils'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {KoboAnswerHistory} from '@/core/sdk/server/kobo/answerHistory/KoboAnswerHistory'
import {AppAvatar} from '@/shared/AppAvatar'
import {DatatableHeadIconByType} from '@/shared/Datatable/DatatableHead'
import {Txt} from '@/shared'

export const DatabaseHistory = () => {
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())
  const t = useTheme()
  const {m, formatDateTime, formatDate} = useI18n()
  const {api} = useAppSettings()
  const fetcher = useFetcher(() => api.kobo.answerHistory.search({formId}))
  const ctxSchema = useKoboSchemaContext()
  const schema = ctxSchema.byId2(formId).get

  useEffect(() => {
    ctxSchema.fetchById(formId)
    fetcher.fetch()
  }, [])

  const getAnswerTranslation = (row: KoboAnswerHistory, fn: (_: KoboAnswerHistory) => string) =>
    map(row.property, (property) => {
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
                <TableIcon
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
      <Panel>
        <Datatable
          showExportBtn
          loading={fetcher.loading}
          data={fetcher.get?.data}
          id={`kobo-answer-history${formId}`}
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
              render: (_) => {
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
              width: 0,
              head: m.id + ' #',
              renderQuick: (_) => _.answerIds.length,
            },
            {
              type: 'string',
              id: 'answerId',
              typeIcon: <DatatableHeadIconByType type="id" />,
              className: 'td-id',
              width: 80,
              head: m.id,
              renderQuick: (_) => _.answerIds?.join(' '),
            },
            {
              type: 'select_one',
              id: 'author',
              width: 0,
              head: m.by,
              render: (_) => {
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
            {
              type: 'select_one',
              id: 'type',
              head: m.type,
              render: (_) => {
                return {
                  value: _.type,
                  label: fnSwitch(_.type, {
                    delete: (
                      <Txt color="error" bold>
                        {m._koboDatabase.deleted}
                      </Txt>
                    ),
                    answer: m._koboDatabase.koboQuestion,
                    tag: m._koboDatabase.customColumn,
                  }),
                }
              },
            },
            {
              type: 'select_one',
              id: 'question',
              head: m.column,
              width: 250,
              render: (_) => {
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
              render: (_) => {
                return {
                  value: _.property,
                  label: (
                    <code style={{background: t.palette.background.default, color: t.palette.text.secondary}}>
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
              render: (row) => {
                const label = getAnswerTranslation(row, (_) => _.oldValue)
                return {
                  label: label && (
                    <span
                      style={{
                        borderRadius: 4,
                        padding: '0 4px',
                        background: alpha(t.palette.error.light, 0.16),
                        color: t.palette.error.main,
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
              renderQuick: (_) => _.oldValue && <Icon color="disabled">arrow_forward</Icon>,
            },
            {
              type: 'string',
              id: 'newVranslate',
              head: m._koboDatabase.newValue,
              render: (row) => {
                if (!row.newValue) return {label: undefined, value: undefined}
                const label = getAnswerTranslation(row, (_) => _.newValue)
                return {
                  label: (
                    <span
                      style={{
                        borderRadius: 4,
                        padding: '0 4px',
                        background: alpha(t.palette.success.light, 0.16),
                        color: t.palette.success.main,
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
      </Panel>
    </Page>
  )
}
