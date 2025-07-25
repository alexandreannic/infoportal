import {IpBtn, Modal, Page} from '@/shared'
import {Grid, Grow, useTheme} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import React, {useMemo, useState} from 'react'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {XlsFileUploadForm} from '@/features/Form/Builder/XlsFileUploadForm'
import {map, seq} from '@axanc/ts-utils'
import {VersionRow, VersionRowRoot, VersionRowShowMore} from '@/features/Form/Builder/VersionRow'
import {useQueryFormById} from '@/core/query/useQueryForm'
import {FormBuilderKoboFender} from '@/features/Form/Builder/FormBuilderKoboFender'
import {FormBuilderPreview} from '@/features/Form/Builder/FormBuilderPreview'
import {createRoute, Link, useRouter} from '@tanstack/react-router'
import {formRoute} from '@/features/Form/Form'
import {IpInput} from '@/shared/Input/Input'
import {useIpToast} from '@/core/useToast'
import {Ip} from 'infoportal-api-sdk'

export const formBuilderRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'formCreator',
  component: FormBuilder,
})

function FormBuilder() {
  const {m} = useI18n()
  const t = useTheme()
  const {toastInfo, toastError} = useIpToast()
  const {workspaceId, formId} = formBuilderRoute.useParams() as {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}
  const [versionVisible, setVersionVisible] = useState(5)
  const queryForm = useQueryFormById({workspaceId, formId}).get
  const queryVersion = useQueryVersion({workspaceId, formId})
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  const location = router.buildLocation({
    to: '/collect/$workspaceId/$formId',
    params: {workspaceId, formId},
  })
  const absoluteUrl = window.location.origin + location.href

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
            <Grid size={{xs: 12, md: 6}}>
              <XlsFileUploadForm
                lastSchema={seq(queryVersion.get.data ?? []).last()}
                workspaceId={workspaceId}
                formId={formId}
              />
              {map(
                queryVersion.get.data,
                versions =>
                  versions.length > 0 && (
                    <Panel>
                      <PanelHead
                        action={
                          <Modal
                            loading={queryVersion.deployLast.isPending}
                            title={m.confirm}
                            onConfirm={(event, close) =>
                              queryVersion.deployLast.mutateAsync({workspaceId, formId}).then(close)
                            }
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
                          .map((_, i) => (
                            <VersionRow key={_.id} version={_} index={i} />
                          ))}
                        {versionVisible < versions.length && (
                          <VersionRowShowMore onClick={() => setVersionVisible(_ => _ + 5)} />
                        )}
                        {queryForm.data && <VersionRowRoot createdAt={queryForm.data.createdAt} />}
                      </PanelBody>
                    </Panel>
                  ),
              )}
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              {active && (
                <Panel sx={{p: 1}}>
                  <IpBtn
                    sx={{mr: 1}}
                    icon="visibility"
                    size="large"
                    variant="outlined"
                    onClick={() => setShowPreview(true)}
                    disabled={!active}
                  >
                    {m.preview}
                  </IpBtn>
                  <Link to="/collect/$workspaceId/$formId" params={{workspaceId, formId}} target="_blank">
                    <IpBtn
                      sx={{mr: 1}}
                      icon="open_in_new"
                      size="large"
                      variant="outlined"
                      onClick={() => setShowPreview(true)}
                    >
                      {m.open}
                    </IpBtn>
                  </Link>
                  <Modal
                    title={m.copyResponderLink}
                    onConfirm={async () => {
                      try {
                        await navigator.clipboard.writeText(absoluteUrl)
                        toastInfo(m.copiedToClipboard)
                      } catch (e: any) {
                        toastError(e?.message ?? m.error)
                      }
                    }}
                    confirmLabel={m.copy}
                    cancelLabel={m.close}
                    content={
                      <IpInput
                        helperText={null}
                        slotProps={{input: {sx: {width: 400, color: t.palette.text.secondary}}}}
                        readOnly
                        value={window.location.origin + location.href}
                      />
                    }
                  >
                    <IpBtn icon="link" size="large" variant="outlined">
                      {m.copyLink}
                    </IpBtn>
                  </Modal>
                </Panel>
              )}
              {active && showPreview && (
                <Grow in={true}>
                  <div>
                    <FormBuilderPreview workspaceId={workspaceId} formId={formId} versionId={active.id} />
                  </div>
                </Grow>
              )}
            </Grid>
          </Grid>
        ))}
    </Page>
  )
}
