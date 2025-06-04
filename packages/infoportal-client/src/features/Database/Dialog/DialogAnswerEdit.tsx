import {Box, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import {IpBtn} from '@/shared/Btn'
import {useI18n} from '@/core/i18n'
import {KoboMappedAnswer, KoboMapper} from '@/core/sdk/server/kobo/KoboMapper'
import React, {useRef} from 'react'
import {databaseIndex} from '@/features/Database/databaseIndex'
import {IpIconBtn} from '@/shared/IconBtn'
import {NavLink} from 'react-router-dom'
import {Kobo} from 'kobo-sdk'
import {DialogProps} from '@toolpad/core'
import {XlsFormFiller, XlsFormFillerHandle} from 'xls-form-filler'
import {KoboSchemaHelper} from 'infoportal-common'

export const DialogAnswerEdit = ({
  onClose,
  payload: {schema, formId, answer},
}: DialogProps<{
  schema: KoboSchemaHelper.Bundle
  formId: Kobo.FormId
  answer: KoboMappedAnswer
}>) => {
  const formRef = useRef<XlsFormFillerHandle>(null)
  const {m} = useI18n()
  return (
    <Dialog open={true}>
      <DialogTitle>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <NavLink to={databaseIndex.siteMap.answer.absolute(formId, answer.id)} onClick={() => onClose()}>
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
        <IpBtn variant="contained" icon="check" onClick={() => formRef.current?.submit()}>{m.save}</IpBtn>
      </DialogActions>
    </Dialog>
  )
}
