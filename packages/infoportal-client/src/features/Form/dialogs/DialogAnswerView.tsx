import {useI18n} from '@/core/i18n'
import {useQueryAnswer} from '@/core/query/useQueryAnswer'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {KoboMappedAnswer} from '@/core/sdk/server/kobo/KoboMapper'
import {useLangIndex} from '@/core/store/useLangIndex'
import {columnBySchemaGenerator} from '@/features/Form/Database/columns/columnBySchema'
import {IpBtn} from '@/shared/Btn'
import {Datatable} from '@/shared/Datatable/Datatable'
import {IpIconBtn} from '@/shared/IconBtn'
import {Page} from '@/shared/Page'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {Txt} from '@/shared/Txt'
import {map, seq} from '@axanc/ts-utils'
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  Skeleton,
  Switch,
  useTheme,
} from '@mui/material'
import {DialogProps} from '@toolpad/core'
import {KoboSchemaHelper, NonNullableKey} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useMemo, useState} from 'react'
import {useQueryFormById} from '@/core/query/useQueryForm'
import {Ip} from 'infoportal-api-sdk'
import {createRoute, Link} from '@tanstack/react-router'
import {formRoute} from '@/features/Form/Form'

export const databaseAnswerViewRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'answer/$answerId',
  component: DatabaseAnswerView,
})

function DatabaseAnswerView() {
  const {m} = useI18n()
  const {workspaceId, formId, answerId} = databaseAnswerViewRoute.useParams()
  const [showQuestionWithoutAnswer, setShowQuestionWithoutAnswer] = useState(false)
  const queryForm = useQueryFormById({formId, workspaceId}).get
  const queryAnswers = useQueryAnswer({formId, workspaceId})
  const querySchema = useQuerySchema({workspaceId, formId})

  const answer = useMemo(() => {
    return queryAnswers.find(answerId)
  }, [formId, queryAnswers.data])

  return (
    <Page>
      {queryForm.isLoading || queryAnswers.isLoading || querySchema.isLoading ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        (map(answer, querySchema.data, (a, schema) => (
          <Panel>
            <PanelHead
              action={
                <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
                  <Txt sx={{fontSize: '1em'}} color="hint">
                    {m._koboDatabase.showAllQuestions}
                  </Txt>
                  <Switch
                    size="small"
                    value={showQuestionWithoutAnswer}
                    onChange={e => setShowQuestionWithoutAnswer(e.target.checked)}
                  />
                </Box>
              }
            >
              {queryForm.data?.name}
              <br />
              <Txt sx={{color: t => t.palette.info.main}}>{answerId}</Txt>
            </PanelHead>
            <PanelBody>
              <KoboAnswerFormView
                formId={formId}
                showQuestionWithoutAnswer={showQuestionWithoutAnswer}
                answer={a}
                schema={schema}
              />
            </PanelBody>
          </Panel>
        )) ?? <Alert color="warning">{m.noDataAtm}</Alert>)
      )}
    </Page>
  )
}

export const DialogAnswerView = ({
  onClose,
  payload: {schema, formId, answer, workspaceId},
}: DialogProps<{
  workspaceId: Ip.Uuid
  formId: Kobo.FormId
  schema: KoboSchemaHelper.Bundle
  answer: KoboMappedAnswer
}>) => {
  const {m} = useI18n()
  const [showQuestionWithoutAnswer, setShowQuestionWithoutAnswer] = useState(false)

  return (
    <Dialog open={true}>
      <DialogTitle>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Link
            to="/$workspaceId/form/$formId/answer/$answerId"
            params={{workspaceId, formId, answerId: answer.id}}
            onClick={() => onClose()}
          >
            <IpIconBtn color="primary">open_in_new</IpIconBtn>
          </Link>
          {answer.id}
          <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
            <Txt sx={{fontSize: '1rem'}} color="hint">
              {m._koboDatabase.showAllQuestions}
            </Txt>
            <Switch value={showQuestionWithoutAnswer} onChange={e => setShowQuestionWithoutAnswer(e.target.checked)} />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <KoboAnswerFormView
          schema={schema}
          formId={formId}
          showQuestionWithoutAnswer={showQuestionWithoutAnswer}
          answer={answer}
        />
      </DialogContent>
      <DialogActions>
        <IpBtn onClick={() => onClose()}>{m.close}</IpBtn>
      </DialogActions>
    </Dialog>
  )
}

