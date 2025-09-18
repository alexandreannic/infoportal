import {useI18n} from '@/core/i18n'
import {Core} from '@/shared'
import {Sidebar, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Box, Icon, useTheme} from '@mui/material'
import {Link} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'
import {appConfig} from '@/conf/AppConfig.js'
import {AppSidebarAssets} from '@/core/layout/AppSidebarAssets.js'
import {UseQueryPermission} from '@/core/query/useQueryPermission.js'

export const AppSidebar = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
  const {m} = useI18n()
  const t = useTheme()
  const permission = UseQueryPermission.workspace({workspaceId})
  return (
    <Sidebar headerId="app-header">
      <Link to="/$workspaceId/dashboard" params={{workspaceId}}>
        {({isActive}) => (
          <SidebarItem icon="home" active={isActive}>
            {m.overview}
          </SidebarItem>
        )}
      </Link>
      <Link to="/$workspaceId/settings/users" params={{workspaceId}}>
        {({isActive}) => (
          <SidebarItem icon="settings" active={isActive}>
            {m.settings}
          </SidebarItem>
        )}
      </Link>
      {/*<Link to="/$workspaceId/new-form" params={{workspaceId}}>*/}
      {/*  {({isActive}) => (*/}
      {/*    <SidebarItem icon="add" active={isActive}>*/}
      {/*      {m.newForm}*/}
      {/*    </SidebarItem>*/}
      {/*  )}*/}
      {/*</Link>*/}
      <SidebarHr />
      <Box display="flex">
        <Link style={{flex: 1}} to="/$workspaceId/form/list" params={{workspaceId}}>
          {({isActive}) => (
            <SidebarItem active={isActive} icon={appConfig.icons.database}>
              {m.forms}
            </SidebarItem>
          )}
        </Link>
        {permission.data?.form_canCreate && (
          <Link
            to="/$workspaceId/new-form"
            params={{workspaceId}}
            style={{
              padding: `calc(${t.vars.spacing} * 0.5)`,
              paddingLeft: 0,
            }}
          >
            {({isActive}) => (
              <Core.Btn variant={isActive ? 'light' : 'outlined'} sx={{height: '100%'}}>
                <Icon>add</Icon>
              </Core.Btn>
            )}
          </Link>
        )}
      </Box>
      <AppSidebarAssets workspaceId={workspaceId} />
    </Sidebar>
  )
}
