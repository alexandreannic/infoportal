import {addDays} from 'date-fns'
import {DashboardFilterLabel} from '@/shared/DashboardLayout/DashboardFilterLabel'
import {DashboardFilterOptions, DashboardFilterValue} from '@/shared/DashboardLayout/DashboardFilterOptions'
import {Box, CircularProgress} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {Obj, seq} from '@axanc/ts-utils'
import {AssetIcon, AssetType} from '@/shared/Asset'
import {Core} from '@/shared'
import React, {Dispatch, SetStateAction, useEffect, useMemo} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {OverviewFilters} from '@/features/Overview/Overview'
import {appConfig} from '@/conf/AppConfig'

export const OverviewFiltersBar = ({
  filters,
  setFilters,
  forms,
  filteredForms,
  onClear,
}: {
  forms?: Ip.Form[]
  filteredForms?: Ip.Form[]
  filters: OverviewFilters
  onClear: () => void
  setFilters: Dispatch<SetStateAction<OverviewFilters>>
}) => {
  const {m} = useI18n()

  const formCategories = useMemo(() => {
    if (!forms) return
    return seq(forms)
      .map(_ => _.category ?? '')
      .distinct(_ => _)
  }, [forms])

  useEffect(() => {
    if (!forms) return
    setFilters(_ => ({..._, formIds: filteredForms?.map(_ => _.id) ?? []}))
  }, [forms, filters.formTypes, filters.folderNames])

  return (
    <Box sx={{mb: 1, display: 'flex', alignItems: 'center', '& > *': {mr: 1}}}>
      <Core.PeriodPicker
        sx={{mt: 0, mb: 0, mr: 1}}
        value={[filters.period.start, filters.period.end]}
        onChange={([start, end]) => {
          setFilters(prev => ({...prev, period: {start: start ?? undefined, end: end ?? undefined}}))
        }}
        label={[m.start, m.endIncluded]}
        max={addDays(new Date(), 1)}
        fullWidth={false}
      />

      <DashboardFilterLabel
        icon="category"
        active={!!filters.formTypes}
        label={<DashboardFilterValue label={m.forms} values={filters.formTypes.map(_ => m.formSource_[_])} />}
      >
        {() => (
          <Box sx={{p: 1}}>
            <Core.RadioGroup<Ip.Form.Type>
              multiple
              value={filters.formTypes}
              onChange={_ => setFilters(prev => ({...prev, formTypes: _}))}
            >
              {Obj.values(Ip.Form.Type).map(_ => (
                <Core.RadioGroupItem
                  hideRadio
                  key={_}
                  value={_}
                  title={m.formSource_[_]}
                  icon={<AssetIcon fontSize="small" type={_ as AssetType} />}
                />
              ))}
            </Core.RadioGroup>
          </Box>
        )}
      </DashboardFilterLabel>

      <DashboardFilterOptions
        icon="folder"
        value={filters.folderNames}
        label={m.folders}
        options={() => formCategories?.map(_ => ({value: _, label: _}))}
        onChange={_ => setFilters(prev => ({...prev, folderNames: _}))}
      />
      <DashboardFilterOptions
        icon={appConfig.icons.database}
        value={filters.formIds}
        label={m.forms}
        options={() => filteredForms?.map(_ => ({value: _.id, label: _.name}))}
        onChange={_ => setFilters(prev => ({...prev, formIds: _ as Ip.FormId[]}))}
      />
      {!forms && <CircularProgress size={24} />}
      <Core.IconBtn sx={{marginLeft: 'auto'}} children="filter_list_off" tooltip={m.clearFilter} onClick={onClear} />
    </Box>
  )
}
