import {createRoute} from '@tanstack/react-router'
import {formBuilderRoute} from '@/features/Form/Builder/FormBuilder'
import {Box} from '@mui/material'
import {XlsFormEditor} from '@infoportal/xls-form-editor'

export const formBuilderEditorRoute = createRoute({
  getParentRoute: () => formBuilderRoute,
  path: 'editor',
  component: FormBuilderEditor,
})

function FormBuilderEditor() {
  return <Box>
    <XlsFormEditor />
  </Box>
}
