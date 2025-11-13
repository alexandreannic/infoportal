import {Core} from '@/shared'
import {Box, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import React, {Dispatch, useMemo, useState} from 'react'
import {useQueryVersion} from '@/core/query/useQueryVersion'
import {UseQueryForm} from '@/core/query/useQueryForm'
import {FormBuilderKoboFender} from '@/features/Form/Builder/FormBuilderKoboFender'
import {FormBuilderPreview} from '@/features/Form/Builder/FormBuilderPreview'
import {createRoute, Outlet, redirect} from '@tanstack/react-router'
import {formRoute} from '@/features/Form/Form'
import {useIpToast} from '@/core/useToast'
import {Ip} from '@infoportal/api-sdk'
import {TabContent} from '@/shared/Tab/TabContent.js'
import {FormBuilderTabs} from '@/features/Form/Builder/FormBuilderTabs'
import {createContext, useContextSelector} from 'use-context-selector'
import {formBuilderVersionRoute} from '@/features/Form/Builder/Version/FormBuilderVersion'

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
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  form: Ip.Form
  versions: Ip.Form.Version[]
  versionActive?: Ip.Form.Version
  showPreview: boolean
  setShowPreview: Dispatch<React.SetStateAction<boolean>>
}

const Context = createContext<FormBuilderContext>({} as any)

export const useFormBuilderContext = <Selected extends any>(selector: (_: FormBuilderContext) => Selected): Selected => {
  return useContextSelector(Context, selector)
}

export const useFormBuilderContentStyle = ({fullWidth}: {fullWidth?: boolean} = {}) => {
  const showPreview = useFormBuilderContext(_ => _.showPreview)
  return {
    marginRight: 'auto',
    marginLeft: 'auto',
    width: fullWidth || showPreview ? '100%' : '50%',
  }
}

function FormBuilder() {
  const t = useTheme()
  const {workspaceId, formId} = formBuilderRoute.useParams() as {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}
  const queryForm = UseQueryForm.get({workspaceId, formId})
  const queryVersion = useQueryVersion({workspaceId, formId})
  const [showPreview, setShowPreview] = useState(false)

  const active = useMemo(() => {
    return queryVersion.get.data?.find(_ => _.status === 'active')
  }, [queryVersion.get.data])

  return (
    <TabContent width="full" loading={queryForm.isPending || queryVersion.get.isLoading}>
      {(() => {
        if (!queryForm.data || !queryVersion.get.data) return
        if (Ip.Form.isConnectedToKobo(queryForm.data))
          return <FormBuilderKoboFender workspaceId={workspaceId} form={queryForm.data} />

        return (
          <Context.Provider value={{
            workspaceId,
            formId,
            form: queryForm.data,
            versions: queryVersion.get.data,
            versionActive: active,
            showPreview,
            setShowPreview,
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
