import {Core, Page} from '@/shared'
import {Grid, Grow, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n'
import React, {useMemo, useState} from 'react'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {XlsFileUploadForm} from '@/features/Form/Builder/XlsFileUploadForm'
import {map, seq} from '@axanc/ts-utils'
import {VersionRow, VersionRowRoot, VersionRowShowMore} from '@/features/Form/Builder/VersionRow'
import {UseQueryForm} from '@/core/query/useQueryForm'
import {FormBuilderKoboFender} from '@/features/Form/Builder/FormBuilderKoboFender'
import {FormBuilderPreview} from '@/features/Form/Builder/FormBuilderPreview'
import {createRoute, Link, useRouter} from '@tanstack/react-router'
import {formRoute} from '@/features/Form/Form'
import {useIpToast} from '@/core/useToast'
import {Ip} from 'infoportal-api-sdk'
import {TabContent} from '@/shared/Tab/TabContent.js'

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
  const queryForm = UseQueryForm.get({workspaceId, formId})
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
    <TabContent width="full" loading={queryForm.isPending || queryVersion.get.isLoading}>
      {queryForm.data &&
        (queryForm.data.kobo ? (
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
                    <Core.Panel>
                      <Core.PanelHead
                        action={
                          <Core.Modal
                            loading={queryVersion.deployLast.isPending}
                            title={m.confirm}
                            onConfirm={(event, close) =>
                              queryVersion.deployLast.mutateAsync({workspaceId, formId}).then(close)
                            }
                          >
                            <Core.Btn
                              icon="send"
                              variant="contained"
                              disabled={!draft}
                              loading={queryVersion.deployLast.isPending}
                            >
                              {m.deployLastVersion}
                            </Core.Btn>
                          </Core.Modal>
                        }
                      >
                        {m.versions}
                      </Core.PanelHead>
                      <Core.PanelBody>
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
                      </Core.PanelBody>
                    </Core.Panel>
                  ),
              )}
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              {active && (
                <Core.Panel sx={{p: 1}}>
                  <Core.Btn
                    sx={{mr: 1}}
                    icon="visibility"
                    size="large"
                    variant="outlined"
                    onClick={() => setShowPreview(true)}
                    disabled={!active}
                  >
                    {m.preview}
                  </Core.Btn>
                  <Link to="/collect/$workspaceId/$formId" params={{workspaceId, formId}} target="_blank">
                    <Core.Btn
                      sx={{mr: 1}}
                      icon="open_in_new"
                      size="large"
                      variant="outlined"
                      onClick={() => setShowPreview(true)}
                    >
                      {m.open}
                    </Core.Btn>
                  </Link>
                  <Core.Modal
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
                      <Core.Input
                        helperText={null}
                        slotProps={{input: {sx: {width: 400, color: t.vars.palette.text.secondary}}}}
                        readOnly
                        value={window.location.origin + location.href}
                      />
                    }
                  >
                    <Core.Btn icon="link" size="large" variant="outlined">
                      {m.copyLink}
                    </Core.Btn>
                  </Core.Modal>
                </Core.Panel>
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
    </TabContent>
  )
}