const KoboAnswerFormView = ({
  answer,
  formId,
  schema,
  showQuestionWithoutAnswer,
}: {
  schema: KoboSchemaHelper.Bundle
  showQuestionWithoutAnswer?: boolean
  answer: KoboMappedAnswer
  formId: Kobo.FormId
}) => {
  return (
    <Box>
      {seq(schema.schemaSanitized.survey)
        .compactBy('name')
        .filter(q => showQuestionWithoutAnswer || q.type === 'begin_group' || (answer[q.name] !== '' && answer[q.name]))
        .map(q => (
          <Box key={q.name} sx={{mb: 1.5}}>
            <KoboAnswerQuestionView formId={formId} schema={schema} answer={answer} questionSchema={q} />
          </Box>
        ))}
    </Box>
  )
}

const KoboAnswerQuestionView = ({
  schema,
  questionSchema,
  answer: row,
  formId,
}: {
  formId: Kobo.FormId
  schema: KoboSchemaHelper.Bundle
  questionSchema: NonNullableKey<Kobo.Form.Question, 'name'>
  answer: KoboMappedAnswer
}) => {
  const langIndex = useLangIndex()
  const {formatDateTime} = useI18n()
  const {m} = useI18n()
  const t = useTheme()
  const columns = useMemo(() => {
    if (questionSchema.type !== 'begin_repeat') return
    const group = schema.helper.group.getByName(questionSchema.name)
    if (!group) return
    return columnBySchemaGenerator({
      m,
      formId,
      t,
      schema,
    }).getByQuestions(group.questions)
  }, [schema.schemaSanitized, langIndex])
  switch (questionSchema.type) {
    case 'begin_group': {
      return (
        <Box sx={{pt: 1, mt: 2, borderTop: t => `1px solid ${t.palette.divider}`}}>
          <Txt bold block size="title">
            {schema.translate.question(questionSchema.name)}
          </Txt>
        </Box>
      )
    }
    case 'image': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <Box>
            <Txt block size="small" color="hint">
              {row[questionSchema.name] as string}
            </Txt>
            <KoboAttachedImg
              formId={formId}
              answerId={row.id}
              attachments={row.attachments}
              size={84}
              fileName={row[questionSchema.name] as string}
            />
          </Box>
        </>
      )
    }
    case 'text': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="short_text">{row[questionSchema.name] as string}</KoboQuestionAnswerView>
        </>
      )
    }
    case 'note': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="info">{row[questionSchema.name] as string}</KoboQuestionAnswerView>
        </>
      )
    }
    case 'begin_repeat': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <Datatable columns={columns!} data={row[questionSchema.name] as any[]} id={questionSchema.name} />
        </>
      )
    }
    case 'start':
    case 'end':
    case 'datetime':
    case 'date': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="event">
            {formatDateTime(row[questionSchema.name] as Date)}
          </KoboQuestionAnswerView>
        </>
      )
    }
    case 'select_multiple': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          {(row[questionSchema.name] as string[])?.map(_ => (
            <KoboQuestionAnswerView key={_} icon="check_box">
              {schema.translate.choice(questionSchema.name, _)}
            </KoboQuestionAnswerView>
          ))}
        </>
      )
    }
    case 'select_one': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="radio_button_checked">
            {schema.translate.choice(questionSchema.name, row[questionSchema.name] as string)}
          </KoboQuestionAnswerView>
        </>
      )
    }
    case 'calculate':
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="functions">{row[questionSchema.name] as string}</KoboQuestionAnswerView>
        </>
      )
    case 'decimal':
    case 'integer': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="tag">{row[questionSchema.name] as string}</KoboQuestionAnswerView>
        </>
      )
    }
    default: {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="short_text">{JSON.stringify(row[questionSchema.name])}</KoboQuestionAnswerView>
        </>
      )
    }
  }
}

const KoboQuestionLabelView = ({children}: {children: string}) => {
  return <Txt bold block sx={{mb: 0.5}} dangerouslySetInnerHTML={{__html: children}} />
}

const KoboQuestionAnswerView = ({icon, children}: {icon: string; children: string}) => {
  if (!children) return
  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <Icon color="disabled" sx={{mr: 1}}>
        {icon}
      </Icon>
      <Txt color="hint">{children}</Txt>
    </Box>
  )
}
