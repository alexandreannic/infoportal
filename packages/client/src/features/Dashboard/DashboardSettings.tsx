import {UseQueryDashboard} from '@/core/query/dashboard/useQueryDashboard'
import {UseQueryPermission} from '@/core/query/useQueryPermission'
import {useIpToast} from '@/core/useToast'
import {dashboardRoute} from '@/features/Dashboard/Dashboard'
import {useDashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {useGetDashboardLink} from '@/features/Dashboard/Context/useGetDashboardLink'
import {WidgetSettingsFilterQuestion} from '@/features/Dashboard/Widget/shared/WidgetSettingsFilter'
import {SettingsRow} from '@/features/Form/Settings/FormSettings'
import {AppAvatar, Core} from '@/shared'
import {PopoverShareLink} from '@/shared/PopoverShareLink'
import {TabContent} from '@/shared/Tab/TabContent'
import {useEffectFn} from '@axanc/react-hooks'
import {Txt} from '@infoportal/client-core'
import {useI18n} from '@infoportal/client-i18n'
import {Box, Icon, Switch, useTheme} from '@mui/material'
import {createRoute, useNavigate} from '@tanstack/react-router'
import {useState} from 'react'
import {Controller} from 'react-hook-form'

export const dashboardSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'settings',
  component: DashboardSettings,
})

export function DashboardSettings() {
  const {m, formatDate} = useI18n()
  const t = useTheme()
  const {toastLoading, toastSuccess} = useIpToast()

  const {form, values} = useDashboardContext(_ => _.updateForm)
  const workspaceId = useDashboardContext(_ => _.workspaceId)
  const dashboard = useDashboardContext(_ => _.dashboard)
  const dataRange = useDashboardContext(_ => _.dataRange)

  const queryUpdate = UseQueryDashboard.update({workspaceId})
  const queryRemove = UseQueryDashboard.remove({workspaceId})
  const queryPermission = UseQueryPermission.workspace({workspaceId})
  const queryRestore = UseQueryDashboard.restorePublishedVersion({workspaceId, id: dashboard.id})

  const navigate = useNavigate()

  const [isEditingTitle, setIsEditingTitle] = useState(false)

  useEffectFn(queryUpdate.isPending, _ => _ && toastLoading(m.savingEllipsis))
  useEffectFn(queryUpdate.isSuccess, _ => _ && toastSuccess(m.successfullyEdited))

  const url = useGetDashboardLink({workspaceId, dashboardId: dashboard.id}).absolute

  return (
    <TabContent width="xs">
      <Core.Panel>
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
        <Core.PanelBody sx={{pt: 0}}>
          {dashboard.description && <Core.Txt color="hint">{dashboard.description}</Core.Txt>}
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Txt color="hint">
              {m.created}: {formatDate(dashboard.createdAt)}
            </Txt>
            <Core.ListItem icon={<AppAvatar email={dashboard.createdBy} size={24} />} title={dashboard.createdBy} />
          </Box>
        </Core.PanelBody>
      </Core.Panel>
      <Core.PanelWBody outsideTitle={m.data}>
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
                  size={'small'}
                  checked={!!field.value}
                  onChange={(e, checked) => {
                    if (checked) form.setValue('filters', {})
                    else form.setValue('filters', null as any)
                  }}
                />
              }
            >
              {values.filters && <WidgetSettingsFilterQuestion name="filters" form={form} sx={{mt: 1}} />}
            </SettingsRow>
          )}
        />
      </Core.PanelWBody>
      <Core.PanelWBody outsideTitle={m.display}>
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
                  size={'small'}
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
                  sx={{mt: 1}}
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
                <Switch size={'small'} checked={!!field.value} onChange={(e, checked) => field.onChange(checked)} />
              )}
            />
          }
        />
        <SettingsRow
          icon="fullscreen"
          label={m._dashboard.expendChart}
          desc={m._dashboard.expendChartDesc}
          action={
            <Controller
              control={form.control}
              name="enableChartFullSize"
              render={({field}) => (
                <Switch size={'small'} checked={!!field.value} onChange={(e, checked) => field.onChange(checked)} />
              )}
            />
          }
        />
      </Core.PanelWBody>
      <Core.PanelWBody outsideTitle={m.access}>
        <SettingsRow
          icon="public"
          label={m.public}
          desc={m._dashboard.publicDesc}
          action={
            <Controller
              control={form.control}
              name="isPublic"
              render={({field}) => (
                <Switch size={'small'} checked={!!field.value} onChange={(e, checked) => field.onChange(checked)} />
              )}
            />
          }
        />
      </Core.PanelWBody>
      {queryPermission.data?.dashboard_canDelete && (
        <Core.PanelWBody outsideTitle={m.dangerZone}>
          <SettingsRow
            icon="settings_backup_restore"
            label={m._dashboard.restorePublishedVersion}
            desc={m._dashboard.restorePublishedVersionDesc}
            action={
              <Core.Modal
                loading={queryRestore.isPending}
                title={m._dashboard.restorePublishedVersion}
                content={dashboard.name}
                onConfirm={async (e, close) => {
                  await queryRestore.mutateAsync()
                  toastSuccess(m._dashboard.restorePublishedDone)
                  close()
                }}
              >
                <Core.Btn variant="outlined" icon="settings_backup_restore" children={m.restore} />
              </Core.Modal>
            }
          />
          <SettingsRow
            icon="delete"
            label={m._dashboard.deleteThis}
            desc={m._dashboard.deleteThisDesc}
            action={
              <Core.Modal
                loading={queryRemove.pendingIds.has(dashboard.id)}
                title={m._dashboard.deleteThis}
                content={dashboard.name}
                onConfirm={async (e, close) => {
                  await queryRemove.mutateAsync({id: dashboard.id})
                  close()
                  navigate({to: '/$workspaceId/dashboard', params: {workspaceId}})
                }}
              >
                <Core.Btn variant="outlined" icon="delete" color="error" children={m.delete} />
              </Core.Modal>
            }
          />
        </Core.PanelWBody>
      )}
    </TabContent>
  )
}
