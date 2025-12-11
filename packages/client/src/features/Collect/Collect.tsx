import {createRoute} from '@tanstack/react-router'
import {rootRoute} from '@/Router'
import {XlsFormFiller} from 'xls-form-filler'
import {Core, Page} from '@/shared'
import {UseQueryForm} from '@/core/query/form/useQueryForm'
import {UseQuerySubmission} from '@/core/query/submission/useQuerySubmission.js'
import {useIpToast} from '@/core/useToast'
import {Api} from '@infoportal/api-sdk'
import React, {useEffect, useState} from 'react'
import {UseQuerySchema} from '@/core/query/form/useQuerySchema'
import {OdkWebForm} from '@infoportal/odk-web-form-wrapper'

export const collectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'collect/$workspaceId/$formId',
  staticData: true,
  component: Collect,
})

function Collect() {
  const {workspaceId, formId} = collectRoute.useParams() as {workspaceId: Api.WorkspaceId; formId: Api.FormId}
  const {toastSuccess} = useIpToast()
  const querySubmit = UseQuerySubmission.submit()
  const querySchemaInspector = UseQuerySchema.getInspector({workspaceId, formId, langIndex: 0})
  const querySchemaXml = UseQuerySchema.getXml({workspaceId, formId})
  const queryForm = UseQueryForm.get({workspaceId, formId})
  const [geolocation, setGeolocation] = useState<Api.Geolocation>()

  useEffect(function handleGetLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      position => {
        setGeolocation([position.coords.latitude, position.coords.longitude])
      },
      err => {},
    )
  }, [])

  return (
    <Page loading={querySchemaXml.isPending} width="xs">
      {querySchemaXml.data && queryForm.data && (
        <Core.Panel>
          <Core.PanelHead>{queryForm.data.name}</Core.PanelHead>
          <Core.PanelBody>
            {querySchemaXml.data && querySchemaInspector.data && (
              <OdkWebForm
                formId={formId}
                questionIndex={querySchemaInspector.data.lookup.questionIndex}
                formXml={querySchemaXml.data as string}
                onSubmit={_ => {
                  querySubmit.mutateAsync({formId, workspaceId, geolocation, ..._}).then(() => toastSuccess(''))
                }}
              />
            )}
          </Core.PanelBody>
        </Core.Panel>
      )}
    </Page>
  )
}
