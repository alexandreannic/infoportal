import {UseQueryDashboard} from '@/core/query/dashboard/useQueryDashboard'
import {defaultThemeParams} from '@/core/theme'
import {useEffectSkipFirst} from '@/shared/useEffectSkipFirst'
import {useDebounce} from '@axanc/react-hooks'
import {useTheme} from '@emotion/react'
import {Ip} from 'infoportal-api-sdk'
import {useForm, useWatch} from 'react-hook-form'

export type UseDashboardFormEdit = ReturnType<typeof useDashboardFormEdit>

export const useDashboardFormEdit = ({
  workspaceId,
  dashboard,
}: {
  workspaceId: Ip.WorkspaceId
  dashboard: Ip.Dashboard
}) => {
  const queryUpdate = UseQueryDashboard.update({workspaceId})
  const t = useTheme()

  const form = useForm<Omit<Ip.Dashboard.Payload.Update, 'id' | 'workspaceId'>>({
    defaultValues: {
      name: dashboard.name,
      isPublic: dashboard.isPublic,
      start: dashboard.start,
      end: dashboard.end,
      filters: dashboard.filters,
      enableChartFullSize: dashboard.enableChartFullSize,
      enableChartDownload: dashboard.enableChartDownload,
      periodComparisonDelta: dashboard.periodComparisonDelta,
      theme: {...defaultThemeParams, ...dashboard.theme},
    },
  })
  const values = useWatch({control: form.control})
  const debouncedValues = useDebounce(values, 1000)

  useEffectSkipFirst(() => {
    queryUpdate.mutateAsync({id: dashboard.id, ...debouncedValues})
  }, [debouncedValues])

  return {form, values}
}
