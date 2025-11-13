import {appConfig} from '@/conf/AppConfig'
import {useI18n} from '@infoportal/client-i18n'
import {useQuerySchemaBundle} from '@/core/query/useQuerySchema'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon} from '@mui/material'
import {createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {createRoute, Outlet, useMatches, useNavigate, useRouterState} from '@tanstack/react-router'
import {UseQueryForm} from '@/core/query/useQueryForm'
import {Ip} from '@infoportal/api-sdk'
import {KoboSchemaHelper} from '@infoportal/kobo-helper'
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
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
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
  workspaceId: Ip.WorkspaceId
  form: Ip.Form
  schema: KoboSchemaHelper.Bundle
  permission: Ip.Permission.Form
  langIndex: number
  setLangIndex: Dispatch<SetStateAction<number>>
}

const Context = createContext<FormContext>({} as FormContext)

export const useFormContext = (): FormContext => useContext<FormContext>(Context)

function Form() {
  const {workspaceId, formId} = formRoute.useParams() as {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}
  const {m} = useI18n()
  const {setTitle} = useLayoutContext()
  const currentFullPath = useMatches().slice(-1)[0].fullPath
  const [langIndex, setLangIndex] = useState(0)

  const querySchema = useQuerySchemaBundle({formId, workspaceId, langIndex})
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
    return schema?.helper.group.search().map(_ => _.name)
  }, [schema])

  useDefaultTabRedirect({
    workspaceId,
    formId,
    currentFullPath,
    isResolved: !!querySchema.data,
    isLoading: querySchema.isLoading,
  })

  const outlet = useMemo(() => {
    if (queryForm.isLoading || querySchema.isLoading || queryPermission.isLoading) {
      return <Page width="full" loading={true} />
    }
    if (!queryForm.data || !querySchema.data || !queryPermission.data) {
      return <>Error</>
    }

    return (
      <Context.Provider
        value={{
          workspaceId,
          langIndex,
          setLangIndex,
          form: queryForm.data,
          schema: querySchema.data,
          permission: queryPermission.data,
        }}
      >
        <Outlet />
      </Context.Provider>
    )
  }, [queryForm.data, querySchema.data, queryPermission.data, workspaceId])

  return (
    <Page width="full" sx={{height: '100%'}}>
      <TabsLayout>
        <TabLink
          icon={<Icon>{appConfig.icons.dataTable}</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          to={answersRoute.fullPath}
          label={m.data}
          disabled={!schema && (!queryForm.data || !Ip.Form.isKobo(queryForm.data))}
        />
        <TabLink
          icon={<Icon>edit</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          to={formBuilderRoute.fullPath}
          label={m.form}
          disabled={!queryPermission.data || !queryPermission.data.version_canGet}
        />
        <TabLink
          icon={<Icon>lock</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          to={databaseAccessRoute.fullPath}
          disabled={!schema}
          label={m.access}
        />
        {queryForm.data?.type === 'smart' ? (
          <TabLink
            icon={<Icon>dynamic_form</Icon>}
            iconPosition="start"
            sx={{minHeight: 34, py: 1}}
            to={formActionsRoute.fullPath}
            label={m.action}
            disabled={!schema}
          />
        ) : (
          <TabLink
            icon={<Icon>history</Icon>}
            disabled={!schema}
            iconPosition="start"
            sx={{minHeight: 34, py: 1}}
            to={databaseHistoryRoute.fullPath}
            label={m.history}
          />
        )}
        <TabLink
          icon={<Icon>settings</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          disabled={!queryPermission.data || !queryPermission.data?.canDelete || !queryPermission.data?.canUpdate}
          to={formSettingsRoute.fullPath}
          label={m.settings}
        />
        {schema &&
          repeatGroups?.map(_ => (
            <TabLink
              icon={<Icon color="disabled">repeat</Icon>}
              iconPosition="start"
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
