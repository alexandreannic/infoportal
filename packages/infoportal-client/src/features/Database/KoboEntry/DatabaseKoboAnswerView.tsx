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
import {IpBtn} from '@/shared/Btn'
import {useI18n} from '@/core/i18n'
import {KoboMappedAnswer} from '@/core/sdk/server/kobo/KoboMapper'
import {KoboSchemaHelper, NonNullableKey} from 'infoportal-common'
import React, {useEffect, useMemo, useState} from 'react'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {Txt} from '@/shared/Txt'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {Datatable} from '@/shared/Datatable/Datatable'
import {Page} from '@/shared/Page'
import {useParams} from 'react-router'
import * as yup from 'yup'
import {databaseIndex} from '@/features/Database/databaseIndex'
import {IpIconBtn} from '@/shared/IconBtn'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {map, seq} from '@axanc/ts-utils'
import {NavLink} from 'react-router-dom'
import {columnBySchemaGenerator} from '@/features/Database/KoboTable/columns/columnBySchema'
import {Kobo} from 'kobo-sdk'

const databaseUrlParamsValidation = yup.object({
  formId: yup.string().required(),
  answerId: yup.string().required(),
})

export const DatabaseKoboAnswerViewPage = () => {
  const {m} = useI18n()
  const {formId, answerId} = databaseUrlParamsValidation.validateSync(useParams())
  const [showQuestionWithoutAnswer, setShowQuestionWithoutAnswer] = useState(false)
  const ctxAnswers = useKoboAnswersContext().byId(formId)
  const ctxSchema = useKoboSchemaContext()

  useEffect(() => {
    ctxAnswers.fetch({})
    ctxSchema.fetchById(formId)
  }, [formId])

  const answer = useMemo(() => {
    return ctxAnswers.find(answerId)
  }, [formId, ctxAnswers.get])

  return (
    <Page>
      {ctxAnswers.loading || ctxSchema.byId[formId]?.loading ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        (map(answer, ctxSchema.byId[formId]?.get, (a, schema) => (
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
                    onChange={(e) => setShowQuestionWithoutAnswer(e.target.checked)}
                  />
                </Box>
              }
            >
              {schema.schema.name}
              <br />
              <Txt sx={{color: (t) => t.palette.info.main}}>{answerId}</Txt>
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

export const DatabaseKoboAnswerViewDialog = ({
  onClose,
  formId,
  answer,
}: {
  formId: Kobo.FormId
  answer: KoboMappedAnswer<any>
  onClose: () => void
  open: boolean
}) => {
  const {m} = useI18n()
  const [showQuestionWithoutAnswer, setShowQuestionWithoutAnswer] = useState(false)
  const ctxSchema = useKoboSchemaContext()

  useEffect(() => {
    ctxSchema.fetchById(formId)
  }, [formId])

  return (
    <Dialog open={true}>
      <DialogTitle>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <NavLink to={databaseIndex.siteMap.answer.absolute(formId, answer.id)} onClick={onClose}>
            <IpIconBtn color="primary">open_in_new</IpIconBtn>
          </NavLink>
          {answer.id}
          <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
            <Txt sx={{fontSize: '1rem'}} color="hint">
              {m._koboDatabase.showAllQuestions}
            </Txt>
            <Switch
              value={showQuestionWithoutAnswer}
              onChange={(e) => setShowQuestionWithoutAnswer(e.target.checked)}
            />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        {map(ctxSchema.byId[formId]?.get, (schema) => (
          <KoboAnswerFormView
            schema={schema}
            formId={formId}
            showQuestionWithoutAnswer={showQuestionWithoutAnswer}
            answer={answer}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <IpBtn onClick={onClose}>{m.close}</IpBtn>
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
  answer: KoboMappedAnswer<any>
  formId: Kobo.FormId
}) => {
  return (
    <Box>
      {seq(schema.schemaSanitized.content.survey)
        .compactBy('name')
        .filter(
          (q) => showQuestionWithoutAnswer || q.type === 'begin_group' || (answer[q.name] !== '' && answer[q.name]),
        )
        .map((q) => (
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
  answer: KoboMappedAnswer<any>
}) => {
  const langIndex = useKoboSchemaContext()
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
        <Box sx={{pt: 1, mt: 2, borderTop: (t) => `1px solid ${t.palette.divider}`}}>
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
              {row[questionSchema.name]}
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
          <KoboQuestionAnswerView icon="short_text">{row[questionSchema.name]}</KoboQuestionAnswerView>
        </>
      )
    }
    case 'note': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="info">{row[questionSchema.name]}</KoboQuestionAnswerView>
        </>
      )
    }
    case 'begin_repeat': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <Datatable columns={columns!} data={row[questionSchema.name]} id={questionSchema.name} />
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
          <KoboQuestionAnswerView icon="event">{formatDateTime(row[questionSchema.name])}</KoboQuestionAnswerView>
        </>
      )
    }
    case 'select_multiple': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          {(row[questionSchema.name] as string[])?.map((_) => (
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
            {schema.translate.choice(questionSchema.name, row[questionSchema.name])}
          </KoboQuestionAnswerView>
        </>
      )
    }
    case 'calculate':
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="functions">{row[questionSchema.name]}</KoboQuestionAnswerView>
        </>
      )
    case 'decimal':
    case 'integer': {
      return (
        <>
          <KoboQuestionLabelView>{schema.translate.question(questionSchema.name)}</KoboQuestionLabelView>
          <KoboQuestionAnswerView icon="tag">{row[questionSchema.name]}</KoboQuestionAnswerView>
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
