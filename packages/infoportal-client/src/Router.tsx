import {Navigate, Route, Routes, useParams} from 'react-router-dom'
import {objectToQueryString} from 'infoportal-common'
import {Database} from '@/features/Database/Database'
import {DatabaseList} from './features/Database/DatabaseList'
import {DatabaseTableCustomRoute} from '@/features/Database/KoboTableCustom/DatabaseKoboTableCustom'
import {DatabaseAccessRoute} from './features/Database/Access/DatabaseAccess'
import {DatabaseKoboAnswerViewPage} from '@/features/Database/Dialog/DialogAnswerView'
import {DatabaseKoboRepeatRoute} from './features/Database/RepeatGroup/DatabaseKoboRepeatGroup'
import {DatabaseHistory} from '@/features/Database/History/DatabaseHistory'
import {ImportKobo} from '@/features/ImportKoboForm/ImportKobo'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {AdminUsers} from '@/features/Admin/AdminUsers'
import {AdminProxy} from '@/features/Admin/AdminProxy'
import {AdminGroups} from '@/features/Admin/AdminGroups'
import {AdminCache} from '@/features/Admin/AdminCache'
import React from 'react'
import {Home} from '@/features/Home/Home'

export const router = {
  root: '/',
  ws: (wsId = ':wsId') => {
    const base = `/${wsId}`
    const settings = {
      root: `${base}/settings`,
      users: `${base}/settings/users`,
      proxy: `${base}/settings/proxy`,
      group: `${base}/settings/group`,
      cache: `${base}/settings/cache`,
    }
    const database = {
      root: `${base}/database`,
      list: `${base}/database/list`,
      custom: (id = ':id') => `${base}/database/custom/${id}`,
      form: (formId = ':formId') => {
        const formBase = `${base}/database/${formId}`
        return {
          root: formBase,
          answers: `${formBase}/data`,
          access: `${formBase}/access`,
          history: `${formBase}/history`,
          answer: (answerId = ':answerId') => `${formBase}/data/${answerId}`,
          group: (group = ':group', id?: string, index?: number) => {
            const qs = (id?: string, index?: number) => (id ? '?' + objectToQueryString({id, index}) : '')
            return `${formBase}/group/${group}${qs(id, index)}`
          },
        }
      },
    }
    return {
      root: base,
      importKoboForm: `${base}/import-kobo`,
      settings,
      database,
    }
  },
}

const path = (absolute: string, base?: string) => (base ? absolute.replace(base + '/', '') : absolute)
const pathDatabase = (absolute: string) => path(absolute, router.ws().database.root)
const pathForm = (absolute: string) => path(absolute, router.ws().database.form().root)

export const Router = () => {
  const ctx = useDatabaseContext()
  return (
    <Routes>
      <Route path={router.root} element={<Home />} />
      <Route path={router.ws().importKoboForm} element={<ImportKobo />} />
      <Route path={router.ws().settings.root}>
        <Route path={router.ws().settings.users} element={<AdminUsers />} />
        <Route path={router.ws().settings.proxy} element={<AdminProxy />} />
        <Route path={router.ws().settings.group} element={<AdminGroups />} />
        <Route path={router.ws().settings.cache} element={<AdminCache />} />
      </Route>
      <Route path={router.ws().database.root}>
        <Route path={pathDatabase(router.ws().database.list)} element={<DatabaseList forms={ctx.formsAccessible} />} />
        <Route path={pathDatabase(router.ws().database.custom())} element={<DatabaseTableCustomRoute />} />
        <Route path={pathDatabase(router.ws().database.form().root)} element={<Database />}>
          <Route path={pathForm(router.ws().database.form().answer())} element={<DatabaseKoboAnswerViewPage />} />
          <Route path={pathForm(router.ws().database.form().access)} element={<DatabaseAccessRoute />} />
          <Route path={pathForm(router.ws().database.form().history)} element={<DatabaseHistory />} />
          <Route path={pathForm(router.ws().database.form().group())} element={<DatabaseKoboRepeatRoute />} />
          <Route index element={<Navigate to={pathForm(router.ws().database.form().answers)} />} />
          {/*Persisted components across routes. */}
          <Route path={pathForm(router.ws().database.form().answers)} element={<></>} />
        </Route>
      </Route>
    </Routes>
  )
}
