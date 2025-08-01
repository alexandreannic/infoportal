import {useI18n} from '@/core/i18n'
import {Fender, IpBtn, IpIconBtn, Txt} from '@/shared'
import {Sidebar, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Box, Icon, InputProps, Skeleton, Tooltip, useTheme} from '@mui/material'
import Fuse from 'fuse.js'
import {forwardRef, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useQueryForm} from '@/core/query/useQueryForm'
import {Link} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'
import {appConfig} from '@/conf/AppConfig.js'
import {IpInput} from '@/shared/Input/Input.js'
import {IpSelectMultiple} from '@/shared/Select/SelectMultiple.js'
import {mapFor, Obj, Seq, seq} from '@axanc/ts-utils'
import useFormPersist from 'react-hook-form-persist'

const SearchInput = forwardRef(
  (
    {
      sx,
      onClear,
      ...props
    }: InputProps & {
      onClear?: () => void
    },
    ref,
  ) => {
    return (
      <IpInput
        ref={ref}
        sx={sx}
        helperText={null}
        startAdornment={
          <Icon color="disabled" sx={{mr: 1}}>
            search
          </Icon>
        }
        endAdornment={
          <IpIconBtn onClick={onClear} size="small">
            clear
          </IpIconBtn>
        }
        {...props}
      />
    )
    // return (
    //   <Box
    //     display="flex"
    //     alignItems="center"
    //     ref={ref}
    //     sx={{
    //       // m: 1,
    //       mb: 0.5,
    //       ...styleUtils(t).color.toolbar.default,
    //       // borderBottom: '1px solid ' + t.palette.divider,
    //       borderRadius: t.shape.borderRadius + 'px',
    //       // pl: 1,
    //       ...sx,
    //     }}
    //   >
    //     <Icon sx={{ml: 1}}>search</Icon>
    //     <Box component="input" {...props} sx={{ml: 1, height: 36, border: 'none', background: 'none', width: '100%'}} />
    //   </Box>
    // )
  },
)

type FilterForm = {
  name: string
  category: string[]
  status: Ip.Form.DeploymentStatus[]
}

export const AppSidebar = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
  const {m} = useI18n()
  const t = useTheme()
  const searchForm = useForm<FilterForm>()
  useFormPersist('storageKey', {
    watch: searchForm.watch,
    setValue: searchForm.setValue,
    storage: window.localStorage,
  })

  const values = searchForm.watch()
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

  const fuse = useMemo(() => {
    return new Fuse(forms, {
      keys: ['name'],
      includeScore: true,
      isCaseSensitive: false,
      threshold: 0.4,
    })
  }, [forms])

  const formCategories = useMemo(() => {
    return forms.map(_ => _.category ?? '').distinct(_ => _)
  }, [forms])

  const filteredForms = useMemo(() => {
    const filteredByName = !values.name || values.name === '' ? forms : fuse.search(values.name).map(res => res.item)
    return filteredByName
      .filter(_ => (_.category && values.category.includes(_.category)) || values.category.length === 0)
      .filter(_ => (_.deploymentStatus && values.status.includes(_.deploymentStatus)) || values.status.length === 0)
  }, [values])

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
      <Link to="/$workspaceId/form/list" params={{workspaceId}}>
        {({isActive}) => (
          <SidebarItem
            sx={{pr: 0}}
            active={isActive}
            iconEnd={
              <Link to="/$workspaceId/new-form" params={{workspaceId}}>
                {({isActive}) => (
                  <IpBtn variant={isActive ? 'light' : 'outlined'} sx={{mr: 0}}>
                    <Icon>add</Icon>
                  </IpBtn>
                )}
              </Link>
            }
            icon={appConfig.icons.database}
          >
            {m.forms}
          </SidebarItem>
        )}
      </Link>
      {queryForm.accessibleForms.isLoading ? (
        mapFor(4, () => (
          <SidebarItem size="tiny">
            <Skeleton sx={{width: 160, height: 30}} />
          </SidebarItem>
        ))
      ) : queryForm.accessibleForms.data?.length === 0 ? (
        <Fender
          type="empty"
          size="small"
          title={m._koboDatabase.noAccessToForm}
          sx={{mt: 2, color: t.palette.text.disabled}}
        />
      ) : (
        <>
          <Box sx={{mx: 0.5, mb: 1, mt: 1}}>
            <Controller
              name="name"
              control={searchForm.control}
              render={({field}) => (
                <SearchInput
                  onClear={() => {
                    searchForm.reset({
                      status: [],
                      category: [],
                      name: '',
                    })
                  }}
                  placeholder={m.searchInForms(forms.length) + '...'}
                  {...field}
                />
              )}
            />
            <Box sx={{mt: 1, display: 'flex'}}>
              <Controller
                name="category"
                control={searchForm.control}
                render={({field}) => (
                  <IpSelectMultiple {...field} options={formCategories.get()} label={m.category} sx={{mr: 0.5}} />
                )}
              />
              <Controller
                name="status"
                control={searchForm.control}
                render={({field}) => (
                  <IpSelectMultiple
                    {...field}
                    options={Obj.keys(Ip.Form.DeploymentStatus).map(_ => {
                      return {
                        value: _,
                        children: m.deploymentStatus_[_],
                      }
                    })}
                    label={m.status}
                    sx={{ml: 0.5}}
                  />
                )}
              />
            </Box>
          </Box>

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
                  <Txt bold>{_.name}</Txt>
                </Box>
              }
              placement="right-end"
            >
              <Link to="/$workspaceId/form/$formId" params={{workspaceId, formId: _.id}}>
                {({isActive}) => (
                  <SidebarItem
                    size={'tiny'}
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
                    <Txt sx={{color: _.deploymentStatus !== 'deployed' ? t.palette.text.disabled : undefined}}>
                      {_.name}
                      {/* {_.custom && <span style={{fontWeight: 300}}> ({m._koboDatabase.mergedDb})</span>} */}
                    </Txt>
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
