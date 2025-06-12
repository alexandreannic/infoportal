import {Navigate, Outlet, Route, Routes, useParams} from 'react-router-dom'
import {objectToQueryString} from 'infoportal-common'
import {Database} from '@/features/Database/Database'
import {DatabaseList} from './features/Database/DatabaseList'
import {DatabaseTableCustomRoute} from '@/features/Database/KoboTableCustom/DatabaseKoboTableCustom'
import {DatabaseAccessRoute} from './features/Database/Access/DatabaseAccess'
import {DatabaseKoboAnswerViewPage} from '@/features/Database/Dialog/DialogAnswerView'
import {DatabaseKoboRepeatRoute} from './features/Database/RepeatGroup/DatabaseKoboRepeatGroup'
import {DatabaseHistory} from '@/features/Database/History/DatabaseHistory'
import {ImportKobo} from '@/features/ImportKoboForm/ImportKobo'
import {DatabaseProvider, useDatabaseContext} from '@/features/Database/DatabaseContext'
import {AdminUsers} from '@/features/Admin/AdminUsers'
import {AdminProxy} from '@/features/Admin/AdminProxy'
import {AdminGroups} from '@/features/Admin/AdminGroups'
import {AdminCache} from '@/features/Admin/AdminCache'
import React from 'react'
import {Workspaces} from '@/features/Workspace/Workspaces'
import {Provide} from './shared'
import {WorkspaceProvider} from './core/context/WorkspaceContext'
import {KoboSchemaProvider} from './features/KoboSchema/KoboSchemaContext'
import {KoboAnswersProvider} from './core/context/KoboAnswersContext'
import {KoboUpdateProvider} from './core/context/KoboUpdateContext'
import {Layout} from './shared/Layout'
import {AppSidebar} from './core/layout/AppSidebar'
import {AppHeader} from './core/layout/AppHeader'

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

const extractPath = (route: string) => route.slice(route.lastIndexOf('/') + 1)

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
        <Route path={extractPath(router.ws().importKoboForm)} element={<ImportKobo />} />
        <Route path={extractPath(router.ws().settings.root)}>
          <Route path={extractPath(router.ws().settings.users)} element={<AdminUsers />} />
          <Route path={extractPath(router.ws().settings.proxy)} element={<AdminProxy />} />
          <Route path={extractPath(router.ws().settings.group)} element={<AdminGroups />} />
          <Route path={extractPath(router.ws().settings.cache)} element={<AdminCache />} />
        </Route>
        <Route path={extractPath(router.ws().database.root)}>
          <Route index path={extractPath(router.ws().database.list)} element={<DatabaseList />} />
          <Route path={extractPath(router.ws().database.custom())} element={<DatabaseTableCustomRoute />} />
          <Route path={extractPath(router.ws().database.form().root)} element={<Database />}>
            <Route path={extractPath(router.ws().database.form().answer())} element={<DatabaseKoboAnswerViewPage />} />
            <Route path={extractPath(router.ws().database.form().access)} element={<DatabaseAccessRoute />} />
            <Route path={extractPath(router.ws().database.form().history)} element={<DatabaseHistory />} />
            <Route path={extractPath(router.ws().database.form().group())} element={<DatabaseKoboRepeatRoute />} />
            <Route index element={<Navigate to={extractPath(router.ws().database.form().answers)} />} />
            {/*Persisted components across routes. */}
            <Route path={extractPath(router.ws().database.form().answers)} element={<></>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
