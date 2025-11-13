import {createRoute} from '@tanstack/react-router'
import {formBuilderRoute, useFormBuilderContext} from '@/features/Form/Builder/FormBuilder'
import {XlsFormEditor} from '@infoportal/xls-form-editor'
import {FormBuilderBody} from '@/features/Form/Builder/FormBuilderBody'
import {useQuerySchemaByVersion} from '@/core/query/useQuerySchemaByVersion'
import {useFormContext} from '@/features/Form/Form'

export const formBuilderEditorRoute = createRoute({
  getParentRoute: () => formBuilderRoute,
  path: 'editor',
  component: FormBuilderEditor,
})

function FormBuilderEditor() {
  const workspaceId = useFormContext(_ => _.workspaceId)
  const formId = useFormContext(_ => _.formId)
  const localDraft = useFormBuilderContext(_ => _.localDraft)
  const setLocalDraft = useFormBuilderContext(_ => _.setLocalDraft)

  console.log(localDraft)
  return (
    <FormBuilderBody fullWidth>
      {localDraft && (
        <XlsFormEditor initialValue={localDraft} onChange={console.log} />
      )}
    </FormBuilderBody>
  )
}
