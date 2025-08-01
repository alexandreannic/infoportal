import {createRoute} from '@tanstack/react-router'
import {rootRoute} from '@/Router'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {XlsFormFiller} from 'xls-form-filler'
import {Page} from '@/shared'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useQueryFormById} from '@/core/query/useQueryForm'
import {useQuerySubmission} from '@/core/query/useQuerySubmission'
import {useIpToast} from '@/core/useToast'
import {Ip} from 'infoportal-api-sdk'
import {useEffect, useState} from 'react'

export const collectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'collect/$workspaceId/$formId',
  staticData: true,
  component: Collect,
})

function Collect() {
  const {workspaceId, formId} = collectRoute.useParams() as {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}
  const {toastSuccess} = useIpToast()
  const querySubmit = useQuerySubmission.submit()
  const querySchema = useQuerySchema({workspaceId, formId})
  const queryForm = useQueryFormById({workspaceId, formId}).get
  const [geolocation, setGeolocation] = useState<Ip.Geolocation>()

  useEffect(function handleGetLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      position => {
        setGeolocation([position.coords.latitude, position.coords.longitude])
      },
      err => {},
    )
  }, [])

  if (querySchema.isPending) {
    return
  }

  return (
    <Page loading={querySchema.isPending} width="xs">
      {querySchema.data && queryForm.data && (
        <Panel>
          <PanelHead>{queryForm.data.name}</PanelHead>
          <PanelBody>
            <XlsFormFiller
              onSubmit={_ =>
                querySubmit.mutateAsync({formId, workspaceId, geolocation, ..._}).then(() => toastSuccess(''))
              }
              survey={querySchema.data.schema}
            />
          </PanelBody>
        </Panel>
      )}
    </Page>
  )
}
