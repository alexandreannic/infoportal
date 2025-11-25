import {SchemaValidationErrorReport} from '@infoportal/kobo-helper'
import {Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import * as Core from '@infoportal/client-core'

export const ErrorModal = ({error, onClose}: {onClose: () => void; error?: SchemaValidationErrorReport}) => {
  const {m} = useI18n()
  const open = !!error

  const renderArray = (label: string, arr?: any[]) => {
    if (!arr || arr.length === 0) return null
    return (
      <>
        <Core.Txt>{label}</Core.Txt>
        <List dense>
          {arr.map((item, i) => (
            <ListItem key={i}>
              <ListItemText primary={String(item)} />
            </ListItem>
          ))}
        </List>
      </>
    )
  }

  const renderMatch = (label: string, value?: number) => {
    if (value === undefined || value === 0) return null
    const text =
      value === 1
        ? m._xlsFormEditor.notClosed
        : value === -1
          ? m._xlsFormEditor.closedBeforeBeingOpened
          : m._xlsFormEditor.unexpectedValue + ' ' + value

    return (
      <>
        <Core.Txt>{label}</Core.Txt>
        <List dense>
          <ListItem>
            <ListItemText primary={text} />
          </ListItem>
        </List>
      </>
    )
  }

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle color="error">Schema Validation Errors</DialogTitle>
      <DialogContent>
        {!error && m._xlsFormEditor.noError}

        {error && (
          <>
            {renderArray(m._xlsFormEditor.missingQuestionNames, error.missingQuestionNames)}
            {renderArray(m._xlsFormEditor.duplicateQuestionNames, error.duplicateQuestionNames)}
            {renderArray(m._xlsFormEditor.duplicateChoiceNames, error.duplicateChoiceNames)}
            {renderArray(m._xlsFormEditor.unusedChoiceLists, error.unusedChoicesLists)}
            {renderArray(m._xlsFormEditor.missingChoiceLists, error.missingChoicesLists)}
            {renderMatch(m._xlsFormEditor.groupStructure, error.matchingGroups)}
            {renderMatch(m._xlsFormEditor.repeatStructure, error.matchingRepeats)}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Core.Btn variant="contained" onClick={onClose}>
          {m.close}
        </Core.Btn>
      </DialogActions>
    </Dialog>
  )
}
