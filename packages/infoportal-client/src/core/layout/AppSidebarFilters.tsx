import {Controller, useForm} from 'react-hook-form'
import {Box, Icon, InputProps} from '@mui/material'
import {IpSelectMultiple} from '@/shared/Select/SelectMultiple.js'
import {Obj, seq, Seq} from '@axanc/ts-utils'
import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@/core/i18n/index.js'
import {forwardRef, useEffect, useMemo} from 'react'
import {IpInput} from '@/shared/Input/Input'
import {IpIconBtn} from '@/shared'
import useFormPersist from 'react-hook-form-persist'
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
  const values = searchForm.watch()
  useFormPersist('appsidebar-form-filters', {
    watch: searchForm.watch,
    setValue: searchForm.setValue,
    storage: window.localStorage,
  })

  const fuse = useMemo(() => {
    return new Fuse(forms, {
      keys: ['name'],
      includeScore: true,
      isCaseSensitive: false,
      threshold: 0.4,
    })
  }, [forms])

  useEffect(() => {
    const filteredByName = !values.name || values.name === '' ? forms : fuse.search(values.name).map(res => res.item)
    if (!values.category) values.category = []
    if (!values.status) values.status = []
    const filteredForms = seq(filteredByName)
      .filter(_ => (_.category && values.category.includes(_.category)) || values.category.length === 0)
      .filter(_ => (_.deploymentStatus && values.status.includes(_.deploymentStatus)) || values.status.length === 0)
    onFilterChanges(filteredForms)
  }, [values])

  const formCategories = useMemo(() => {
    return forms.map(_ => _.category ?? '').distinct(_ => _)
  }, [forms])

  return (
    <Box sx={{mx: 0.5, mb: 1, mt: 1}}>
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
  )
}
