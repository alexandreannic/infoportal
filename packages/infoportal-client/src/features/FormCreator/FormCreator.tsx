import {AppAvatar, Page, Txt} from '@/shared'
import {Box, Grid, Icon, useTheme} from '@mui/material'
import {Panel, PanelBody} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import React, {useMemo} from 'react'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useParams} from 'react-router'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {XlsFileUploadForm} from '@/features/FormCreator/XlsFileUploadForm'
import {seq} from '@axanc/ts-utils'
import {capitalize} from 'infoportal-common'
import {FormCreatorPreview} from '@/features/FormCreator/FormCreatorPreview'
import {Ip} from 'infoportal-api-sdk'

export const FormCreator = () => {
  const {m} = useI18n()
  const {workspaceId} = useWorkspaceRouter()
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())

  const queryVersion = useQueryVersion({workspaceId, formId})

  const activeVersion = useMemo(() => {
    return queryVersion.get.data?.find(_ => _.status === 'active')
  }, [queryVersion.get.data])

  return (
    <Page width="full">
      <Grid container>
        <Grid size={{xs: 12, md: 5}}>
          <XlsFileUploadForm
            lastSchema={seq(queryVersion.get.data ?? []).last()}
            workspaceId={workspaceId}
            formId={formId}
            onSubmit={form => queryVersion.upload.mutateAsync(form)}
          />
        </Grid>
        <Grid size={{xs: 12, md: 7}}>
          <Panel>
            <PanelBody>
              {seq(queryVersion.get.data ?? [])
                .sort((a, b) => {
                  return (a.version - b.version) * -1
                })
                .map(_ => (
                  <VersionRow key={_.id} version={_} active={_.id === activeVersion?.id} />
                ))}
            </PanelBody>
          </Panel>
          {activeVersion && (
            <FormCreatorPreview workspaceId={workspaceId} formId={formId} versionId={activeVersion.id} />
          )}
        </Grid>
      </Grid>
    </Page>
  )
}

const VersionRow = ({version, active}: {active: boolean; version: Ip.Form.Version}) => {
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
