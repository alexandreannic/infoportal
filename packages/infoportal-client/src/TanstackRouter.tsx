import React from 'react'
import {createRootRoute, createRoute, Link, Outlet, Router} from '@tanstack/react-router'
import {Workspaces} from '@/features/Workspace/Workspaces'
import {NewForm} from '@/features/NewForm/NewForm'
import {App} from './App'
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

const Collect = () => {
  const {formId} = appRoutes.collect.useParams()
  return <>Collect {formId}</>
}

export const appRoutes = (() => {
  const rootRoute = createRootRoute({
    component: () => <Outlet />,
  })
  return {
    root: rootRoute,
    home: createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => (
        <div>
          Test
          <Link to="/app">App</Link>
        </div>
      ),
    }),
    contact: createRoute({
      getParentRoute: () => rootRoute,
      path: 'contact',
      component: () => <div>Contact</div>,
    }),
    collect: createRoute({
      getParentRoute: () => rootRoute,
      path: 'collect/$formId',
      component: Collect,
    }),
    app: (() => {
      const app = createRoute({
        getParentRoute: () => rootRoute,
        path: 'app',
        component: App,
      })
      return {
        root: app,
        workspaces: createRoute({
          getParentRoute: () => app,
          path: '/',
          component: Workspaces,
        }),
        workspace: (() => {
          const workspace = createRoute({
            getParentRoute: () => app,
            path: '$workspaceId',
            component: () => <Outlet />,
          })
          return {
            root: workspace,
            forms: (() => {
              const forms = createRoute({
                getParentRoute: () => workspace,
                path: 'form',
                component: () => <Outlet />,
              })
              return {
                root: forms,
                list: createRoute({
                  getParentRoute: () => forms,
                  path: 'list',
                  component: () => <Forms />,
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
                      path: 'answer',
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
                      path: 'group',
                      component: DatabaseKoboRepeatRoute,
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
            dashboard: createRoute({
              getParentRoute: () => workspace,
              path: '/',
              component: () => <div>Dashboard</div>,
            }),
            importKoboForm: createRoute({
              getParentRoute: () => workspace,
              path: 'import',
              component: NewForm,
            }),
          }
        })(),
      }
    })(),
  }
})()

// const home = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/',
//   component: () => (
//     <div>
//       Test
//       <Link to="/app">App</Link>
//     </div>
//   ),
// })
//
// const contact = createRoute({
//   getParentRoute: () => rootRoute,
//   path: 'contact',
//   component: () => <div>Contact</div>,
// })
//
// const collect = createRoute({
//   getParentRoute: () => rootRoute,
//   path: 'collect/$formId',
//   component: Collect,
// })

// const app = createRoute({
//   getParentRoute: () => rootRoute,
//   path: 'app',
//   component: App,
// })

// const workspaces = createRoute({
//   getParentRoute: () => app,
//   path: '/',
//   component: Workspaces,
// })
//
// export const workspace = createRoute({
//   getParentRoute: () => app,
//   path: '$workspaceId',
//   component: () => <Outlet />,
// })

// const dashboard = createRoute({
//   getParentRoute: () => workspace,
//   path: '/',
//   component: () => <div>Dashboard</div>,
// })
//
// const importKoboForm = createRoute({
//   getParentRoute: () => workspace,
//   path: 'import',
//   component: () => <NewForm />,
// })
//
// const settings = createRoute({
//   getParentRoute: () => workspace,
//   path: 'settings',
//   component: () => <Settings />,
// })

const tsRoutes = [
  appRoutes.home,
  appRoutes.contact,
  appRoutes.collect,
  appRoutes.app.root.addChildren([
    appRoutes.app.workspaces,
    appRoutes.app.workspace.root.addChildren([
      appRoutes.app.workspace.dashboard,
      appRoutes.app.workspace.importKoboForm,
      appRoutes.app.workspace.forms.root.addChildren([
        appRoutes.app.workspace.forms.root.addChildren([
          appRoutes.app.workspace.forms.list,
          appRoutes.app.workspace.forms.byId.root.addChildren([
            appRoutes.app.workspace.forms.byId.answer,
            appRoutes.app.workspace.forms.byId.formCreator,
            appRoutes.app.workspace.forms.byId.access,
            appRoutes.app.workspace.forms.byId.history,
            appRoutes.app.workspace.forms.byId.group,
            appRoutes.app.workspace.forms.byId.settings,
            appRoutes.app.workspace.forms.byId.answers,
          ]),
        ]),
      ]),
      appRoutes.app.workspace.settings.root.addChildren([
        appRoutes.app.workspace.settings.group,
        appRoutes.app.workspace.settings.users,
        appRoutes.app.workspace.settings.proxy,
        appRoutes.app.workspace.settings.cache,
      ]),
    ]),
  ]),
]

const routeTree = appRoutes.root.addChildren(tsRoutes)
export const tsRouter = new Router({routeTree})
