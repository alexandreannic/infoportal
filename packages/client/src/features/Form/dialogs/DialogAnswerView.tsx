import {useI18n} from '@infoportal/client-i18n'
import {UseQuerySubmission} from '@/core/query/form/useQuerySubmission'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {Core, Datatable} from '@/shared'
import {Page} from '@/shared/Page'
import {map} from '@axanc/ts-utils'
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
import {useMemo, useState} from 'react'
import {Ip} from '@infoportal/api-sdk'
import {createRoute, Link} from '@tanstack/react-router'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {buildDbColumns} from '@infoportal/database-column'
import {getKoboAttachmentUrl, KoboAttachedImg} from '@/core/KoboAttachmentUrl.js'
import {SchemaInspector} from '@infoportal/form-helper'

export const databaseAnswerViewRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'answer/$answerId',
  component: DatabaseAnswerView,
})

function DatabaseAnswerView() {
  const {m} = useI18n()
  const {workspaceId, formId, answerId} = databaseAnswerViewRoute.useParams() as {
    workspaceId: Ip.WorkspaceId
    formId: Ip.FormId
    answerId: Ip.SubmissionId
  }
  const [showQuestionWithoutAnswer, setShowQuestionWithoutAnswer] = useState(false)
  const {inspector, form} = useFormContext(_ => _)
  const queryAnswers = UseQuerySubmission.search({formId, workspaceId})

  const answer = useMemo(() => {
    return queryAnswers.find(answerId)
  }, [formId, queryAnswers.data])

  return (
    <Page width="xs">
      {queryAnswers.isLoading ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        (map(answer, inspector, (a, s) => (
          <Core.Panel>
            <Core.PanelHead
              action={
                <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
                  <Core.Txt sx={{fontSize: '1em'}} color="hint">
                    {m._koboDatabase.showAllQuestions}
                  </Core.Txt>
                  <Switch
                    size="small"
                    value={showQuestionWithoutAnswer}
                    onChange={e => setShowQuestionWithoutAnswer(e.target.checked)}
                  />
                </Box>
              }
            >
              {form.name}
              <br />
              <Core.Txt sx={{color: t => t.vars.palette.info.main}}>{answerId}</Core.Txt>
            </Core.PanelHead>
            <Core.PanelBody>
              <KoboAnswerFormView
                workspaceId={workspaceId}
                formId={formId}
                showQuestionWithoutAnswer={showQuestionWithoutAnswer}
                answer={a}
                inspector={s}
              />
            </Core.PanelBody>
          </Core.Panel>
        )) ?? <Alert color="warning">{m.noDataAtm}</Alert>)
      )}
    </Page>
  )
}

export const DialogAnswerView = ({
  onClose,
  payload: {schema, formId, submission, workspaceId},
}: DialogProps<{
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  schema: SchemaInspector
  submission: Submission
}>) => {
  const {m} = useI18n()
  const [showQuestionWithoutAnswer, setShowQuestionWithoutAnswer] = useState(false)

  return (
    <Dialog open={true}>
      <DialogTitle>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Link
            to="/$workspaceId/form/$formId/answer/$answerId"
            params={{workspaceId, formId, answerId: submission.id}}
            onClick={() => onClose()}
          >
            <Core.IconBtn color="primary">open_in_new</Core.IconBtn>
          </Link>
          {submission.id}
          <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
            <Core.Txt sx={{fontSize: '1rem'}} color="hint">
              {m._koboDatabase.showAllQuestions}
            </Core.Txt>
            <Switch value={showQuestionWithoutAnswer} onChange={e => setShowQuestionWithoutAnswer(e.target.checked)} />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <KoboAnswerFormView
          workspaceId={workspaceId}
          inspector={schema}
          formId={formId}
          showQuestionWithoutAnswer={showQuestionWithoutAnswer}
          answer={submission}
        />
      </DialogContent>
      <DialogActions>
        <Core.Btn onClick={() => onClose()}>{m.close}</Core.Btn>
      </DialogActions>
    </Dialog>
  )
}

const KoboAnswerFormView = ({
  workspaceId,
  answer,
  formId,
  inspector,
  showQuestionWithoutAnswer,
}: {
  workspaceId: Ip.WorkspaceId
  inspector: SchemaInspector
  showQuestionWithoutAnswer?: boolean
  answer: Submission
  formId: Ip.FormId
}) => {
  return (
    <Box>
      {inspector.schemaSanitized.survey
        .filter(
          q =>
            q.name &&
            (showQuestionWithoutAnswer ||
              q.type === 'begin_group' ||
              (answer.answers[q.name] !== '' && answer.answers[q.name])),
        )
        .map(q => (
          <Box key={q.name} sx={{mb: 1.5}}>
            <KoboAnswerQuestionView
              workspaceId={workspaceId}
              formId={formId}
              inspector={inspector}
              answer={answer}
              questionSchema={q}
            />
          </Box>
        ))}
    </Box>
  )
}

