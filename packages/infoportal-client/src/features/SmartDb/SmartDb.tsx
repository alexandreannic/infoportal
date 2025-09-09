import {Page} from '@/shared'
import {createRoute, Link, Outlet} from '@tanstack/react-router'
import {formRootRoute} from '@/features/Form/Form'
import {UseQuerySmartDb} from '@/core/query/useQuerySmartDb.js'
import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@/core/i18n/index.js'
import {Icon, Tab, Tabs} from '@mui/material'
import {appConfig} from '@/conf/AppConfig.js'
import {smartDbDataRoute} from '@/features/SmartDb/SmartDbData.js'
import {smartDbEditRoute} from '@/features/SmartDb/SmartDbEdit.js'

export const smartDbRoute = createRoute({
  getParentRoute: () => formRootRoute,
  path: 'smart-db/$smartDbId',
  component: SmartDb,
})

export function SmartDb() {
  const {workspaceId, smartDbId} = smartDbRoute.useParams() as {workspaceId: Ip.WorkspaceId; smartDbId: Ip.SmartDbId}
  console.log(smartDbRoute.fullPath)
  const querySmartDb = UseQuerySmartDb.getById(workspaceId, smartDbId)
  const {formatDate, m} = useI18n()
  return (
    <Page width="full" loading={querySmartDb.isLoading}>
      <Tabs variant="scrollable" scrollButtons="auto" value={smartDbRoute.fullPath}>
        <Tab
          icon={<Icon>{appConfig.icons.dataTable}</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={smartDbDataRoute.fullPath}
          to={smartDbDataRoute.fullPath}
          label={m.data}
        />
        <Tab
          icon={<Icon>edit</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={smartDbEditRoute.fullPath}
          to={smartDbEditRoute.fullPath}
          label={m.form}
        />
        <Tab
          icon={<Icon>dynamic_form</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={smartDbEditRoute.fullPath}
          to={smartDbEditRoute.fullPath}
          label={m.action}
        />
        {/*<Tab*/}
        {/*  icon={<Icon>lock</Icon>}*/}
        {/*  iconPosition="start"*/}
        {/*  sx={{minHeight: 34, py: 1}}*/}
        {/*  component={Link}*/}
        {/*  value={databaseAccessRoute.fullPath}*/}
        {/*  to={databaseAccessRoute.fullPath}*/}
        {/*  disabled={!schema}*/}
        {/*  label={m.access}*/}
        {/*/>*/}
      </Tabs>
      <Outlet />
    </Page>
  )
}
