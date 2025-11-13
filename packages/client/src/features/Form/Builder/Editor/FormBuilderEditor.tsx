import {createRoute} from '@tanstack/react-router'
import {formBuilderRoute} from '@/features/Form/Builder/FormBuilder'
import {XlsFormEditor} from '@infoportal/xls-form-editor'
import {FormBuilderBody} from '@/features/Form/Builder/FormBuilderBody'

export const formBuilderEditorRoute = createRoute({
  getParentRoute: () => formBuilderRoute,
  path: 'editor',
  component: FormBuilderEditor,
})

function FormBuilderEditor() {
  return <FormBuilderBody fullWidth>
    <XlsFormEditor />
  </FormBuilderBody>
}
