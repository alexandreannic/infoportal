import {Dispatch, SetStateAction, useCallback} from 'react'
import {Box, Collapse, useTheme} from '@mui/material'
import {DatabaseViewEditor} from '@/features/Form/Database/view/DatabaseView'
import {DialogAnswerEdit, DialogAnswerEditProps} from '@/features/Form/dialogs/DialogAnswerEdit'
import {AnswerView, DialogAnswerViewProps} from '@/features/Form/dialogs/AnswerView'

export type DatabaseLeftPanelProps<T extends object | undefined> = {
  onClose: () => void
  payload: T
}

export type DatabaseLeftPanelState =
  | {
      type: 'SUBMISSION_VIEW'
      payload: DialogAnswerViewProps
    }
  | {
      type: 'SUBMISSION_EDIT'
      payload: DialogAnswerEditProps
    }
  | {
      type: 'DATABASE_VIEWS'
      payload?: undefined
    }

export const DatabaseLeftPanel = ({
  state,
  setState,
}: {
  state?: DatabaseLeftPanelState
  setState: Dispatch<SetStateAction<DatabaseLeftPanelState | undefined>>
}) => {
  const t = useTheme()
  const handleClose = useCallback(() => setState(undefined), [setState])
  return (
    <Collapse orientation="horizontal" in={!!state} sx={{flexShrink: 0}}>
      <Box sx={{width: state?.type === 'DATABASE_VIEWS' ? 340 : 400, transition: t.transitions.create('all'), mr: 1}}>
        {(() => {
          if (!state) return
          switch (state.type) {
            case 'DATABASE_VIEWS': {
              return <DatabaseViewEditor onClose={handleClose} payload={undefined} />
            }
            case 'SUBMISSION_VIEW': {
              return <AnswerView onClose={handleClose} payload={state.payload} />
            }
            case 'SUBMISSION_EDIT': {
              return <DialogAnswerEdit onClose={handleClose} payload={state.payload} />
            }
          }
        })()}
      </Box>
    </Collapse>
  )
}
