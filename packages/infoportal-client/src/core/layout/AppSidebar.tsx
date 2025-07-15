import {useI18n} from '@/core/i18n'
import {Fender, Txt} from '@/shared'
import {Sidebar, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Box, BoxProps, Icon, Skeleton, Tooltip, useTheme} from '@mui/material'
import Fuse from 'fuse.js'
import {forwardRef, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {styleUtils} from '../theme'
import {useQueryForm} from '@/core/query/useQueryForm'
import {Link} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'

type Form = {
  id: string
  name: string
  archived?: boolean
}

const SearchInput = forwardRef(
  ({sx, ...props}: React.InputHTMLAttributes<HTMLInputElement> & Pick<BoxProps, 'sx'>, ref) => {
    const t = useTheme()
    // return (
    // <IpInput
    //   ref={ref}
    //   InputProps={{
    //     sx: {...styleUtils(t).color.toolbar.default, border: 'none', borderRadius: t.shape.borderRadius + 'px'},
    //   }}
    //   helperText={null}
    //   startAdornment={
    //     <Icon color="disabled" sx={{mr: 1}}>
    //       search
    //     </Icon>
    //   }
    //   {...props}
    // />
    // )
    return (
      <Box
        display="flex"
        alignItems="center"
        ref={ref}
        sx={{
          // m: 1,
          mb: 0.5,
          ...styleUtils(t).color.toolbar.default,
          // borderBottom: '1px solid ' + t.palette.divider,
          borderRadius: t.shape.borderRadius + 'px',
          // pl: 1,
          ...sx,
        }}
      >
        <Icon sx={{ml: 1}}>search</Icon>
        <Box component="input" {...props} sx={{ml: 1, height: 36, border: 'none', background: 'none', width: '100%'}} />
      </Box>
    )
  },
)

export const AppSidebar = ({workspaceId}: {workspaceId: Ip.Uuid}) => {
  const {m} = useI18n()
  const t = useTheme()
  const searchForm = useForm<{name: string}>()
  const values = searchForm.watch()
  const queryForm = useQueryForm(workspaceId)

  const forms = useMemo(() => {
    return (
      queryForm.accessibleForms.data?.map(_ => ({
        ..._,
        id: _.id,
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
      <Link to="/$workspaceId/settings" params={{workspaceId}}>
        {({isActive}) => (
          <SidebarItem icon="settings" active={isActive}>
            {m.settings}
          </SidebarItem>
        )}
      </Link>
      <Link to="/$workspaceId/new-form" params={{workspaceId}}>
        {({isActive}) => (
          <SidebarItem icon="add" active={isActive}>
            {m.newForm}
          </SidebarItem>
        )}
      </Link>
      <Link to="/$workspaceId/new-form" params={{workspaceId}}>
        {({isActive}) => <SidebarItem icon="home">{m.forms}</SidebarItem>}
      </Link>
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
          <Box sx={{mx: 0.5, mb: 1, mt: 1}}>
            <Controller
              name="name"
              control={searchForm.control}
              render={({field}) => <SearchInput placeholder={m.searchInForms(forms.length) + '...'} {...field} />}
            />
          </Box>

          {filteredForms.map((_: Form) => (
            <Tooltip key={_.id} title={_.name} placement="right-end">
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
              </Link>
            </Tooltip>
          ))}
        </>
      )}
    </Sidebar>
  )
}
