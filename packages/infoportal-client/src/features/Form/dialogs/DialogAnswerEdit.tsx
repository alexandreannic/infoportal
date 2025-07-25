import {useI18n} from '@/core/i18n'
import {KoboMapper, Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {IpBtn} from '@/shared/Btn'
import {IpIconBtn} from '@/shared/IconBtn'
import {Box, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import {DialogProps} from '@toolpad/core'
import {KoboSchemaHelper} from 'infoportal-common'
import {useRef} from 'react'
import {XlsFormFiller, XlsFormFillerHandle} from 'xls-form-filler'
import {Ip} from 'infoportal-api-sdk'
import {Link} from '@tanstack/react-router'

export const DialogAnswerEdit = ({
  onClose,
  payload: {schema, workspaceId, formId, answer},
}: DialogProps<{
  schema: KoboSchemaHelper.Bundle
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  answer: Submission
}>) => {
  const formRef = useRef<XlsFormFillerHandle>(null)
  const {m} = useI18n()
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
        </Box>
      </DialogTitle>
      <DialogContent>
        <XlsFormFiller
          ref={formRef}
          answers={KoboMapper.unmapSubmissionBySchema(schema.helper.questionIndex, answer)}
          survey={schema.schema}
          hideActions
          onSubmit={_ => {
            console.log('HERE')
            console.log(_)
          }}
        />
      </DialogContent>
      <DialogActions>
        <IpBtn onClick={() => onClose()}>{m.close}</IpBtn>
        <IpBtn variant="contained" icon="check" onClick={() => formRef.current?.submit()}>
          {m.save}
        </IpBtn>
      </DialogActions>
    </Dialog>
  )
}
