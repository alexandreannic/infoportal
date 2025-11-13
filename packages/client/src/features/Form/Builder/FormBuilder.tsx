import {Core} from '@/shared'
import {Box, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import React, {Dispatch, useEffect, useMemo, useState} from 'react'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {UseQueryForm} from '@/core/query/useQueryForm'
import {FormBuilderKoboFender} from '@/features/Form/Builder/FormBuilderKoboFender'
import {FormBuilderPreview} from '@/features/Form/Builder/FormBuilderPreview'
import {createRoute, Outlet, redirect} from '@tanstack/react-router'
import {formRoute} from '@/features/Form/Form'
import {HttpError, Ip} from '@infoportal/api-sdk'
import {TabContent} from '@/shared/Tab/TabContent.js'
import {FormBuilderTabs} from '@/features/Form/Builder/FormBuilderTabs'
import {createContext, useContextSelector} from 'use-context-selector'
import {formBuilderVersionRoute} from '@/features/Form/Builder/Version/FormBuilderVersion'
import {UseQueryPermission} from '@/core/query/useQueryPermission'
import {useQuerySchemaByVersion} from '@/core/query/useQuerySchemaByVersion'

const formBuilderRoutePath = 'formCreator'
export const formBuilderRoute = createRoute({
  getParentRoute: () => formRoute,
  path: formBuilderRoutePath,
  component: FormBuilder,
  beforeLoad: ({location, params}) => {
    if (location.pathname.endsWith(formBuilderRoutePath)) {
      throw redirect({to: formBuilderVersionRoute.to, params})
    }
  },
})

export type FormBuilderContext = {
  // workspaceId: Ip.WorkspaceId
  // formId: Ip.FormId
  // form: Ip.Form
  // formPermission: Ip.Permission.Form
  versions: Ip.Form.Version[]
  versionActive?: Ip.Form.Version
  versionDraft?: Ip.Form.Version
  showPreview: boolean
  setShowPreview: Dispatch<React.SetStateAction<boolean>>
  localDraft: Ip.Form.Schema | undefined
  setLocalDraft: Dispatch<React.SetStateAction<Ip.Form.Schema | undefined>>
}

const Context = createContext<FormBuilderContext>({} as any)

export const useFormBuilderContext = <Selected extends any>(selector: (_: FormBuilderContext) => Selected): Selected => {
  return useContextSelector(Context, selector)
}

function FormBuilder() {
  const t = useTheme()
  const {workspaceId, formId} = formBuilderRoute.useParams() as {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}
  const queryForm = UseQueryForm.get({workspaceId, formId})
  const queryVersion = useQueryVersion({workspaceId, formId})
  const queryPermission = UseQueryPermission.form({workspaceId, formId})
  const [showPreview, setShowPreview] = useState(false)

  const {active, draft} = useMemo(() => {
    return {
      active: queryVersion.get.data?.find(_ => _.status === 'active'),
      draft: queryVersion.get.data?.find(_ => _.status === 'draft'),
    }
  }, [queryVersion.get.data])

  const queryDraftSchema = useQuerySchemaByVersion({workspaceId, formId, versionId: draft?.id})

  const [localDraft, setLocalDraft] = useState<Ip.Form.Schema | undefined>()
  useEffect(() => {
    if (!localDraft && queryDraftSchema.isSuccess || queryDraftSchema.error instanceof HttpError.NotFound) {
      if (queryDraftSchema.data) setLocalDraft(queryDraftSchema.data)
      else setLocalDraft({choices: [], survey: [], translations: [], settings: {}, translated: [], schema: ''})
    }
  }, [queryDraftSchema.data])

  // console.log(localDraft)

  return (
    <TabContent width="full" loading={queryPermission.isLoading || queryForm.isPending || queryVersion.get.isLoading}>
      {(() => {
        if (!queryForm.data || !queryPermission.data || !queryVersion.get.data) return
        if (Ip.Form.isConnectedToKobo(queryForm.data))
          return <FormBuilderKoboFender workspaceId={workspaceId} form={queryForm.data} />

        return (
          <Context.Provider value={{
            versions: queryVersion.get.data,
            versionActive: active,
            versionDraft: draft,
            showPreview,
            setShowPreview,
            localDraft,
            setLocalDraft,
          }}>
            <Box
              sx={{
                gap: t.vars.spacing,
                justifyItems: 'center',
                width: showPreview ? '100%' : '100%',
                margin: 'auto',
                display: 'flex',
                overflowX: 'auto',
                transition: 'all 0.4s ease',
                '--right-width': showPreview ? '50%' : '0%',
                '--left-width': showPreview ? '50%' : '100%',
              }}
            >
              <Box
                sx={{
                  flex: '1 1 var(--left-width)',
                  transition: 'flex-basis 0.4s ease',
                  minWidth: 0,
                }}
              >
                <FormBuilderTabs
                  sx={{margin: 'auto', width: showPreview ? '100%' : '50%'}}
                  workspaceId={workspaceId}
                  formId={formId}
                  activeVersion={active}
                  setShowPreview={setShowPreview}
                  showPreview={showPreview}
                />
                {Ip.Form.isKobo(queryForm.data) && <AlertImportKoboSchema workspaceId={workspaceId} formId={formId} />}
                <Outlet />
              </Box>

              <Box
                sx={{
                  flex: '1 1 var(--right-width)',
                  transition: 'flex-basis 0.4s ease',
                  overflow: 'hidden',
                  opacity: showPreview ? 1 : 0,
                }}
              >
                {active && <FormBuilderPreview workspaceId={workspaceId} formId={formId} versionId={active?.id} />}
              </Box>
            </Box>
          </Context.Provider>
        )
      })()}
    </TabContent>
  )
}

function AlertImportKoboSchema({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) {
  const {m} = useI18n()
  const queryVersion = useQueryVersion({workspaceId, formId})
  return (
    <Core.Alert severity="warning" sx={{mb: 1}}>
      <div>{m._builder.alertPreviouslyKoboForm}</div>
      {queryVersion.get.data?.length === 0 && (
        <div style={{textAlign: 'right'}}>
          <Core.Btn
            color="inherit"
            icon="download"
            loading={queryVersion.importLastKoboSchema.isPending}
            onClick={() => queryVersion.importLastKoboSchema.mutate()}
            sx={{textTransform: 'inherit', marginLeft: 'auto', whiteSpace: 'nowrap'}}
            children={m._builder.importCurrentKoboSurvey}
          />
        </div>
      )}
    </Core.Alert>
  )
}
