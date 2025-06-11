import {useWorkspaceRouter} from '@/core/context/WorkspaceContext'
import {useI18n} from '@/core/i18n'
import {KoboMappedAnswer, KoboMapper} from '@/core/sdk/server/kobo/KoboMapper'
import {IpBtn} from '@/shared/Btn'
import {IpIconBtn} from '@/shared/IconBtn'
import {Box, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import {DialogProps} from '@toolpad/core'
import {KoboSchemaHelper} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useRef} from 'react'
import {NavLink} from 'react-router-dom'
import {XlsFormFiller, XlsFormFillerHandle} from 'xls-form-filler'

export const DialogAnswerEdit = ({
  onClose,
  payload: {schema, formId, answer},
}: DialogProps<{
  schema: KoboSchemaHelper.Bundle
  formId: Kobo.FormId
  answer: KoboMappedAnswer
}>) => {
  const formRef = useRef<XlsFormFillerHandle>(null)
  const {router} = useWorkspaceRouter()
  const {m} = useI18n()
  return (
    <Dialog open={true}>
      <DialogTitle>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <NavLink to={router.database.form(formId).answer(answer.id)} onClick={() => onClose()}>
            <IpIconBtn color="primary">open_in_new</IpIconBtn>
          </NavLink>
          {answer.id}
        </Box>
      </DialogTitle>
      <DialogContent>
        <XlsFormFiller
          ref={formRef}
          answers={KoboMapper.unmapAnswerBySchema(schema.helper.questionIndex, answer)}
          survey={schema.schema.content}
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
