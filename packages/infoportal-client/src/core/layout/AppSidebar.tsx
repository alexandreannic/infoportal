import {useI18n} from '@/core/i18n'
import {Core} from '@/shared'
import {Sidebar, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Box, Icon, IconProps, useTheme} from '@mui/material'
import {useMemo, useState} from 'react'
import {useQueryForm} from '@/core/query/useQueryForm'
import {Link} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'
import {appConfig} from '@/conf/AppConfig.js'
import {Seq, seq} from '@axanc/ts-utils'
import {SidebarItemProps} from '@/shared/Layout/Sidebar/SidebarItem.js'
import {AppSidebarAssets} from '@/core/layout/AppSidebarAssets.js'

export const AppSidebar = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
  const {m} = useI18n()
  const t = useTheme()

  const queryForm = useQueryForm(workspaceId)

  const forms: Seq<Ip.Form> = useMemo(() => {
    if (!queryForm.accessibleForms.data) return seq()
    return queryForm.accessibleForms.data
  }, [queryForm.accessibleForms.data])

  const [filteredForms, setFilteredForms] = useState<Seq<Ip.Form>>(forms)

  const formItemSize: SidebarItemProps['size'] = forms.length > 19 ? 'tiny' : forms.length > 15 ? 'small' : 'normal'

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
      </Box>
      <AppSidebarAssets workspaceId={workspaceId} />
    </Sidebar>
  )
}

function IconDeploymentStatus({status, sx, ...props}: IconProps & {status?: null | Ip.Form.DeploymentStatus}) {
  return (
    <Icon
      fontSize="small"
      color="disabled"
      sx={{marginLeft: '4px', marginRight: '-4px', verticalAlign: 'middle', ...sx}}
      {...props}
    >
      {appConfig.icons.deploymentStatus[status!]}
    </Icon>
  )
}

function IconLinkedToKobo({sx, ...props}: IconProps) {
  return (
    <Icon fontSize="small" color="info" sx={{verticalAlign: 'middle', textAlign: 'center', ...sx}} {...props}>
      plug_connect
    </Icon>
  )
}
