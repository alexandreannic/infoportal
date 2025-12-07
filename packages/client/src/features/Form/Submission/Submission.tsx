import {useI18n} from '@infoportal/client-i18n'
import {UseQuerySubmission} from '@/core/query/submission/useQuerySubmission.js'
import {Core} from '@/shared'
import {Page} from '@/shared/Page'
import {map} from '@axanc/ts-utils'
import {Alert, Box, Skeleton, Switch} from '@mui/material'
import {useMemo, useState} from 'react'
import {Api} from '@infoportal/api-sdk'
import {createRoute} from '@tanstack/react-router'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {SubmissionContent} from '@/features/Form/Submission/SubmissionContent'

export const submissionRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'submission/$submissionId',
  component: SubmissionPage,
})

function SubmissionPage() {
  const {m} = useI18n()
  const params = submissionRoute.useParams()
  const workspaceId = params.workspaceId as Api.WorkspaceId
  const formId = params.formId as Api.FormId
  const submissionId = params.submissionId as Api.SubmissionId

  const [showQuestionWithoutAnswer, setShowQuestionWithoutAnswer] = useState(false)
  const {inspector, form} = useFormContext(_ => _)
  const queryAnswers = UseQuerySubmission.search({formId, workspaceId})

  const answer = useMemo(() => {
    return queryAnswers.find(submissionId)
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
              <Core.Txt sx={{color: t => t.vars.palette.info.main}}>{submissionId}</Core.Txt>
            </Core.PanelHead>
            <Core.PanelBody>
              <SubmissionContent
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
