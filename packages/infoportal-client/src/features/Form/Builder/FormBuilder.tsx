import {Fender, IpBtn, Modal, Page} from '@/shared'
import {Alert, AlertTitle, Grid} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import React, {useMemo, useState} from 'react'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useParams} from 'react-router'
import {databaseUrlParamsValidation} from '@/features/Form/Form'
import {XlsFileUploadForm} from '@/features/Form/Builder/XlsFileUploadForm'
import {map, seq} from '@axanc/ts-utils'
import {VersionRow, VersionRowRoot, VersionRowShowMore} from '@/features/Form/Builder/VersionRow'
import {useQueryFormById} from '@/core/query/useQueryForm'
import {FormBuilderKoboFender} from '@/features/Form/Builder/FormBuilderKoboFender'
import {FormBuilderPreview} from '@/features/Form/Builder/FormBuilderPreview'

export const FormBuilder = () => {
  const {m} = useI18n()
  const {workspaceId} = useWorkspaceRouter()
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())
  const [versionVisible, setVersionVisible] = useState(5)
  const queryForm = useQueryFormById({workspaceId, formId})
  const queryVersion = useQueryVersion({workspaceId, formId})

  const {active, draft} = useMemo(() => {
    return {
      active: queryVersion.get.data?.find(_ => _.status === 'active'),
      draft: queryVersion.get.data?.find(_ => _.status === 'draft'),
    }
  }, [queryVersion.get.data])

  return (
    <Page width="full" loading={queryForm.isPending || queryVersion.get.isLoading}>
      {queryForm.data &&
        (queryForm.data.source === 'kobo' ? (
          <FormBuilderKoboFender workspaceId={workspaceId} form={queryForm.data} />
        ) : (
          <Grid container>
            <Grid size={{xs: 12, md: 5}}>
              <XlsFileUploadForm
                lastSchema={seq(queryVersion.get.data ?? []).last()}
                workspaceId={workspaceId}
                formId={formId}
              />
              {map(queryVersion.get.data, versions => versions.length > 0 && (
                <Panel>
                  <PanelHead
                    action={
                      <Modal
                        loading={queryVersion.deployLast.isPending}
                        title={m.confirm}
                        onConfirm={() => queryVersion.deployLast.mutate({workspaceId, formId})}
                      >
                        <IpBtn
                          icon="send"
                          variant="contained"
                          disabled={!draft}
                          loading={queryVersion.deployLast.isPending}
                        >
                          {m.deployLastVersion}
                        </IpBtn>
                      </Modal>
                    }
                  >
                    {m.versions}
                  </PanelHead>
                  <PanelBody>
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
                  </PanelBody>
                </Panel>
              ))}
            </Grid>
            <Grid size={{xs: 12, md: 7}}>
              {active && <FormBuilderPreview workspaceId={workspaceId} formId={formId} versionId={active.id} />}
              {/*{activeVersion && (*/}
              {/*)}*/}
            </Grid>
          </Grid>
        ))}
    </Page>
  )
}
