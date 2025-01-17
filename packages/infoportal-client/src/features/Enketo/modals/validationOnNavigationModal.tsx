import React from 'react'

import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from '@mui/material'

interface Props {
  nextPage: () => void;
  showValidationConfirmation: boolean;
  closeValidationMessage: () => void;
}

const ValidationOnNavigationModal = (props: Props) => {
  const {nextPage, showValidationConfirmation, closeValidationMessage} =
    props

  return (
    <Dialog
      open={showValidationConfirmation}
      onClose={closeValidationMessage}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        s.routes.operations.forms.invalidData.title
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          s.routes.operations.forms.invalidData.infoOnNavigation
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button onClick={closeValidationMessage} autoFocus>
          <span>
            s.routes.operations.forms.invalidData.fixNow
          </span>
        </button>
        <button onClick={nextPage}>
          <span>
            s.routes.operations.forms.invalidData.fixLater
          </span>
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default ValidationOnNavigationModal
