import {TabContent} from '@/shared/Tab/TabContent'
import {createRoute} from '@tanstack/react-router'
import {dashboardRoute} from '@/features/Dashboard/Dashboard'
import {AppAvatar, Core} from '@/shared'
import {SettingsRow} from '@/features/Form/Settings/FormSettings'
import {useI18n} from '@infoportal/client-i18n'
import {Box, Icon, Switch, useTheme} from '@mui/material'
import {WidgetSettingsFilterQuestion} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsFilter'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {useEffect, useMemo, useState} from 'react'
import {Ip} from 'infoportal-api-sdk'
import {UseQueryDashboard} from '@/core/query/dashboard/useQueryDashboard'
import {useIpToast} from '@/core/useToast'
import {useDebounce, useEffectFn} from '@axanc/react-hooks'
import {diffObject} from 'infoportal-common'
import {PopoverShareLink} from '@/shared/PopoverShareLink'
import {UseQueryWorkspace} from '@/core/query/useQueryWorkspace'
import {useAppSettings} from '@/core/context/ConfigContext'

export const dashboardSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'settings',
  component: DashboardSettings,
})

export function DashboardSettings() {
  const {m, formatDate} = useI18n()
  const t = useTheme()
  const {conf} = useAppSettings()
  const {toastLoading, toastSuccess} = useIpToast()
  const {workspaceId, dashboard, effectiveDataRange, dataRange, schema, flatSubmissions} = useDashboardContext()
  const queryWorkspace = UseQueryWorkspace.getById(workspaceId)
  const queryUpdate = UseQueryDashboard.update({workspaceId})
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const form = useForm<Ip.Dashboard.Payload.Update>({
    defaultValues: {
      name: dashboard.name,
      isPublic: dashboard.isPublic,
      start: dashboard.start,
      end: dashboard.end,
      filters: dashboard.filters,
      enableChartDownload: dashboard.enableChartDownload,
      periodComparisonDelta: dashboard.periodComparisonDelta,
    },
  })
  const values = useWatch({control: form.control})

  useEffectFn(queryUpdate.isPending, _ => _ && toastLoading(m.savingEllipsis))
  useEffectFn(queryUpdate.isSuccess, _ => _ && toastSuccess(m.successfullyEdited))

  const debouncedValues = useDebounce(values, 500)

  useEffect(() => {
    if (diffObject(debouncedValues, dashboard).hasChanged)
      queryUpdate.mutateAsync({id: dashboard.id, ...debouncedValues})
  }, [debouncedValues])

  const url =
    queryWorkspace.data && conf
      ? new URL(Ip.Dashboard.buildPath(queryWorkspace.data, dashboard), conf.baseURL).toString()
      : undefined

  return (
    <TabContent width="xs">
      <Core.Panel>
        {JSON.stringify(dataRange)}
        <br />
        {JSON.stringify(effectiveDataRange)}
        <Core.PanelHead action={url && <PopoverShareLink url={url} />}>
          {isEditingTitle ? (
            <Controller
              control={form.control}
              name="name"
              render={({field}) => (
                <Core.AsyncInput
                  helperText={null}
                  onClear={() => setIsEditingTitle(false)}
                  value={field.value}
                  onSubmit={_ => {
                    field.onChange(_)
                    setIsEditingTitle(false)
                  }}
                />
              )}
            />
          ) : (
            <>
              {values.name}
              <Core.IconBtn onClick={() => setIsEditingTitle(true)} sx={{color: t.vars.palette.text.secondary}}>
                edit
              </Core.IconBtn>
            </>
          )}
        </Core.PanelHead>
        <Core.PanelBody>
          {dashboard.description && <Core.Txt color="hint">{dashboard.description}</Core.Txt>}
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Core.ListItem icon="calendar_today" title={formatDate(dashboard.createdAt)} />
            <Core.ListItem icon={<AppAvatar email={dashboard.createdBy} size={24} />} title={dashboard.createdBy} />
          </Box>
        </Core.PanelBody>
      </Core.Panel>
      <Core.Panel>
        <Core.PanelBody>
          <Controller
            control={form.control}
            name="start"
            render={({field}) => {
              const start = form.watch('start') ?? undefined
              const end = form.watch('end') ?? undefined
              return (
                <SettingsRow
                  icon="date_range"
                  label={m._dashboard.filterPeriod}
                  desc={m._dashboard.filterPeriodDesc}
                  action={
                    <Core.PeriodPicker
                      min={dataRange.start}
                      max={dataRange.end}
                      value={[start, end]}
                      onChange={([newStart, newEnd]) => {
                        form.setValue('start', newStart)
                        form.setValue('end', newEnd)
                      }}
                    />
                  }
                />
              )
            }}
          />
          <Controller
            control={form.control}
            name="filters"
            render={({field}) => (
              <SettingsRow
                icon="filter_alt"
                label={m._dashboard.filterData}
                desc={m._dashboard.filterDataDesc}
                action={
                  <Switch
                    checked={!!field.value}
                    onChange={(e, checked) => {
                      if (checked) form.setValue('filters', {})
                      else form.setValue('filters', null as any)
                    }}
                  />
                }
              >
                {values.filters && <WidgetSettingsFilterQuestion name="filters" form={form} />}
              </SettingsRow>
            )}
          />
          <Controller
            control={form.control}
            name="periodComparisonDelta"
            render={({field}) => (
              <SettingsRow
                icon={<Icon color="success">arrow_upward</Icon>}
                label={m._dashboard.periodComparisonDelta}
                desc={m._dashboard.periodComparisonDeltaDesc}
                action={
                  <Switch
                    checked={!!field.value}
                    onChange={(e, checked) => {
                      if (checked) form.setValue('periodComparisonDelta', 90)
                      else form.setValue('periodComparisonDelta', null as any)
                    }}
                  />
                }
              >
                {values.periodComparisonDelta !== undefined && values.periodComparisonDelta !== null && (
                  <Core.Input
                    helperText={null}
                    type="number"
                    label={m._dashboard.periodComparisonDeltaLabel}
                    {...field}
                    onChange={e => field.onChange(+e.target.value)}
                  />
                )}
              </SettingsRow>
            )}
          />
          <SettingsRow
            icon="download"
            label={m._dashboard.downloadChartAsImg}
            desc={m._dashboard.downloadChartAsImgDesc}
            action={
              <Controller
                control={form.control}
                name="enableChartDownload"
                render={({field}) => (
                  <Switch checked={!!field.value} onChange={(e, checked) => field.onChange(checked)} />
                )}
              />
            }
          />
          <SettingsRow
            icon="public"
            label={m.public}
            desc={m._dashboard.publicDesc}
            action={
              <Controller
                control={form.control}
                name="isPublic"
                render={({field}) => (
                  <Switch checked={!!field.value} onChange={(e, checked) => field.onChange(checked)} />
                )}
              />
            }
          />
        </Core.PanelBody>
      </Core.Panel>
    </TabContent>
  )
}
