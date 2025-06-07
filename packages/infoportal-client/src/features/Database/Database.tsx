import {useAppSettings} from '@/core/context/ConfigContext'
import React, {useEffect, useMemo} from 'react'
import {Sidebar, SidebarItem} from '@/shared/Layout/Sidebar'
import {useI18n} from '@/core/i18n'
import * as yup from 'yup'
import {databaseIndex} from '@/features/Database/databaseIndex'
import {Navigate, NavLink, Outlet, Route, Routes} from 'react-router-dom'
import {AppHeader} from '@/core/layout/AppHeader'
import {Layout} from '@/shared/Layout'
import {Icon, Skeleton, Tab, Tabs, Tooltip, useTheme} from '@mui/material'
import {useLocation, useParams} from 'react-router'
import {DatabaseProvider, useDatabaseContext} from '@/features/Database/DatabaseContext'
import {DatabaseAccessRoute} from '@/features/Database/Access/DatabaseAccess'
import {DatabaseTableRoute} from '@/features/Database/KoboTable/DatabaseKoboTable'
import {Txt} from '@/shared'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Obj, Seq, seq} from '@axanc/ts-utils'
import {SidebarSection} from '@/shared/Layout/Sidebar/SidebarSection'
import {DatabaseList} from '@/features/Database/DatabaseList'
import {DatabaseKoboAnswerViewPage} from '@/features/Database/Dialog/DialogAnswerView'
import {DatabaseHistory} from '@/features/Database/History/DatabaseHistory'
import {customForms, DatabaseTableCustomRoute} from '@/features/Database/KoboTableCustom/DatabaseKoboTableCustom'
import {useAsync} from '@/shared/hook/useAsync'
import {Fender} from '@/shared/Fender'
import {useReactRouterDefaultRoute} from '@/core/useReactRouterDefaultRoute'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {appConfig} from '@/conf/AppConfig'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {DatabaseKoboRepeatRoute} from '@/features/Database/RepeatGroup/DatabaseKoboRepeatGroup'
import {KoboFormSdk, KoboParsedFormName} from '@/core/sdk/server/kobo/KoboFormSdk'
import {ImportKobo} from '@/features/Database/ImportKoboForm/ImportKobo'

export const databaseUrlParamsValidation = yup.object({
  formId: yup.string().required(),
})

export const Database = () => {
  const {m} = useI18n()
  const t = useTheme()
  const {conf, api} = useAppSettings()
  const ctx = useDatabaseContext()

  return 2
}

export const DatabaseHome = () => {
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {m} = useI18n()
  const {setTitle} = useLayoutContext()
  const ctx = useDatabaseContext()
  const ctxSchema = useKoboSchemaContext()
  const fetcherAnswers = useKoboAnswersContext().byId(formId)
  const {pathname} = useLocation()

  useEffect(() => {
    if (ctx.getForm(formId)?.name) setTitle(m._koboDatabase.title(ctx.getForm(formId)?.name))
    ctxSchema.fetchById(formId)
    fetcherAnswers.fetch({force: false})
    return () => setTitle(m._koboDatabase.title())
  }, [ctx._forms.get, formId])

  const schema = ctxSchema.byId[formId]?.get
  const repeatGroups = useMemo(() => {
    return schema?.helper.group.search().map(_ => _.name)
  }, [schema])

  return (
    <>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={pathname}
        sx={{
          borderBottom: t => `1px solid ${t.palette.divider}`,
        }}
      >
        <Tab
          icon={<Icon>{appConfig.icons.dataTable}</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={databaseIndex.siteMap.database.absolute(formId)}
          to={databaseIndex.siteMap.database.absolute(formId)}
          label={m.data}
        />
        <Tab
          icon={<Icon>lock</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={databaseIndex.siteMap.access.absolute(formId)}
          to={databaseIndex.siteMap.access.absolute(formId)}
          label={m.access}
        />
        <Tab
          icon={<Icon>history</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={databaseIndex.siteMap.history.absolute(formId)}
          to={databaseIndex.siteMap.history.absolute(formId)}
          label={m.history}
        />
        {schema &&
          repeatGroups?.map(_ => (
            <Tab
              icon={<Icon color="disabled">repeat</Icon>}
              iconPosition="start"
              key={_}
              sx={{minHeight: 34, py: 1}}
              component={NavLink}
              value={databaseIndex.siteMap.group.absolute(formId, _)}
              to={databaseIndex.siteMap.group.absolute(formId, _)}
              label={schema.translate.question(_)}
            />
          ))}
      </Tabs>
      <div style={{display: pathname === databaseIndex.siteMap.database.absolute(formId) ? 'block' : 'none'}}>
        <DatabaseTableRoute />
      </div>
      <Outlet />
    </>
  )
}