const KoboAnswerQuestionView = ({
  inspector,
  questionSchema,
  answer: row,
  formId,
  workspaceId,
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  inspector: SchemaInspector
  questionSchema: Ip.Form.Question
  answer: Submission
}) => {
  const langIndex = useFormContext(_ => _.langIndex)
  const {formatDateTime} = useI18n()
  const {m} = useI18n()
  const t = useTheme()
  const columns = useMemo(() => {
    if (questionSchema.type !== 'begin_repeat') return
    const group = inspector.lookup.group.getByName(questionSchema.name)
    if (!group) return
    return buildDbColumns.question.byQuestions({
      getFileUrl: getKoboAttachmentUrl,
      questions: group.questions,
      inspector: inspector,
      formId,
      m,
      t,
    })
  }, [inspector.schemaSanitized, langIndex])

  switch (questionSchema.type) {
    case 'begin_group': {
      return (
        <Box sx={{pt: 1, mt: 2, borderTop: t => `1px solid ${t.vars.palette.divider}`}}>
          <Core.Txt bold block size="title">
            {inspector.translate.question(questionSchema.name)}
          </Core.Txt>
        </Box>
      )
    }
    case 'image': {
      return (
        <>
          <KoboQuestionLabelView>{inspector.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <Box>
            <Core.Txt block size="small" color="hint">
              {row.answers[questionSchema.name] as string}
            </Core.Txt>
            <KoboAttachedImg
              formId={formId}
              submissionId={row.id}
              attachments={row.attachments}
              size={84}
              fileName={row.answers[questionSchema.name] as string}
            />
          </Box>
        </>
      )
    }
    case 'text': {
      return (
        <>
          <KoboQuestionLabelView>{inspector.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="short_text">
            {row.answers[questionSchema.name] as string}
          </KoboQuestionAnswerView>
        </>
      )
    }
    case 'note': {
      return (
        <>
          <KoboQuestionLabelView>{inspector.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="info">{row.answers[questionSchema.name] as string}</KoboQuestionAnswerView>
        </>
      )
    }
    case 'begin_repeat': {
      return (
        <>
          <KoboQuestionLabelView>{inspector.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <Datatable.Component
            getRowKey={_ => _.id}
            columns={columns!}
            data={row.answers[questionSchema.name] as any[]}
            id={questionSchema.name}
          />
        </>
      )
    }
    case 'start':
    case 'end':
    case 'datetime':
    case 'date': {
      return (
        <>
          <KoboQuestionLabelView>{inspector.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="event">
            {formatDateTime(row.answers[questionSchema.name] as Date)}
          </KoboQuestionAnswerView>
        </>
      )
    }
    case 'select_multiple': {
      return (
        <>
          <KoboQuestionLabelView>{inspector.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          {(row.answers[questionSchema.name] as string[])?.map(_ => (
            <KoboQuestionAnswerView key={_} icon="check_box">
              {inspector.translate.choice(questionSchema.name, _)}
            </KoboQuestionAnswerView>
          ))}
        </>
      )
    }
    case 'select_one': {
      return (
        <>
          <KoboQuestionLabelView>{inspector.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="radio_button_checked">
            {inspector.translate.choice(questionSchema.name, row.answers[questionSchema.name] as string)}
          </KoboQuestionAnswerView>
        </>
      )
    }
    case 'calculate':
      return (
        <>
          <KoboQuestionLabelView>{inspector.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="functions">{row.answers[questionSchema.name] as string}</KoboQuestionAnswerView>
        </>
      )
    case 'decimal':
    case 'integer': {
      return (
        <>
          <KoboQuestionLabelView>{inspector.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="tag">{row.answers[questionSchema.name] as string}</KoboQuestionAnswerView>
        </>
      )
    }
    default: {
      return (
        <>
          <KoboQuestionLabelView>{inspector.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="short_text">
            {JSON.stringify(row.answers[questionSchema.name])}
          </KoboQuestionAnswerView>
        </>
      )
    }
  }
}

const KoboQuestionLabelView = ({children}: {children: string}) => {
  return <Core.Txt bold block sx={{mb: 0.5}} dangerouslySetInnerHTML={{__html: children}} />
}

const KoboQuestionAnswerView = ({icon, children}: {icon: string; children: string}) => {
  if (!children) return
  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <Icon color="disabled" sx={{mr: 1}}>
        {icon}
      </Icon>
      <Core.Txt color="hint">{children}</Core.Txt>
    </Box>
  )
}
