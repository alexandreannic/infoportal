import React, {useEffect} from 'react'
import {NavLink, Outlet} from 'react-router-dom'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {KoboFormName} from 'infoportal-common'
import {MealPdmProvider} from '@/features/Meal/Pdm/Context/MealPdmContext'
import {useLocation} from 'react-router'
import {useI18n} from '@/core/i18n'
import {Tab, Tabs} from '@mui/material'
import {mealIndex} from '@/features/Meal/Meal'

export const MealPdm = ({formName}: {formName: KoboFormName}) => {
  const ctx = useKoboSchemaContext()
  const {pathname} = useLocation()
  const {m} = useI18n()

  useEffect(() => {
    ctx.fetchByName(formName)
  }, [formName])

  if (ctx.byName[formName]?.get) {
    return (
      <MealPdmProvider>
        <>
          <Tabs
            value={pathname}
            sx={{borderBottom: t => `1px solid ${t.palette.divider}`}}
          >
            <Tab
              sx={{minHeight: 34, py: 1}}
              component={NavLink}
              value={mealIndex.siteMap.pdm.cashPdmDashboard}
              to={mealIndex.siteMap.pdm.cashPdmDashboard}
              label={m.mealMonitoringPdm.cashPdmDashboard}
            />
            <Tab
              sx={{minHeight: 34, py: 1}}
              component={NavLink}
              value={mealIndex.siteMap.pdm.shelterPdmDashboard}
              to={mealIndex.siteMap.pdm.shelterPdmDashboard}
              label={m.mealMonitoringPdm.shelterPdmDashboard}
            />
          </Tabs>
          <Outlet/>
        </>
      </MealPdmProvider>
    )
  }
}
