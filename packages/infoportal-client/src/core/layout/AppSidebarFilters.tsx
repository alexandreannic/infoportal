import {Controller, useForm, useWatch} from 'react-hook-form'
import {Box, Icon, InputProps} from '@mui/material'
import {Obj, seq, Seq} from '@axanc/ts-utils'
import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@/core/i18n/index.js'
import {forwardRef, useEffect, useMemo} from 'react'
import {Core} from '@/shared'
import Fuse from 'fuse.js'

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
      <Core.Input
        ref={ref}
        sx={sx}
        helperText={null}
        startAdornment={
          <Icon color="disabled" sx={{mr: 1}}>
            search
          </Icon>
        }
        endAdornment={
          <Core.IconBtn onClick={onClear} size="small">
            clear
          </Core.IconBtn>
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
    //       // borderBottom: '1px solid ' + t.vars.palette.divider,
    //       borderRadius: t.vars.shape.borderRadius,
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

const defaultFormValues: FilterForm = {
  name: '',
  category: [],
  status: [],
}

export const AppSidebarFilters = ({
  forms,
  onFilterChanges,
}: {
  forms: Seq<Ip.Form>
  onFilterChanges: (_: Seq<Ip.Form>) => void
}) => {
  const {m} = useI18n()
  const searchForm = useForm<FilterForm>()
  const values = useWatch({control: searchForm.control})
  // useFormPersist('appsidebar-form-filters', {
  //   watch: searchForm.watch,
  //   setValue: searchForm.setValue,
  //   storage: window.localStorage,
  // })

  const fuse = useMemo(() => {
    return new Fuse(forms, {
      keys: ['name'],
      includeScore: true,
      isCaseSensitive: false,
      threshold: 0.4,
    })
  }, [forms])

  useEffect(() => {
    const filteredByName = !values?.name ? forms : fuse.search(values.name).map(res => res.item)
    const categories = values?.category ?? []
    const statuses = values?.status ?? []

    const filteredForms = seq(filteredByName)
      .filter(_ => (_.category && categories.includes(_.category)) || categories.length === 0)
      .filter(_ => (_.deploymentStatus && statuses.includes(_.deploymentStatus)) || statuses.length === 0)

    onFilterChanges(filteredForms)
  }, [values, forms, fuse, onFilterChanges])

  const formCategories = useMemo(() => {
    return forms.map(_ => _.category ?? '').distinct(_ => _)
  }, [forms])

  return (
    <Box sx={{mx: 0.5, mb: 1, mt: 0}}>
      <Controller
        name="name"
        control={searchForm.control}
        render={({field}) => (
          <SearchInput
            onClear={() => searchForm.reset(defaultFormValues)}
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
            <Core.SelectMultiple {...field} options={formCategories.get()} label={m.category} sx={{mr: 0.5}} />
          )}
        />
        <Controller
          name="status"
          control={searchForm.control}
          render={({field}) => (
            <Core.SelectMultiple
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
  )
}
