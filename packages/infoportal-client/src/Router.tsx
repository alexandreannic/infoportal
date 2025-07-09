import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {objectToQueryString} from 'infoportal-common'
import {Database} from '@/features/Database/Database'
import {DatabaseList} from './features/Database/DatabaseList'
import {DatabaseAccess} from './features/Database/Access/DatabaseAccess'
import {DatabaseKoboAnswerViewPage} from '@/features/Database/Dialog/DialogAnswerView'
import {DatabaseKoboRepeatRoute} from './features/Database/RepeatGroup/DatabaseKoboRepeatGroup'
import {DatabaseHistory} from '@/features/Database/History/DatabaseHistory'
import {ImportKobo} from '@/features/ImportKoboForm/ImportKobo'
import {AdminUsers} from '@/features/Admin/AdminUsers'
import {AdminProxy} from '@/features/Admin/AdminProxy'
import {AdminGroups} from '@/features/Admin/AdminGroups'
import {AdminCache} from '@/features/Admin/AdminCache'
import React from 'react'
import {Workspaces} from '@/features/Workspace/Workspaces'
import {Layout} from './shared/Layout/Layout'
import {AppSidebar} from './core/layout/AppSidebar'
import {AppHeader} from './core/layout/AppHeader'
import {Settings} from './features/Settings/Settings'
import {FormCreator} from './features/FormCreator/FormCreator'
import {useWorkspaceRouterMaybe} from '@/core/query/useQueryWorkspace'
import {useQuerySchema} from '@/core/query/useQuerySchema'

export const appRouter = {
  root: '/',
  ws: (wsId = ':wsId') => {
    return {
      root: `/${wsId}`,
      importKoboForm: `/${wsId}/import-kobo`,
      settings: {
        root: `/${wsId}/settings`,
        users: `/${wsId}/settings/users`,
        proxy: `/${wsId}/settings/proxy`,
        group: `/${wsId}/settings/group`,
        cache: `/${wsId}/settings/cache`,
      },
      database: {
        root: `/${wsId}/database`,
        list: `/${wsId}/database/list`,
        custom: (id = ':id') => `/${wsId}/database/custom/${id}`,
        form: (formId = ':formId') => {
          return {
            root: `/${wsId}/database/${formId}`,
            answers: `/${wsId}/database/${formId}/data`,
            access: `/${wsId}/database/${formId}/access`,
            history: `/${wsId}/database/${formId}/history`,
            formCreator: `/${wsId}/database/${formId}/form-creator`,
            answer: (answerId = ':answerId') => `/${wsId}/database/${formId}/data/${answerId}`,
            group: (group = ':group', id?: string, index?: number) => {
              const qs = (id?: string, index?: number) => (id ? '?' + objectToQueryString({id, index}) : '')
              return `/${wsId}/database/${formId}/group/${group}${qs(id, index)}`
            },
          }
        },
      },
    }
  },
}

const path = (route: string, tokensToKeep = 1) => {
  const tokens = route.split('/').filter(Boolean) // remove empty parts
  const keptTokens = tokens.slice(-tokensToKeep)
  return keptTokens.join('/')
}

export const Router = () => {
  const {workspaceId} = useWorkspaceRouterMaybe()
  // const querySchema = useQuerySchema({formId, workspaceId})

  return (
    <Layout header={<AppHeader />} sidebar={workspaceId ? <AppSidebar /> : undefined}>
      <Routes>
        <Route path={appRouter.root} element={<Workspaces />} />
        <Route path={appRouter.ws().root}>
          <Route path={path(appRouter.ws().importKoboForm)} element={<ImportKobo />} />
          <Route path={path(appRouter.ws().settings.root)} element={<Settings />}>
            <Route path={path(appRouter.ws().settings.users)} element={<AdminUsers />} />
            <Route path={path(appRouter.ws().settings.proxy)} element={<AdminProxy />} />
            <Route path={path(appRouter.ws().settings.group)} element={<AdminGroups />} />
            <Route path={path(appRouter.ws().settings.cache)} element={<AdminCache />} />
            <Route index element={<Navigate to={path(appRouter.ws().settings.users)} />} />
          </Route>
          <Route path={path(appRouter.ws().database.root)}>
            <Route index path={path(appRouter.ws().database.list)} element={<DatabaseList />} />
            <Route path={path(appRouter.ws().database.form().root)} element={<Database />}>
              <Route path={path(appRouter.ws().database.form().answer())} element={<DatabaseKoboAnswerViewPage />} />
              <Route path={path(appRouter.ws().database.form().formCreator)} element={<FormCreator />} />
              <Route path={path(appRouter.ws().database.form().access)} element={<DatabaseAccess />} />
              <Route path={path(appRouter.ws().database.form().history)} element={<DatabaseHistory />} />
              <Route path={path(appRouter.ws().database.form().group(), 2)} element={<DatabaseKoboRepeatRoute />} />
              {/*    <Route index element={<Navigate to={path(appRouter.ws().database.form().answers)} />} />*/}
              {/*Persisted components across routes. */}
              <Route path={path(appRouter.ws().database.form().answers)} element={<></>} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Layout>
  )
}
