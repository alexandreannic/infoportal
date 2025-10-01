import {TabContent} from '@/shared/Tab/TabContent'
import {createRoute} from '@tanstack/react-router'
import {dashboardRoute} from '@/features/Dashboard/Dashboard'
import {Core} from '@/shared'
import {SettingsRow} from '@/features/Form/Settings/FormSettings'
import {useI18n} from '@infoportal/client-i18n'
import {Icon, Switch} from '@mui/material'
import {WidgetSettingsFilterQuestion} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsFilter'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {useMemo} from 'react'
import {Ip} from 'infoportal-api-sdk'

export const dashboardSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'settings',
  component: DashboardSettings,
})

type SettingsForm = Pick<
  Ip.Dashboard,
  'isPublic' | 'start' | 'end' | 'filters' | 'enableChartDownload' | 'periodComparisonDelta'
>

export function DashboardSettings() {
  const {m} = useI18n()
  const {schema, flatSubmissions} = useDashboardContext()

  const form = useForm<SettingsForm>()
  const values = useWatch({control: form.control})

  const {min, max} = useMemo(() => {
    let min = flatSubmissions[0].submissionTime.getTime()
    let max = flatSubmissions[0].submissionTime.getTime()
    for (let i = 1; i < flatSubmissions.length - 1; i++) {
      const time = flatSubmissions[i].submissionTime.getTime()
      if (min > time) min = time
      else if (max < time) max = time
    }
    return {min: new Date(min), max: new Date(max)}
  }, [flatSubmissions])

  return (
    <TabContent width="xs">
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
                  label={m.period}
                  desc={m._dashboard.periodDesc}
                  action={
                    <Core.PeriodPicker
                      min={min}
                      max={max}
                      value={[start, end]}
                      onChange={([newStart, newEnd]) => {
                        form.setValue('start', newStart ?? null)
                        form.setValue('end', newEnd ?? null)
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
                      else form.resetField('filters')
                    }}
                  />
                }
              >
                {values.filters && <WidgetSettingsFilterQuestion name="" form={form} />}
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
                      else form.resetField('periodComparisonDelta')
                    }}
                  />
                }
              >
                {values.periodComparisonDelta && (
                  <Core.Input
                    helperText={null}
                    type="number"
                    label={m._dashboard.periodComparisonDeltaLabel}
                    {...field}
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
                  <Switch checked={field.value} onChange={(e, checked) => field.onChange(checked)} />
                )}
              />
            }
          />
        </Core.PanelBody>
      </Core.Panel>
    </TabContent>
  )
}
