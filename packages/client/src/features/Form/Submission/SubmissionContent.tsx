import {Api} from '@infoportal/api-sdk'
import {SchemaInspector} from '@infoportal/form-helper'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {Box, Icon, useTheme} from '@mui/material'
import {useFormContext} from '@/features/Form/Form'
import {useI18n} from '@infoportal/client-i18n'
import {useMemo} from 'react'
import {buildDbColumns} from '@infoportal/database-column'
import {getKoboAttachmentUrl, KoboAttachedImg} from '@/core/KoboAttachmentUrl'
import {Core, Datatable} from '@/shared'

export const SubmissionContent = ({
  workspaceId,
  answer,
  formId,
  inspector,
  showQuestionWithoutAnswer,
}: {
  workspaceId: Api.WorkspaceId
  inspector: SchemaInspector
  showQuestionWithoutAnswer?: boolean
  answer: Submission
  formId: Api.FormId
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
            <SubmissionViewQuestion
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

const SubmissionViewQuestion = ({
  inspector,
  questionSchema,
  answer: row,
  formId,
  workspaceId,
}: {
  workspaceId: Api.WorkspaceId
  formId: Api.FormId
  inspector: SchemaInspector
  questionSchema: Api.Form.Question
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
          <SubmissionViewLabel>{inspector.translate.question(questionSchema.name)}</SubmissionViewLabel>
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
          <SubmissionViewLabel>{inspector.translate.question(questionSchema.name)}</SubmissionViewLabel>
          <SubmissionViewAnswer icon="short_text">{row.answers[questionSchema.name] as string}</SubmissionViewAnswer>
        </>
      )
    }
    case 'note': {
      return (
        <>
          <SubmissionViewLabel>{inspector.translate.question(questionSchema.name)}</SubmissionViewLabel>
          <SubmissionViewAnswer icon="info">{row.answers[questionSchema.name] as string}</SubmissionViewAnswer>
        </>
      )
    }
    case 'begin_repeat': {
      return (
        <>
          <SubmissionViewLabel>{inspector.translate.question(questionSchema.name)}</SubmissionViewLabel>
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
          <SubmissionViewLabel>{inspector.translate.question(questionSchema.name)}</SubmissionViewLabel>
          <SubmissionViewAnswer icon="event">
            {formatDateTime(row.answers[questionSchema.name] as Date)}
          </SubmissionViewAnswer>
        </>
      )
    }
    case 'select_multiple': {
      return (
        <>
          <SubmissionViewLabel>{inspector.translate.question(questionSchema.name)}</SubmissionViewLabel>
          {(row.answers[questionSchema.name] as string[])?.map(_ => (
            <SubmissionViewAnswer key={_} icon="check_box">
              {inspector.translate.choice(questionSchema.name, _)}
            </SubmissionViewAnswer>
          ))}
        </>
      )
    }
    case 'select_one': {
      return (
        <>
          <SubmissionViewLabel>{inspector.translate.question(questionSchema.name)}</SubmissionViewLabel>
          <SubmissionViewAnswer icon="radio_button_checked">
            {inspector.translate.choice(questionSchema.name, row.answers[questionSchema.name] as string)}
          </SubmissionViewAnswer>
        </>
      )
    }
    case 'calculate':
      return (
        <>
          <SubmissionViewLabel>{inspector.translate.question(questionSchema.name)}</SubmissionViewLabel>
          <SubmissionViewAnswer icon="functions">{row.answers[questionSchema.name] as string}</SubmissionViewAnswer>
        </>
      )
    case 'decimal':
    case 'integer': {
      return (
        <>
          <SubmissionViewLabel>{inspector.translate.question(questionSchema.name)}</SubmissionViewLabel>
          <SubmissionViewAnswer icon="tag">{row.answers[questionSchema.name] as string}</SubmissionViewAnswer>
        </>
      )
    }
    default: {
      return (
        <>
          <SubmissionViewLabel>{inspector.translate.question(questionSchema.name)}</SubmissionViewLabel>
          <SubmissionViewAnswer icon="short_text">
            {JSON.stringify(row.answers[questionSchema.name])}
          </SubmissionViewAnswer>
        </>
      )
    }
  }
}

const SubmissionViewLabel = ({children}: {children: string}) => {
  return <Core.Txt bold block sx={{mb: 0.5}} dangerouslySetInnerHTML={{__html: children}} />
}

const SubmissionViewAnswer = ({icon, children}: {icon: string; children: string}) => {
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
