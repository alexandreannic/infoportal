import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {objectToQueryString} from 'infoportal-common'
import {Database} from '@/features/Database/Database'
import {DatabaseList} from './features/Database/DatabaseList'
import {DatabaseTableCustomRoute} from '@/features/Database/KoboTableCustom/DatabaseKoboTableCustom'
import {DatabaseAccessRoute} from './features/Database/Access/DatabaseAccess'
import {DatabaseKoboAnswerViewPage} from '@/features/Database/Dialog/DialogAnswerView'
import {DatabaseKoboRepeatRoute} from './features/Database/RepeatGroup/DatabaseKoboRepeatGroup'
import {DatabaseHistory} from '@/features/Database/History/DatabaseHistory'
import {ImportKobo} from '@/features/ImportKoboForm/ImportKobo'
import {DatabaseProvider} from '@/features/Database/DatabaseContext'
import {AdminUsers} from '@/features/Admin/AdminUsers'
import {AdminProxy} from '@/features/Admin/AdminProxy'
import {AdminGroups} from '@/features/Admin/AdminGroups'
import {AdminCache} from '@/features/Admin/AdminCache'
import React from 'react'
import {Workspaces} from '@/features/Workspace/Workspaces'
import {Provide} from './shared'
import {KoboSchemaProvider} from './core/store/useLangIndex'
import {KoboAnswersProvider} from './core/context/KoboAnswersContext'
import {KoboUpdateProvider} from './core/context/KoboUpdateContext'
import {Layout} from './shared/Layout'
import {AppSidebar} from './core/layout/AppSidebar'
import {AppHeader} from './core/layout/AppHeader'
import {Settings} from './features/Settings/Settings'
import {FormCreator} from './features/FormCreator/FormCreator'

export const router = {
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
  return (
    <Routes>
      <Route path={router.root} element={<Workspaces />} />
      <Route
        path={router.ws().root}
        element={
          <Provide
            providers={[
              _ => <KoboSchemaProvider children={_} />,
              _ => <KoboAnswersProvider children={_} />,
              _ => <KoboUpdateProvider children={_} />,
              _ => <DatabaseProvider children={_} />,
            ]}
          >
            <Layout header={<AppHeader />} sidebar={<AppSidebar />}>
              <Outlet />
            </Layout>
          </Provide>
        }
      >
        <Route path={path(router.ws().importKoboForm)} element={<ImportKobo />} />
        <Route path={path(router.ws().settings.root)} element={<Settings />}>
          <Route path={path(router.ws().settings.users)} element={<AdminUsers />} />
          <Route path={path(router.ws().settings.proxy)} element={<AdminProxy />} />
          <Route path={path(router.ws().settings.group)} element={<AdminGroups />} />
          <Route path={path(router.ws().settings.cache)} element={<AdminCache />} />
          <Route index element={<Navigate to={path(router.ws().settings.users)} />} />
        </Route>
        <Route path={path(router.ws().database.root)}>
          <Route index path={path(router.ws().database.list)} element={<DatabaseList />} />
          <Route path={path(router.ws().database.custom())} element={<DatabaseTableCustomRoute />} />
          <Route path={path(router.ws().database.form().root)} element={<Database />}>
            <Route path={path(router.ws().database.form().answer())} element={<DatabaseKoboAnswerViewPage />} />
            <Route path={path(router.ws().database.form().formCreator)} element={<FormCreator />} />
            <Route path={path(router.ws().database.form().access)} element={<DatabaseAccessRoute />} />
            <Route path={path(router.ws().database.form().history)} element={<DatabaseHistory />} />
            <Route path={path(router.ws().database.form().group(), 2)} element={<DatabaseKoboRepeatRoute />} />
            <Route index element={<Navigate to={path(router.ws().database.form().answers)} />} />
            {/*Persisted components across routes. */}
            <Route path={path(router.ws().database.form().answers)} element={<></>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
