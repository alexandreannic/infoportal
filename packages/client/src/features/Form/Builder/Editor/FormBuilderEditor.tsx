import {createRoute} from '@tanstack/react-router'
import {formBuilderRoute, useFormBuilderContext} from '@/features/Form/Builder/FormBuilder'
import {XlsFormEditor} from '@infoportal/xls-form-editor'
import {FormBuilderBody} from '@/features/Form/Builder/FormBuilderBody'
import {Core} from '@/shared'

export const formBuilderEditorRoute = createRoute({
  getParentRoute: () => formBuilderRoute,
  path: 'editor',
  component: FormBuilderEditor,
})

function FormBuilderEditor() {
  const localDraft = useFormBuilderContext(_ => _.localDraft)

  return (
    <FormBuilderBody fullWidth>
      {localDraft.error && <Core.Alert color="error" />}
      {localDraft.isSuccess && <XlsFormEditor initialValue={localDraft.get} onChange={console.log} />}
    </FormBuilderBody>
  )
}
