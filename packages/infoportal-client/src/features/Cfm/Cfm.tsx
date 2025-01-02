import {NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Layout} from '@/shared/Layout'
import {useI18n} from '@/core/i18n'
import React, {useEffect, useMemo} from 'react'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {useSession} from '@/core/Session/SessionContext'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'
import {CfmTable} from '@/features/Cfm/Data/CfmTable'
import {CfmProvider, useCfmContext} from '@/features/Cfm/CfmContext'
import {CfmDataPriority, KoboFormName, KoboMealCfmStatus} from 'infoportal-common'
import {useAppSettings} from '@/core/context/ConfigContext'
import {CfmEntryRoute} from '@/features/Cfm/Data/CfmDetails'
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import {Box, LinearProgress} from '@mui/material'
import {CfmAccess} from '@/features/Cfm/Access/CfmAccess'
import {appConfig} from '@/conf/AppConfig'
import {getKoboFormRouteProps, SidebarKoboLink} from '@/features/SidebarKoboLink'
import {shelterIndex} from '@/features/Shelter/Shelter'
import {SidebarSection} from '@/shared/Layout/Sidebar/SidebarSection'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {CfmDashboard} from '@/features/Cfm/Dashboard/CfmDashboard'
import {useReactRouterDefaultRoute} from '@/core/useReactRouterDefaultRoute'
import {Kobo} from 'kobo-sdk'

const relatedKoboForms: KoboFormName[] = [
  'meal_cfmInternal',
  'meal_cfmExternal',
]

export const cfmIndex = {
  basePath: '/cfm',
  siteMap: {
    dashboard: '/dashboard',
    access: '/access',
    data: '/data',
    entry: (formId: Kobo.FormId = ':formId', answerId: string = ':answerId') => `/entry/${formId}/${answerId}`
  }
}

const CfmSidebar = () => {
  const path = (page: string) => '' + page
  const {conf} = useAppSettings()
  const {m} = useI18n()
  const ctx = useCfmContext()
  const _stats = useMemo(() => {
    let open = 0
    let coc = 0
    ctx.mappedData?.forEach(_ => {
      if (_.tags?.status === undefined || _.tags?.status === KoboMealCfmStatus.Open) {
        if (_.priority === CfmDataPriority.High) coc++
        open++
      }
    })
    return {
      open,
      coc,
      total: ctx.mappedData?.length
    }
  }, [ctx.mappedData])

  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(cfmIndex.siteMap.dashboard)}>
          {({isActive, isPending}) => (
            <SidebarItem icon={appConfig.icons.dashboard} active={isActive}>{m.dashboard}</SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(cfmIndex.siteMap.data)}>
          {({isActive, isPending}) => (
            <SidebarItem icon={appConfig.icons.dataTable} active={isActive}>{m.data}</SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(cfmIndex.siteMap.access)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="person_add" active={isActive}>{m.access}</SidebarItem>
          )}
        </NavLink>
        <SidebarHr/>
        <SidebarItem
          icon={appConfig.icons.matrix}
          onClick={() => void 0}
          href={conf.externalLink.mealReferralMatrix}
          target="_blank"
          iconEnd="open_in_new"
        >
          {m._cfm.referralMatrix}
        </SidebarItem>
        <SidebarSection title={m.koboForms}>
          {relatedKoboForms.map(_ =>
            <SidebarKoboLink key={_} path={path(shelterIndex.siteMap.form(_))} name={_}/>
          )}
        </SidebarSection>
      </SidebarBody>
      <SidebarHr/>
      <SidebarBody>
        <Box sx={{pl: 2}}>
          <ChartPieWidget
            dense
            showValue
            title={m._cfm.openTickets}
            value={_stats.open}
            base={_stats.total ?? 1}
          />
          {/*<Divider sx={{my: 1.5}}/>*/}
          <ChartPieWidget
            sx={{mt: 2}}
            dense
            showValue
            title={m._cfm.openTicketsHigh}
            value={_stats.coc}
            base={_stats.open ?? 1}
          />
        </Box>
      </SidebarBody>
    </Sidebar>
  )
}

export const Cfm = () => {
  const {session, accesses} = useSession()
  const access = useMemo(() => !!appFeaturesIndex.cfm.showIf?.(session, accesses), [accesses])
  const schemaContext = useKoboSchemaContext()

  useEffect(() => {
    schemaContext.fetchByName('meal_cfmExternal')
    schemaContext.fetchByName('meal_cfmInternal')
  }, [])
  useReactRouterDefaultRoute(cfmIndex.siteMap.data)

  if (!access) {
    return (
      <NoFeatureAccessPage/>
    )
  }
  return (
    <>
      {schemaContext.byName.meal_cfmExternal.get && schemaContext.byName.meal_cfmInternal.get ? (
        <CfmProvider
          schemaExternal={schemaContext.byName.meal_cfmExternal.get}
          schemaInternal={schemaContext.byName.meal_cfmInternal.get}
        >
          <Layout
            title={appFeaturesIndex.cfm.name}
            sidebar={<CfmSidebar/>}
            header={<AppHeader id="app-header"/>}
          >
            <Routes>
              <Route path={cfmIndex.siteMap.dashboard} element={<CfmDashboard/>}/>
              <Route path={cfmIndex.siteMap.data} element={<CfmTable/>}/>
              <Route path={cfmIndex.siteMap.entry()} element={<CfmEntryRoute/>}/>
              <Route path={cfmIndex.siteMap.access} element={<CfmAccess/>}/>
              {relatedKoboForms.map(_ =>
                <Route key={_} {...getKoboFormRouteProps({path: shelterIndex.siteMap.form(_), name: _})}/>
              )}
            </Routes>
          </Layout>
        </CfmProvider>
      ) : schemaContext.anyLoading && (
        <LinearProgress/>
      )}
    </>
  )
}

