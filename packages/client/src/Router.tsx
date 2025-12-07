import {createRootRoute, createRouter, ErrorRouteComponent} from '@tanstack/react-router'
import {settingsRoute} from './features/Settings/Settings'
import {settingsUsersRoute} from '@/features/Settings/SettingsUsers'
import {settingsCacheRoute} from '@/features/Settings/SettingsCache'
import {formsRoute} from '@/features/Form/Forms'
import {formRootRoute, formRoute} from '@/features/Form/Form'
import {formBuilderRoute} from '@/features/Form/Builder/FormBuilder'
import {databaseAccessRoute} from '@/features/Form/Access/DatabaseAccess'
import {databaseHistoryRoute} from '@/features/Form/History/DatabaseHistory'
import {formSettingsRoute} from './features/Form/Settings/FormSettings'
import {databaseKoboRepeatRoute} from '@/features/Form/RepeatGroup/DatabaseKoboRepeatGroup'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {App} from '@/App'
import {collectRoute} from '@/features/Collect/Collect'
import {overviewRoute} from '@/features/Overview/Overview.js'
import {submissionsRoute} from '@/features/Form/Database/DatabaseTable'
import {workspacesRoute} from '@/features/Workspace/Workspaces'
import {newFormRoute} from '@/features/NewForm/NewForm'
import {settingsGroupsRoute} from '@/features/Settings/SettingsGroups'
import {formActionRoute} from '@/features/Form/Action/Action/FormAction.js'
import {formActionsRoute} from '@/features/Form/Action/FormActions.js'
import {formActionReportsRoute} from '@/features/Form/Action/FormActionReports.js'
import {formActionLogsRoute} from '@/features/Form/Action/FormActionLogs.js'
import {dashboardsRoute} from '@/features/Dashboard/Dashboards'
import {dashboardSectionRoute} from '@/features/Dashboard/Section/DashboardSection'
import {dashboardRoute} from '@/features/Dashboard/Dashboard'
import {dashboardSettingsRoute} from '@/features/Dashboard/DashboardSettings'
import {dashboardRenderRoute} from '@/features/Dashboard/Render/DashboardRender'
import {formBuilderVersionRoute} from '@/features/Form/Builder/Version/FormBuilderVersion'
import {formBuilderXlsUploaderRoute} from '@/features/Form/Builder/Upload/XlsFileUploadForm'
import {formBuilderEditorRoute} from '@/features/Form/Builder/Editor/FormBuilderEditor'
import {submissionRoute} from '@/features/Form/Submission/Submission'

export const rootRoute = createRootRoute({
  component: App,
})

const tsRoutes = [
  collectRoute,
  workspacesRoute,
  dashboardRenderRoute,
  workspaceRoute.addChildren([
    dashboardsRoute,
    dashboardRoute.addChildren([dashboardSettingsRoute, dashboardSectionRoute]),
    overviewRoute,
    newFormRoute,
    formRootRoute.addChildren([
      formsRoute,
      formRoute.addChildren([
        databaseAccessRoute,
        formBuilderRoute.addChildren([formBuilderVersionRoute, formBuilderXlsUploaderRoute, formBuilderEditorRoute]),
        submissionsRoute,
        submissionRoute,
        databaseHistoryRoute,
        databaseKoboRepeatRoute,
        formSettingsRoute,
        formActionsRoute.addChildren([formActionRoute, formActionLogsRoute, formActionReportsRoute]),
      ]),
    ]),
    settingsRoute.addChildren([settingsGroupsRoute, settingsCacheRoute, settingsUsersRoute]),
  ]),
]

const routeTree = rootRoute.addChildren(tsRoutes)
export const tsRouter = createRouter({
  routeTree,
  defaultOnCatch: (e: any, e2: any) => {
    throw e
  },
  defaultErrorComponent: (({error}: any) => {
    throw error // re-throws the error and bypasses router catch logic
  }) satisfies ErrorRouteComponent,
})
