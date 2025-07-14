import React from 'react'
import {createRootRoute, createRoute, Link, Outlet, Router} from '@tanstack/react-router'
import {Workspaces} from '@/features/Workspace/Workspaces'
import {NewForm} from '@/features/NewForm/NewForm'
import {App} from './App'
import {Settings} from './features/Settings/Settings'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof tsRouter
  }
}

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
            path: '$wsId',
            component: () => <Outlet />,
          })
          return {
            root: workspace,
            dashboard: createRoute({
              getParentRoute: () => workspace,
              path: '/',
              component: () => <div>Dashboard</div>,
            }),
            importKoboForm: createRoute({
              getParentRoute: () => workspace,
              path: 'import',
              component: () => <NewForm />,
            }),

            settings: createRoute({
              getParentRoute: () => workspace,
              path: 'settings',
              component: () => <Settings />,
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
//   path: '$wsId',
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
      appRoutes.app.workspace.settings,
    ]),
  ]),
]

const routeTree = appRoutes.root.addChildren(tsRoutes)
export const tsRouter = new Router({routeTree})
