import {Navigate, NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarItem} from '@/shared/Layout/Sidebar'
import {Layout} from '@/shared/Layout'
import {useI18n} from '@/core/i18n'
import React, {useMemo} from 'react'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {useSession} from '@/core/Session/SessionContext'
import {AppFeatureId, appFeaturesIndex} from '@/features/appFeatureId'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'
import {SidebarSection} from '@/shared/Layout/Sidebar/SidebarSection'
import {KoboFormName, KoboIndex} from 'infoportal-common'
import {MealVerificationList} from '@/features/Meal/Verification/MealVerificationList'
import {MealVerificationForm} from '@/features/Meal/Verification/Form/MealVerificationForm'
import {getKoboFormRouteProps, SidebarKoboLink} from '@/features/SidebarKoboLink'
import {MealVisit} from '@/features/Meal/Visit/MealVisit'
import {MealVisitDashboard} from '@/features/Meal/Visit/MealVisitDashboard'
import {MealVisitDetails} from '@/features/Meal/Visit/MealVisitDetails'
import {MealVerification} from '@/features/Meal/Verification/MealVerification'
import {Access} from '@/core/sdk/server/access/Access'
import {appConfig} from '@/conf/AppConfig'
import {MealPdm} from '@/features/Meal/Pdm/MealPdm'
import {useReactRouterDefaultRoute} from '@/core/useReactRouterDefaultRoute'
import {MealVerificationData} from '@/features/Meal/Verification/MealVerificationData'
import {MealPdmCashDashboard} from '@/features/Meal/Pdm/MealPdmCashDashboard'
import {MealPdmShelterDashboard} from '@/features/Meal/Pdm/MealPdmShelterDashboard'

const relatedKoboForms: KoboFormName[] = [
  'meal_verificationWinterization',
  'meal_verificationEcrec',
  'meal_visitMonitoring',
  'meal_cashPdm',
  'meal_shelterPdm',
  'meal_nfiPdm',
]

export const mealIndex = {
  basePath: '/meal',
  siteMap: {
    visit: {
      _: '/visit',
      dashboard: `/visit/dashboard`,
      details: (koboAnswerId = ':id') => `/visit/details/${koboAnswerId}`,
    },
    verification: {
      _: '/verification',
      list: '/verification/list',
      form: '/verification/form',
      data: (_: string = '/:id') => `/verification/${_}`,
    },
    pdm: {
      _: '/pdm',
      cashPdmDashboard: `/pdm/cash/dashboard`,
      shelterPdmDashboard: `/pdm/shelter/dashboard`,
    },
    form: (id: KoboFormName = ':id' as any) => '/form/' + id,
  },
}

const MealSidebar = ({
  access
}: {
  access: {
    verification: boolean
  }
}) => {
  const path = (page: string) => '' + page
  const {m, formatLargeNumber} = useI18n()
  return (
    <Sidebar>
      <SidebarBody>
        <SidebarSection title={m._meal.visitMonitoring}>
          <NavLink to={path(mealIndex.siteMap.visit.dashboard)}>
            {({isActive, isPending}) => (
              <SidebarItem icon={appConfig.icons.dashboard} active={isActive}>{m.dashboard}</SidebarItem>
            )}
          </NavLink>
          <a href="https://drcngo.sharepoint.com/:x:/s/UKRPortal/EUYPiMkl4n1GqaWinv2OgUoByXCmeVtmsgIINesDzZo66w?e=zrOdMh" target="_blank">
            <SidebarItem icon={appConfig.icons.matrix} iconEnd="open_in_new">{m._meal.openTracker}</SidebarItem>
          </a>
          <SidebarKoboLink path={path(mealIndex.siteMap.form('meal_visitMonitoring'))} name="meal_visitMonitoring"/>
        </SidebarSection>
        {access.verification && (
          <SidebarSection title={m._meal.verification}>
            <NavLink to={path(mealIndex.siteMap.verification.list)}>
              {({isActive, isPending}) => (
                <SidebarItem icon="manage_search" active={isActive}>{m.data}</SidebarItem>
              )}
            </NavLink>
            <NavLink to={path(mealIndex.siteMap.verification.form)}>
              {({isActive, isPending}) => (
                <SidebarItem icon="add_circle" active={isActive}>{m._mealVerif.newRequest}</SidebarItem>
              )}
            </NavLink>
            <SidebarKoboLink path={path(mealIndex.siteMap.form('meal_verificationEcrec'))} name="meal_verificationEcrec"/>
            <SidebarKoboLink path={path(mealIndex.siteMap.form('meal_verificationWinterization'))} name="meal_verificationWinterization"/>
          </SidebarSection>
        )}
        <SidebarSection title={m._meal.pdm}>
          <NavLink to={path(mealIndex.siteMap.pdm._)}>
            {({isActive, isPending}) => (
              <SidebarItem icon={appConfig.icons.dashboard} active={isActive}>{m.dashboard}</SidebarItem>
            )}
          </NavLink>
          <SidebarKoboLink path={path(mealIndex.siteMap.form('meal_cashPdm'))} name="meal_cashPdm"/>
          <SidebarKoboLink path={path(mealIndex.siteMap.form('meal_shelterPdm'))} name="meal_shelterPdm"/>
          <SidebarKoboLink path={path(mealIndex.siteMap.form('meal_nfiPdm'))} name="meal_nfiPdm"/>
        </SidebarSection>
      </SidebarBody>
    </Sidebar>
  )
}

