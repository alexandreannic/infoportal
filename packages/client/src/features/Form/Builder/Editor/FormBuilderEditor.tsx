import {createRoute} from '@tanstack/react-router'
import {formBuilderRoute, useFormBuilderContext} from '@/features/Form/Builder/FormBuilder'
import {XlsFormEditor} from '@infoportal/xls-form-editor'
import {FormBuilderBody} from '@/features/Form/Builder/FormBuilderBody'
import {Core} from '@/shared'
import {UseQueryVersion} from '@/core/query/useQueryVersion'
import {Ip} from '@infoportal/api-sdk'

export const formBuilderEditorRoute = createRoute({
  getParentRoute: () => formBuilderRoute,
  path: 'editor',
  component: FormBuilderEditor,
})

function FormBuilderEditor() {
  const {formId, workspaceId} = formBuilderEditorRoute.useParams() as {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}
  const queryDraftVersion = useFormBuilderContext(_ => _.queryLastVersion)
  const versions = useFormBuilderContext(_ => _.versions)
  const queryVersion = UseQueryVersion.createNewVersion({workspaceId, formId})

  return (
    <FormBuilderBody fullWidth>
      {queryDraftVersion.error && <Core.Alert color="error" />}
      {(queryDraftVersion.isSuccess || !versions.draft) && (
        <XlsFormEditor
          value={queryDraftVersion.data}
          onCommit={_ => {
            queryVersion.mutateAsync({schemaJson: _})
          }}
        />
      )}
    </FormBuilderBody>
  )
}
