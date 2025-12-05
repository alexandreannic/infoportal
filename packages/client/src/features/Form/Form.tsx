import {appConfig} from '@/conf/AppConfig'
import {useI18n} from '@infoportal/client-i18n'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon} from '@mui/material'
import {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {createRoute, Outlet, useMatches, useNavigate, useRouterState} from '@tanstack/react-router'
import {UseQueryForm} from '@/core/query/form/useQueryForm'
import {Api} from '@infoportal/api-sdk'
import {SchemaInspector} from '@infoportal/form-helper'
import {Page} from '@/shared'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {answersRoute} from '@/features/Form/Database/DatabaseTable'
import {formSettingsRoute} from '@/features/Form/Settings/FormSettings'
import {databaseHistoryRoute} from './History/DatabaseHistory'
import {databaseAccessRoute} from './Access/DatabaseAccess'
import {formBuilderRoute} from '@/features/Form/Builder/FormBuilder'
import {UseQueryPermission} from '@/core/query/useQueryPermission'
import {formActionsRoute} from '@/features/Form/Action/FormActions.js'
import {TabLink, TabsLayout} from '@/shared/Tab/Tabs'
import {ErrorContent} from '@/shared/PageError'
import {createContext, useContextSelector} from 'use-context-selector'
import {UseQuerySchema} from '@/core/query/form/useQuerySchema'

export const formRootRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'form',
  component: Outlet,
})

export const formRoute = createRoute({
  getParentRoute: () => formRootRoute,
  path: '$formId',
  component: Form,
})

export const useDefaultTabRedirect = ({
  currentFullPath,
  workspaceId,
  formId,
  isLoading,
  isResolved,
}: {
  isLoading?: boolean
  isResolved?: boolean
  currentFullPath: string
  workspaceId: Api.WorkspaceId
  formId: Api.FormId
}) => {
  const navigate = useNavigate()
  const pathname = useRouterState({select: s => s.location.pathname})

  useEffect(() => {
    if (isLoading) return
    if (currentFullPath == formRoute.fullPath) {
      if (isResolved) {
        navigate({to: '/$workspaceId/form/$formId/answers', params: {workspaceId, formId}})
      } else {
        navigate({to: '/$workspaceId/form/$formId/formCreator', params: {workspaceId, formId}})
      }
    }
  }, [currentFullPath, pathname, isLoading])
}

export type FormContext = {
  workspaceId: Api.WorkspaceId
  formId: Api.FormId
  form: Api.Form
  inspector?: SchemaInspector
  schemaXml?: Api.Form.SchemaXml
  permission: Api.Permission.Form
  langIndex: number
  setLangIndex: Dispatch<SetStateAction<number>>
}

const Context = createContext<FormContext>({} as FormContext)

export const useFormContext = <Selected extends any>(selector: (_: FormContext) => Selected): Selected => {
  return useContextSelector(Context, selector)
}

function Form() {
  const {workspaceId, formId} = formRoute.useParams() as {workspaceId: Api.WorkspaceId; formId: Api.FormId}
  const {m} = useI18n()
  const {setTitle} = useLayoutContext()
  const currentFullPath = useMatches().slice(-1)[0].fullPath
  const [langIndex, setLangIndex] = useState(0)

  const querySchema = UseQuerySchema.getInspector({formId, workspaceId, langIndex})
  const querySchemaXml = UseQuerySchema.getXml({formId, workspaceId})
  const queryForm = UseQueryForm.get({workspaceId, formId})
  const queryPermission = UseQueryPermission.form({workspaceId, formId})

  useEffect(() => {
    if (queryForm.data)
      setTitle(
        m._koboDatabase.title((queryForm.data.category ? queryForm.data.category + ' > ' : '') + queryForm.data.name),
      )
    return () => setTitle(m._koboDatabase.title())
  }, [queryForm.data, formId])

  const schema = querySchema.data
  const repeatGroups = useMemo(() => {
    return schema?.lookup.group.search().map(_ => _.name)
  }, [schema])

  useDefaultTabRedirect({
    workspaceId,
    formId,
    currentFullPath,
    isResolved: !!querySchema.data,
    isLoading: querySchema.isLoading,
  })

  const outlet = useMemo(() => {
    if (queryForm.isLoading || queryPermission.isLoading) {
      return <Page width="full" loading={true} />
    }
    if (!queryForm.data || !queryPermission.data) {
      return <ErrorContent variant="internal">Cannot load Form.</ErrorContent>
    }

    return (
      <Context.Provider
        value={{
          workspaceId,
          formId,
          langIndex,
          setLangIndex,
          form: queryForm.data,
          inspector: querySchema.data,
          permission: queryPermission.data,
          schemaXml: querySchemaXml.data,
        }}
      >
        <Outlet />
      </Context.Provider>
    )
  }, [queryForm.data, querySchema.data, queryPermission.data, workspaceId])

  return (
    <Page width="full" fullHeight>
      <TabsLayout>
        <TabLink
          icon={<Icon>{appConfig.icons.dataTable}</Icon>}
          sx={{minHeight: 34, py: 1}}
          to={answersRoute.fullPath}
          label={m.data}
          disabled={!schema && (!queryForm.data || !Api.Form.isKobo(queryForm.data))}
        />
        <TabLink
          icon={<Icon>edit</Icon>}
          sx={{minHeight: 34, py: 1}}
          to={formBuilderRoute.fullPath}
          label={m.form}
          disabled={!queryPermission.data || !queryPermission.data.version_canGet}
        />
        <TabLink
          icon={<Icon>lock</Icon>}
          sx={{minHeight: 34, py: 1}}
          to={databaseAccessRoute.fullPath}
          disabled={!schema}
          label={m.access}
        />
        {queryForm.data?.type === 'smart' ? (
          <TabLink
            icon={<Icon>dynamic_form</Icon>}
            sx={{minHeight: 34, py: 1}}
            to={formActionsRoute.fullPath}
            label={m.action}
            disabled={!schema}
          />
        ) : (
          <TabLink
            icon={<Icon>history</Icon>}
            disabled={!schema}
            sx={{minHeight: 34, py: 1}}
            to={databaseHistoryRoute.fullPath}
            label={m.history}
          />
        )}
        <TabLink
          icon={<Icon>settings</Icon>}
          sx={{minHeight: 34, py: 1}}
          disabled={!queryPermission.data || !queryPermission.data?.canDelete || !queryPermission.data?.canUpdate}
          to={formSettingsRoute.fullPath}
          label={m.settings}
        />
        {schema &&
          repeatGroups?.map(_ => (
            <TabLink
              icon={<Icon color="disabled">repeat</Icon>}
              key={_}
              sx={{minHeight: 34, py: 1}}
              to="/$workspaceId/form/$formId/group/$group"
              params={{workspaceId, formId, group: _}}
              label={schema.translate.question(_)}
            />
          ))}
      </TabsLayout>
      {outlet}
    </Page>
  )
}
