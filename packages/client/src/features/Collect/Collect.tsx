import {createRoute} from '@tanstack/react-router'
import {rootRoute} from '@/Router'
import {useQuerySchema, useQuerySchemaBundle} from '@/core/query/useQuerySchema'
import {XlsFormFiller} from 'xls-form-filler'
import {Core, Page} from '@/shared'
import {UseQueryForm} from '@/core/query/useQueryForm'
import {UseQuerySubmission} from '@/core/query/useQuerySubmission'
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
  const querySubmit = UseQuerySubmission.submit()
  const querySchema = useQuerySchema({workspaceId, formId})
  const queryForm = UseQueryForm.get({workspaceId, formId})
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
        <Core.Panel>
          <Core.PanelHead>{queryForm.data.name}</Core.PanelHead>
          <Core.PanelBody>
            <XlsFormFiller
              onSubmit={_ =>
                querySubmit.mutateAsync({formId, workspaceId, geolocation, ..._}).then(() => toastSuccess(''))
              }
              survey={querySchema.data}
            />
          </Core.PanelBody>
        </Core.Panel>
      )}
    </Page>
  )
}
