import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useI18n} from '@/core/i18n'
import {Fender, Txt} from '@/shared'
import {Sidebar, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Box, BoxProps, Icon, Skeleton, Tooltip, useTheme} from '@mui/material'
import Fuse from 'fuse.js'
import {useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {NavLink} from 'react-router-dom'
import {getComponentStyleOverride, styleUtils} from '../theme'

import {useQueryForm} from '@/core/query/useQueryForm'

type Form = {
  id: string
  // custom?: boolean
  url: string
  name: string
  archived?: boolean
}

const SearchInput = ({sx, ...props}: React.InputHTMLAttributes<HTMLInputElement> & Pick<BoxProps, 'sx'>) => {
  const t = useTheme()
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        m: 1,
        mb: 0.5,
        borderRadius: t.shape.borderRadius + 'px',
        ...styleUtils(t).color.inputBack,
        pl: 1,
        ...sx,
      }}
    >
      <Icon color="disabled">search</Icon>
      <Box component="input" {...props} sx={{ml: 1, height: 36, border: 'none', background: 'none', width: '100%'}} />
    </Box>
  )
}

export const AppSidebar = () => {
  const {workspaceId} = useWorkspaceRouter()
  const {m} = useI18n()
  const t = useTheme()
  const {router} = useWorkspaceRouter()
  const searchForm = useForm<{name: string}>()
  const values = searchForm.watch()
  const queryForm = useQueryForm(workspaceId)

  const forms = useMemo(() => {
    return (
      queryForm.accessibleForms.data?.map(_ => ({
        ..._,
        id: _.id,
        url: router.database.form(_.id).root,
        archived: _.deploymentStatus === 'archived',
        name: _.name,
      })) ?? []
    )
    // custom: customForms
    //   .filter(c => ctx.formsAccessible?.some(_ => _.id === c.forms[0]?.id))
    //   .map(_ => ({
    //     url: router.database.custom(_.id),
    //     id: _.id,
    //     custom: true,
    //     archived: _.forms.every(fa => {
    //       const form = ctx.formsAccessible?.find(fa => fa.id === _.id)
    //       return !form || form.deploymentStatus === 'archived'
    //     }),
    //     parsedName: KoboFormSdk.parseFormName(_.name),
    //   })),
  }, [queryForm.accessibleForms.data])

  const fuse = useMemo(() => {
    return new Fuse(forms, {
      keys: ['name'],
      includeScore: true,
      isCaseSensitive: false,
      threshold: 0.4,
    })
  }, [forms])

  const filteredForms = useMemo(() => {
    if (!values.name || values.name === '') return forms
    return fuse.search(values.name).map(res => res.item)
  }, [values])

  return (
    <Sidebar headerId="app-header">
      <NavLink to={router.settings.root}>
        {({isActive}) => (
          <SidebarItem icon="settings" active={isActive}>
            {m.settings}
          </SidebarItem>
        )}
      </NavLink>
      <NavLink to={router.importKoboForm}>
        {({isActive, isPending}) => (
          <SidebarItem icon="add" active={isActive}>
            {m.importFromKobo}
          </SidebarItem>
        )}
      </NavLink>
      <NavLink to={router.database.list}>
        {({isActive, isPending}) => <SidebarItem icon="home">{m.forms}</SidebarItem>}
      </NavLink>
      <SidebarHr />
      {queryForm.accessibleForms.isLoading ? (
        <>
          <SidebarItem size="tiny">
            <Skeleton sx={{width: 160, height: 30}} />
          </SidebarItem>
          <SidebarItem size="tiny">
            <Skeleton sx={{width: 160, height: 30}} />
          </SidebarItem>
          <SidebarItem size="tiny">
            <Skeleton sx={{width: 160, height: 30}} />
          </SidebarItem>
          <SidebarItem size="tiny">
            <Skeleton sx={{width: 160, height: 30}} />
          </SidebarItem>
        </>
      ) : queryForm.accessibleForms.data?.length === 0 ? (
        <Fender
          type="empty"
          size="small"
          title={m._koboDatabase.noAccessToForm}
          sx={{mt: 2, color: t.palette.text.disabled}}
        />
      ) : (
        <>
          <Controller
            name="name"
            control={searchForm.control}
            render={({field}) => <SearchInput placeholder={m.searchInForms(forms.length) + '...'} {...field} />}
          />

          {filteredForms.map((_: Form) => (
            <Tooltip key={_.id} title={_.name} placement="right-end">
              <NavLink to={_.url}>
                {({isActive, isPending}) => (
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
                        {_.archived && (
                          <Icon
                            fontSize="small"
                            color="disabled"
                            sx={{marginLeft: '4px', marginRight: '-4px', verticalAlign: 'middle'}}
                          >
                            archive
                          </Icon>
                        )}
                      </>
                    }
                  >
                    <Txt sx={{color: _.archived ? t.palette.text.disabled : undefined}}>
                      {_.name}
                      {/* {_.custom && <span style={{fontWeight: 300}}> ({m._koboDatabase.mergedDb})</span>} */}
                    </Txt>
                  </SidebarItem>
                )}
              </NavLink>
            </Tooltip>
          ))}
        </>
      )}
    </Sidebar>
  )
}
