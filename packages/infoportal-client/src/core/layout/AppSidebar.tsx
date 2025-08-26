import {useI18n} from '@/core/i18n'
import {Fender, IpBtn, Txt} from '@/shared'
import {Sidebar, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Box, Icon, Skeleton, Tooltip, useTheme} from '@mui/material'
import {useMemo, useState} from 'react'
import {useQueryForm} from '@/core/query/useQueryForm'
import {Link, useNavigate} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'
import {appConfig} from '@/conf/AppConfig.js'
import {mapFor, Seq, seq} from '@axanc/ts-utils'
import {SidebarItemProps} from '@/shared/Layout/Sidebar/SidebarItem.js'
import {AppSidebarFilters} from '@/core/layout/AppSidebarFilters.js'
import {Core} from '@/shared'

export const AppSidebar = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
  const {m} = useI18n()
  const t = useTheme()

  const queryForm = useQueryForm(workspaceId)

  const forms: Seq<Ip.Form> = useMemo(() => {
    if (!queryForm.accessibleForms.data) return seq()
    return queryForm.accessibleForms.data.map(_ => ({
      ..._,
      id: _.id,
      archived: _.deploymentStatus === 'archived',
      name: _.name,
    }))
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
            </CoreBtn>
          )}
        </Link>
      </Box>
      <AppSidebarFilters forms={forms} onFilterChanges={setFilteredForms} />
      {queryForm.accessibleForms.isLoading ? (
        mapFor(4, i => (
          <SidebarItem key={i} size={formItemSize}>
            <Skeleton sx={{width: 160, height: 30}} />
          </SidebarItem>
        ))
      ) : queryForm.accessibleForms.data?.length === 0 ? (
        <Fender
          type="empty"
          size="small"
          title={m._koboDatabase.noAccessToForm}
          sx={{mt: 2, color: t.vars.palette.text.disabled}}
        />
      ) : (
        <>
          {filteredForms.map((_: Ip.Form) => (
            <Tooltip
              key={_.id}
              title={
                <Box display="flex" alignItems="center">
                  {_.category}
                  {_.category && (
                    <Icon color="disabled" fontSize="small">
                      chevron_right
                    </Icon>
                  )}
                  <Core.Txt bold>{_.name}</Core.Txt>
                </Box>
              }
              placement="right-end"
            >
              <Link to="/$workspaceId/form/$formId" params={{workspaceId, formId: _.id}}>
                {({isActive}) => (
                  <SidebarItem
                    size={formItemSize}
                    sx={{height: 26}}
                    onClick={() => undefined}
                    key={_.id}
                    active={isActive}
                    iconEnd={
                      <>
                        {/* {_.custom && (
                          <Icon fontSize="small" sx={{marginLeft: '4px', marginRight: '-4px', verticalAlign: 'middle'}}>
                            device_hub
                          </Icon>
                        )} */}
                        {_.deploymentStatus !== 'deployed' && (
                          <Icon
                            fontSize="small"
                            color="disabled"
                            sx={{marginLeft: '4px', marginRight: '-4px', verticalAlign: 'middle'}}
                          >
                            {appConfig.icons.deploymentStatus[_.deploymentStatus!]}
                          </Icon>
                        )}
                      </>
                    }
                  >
                    <Core.Txt sx={{color: _.deploymentStatus !== 'deployed' ? t.vars!.palette.text.disabled : undefined}}>
                      {_.name}
                      {/* {_.custom && <span style={{fontWeight: 300}}> ({m._koboDatabase.mergedDb})</span>} */}
                    </Core.Txt>
                  </SidebarItem>
                )}
              </Link>
            </Tooltip>
          ))}
        </>
      )}
    </Sidebar>
  )
}
