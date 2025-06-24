import {AppAvatar, Page, Txt} from '@/shared'
import {Box, Grid2, Icon, useTheme} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import React from 'react'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useParams} from 'react-router'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {XlsFileUploadForm} from '@/features/FormCreator/XlsFileUploadForm'
import {SchemaDetails} from '@/core/sdk/server/kobo/FormVersionSdk'
import {seq} from '@axanc/ts-utils'
import {capitalize} from 'infoportal-common'
import {XlsFormFiller} from 'xls-form-filler'

export const FormCreator = () => {
  const {m} = useI18n()
  const {workspaceId} = useWorkspaceRouter()
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())

  const querySchema = useQuerySchema({workspaceId, formId})

  console.log(querySchema.get.data)
  return (
    <Page width="full">
      <Grid2 container>
        <Grid2 size={{xs: 12, md: 5}}>

              <XlsFileUploadForm
                oldShema={querySchema.get.data?.last?.schema as object}
                workspaceId={workspaceId}
                formId={formId}
                onSubmit={form => querySchema.upload.mutateAsync(form)}
              />
        </Grid2>
        <Grid2 size={{xs: 12, md: 7}}>
          <Panel>
            <PanelBody>
              {seq(querySchema.get.data?.all ?? [])
                .sort((a, b) => {
                  return (a.version - b.version) * -1
                })
                .map(_ => (
                  <VersionRow key={_.id} version={_} active={_.id === querySchema.get.data?.active?.id} />
                ))}
            </PanelBody>
          </Panel>
          {querySchema.get.data?.last && (
            <Panel>
              <PanelHead>{m.preview}</PanelHead>
              <PanelBody>
                <XlsFormFiller
                  survey={querySchema.get.data?.last.schema}
                  hideActions
                  onSubmit={_ => {
                    console.log('HERE')
                    console.log(_)
                  }}
                />
              </PanelBody>
            </Panel>
          )}
        </Grid2>
      </Grid2>
    </Page>
  )
}

const VersionRow = ({version, active}: {active: boolean; version: SchemaDetails['all'][number]}) => {
  const {m, formatDateTime, dateFromNow} = useI18n()
  const t = useTheme()
  return (
    <Box sx={{display: 'flex', py: 1, alignItems: 'center', borderBottom: '1px solid', borderColor: t.palette.divider}}>
      <Txt bold size="title" color="hint" sx={{width: 40, mr: 2, textAlign: 'right', fontFamily: 'monospace'}}>
        v{version.version}
      </Txt>
      <Box>
        <Txt block>{version.message ?? <i>{m.noMessage}</i>}</Txt>
        <Txt color="hint" block sx={{flex: 1}}>
          <AppAvatar size={24} sx={{verticalAlign: 'middle', mr: 0.5}} email={version.uploadedBy} />
          {capitalize(dateFromNow(version.createdAt))} {m.by.toLowerCase()} {version.uploadedBy}
        </Txt>
        {active && <Icon color="success">check_circle</Icon>}
      </Box>
    </Box>
  )
}
