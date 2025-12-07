import {DatabaseLeftPanelProps} from '@/features/Form/Database/DatabaseLeftPanel/DatabaseLeftPanel'
import {useI18n} from '@infoportal/client-i18n'
import {useState} from 'react'
import {Box} from '@mui/material'
import {Link} from '@tanstack/react-router'
import {SwitchBox} from '@/shared/customInput/SwitchBox'
import {Core} from '@/shared'
import {Api} from '@infoportal/api-sdk'
import {SchemaInspector} from '@infoportal/form-helper'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {SubmissionContent} from '@/features/Form/Submission/SubmissionContent'

export type DialogAnswerViewProps = {
  workspaceId: Api.WorkspaceId
  formId: Api.FormId
  schemaInspector: SchemaInspector
  submission: Submission
}
export const SubmissionViewerPanel = ({
  onClose,
  payload: {schemaInspector, formId, submission, workspaceId},
}: DatabaseLeftPanelProps<DialogAnswerViewProps>) => {
  const {m} = useI18n()
  const [showQuestionWithoutAnswer, setShowQuestionWithoutAnswer] = useState(false)

  return (
    <Core.Panel sx={{p: 1}}>
      <Core.PanelTitle>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Link
            to="/$workspaceId/form/$formId/submission/$submissionId"
            params={{workspaceId, formId, submissionId: submission.id}}
            onClick={() => onClose()}
          >
            <Core.IconBtn color="primary">open_in_new</Core.IconBtn>
          </Link>
          {submission.id}
        </Box>
      </Core.PanelTitle>
      <SwitchBox
        sx={{mb: 1}}
        label={m._koboDatabase.showAllQuestions}
        value={showQuestionWithoutAnswer}
        onChange={e => setShowQuestionWithoutAnswer(e.target.checked)}
      />
      <SubmissionContent
        workspaceId={workspaceId}
        inspector={schemaInspector}
        formId={formId}
        showQuestionWithoutAnswer={showQuestionWithoutAnswer}
        answer={submission}
      />
    </Core.Panel>
  )
}
