import {createRootRoute, createRouter} from '@tanstack/react-router'
import {settingsRoute} from './features/Settings/Settings'
import {adminUsersRoute} from '@/features/Admin/AdminUsers'
import {adminProxyRoute} from '@/features/Admin/AdminProxy'
import {adminCacheRoute} from '@/features/Admin/AdminCache'
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
import {dashboardRoute} from '@/features/Dashboard/Dashboard'
import {answersRoute} from '@/features/Form/Database/DatabaseTable'
import {workspacesRoute} from '@/features/Workspace/Workspaces'
import {newFormRoute} from '@/features/NewForm/NewForm'
import {databaseAnswerViewRoute} from '@/features/Form/dialogs/DialogAnswerView'
import {adminGroupsRoute} from '@/features/Admin/AdminGroups'

export const rootRoute = createRootRoute({
  component: App,
})

const tsRoutes = [
  collectRoute,
  workspacesRoute,
  workspaceRoute.addChildren([
    dashboardRoute,
    newFormRoute,
    formRootRoute.addChildren([
      formsRoute,
      formRoute.addChildren([
        databaseAccessRoute,
        formBuilderRoute,
        answersRoute,
        databaseAnswerViewRoute,
        databaseHistoryRoute,
        databaseKoboRepeatRoute,
        formSettingsRoute,
      ]),
    ]),
    settingsRoute.addChildren([adminGroupsRoute, adminCacheRoute, adminProxyRoute, adminUsersRoute]),
  ]),
]

const routeTree = rootRoute.addChildren(tsRoutes)
export const tsRouter = createRouter({routeTree})
