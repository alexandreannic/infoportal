import React from 'react'
import {createRootRoute, createRoute, createRouter, Outlet} from '@tanstack/react-router'
import {Workspaces} from '@/features/Workspace/Workspaces'
import {NewForm} from '@/features/NewForm/NewForm'
import {Settings} from './features/Settings/Settings'
import {AdminUsers} from '@/features/Admin/AdminUsers'
import {AdminProxy} from '@/features/Admin/AdminProxy'
import {AdminGroups} from '@/features/Admin/AdminGroups'
import {AdminCache} from '@/features/Admin/AdminCache'
import {Forms} from '@/features/Form/Forms'
import {Form} from '@/features/Form/Form'
import {DatabaseKoboAnswerViewPage} from '@/features/Form/dialogs/DialogAnswerView'
import {FormBuilder} from '@/features/Form/Builder/FormBuilder'
import {DatabaseAccess} from '@/features/Form/Access/DatabaseAccess'
import {DatabaseHistory} from '@/features/Form/History/DatabaseHistory'
import {DatabaseTableRoute} from '@/features/Form/Database/DatabaseTable'
import {FormSettings} from './features/Form/Settings/FormSettings'
import {DatabaseKoboRepeatRoute} from '@/features/Form/RepeatGroup/DatabaseKoboRepeatGroup'
import {z} from 'zod'
import {Workspace} from '@/features/Workspace/Workspace'
import {App} from '@/App'

const Collect = () => {
  const {formId} = appRoutes.collect.useParams()
  return <>Collect {formId}</>
}

const Dashboard = () => {
  return <div>Dash</div>
}

export const appRoutes = (() => {
  const rootRoute = createRootRoute({
    component: App,
  })
  return {
    root: rootRoute,
    collect: createRoute({
      getParentRoute: () => rootRoute,
      path: 'collect/$formId',
      staticData: true,
      component: Collect,
    }),
    workspaces: createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: Workspaces,
    }),
    workspace: (() => {
      const workspace = createRoute({
        getParentRoute: () => rootRoute,
        path: '$workspaceId',
        component: Workspace,
      })
      return {
        root: workspace,
        dashboard: createRoute({
          getParentRoute: () => workspace,
          path: '/',
          component: Dashboard,
        }),
        importKoboForm: createRoute({
          getParentRoute: () => workspace,
          path: 'new-form',
          component: NewForm,
        }),
        forms: (() => {
          const forms = createRoute({
            getParentRoute: () => workspace,
            path: 'form',
            component: Outlet,
          })
          return {
            root: forms,
            list: createRoute({
              getParentRoute: () => forms,
              path: 'list',
              component: Forms,
            }),
            byId: (() => {
              const form = createRoute({
                getParentRoute: () => forms,
                path: '$formId',
                component: Form,
              })
              return {
                root: form,
                answer: createRoute({
                  getParentRoute: () => form,
                  path: 'answer/$answerId',
                  component: DatabaseKoboAnswerViewPage,
                }),
                formCreator: createRoute({
                  getParentRoute: () => form,
                  path: 'formCreator',
                  component: FormBuilder,
                }),
                access: createRoute({
                  getParentRoute: () => form,
                  path: 'access',
                  component: DatabaseAccess,
                }),
                history: createRoute({
                  getParentRoute: () => form,
                  path: 'history',
                  component: DatabaseHistory,
                }),
                group: createRoute({
                  getParentRoute: () => form,
                  path: 'group/$group',
                  component: DatabaseKoboRepeatRoute,
                  validateSearch: z.object({
                    id: z.string().optional(),
                    index: z.number().optional(),
                  }),
                }),
                settings: createRoute({
                  getParentRoute: () => form,
                  path: 'settings',
                  component: FormSettings,
                }),
                answers: createRoute({
                  getParentRoute: () => form,
                  path: 'answers',
                  component: DatabaseTableRoute,
                }),
              }
            })(),
          }
        })(),
        settings: (() => {
          const settings = createRoute({
            getParentRoute: () => workspace,
            path: 'settings',
            component: Settings,
          })
          return {
            root: settings,
            users: createRoute({
              getParentRoute: () => settings,
              path: 'users',
              component: AdminUsers,
            }),
            proxy: createRoute({
              getParentRoute: () => settings,
              path: 'proxy',
              component: AdminProxy,
            }),
            group: createRoute({
              getParentRoute: () => settings,
              path: 'group',
              component: AdminGroups,
            }),
            cache: createRoute({
              getParentRoute: () => settings,
              path: 'cache',
              component: AdminCache,
            }),
          }
        })(),
      }
    })(),
  }
})()

const tsRoutes = [
  appRoutes.collect,
  appRoutes.workspaces,
  appRoutes.workspace.root.addChildren([
    appRoutes.workspace.dashboard,
    appRoutes.workspace.importKoboForm,
    appRoutes.workspace.forms.root.addChildren([
      appRoutes.workspace.forms.list,
      appRoutes.workspace.forms.byId.root.addChildren([
        appRoutes.workspace.forms.byId.answer,
        appRoutes.workspace.forms.byId.formCreator,
        appRoutes.workspace.forms.byId.access,
        appRoutes.workspace.forms.byId.history,
        appRoutes.workspace.forms.byId.group,
        appRoutes.workspace.forms.byId.settings,
        appRoutes.workspace.forms.byId.answers,
      ]),
    ]),
    appRoutes.workspace.settings.root.addChildren([
      appRoutes.workspace.settings.group,
      appRoutes.workspace.settings.users,
      appRoutes.workspace.settings.proxy,
      appRoutes.workspace.settings.cache,
    ]),
  ]),
]

const routeTree = appRoutes.root.addChildren(tsRoutes)
export const tsRouter = createRouter({routeTree})
