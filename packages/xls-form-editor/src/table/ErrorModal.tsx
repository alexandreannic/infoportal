import {SchemaValidationErrorReport} from '@infoportal/kobo-helper'
import {Box, Chip, Dialog, DialogActions, DialogContent, DialogTitle, useTheme} from '@mui/material'
import {Messages, useI18n} from '@infoportal/client-i18n'
import * as Core from '@infoportal/client-core'

export type ErrorModalValue = SchemaValidationErrorReport & {noChanges?: boolean}

const getMatchValue = (m: Messages, value?: number) => {
  if (!value) return
  const text =
    value === 1
      ? m._xlsFormEditor.notClosed
      : value === -1
        ? m._xlsFormEditor.closedBeforeBeingOpened
        : m._xlsFormEditor.unexpectedValue + ' ' + value
  return [text]
}

export const ErrorModal = ({report, onClose}: {onClose: () => void; report?: ErrorModalValue}) => {
  const {m} = useI18n()
  const open = !!report

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Schema Validation Errors</DialogTitle>
      <DialogContent>
        {report && (
          <>
            {(report.errors || report.noChanges) && (
              <>
                <Core.Txt bold color="error" size="big" block>
                  {m.error}
                </Core.Txt>
                <ErrorItem label={m._xlsFormEditor.noChanges} errors={report.noChanges ? [] : undefined} />
                <ErrorItem label={m._xlsFormEditor.missingQuestionNames} errors={report.errors?.missingQuestionNames} />
                <ErrorItem
                  label={m._xlsFormEditor.duplicateQuestionNames}
                  errors={report.errors?.duplicateQuestionNames}
                />
                <ErrorItem label={m._xlsFormEditor.duplicateChoiceNames} errors={report.errors?.duplicateChoiceNames} />
                <ErrorItem label={m._xlsFormEditor.missingChoiceLists} errors={report.errors?.missingChoicesLists} />
                <ErrorItem
                  label={m._xlsFormEditor.groupStructure}
                  errors={getMatchValue(m, report.errors?.matchingGroups)}
                />
                <ErrorItem
                  label={m._xlsFormEditor.repeatStructure}
                  errors={getMatchValue(m, report.errors?.matchingRepeats)}
                />
              </>
            )}
            {report.warnings && (
              <>
                <Core.Txt bold color="warning" size="big" block>
                  {m.warning}
                </Core.Txt>
                <ErrorItem label={m._xlsFormEditor.unusedChoiceLists} errors={report.warnings?.unusedChoicesLists} />
              </>
            )}
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

const ErrorItem = ({label, errors}: {label: string; errors?: (string | number)[]}) => {
  const t = useTheme()
  if (!errors) return null
  return (
    <>
      <Core.Txt sx={{mb: 1}} block bold>{label}</Core.Txt>
      <Box sx={{display: 'flex', gap: t.vars?.spacing, flexWrap: 'wrap'}}>
        {errors.map((item, i) => (
          <Chip size="small" label={item} key={i} />
        ))}
      </Box>
    </>
  )
}
