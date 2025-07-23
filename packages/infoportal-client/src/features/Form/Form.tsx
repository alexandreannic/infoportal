import {appConfig} from '@/conf/AppConfig'
import {useI18n} from '@/core/i18n'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon, Tab, Tabs} from '@mui/material'
import {createContext, useContext, useEffect, useMemo} from 'react'
import {createRoute, Link, Outlet, useMatches, useNavigate, useRouterState} from '@tanstack/react-router'
import {useQueryFormById} from '@/core/query/useQueryForm'
import {Ip} from 'infoportal-api-sdk'
import {KoboSchemaHelper} from 'infoportal-common'
import {Page} from '@/shared'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {answersRoute} from '@/features/Form/Database/DatabaseTable'
import {formSettingsRoute} from '@/features/Form/Settings/FormSettings'
import {databaseHistoryRoute} from './History/DatabaseHistory'
import {databaseAccessRoute} from './Access/DatabaseAccess'
import {formBuilderRoute} from '@/features/Form/Builder/FormBuilder'
import {databaseKoboRepeatRoute} from '@/features/Form/RepeatGroup/DatabaseKoboRepeatGroup'
import {useQueryPermission} from '@/core/query/useQueryPermission'

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
}: {
  currentFullPath?: string
  workspaceId: Ip.Uuid
  formId: Ip.FormId
}) => {
  const navigate = useNavigate()
  const pathname = useRouterState({select: s => s.location.pathname})
  const querySchema = useQuerySchema({formId, workspaceId})

  useEffect(() => {
    if (querySchema.isLoading) return
    if (currentFullPath == formRoute.fullPath) {
      if (querySchema.data) {
        navigate({to: '/$workspaceId/form/$formId/answers', params: {workspaceId, formId}})
      } else {
        navigate({to: '/$workspaceId/form/$formId/formCreator', params: {workspaceId, formId}})
      }
    }
  }, [pathname, querySchema.isLoading])
}

export type FormContext = {
  workspaceId: Ip.Uuid
  form: Ip.Form
  schema?: KoboSchemaHelper.Bundle
  permission: Ip.Permission.Form
}

const Context = createContext<FormContext>({} as FormContext)

export const useFormContext = (): FormContext => useContext<FormContext>(Context)

function Form() {
  const {workspaceId, formId} = formRoute.useParams()
  const {m} = useI18n()
  const {setTitle} = useLayoutContext()
  const currentFullPath = useMatches().slice(-1)[0].fullPath

  const querySchema = useQuerySchema({formId, workspaceId})
  const queryForm = useQueryFormById({workspaceId, formId}).get
  const queryPermission = useQueryPermission.form({workspaceId, formId})

  useEffect(() => {
    if (queryForm.data) setTitle(m._koboDatabase.title(queryForm.data.name))
    return () => setTitle(m._koboDatabase.title())
  }, [queryForm.data, formId])

  const schema = querySchema.data
  const repeatGroups = useMemo(() => {
    return schema?.helper.group.search().map(_ => _.name)
  }, [schema])

  useDefaultTabRedirect({workspaceId, formId})

  const outlet = useMemo(() => {
    if (queryForm.isLoading || querySchema.isLoading || queryPermission.isLoading) {
      return <Page width="full" loading={true} />
    }
    if (!queryForm.data || !queryPermission.data) {
      return <>Error</>
    }

    return (
      <Context.Provider
        value={{
          workspaceId,
          form: queryForm.data,
          schema: querySchema.data,
          permission: queryPermission.data,
        }}
      >
        <Outlet />
      </Context.Provider>
    )
  }, [queryForm.status, queryForm.data, querySchema.status, queryPermission.data, workspaceId])

  return (
    <Page width="full">
      <Tabs variant="scrollable" scrollButtons="auto" value={currentFullPath}>
        <Tab
          icon={<Icon>{appConfig.icons.dataTable}</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={answersRoute.fullPath}
          to={answersRoute.fullPath}
          label={m.data}
          disabled={!schema}
        />
        <Tab
          icon={<Icon>edit</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={formBuilderRoute.fullPath}
          to={formBuilderRoute.fullPath}
          label={m.form}
        />
        <Tab
          icon={<Icon>lock</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={databaseAccessRoute.fullPath}
          to={databaseAccessRoute.fullPath}
          disabled={!schema}
          label={m.access}
        />
        <Tab
          icon={<Icon>history</Icon>}
          disabled={!schema}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={databaseHistoryRoute.fullPath}
          to={databaseHistoryRoute.fullPath}
          label={m.history}
        />
        <Tab
          icon={<Icon>settings</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={formSettingsRoute.fullPath}
          to={formSettingsRoute.fullPath}
          label={m.settings}
        />
        {schema &&
          repeatGroups?.map(_ => (
            <Tab
              icon={<Icon color="disabled">repeat</Icon>}
              iconPosition="start"
              key={_}
              sx={{minHeight: 34, py: 1}}
              component={Link}
              value={databaseKoboRepeatRoute.fullPath}
              to={databaseKoboRepeatRoute.fullPath}
              label={schema.translate.question(_)}
            />
          ))}
      </Tabs>
      {outlet}
    </Page>
  )
}
