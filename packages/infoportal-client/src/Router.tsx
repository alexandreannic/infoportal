import {Navigate, Route, Routes} from 'react-router-dom'
import {objectToQueryString} from 'infoportal-common'
import {Form} from '@/features/Form/Form'
import {Forms} from '@/features/Form/Forms'
import {DatabaseAccess} from '@/features/Form/Access/DatabaseAccess'
import {DatabaseKoboAnswerViewPage} from '@/features/Form/dialogs/DialogAnswerView'
import {DatabaseKoboRepeatRoute} from '@/features/Form/RepeatGroup/DatabaseKoboRepeatGroup'
import {DatabaseHistory} from '@/features/Form/History/DatabaseHistory'
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
import {FormBuilder} from '@/features/Form/Builder/FormBuilder'
import {useWorkspaceRouterMaybe} from '@/core/query/useQueryWorkspace'
import {DatabaseSettings} from '@/features/Form/Settings/DatabaseSettings'
import {DatabaseTableRoute} from '@/features/Form/Database/DatabaseTable'

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
      form: {
        root: `/${wsId}/form`,
        list: `/${wsId}/form/list`,
        custom: (id = ':id') => `/${wsId}/form/custom/${id}`,
        byId: (formId = ':formId') => {
          return {
            root: `/${wsId}/form/${formId}`,
            answers: `/${wsId}/form/${formId}/data`,
            access: `/${wsId}/form/${formId}/access`,
            settings: `/${wsId}/form/${formId}/settings`,
            history: `/${wsId}/form/${formId}/history`,
            formCreator: `/${wsId}/form/${formId}/form-creator`,
            answer: (answerId = ':answerId') => `/${wsId}/form/${formId}/data/${answerId}`,
            group: (group = ':group', id?: string, index?: number) => {
              const qs = (id?: string, index?: number) => (id ? '?' + objectToQueryString({id, index}) : '')
              return `/${wsId}/form/${formId}/group/${group}${qs(id, index)}`
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
          <Route path={path(appRouter.ws().form.root)}>
            <Route index path={path(appRouter.ws().form.list)} element={<Forms />} />
            <Route path={path(appRouter.ws().form.byId().root)} element={<Form />}>
              <Route path={path(appRouter.ws().form.byId().answer())} element={<DatabaseKoboAnswerViewPage />} />
              <Route path={path(appRouter.ws().form.byId().formCreator)} element={<FormBuilder />} />
              <Route path={path(appRouter.ws().form.byId().access)} element={<DatabaseAccess />} />
              <Route path={path(appRouter.ws().form.byId().history)} element={<DatabaseHistory />} />
              <Route path={path(appRouter.ws().form.byId().group(), 2)} element={<DatabaseKoboRepeatRoute />} />
              <Route path={path(appRouter.ws().form.byId().settings)} element={<DatabaseSettings />} />
              <Route path={path(appRouter.ws().form.byId().answers)} element={<DatabaseTableRoute />} />
              {/*<Route index element={<Navigate to={path(appRouter.ws().database.form().answers)} />} />*/}
              {/*Persisted components across routes. */}
              {/*<Route path={path(appRouter.ws().database.form().answers)} element={<></>} />*/}
            </Route>
          </Route>
        </Route>
      </Routes>
    </Layout>
  )
}
