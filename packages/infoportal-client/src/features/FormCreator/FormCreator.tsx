import {Page} from '@/shared'
import {Grid2} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import React from 'react'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useParams} from 'react-router'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {XlsFileUploadForm} from '@/features/FormCreator/XlsFileUploadForm'

export const FormCreator = () => {
  const {m} = useI18n()
  const {workspaceId} = useWorkspaceRouter()
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())

  const querySchema = useQuerySchema({workspaceId, formId})

  console.log(querySchema.get.data)
  return (
    <Page width="full">
      <Grid2 container spacing={2}>
        <Grid2 size={{xs: 12, md: 6}}>
          <Panel>
            <PanelHead>{m.importXlsFile}</PanelHead>
            <PanelBody>
              <XlsFileUploadForm
                oldShema={querySchema.get.data?.last?.schema as object}
                workspaceId={workspaceId}
                formId={formId}
                onSubmit={form => querySchema.upload.mutateAsync(form)}
              />
            </PanelBody>
          </Panel>
        </Grid2>
        <Grid2 size={{xs: 12, md: 6}}>
          <Panel>{JSON.stringify(querySchema.get.data)}</Panel>
        </Grid2>
      </Grid2>
    </Page>
  )
}
