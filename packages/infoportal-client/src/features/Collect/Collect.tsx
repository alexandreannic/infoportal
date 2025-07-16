import {createRoute} from '@tanstack/react-router'
import {rootRoute} from '@/Router'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {XlsFormFiller} from 'xls-form-filler'
import {Page} from '@/shared'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useQueryFormById} from '@/core/query/useQueryForm'

export const collectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'collect/$workspaceId/$formId',
  staticData: true,
  component: Collect,
})

function Collect() {
  const {workspaceId, formId} = collectRoute.useParams()
  const querySchema = useQuerySchema({workspaceId, formId})
  const queryForm = useQueryFormById({workspaceId, formId}).get
  if (querySchema.isPending) {
    return
  }
  return (
    <Page loading={querySchema.isPending} width="xs">
      {querySchema.data && queryForm.data && (
        <Panel>
          <PanelHead>{queryForm.data.name}</PanelHead>
          <PanelBody>
            <XlsFormFiller onSubmit={console.log} survey={querySchema.data.schema} />
          </PanelBody>
        </Panel>
      )}
    </Page>
  )
}