export const Meal = () => {
  const {session, accesses} = useSession()
  useReactRouterDefaultRoute(mealIndex.siteMap.visit.dashboard, mealIndex.siteMap.visit._)
  const access = useMemo(() => {
    return {
      _: !!appFeaturesIndex.meal.showIf?.(session, accesses),
      verification: session && session?.admin || accesses && !!accesses
        .filter(Access.filterByFeature(AppFeatureId.kobo_database))
        .find(_ => {
          return _.params?.koboFormId === KoboIndex.byName('bn_re').id ||
            _.params?.koboFormId === KoboIndex.byName('ecrec_cashRegistration').id ||
            _.params?.koboFormId === KoboIndex.byName('meal_visitMonitoring').id ||
            _.params?.koboFormId === KoboIndex.byName('meal_cashPdm').id ||
            _.params?.koboFormId === KoboIndex.byName('meal_shelterPdm').id ||
            _.params?.koboFormId === KoboIndex.byName('meal_nfiPdm').id
        })
    }
  }, [accesses, session])

  if (!access._) {
    return (
      <NoFeatureAccessPage/>
    )
  }

  return (
    <Layout
      title={appFeaturesIndex.meal.name}
      sidebar={<MealSidebar access={access}/>}
      header={<AppHeader id="app-header"/>}
    >
      <Routes>
        <Route path={mealIndex.siteMap.visit._} element={<MealVisit/>}>
          <Route path={mealIndex.siteMap.visit.dashboard} element={<MealVisitDashboard/>}/>
          <Route path={mealIndex.siteMap.visit.details()} element={<MealVisitDetails/>}/>
        </Route>
        {access.verification && (
          <Route path={mealIndex.siteMap.verification._} element={<MealVerification/>}>
            <Route index element={<Navigate to={mealIndex.siteMap.verification.list}/>}/>
            <Route path={mealIndex.siteMap.verification.list} element={<MealVerificationList/>}/>
            <Route path={mealIndex.siteMap.verification.form} element={<MealVerificationForm/>}/>
            <Route path={mealIndex.siteMap.verification.data()} element={<MealVerificationData/>}/>
          </Route>
        )}
        <Route path={mealIndex.siteMap.pdm._} element={<MealPdm formName="meal_cashPdm"/>}>
          <Route index element={<Navigate to={mealIndex.siteMap.pdm.cashPdmDashboard} replace/>}/>
          <Route path={mealIndex.siteMap.pdm.cashPdmDashboard} element={<MealPdmCashDashboard/>}/>
          <Route path={mealIndex.siteMap.pdm.shelterPdmDashboard} element={<MealPdmShelterDashboard/>}/>
        </Route>
        <Route index element={<Navigate to={mealIndex.siteMap.visit.dashboard}/>}/>
        {relatedKoboForms.map(_ =>
          <Route key={_} {...getKoboFormRouteProps({path: mealIndex.siteMap.form(_), name: _})}/>
        )}
      </Routes>
    </Layout>
  )
}

