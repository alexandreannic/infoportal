import React from 'react'
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from '@mui/material'
import {SubmissionValidation} from '../types'

interface Props {
  submissionValidation: SubmissionValidation;
  closeInvalidSubmissionMessage: () => void;
}

const ValidationOnSubmitModal = (props: Props) => {
  const {submissionValidation, closeInvalidSubmissionMessage} = props

  return (
    <Dialog
      open={submissionValidation === 'invalid'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        s.routes.operations.forms.invalidData.title
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          s.routes.operations.forms.invalidData.infoOnSubmit
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          onClick={closeInvalidSubmissionMessage}
          color="primary"
          autoFocus
        >
          <span>
            s.routes.operations.forms.invalidData.okay)
          </span>
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default ValidationOnSubmitModal
