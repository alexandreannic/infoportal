import {Route, Routes} from 'react-router-dom'
import {objectToQueryString} from 'infoportal-common'
import {DatabaseHome} from '@/features/Database/Database'
import {DatabaseList} from './features/Database/DatabaseList'
import {DatabaseTableCustomRoute} from '@/features/Database/KoboTableCustom/DatabaseKoboTableCustom'
import {DatabaseAccessRoute} from './features/Database/Access/DatabaseAccess'
import {DatabaseKoboAnswerViewPage} from '@/features/Database/Dialog/DialogAnswerView'
import {DatabaseKoboRepeatRoute} from './features/Database/RepeatGroup/DatabaseKoboRepeatGroup'
import {DatabaseHistory} from '@/features/Database/History/DatabaseHistory'
import {ImportKobo} from './features/Database/ImportKoboForm/ImportKobo'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'

export const router = {
  root: '/',
  importKoboForm: '/import-kobo',
  settings: {
    root: '/settings',
    users: '/settings/users',
    proxy: '/settings/proxy',
    group: '/settings/group',
    cache: '/settings/cache',
  },
  database: {
    root: '/database',
    list: `/database/list`,
    custom: (id = ':id') => `/database/custom/${id}`,
    form: {
      root: (formId = ':formId') => `/database/${formId}`,
      answers: (formId = ':formId') => `/database/${formId}/data`,
      access: (formId = ':formId') => `/database/${formId}/access`,
      history: (formId = ':formId') => `/database/${formId}/history`,
      answer: (formId = ':formId', answerId = ':answerId') => `/database/${formId}/data/${answerId}`,
      group: (formId = ':formId', group = ':group', id?: string, index?: number) => {
        const qs = (id?: string, index?: number) => (id ? '?' + objectToQueryString({id, index}) : '')
        return `/database/${formId}/group/${group}${qs(id, index)}`
      },
    },
  },
}

export const Router = () => {
  const path = (absolute: string, base?: string) => (base ? absolute.replace(base + '/', '') : absolute)
  const pathDatabase = (absolute: string) => path(absolute, router.database.root)
  const pathForm = (absolute: string) => path(absolute, router.database.form.root())
  const ctx = useDatabaseContext()
  return (
    <Routes>
      <Route path={router.root} element={<div>Dashboard</div>} />
      <Route path={router.importKoboForm} element={<ImportKobo />} />
      <Route path={router.database.root} element={<DatabaseHome />}>
        {/*<Route index element={<Navigate to={router.database.relative} />} />*/}
        <Route path={pathDatabase(router.database.list)} element={<DatabaseList forms={ctx.formsAccessible} />} />
        <Route path={pathDatabase(router.database.custom())} element={<DatabaseTableCustomRoute />} />
        <Route>
          <Route path={pathForm(router.database.form.answer())} element={<DatabaseKoboAnswerViewPage />} />
          <Route path={pathForm(router.database.form.access())} element={<DatabaseAccessRoute />} />
          <Route path={pathForm(router.database.form.history())} element={<DatabaseHistory />} />
          <Route path={pathForm(router.database.form.group())} element={<DatabaseKoboRepeatRoute />} />
          {/*Persisted components across routes: */}
          {/*<Route path={router.database.relative} element={<></>} />*/}
        </Route>
      </Route>
    </Routes>
  )
}
