import {Fender, IpBtn, Page} from '@/shared'
import {Grid} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import React, {useMemo, useState} from 'react'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useParams} from 'react-router'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {XlsFileUploadForm} from '@/features/FormCreator/XlsFileUploadForm'
import {map, seq} from '@axanc/ts-utils'
import {VersionRow, VersionRowRoot, VersionRowShowMore} from '@/features/FormCreator/VersionRow'
import {useQueryFormById} from '@/core/query/useQueryForm'

export const FormCreator = () => {
  const {m} = useI18n()
  const {workspaceId} = useWorkspaceRouter()
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())
  const [versionVisible, setVersionVisible] = useState(5)
  const queryForm = useQueryFormById({workspaceId, formId})
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
          />
        </Grid>
        <Grid size={{xs: 12, md: 7}}>
          <Panel>
            <PanelHead
              action={
                <IpBtn
                  icon="send"
                  variant="contained"
                  loading={queryVersion.deployLast.isPending}
                  onClick={() => queryVersion.deployLast.mutate({workspaceId, formId})}
                >
                  {m.deployLastVersion}
                </IpBtn>
              }
            >
              {m.versions}
            </PanelHead>
            <PanelBody>
              {map(queryVersion.get.data, versions =>
                versions.length === 0 ? (
                  <Fender type="empty">{m.noSurveyCreatedYet}</Fender>
                ) : (
                  <>
                    {seq(versions ?? [])
                      .sortByNumber(_ => _.version, '9-0')
                      .slice(0, versionVisible)
                      .map(_ => (
                        <VersionRow key={_.id} version={_} />
                      ))}
                    {versionVisible < versions.length && (
                      <VersionRowShowMore onClick={() => setVersionVisible(_ => _ + 5)} />
                    )}
                    {queryForm.data && <VersionRowRoot createdAt={queryForm.data.createdAt} />}
                  </>
                ),
              )}
            </PanelBody>
          </Panel>
          {/*{activeVersion && (*/}
          {/*  <FormCreatorPreview workspaceId={workspaceId} formId={formId} versionId={activeVersion.id} />*/}
          {/*)}*/}
        </Grid>
      </Grid>
    </Page>
  )
}
