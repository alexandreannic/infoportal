import {Controller, useForm, useWatch} from 'react-hook-form'
import {Box, Collapse, Icon, InputProps} from '@mui/material'
import {Obj, seq, Seq} from '@axanc/ts-utils'
import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@/core/i18n/index.js'
import {forwardRef, useEffect, useMemo} from 'react'
import {Core} from '@/shared'
import Fuse from 'fuse.js'
import {Asset} from '@/shared/Asset.js'
import {DeploymentStatus} from '@/shared/DeploymentStatus.js'
import {usePersistentState} from '@axanc/react-hooks'

const SearchInput = forwardRef(
  (
    {
      sx,
      onClear,
      endAdornment,
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
          <>
            {endAdornment}
            <Core.IconBtn onClick={onClear} size="small">
              clear
            </Core.IconBtn>
          </>
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
  assetType: Asset.Type[]
  status: Ip.Form.DeploymentStatus[]
}

const defaultFormValues: FilterForm = {
  name: '',
  assetType: [],
  category: [],
  status: [],
}

export const AppSidebarFilters = ({
  assets,
  onFilterChanges,
}: {
  assets: Seq<Asset>
  onFilterChanges: (_: Seq<Asset>) => void
}) => {
  const {m} = useI18n()
  const searchForm = useForm<FilterForm>()
  const values = useWatch({control: searchForm.control})
  const [moreFilters, setMoreFilters] = usePersistentState(false, {storageKey: 'app-filter-more-filter'})
  // useFormPersist('appsidebar-form-filters', {
  //   watch: searchForm.watch,
  //   setValue: searchForm.setValue,
  //   storage: window.localStorage,
  // })

  const fuse = useMemo(() => {
    return new Fuse(assets, {
      keys: ['name'],
      includeScore: true,
      isCaseSensitive: false,
      threshold: 0.4,
    })
  }, [assets])

  useEffect(() => {
    const filteredByName = !values?.name ? assets : fuse.search(values.name).map(res => res.item)
    const assetTypes = values?.assetType ?? []
    const categories = values?.category ?? []
    const statuses = values?.status ?? []

    const filteredForms = seq(filteredByName)
      .filter(_ => (_.type && assetTypes.includes(_.type)) || assetTypes.length === 0)
      .filter(_ => (_.category && categories.includes(_.category)) || categories.length === 0)
      .filter(_ => (_.deploymentStatus && statuses.includes(_.deploymentStatus)) || statuses.length === 0)

    onFilterChanges(filteredForms)
  }, [values, assets, fuse, onFilterChanges])

  const formCategories = useMemo(() => {
    return assets.map(_ => _.category ?? '').distinct(_ => _)
  }, [assets])

  return (
    <Box sx={{mx: 0.5, mb: 1, mt: 0}}>
      <Controller
        name="name"
        control={searchForm.control}
        render={({field}) => (
          <SearchInput
            endAdornment={
              <Core.IconBtn onClick={() => setMoreFilters(_ => !_)} color={moreFilters ? 'primary' : undefined}>
                tune
              </Core.IconBtn>
            }
            onClear={() => searchForm.reset(defaultFormValues)}
            placeholder={m.searchInForms(assets.length) + '...'}
            {...field}
          />
        )}
      />
      <Collapse in={moreFilters}>
        <>
          <Controller
            name="category"
            control={searchForm.control}
            render={({field}) => (
              <Core.SelectMultiple {...field} options={formCategories.get()} label={m.category} sx={{mt: 0.5}} />
            )}
          />
          <Box sx={{mt: 0.5, display: 'flex'}}>
            <Controller
              name="assetType"
              control={searchForm.control}
              render={({field}) => (
                <Core.RadioGroup<Asset.Type>
                  value={field.value}
                  onChange={_ => field.onChange(_)}
                  multiple
                  inline
                  dense
                  sx={{flex: 1, mr: 0.25}}
                >
                  {Obj.values(Asset.Type).map(_ => (
                    <Core.RadioGroupItem hideRadio key={_} value={_} title={<Asset.Icon fontSize="small" type={_} />} />
                  ))}
                </Core.RadioGroup>
              )}
            />
            <Controller
              name="status"
              control={searchForm.control}
              render={({field}) => (
                <Core.RadioGroup<Ip.Form.DeploymentStatus>
                  value={field.value}
                  onChange={_ => field.onChange(_)}
                  multiple
                  inline
                  dense
                  sx={{flex: 1, ml: 0.25}}
                >
                  {Obj.values(Ip.Form.DeploymentStatus).map(_ => (
                    <Core.RadioGroupItem
                      hideRadio
                      key={_}
                      value={_}
                      sx={{display: 'flex', alignItems: 'center'}}
                      title={<DeploymentStatus.Icon fontSize="small" status={_} />}
                    />
                  ))}
                </Core.RadioGroup>
                /* <Core.SelectMultiple
              {...field}
              options={Obj.keys(Ip.Form.DeploymentStatus).map(_ => {
                return {
                  value: _,
                  children: m.deploymentStatus_[_],
                }
              })}
              label={m.status}
              sx={{ml: 0.5}}
            />*/
              )}
            />
          </Box>
        </>
      </Collapse>
    </Box>
  )
}
