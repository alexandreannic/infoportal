import {Api} from '@infoportal/api-sdk'
import {useI18n} from '@infoportal/client-i18n'
import {useTheme} from '@mui/material'
import {UseQueryDashboardWidget} from '@/core/query/dashboard/useQueryDashboardWidget'
import {WidgetCreate, WidgetCreateForm} from '@/features/Dashboard/Widget/WidgetCreate'
import {Core} from '@/shared'

export function DashboardSectionBtnCreate({
  sectionId,
  workspaceId,
  dashboardId,
  widgets,
  onCreate,
}: {
  workspaceId: Api.WorkspaceId
  dashboardId: Api.DashboardId
  sectionId: Api.Dashboard.SectionId
  widgets: Api.Dashboard.Widget[]
  onCreate: (_: Api.Dashboard.WidgetId) => void
}) {
  const {m} = useI18n()
  const t = useTheme()
  const queryWidgetCreate = UseQueryDashboardWidget.create({workspaceId, dashboardId: dashboardId, sectionId})

  const createWidget = async (form: WidgetCreateForm) => {
    const maxY = Math.max(...widgets.map(w => w.position.y + w.position.h))
    const data = await queryWidgetCreate.mutateAsync({
      ...form,
      i18n_title: [],
      config: {},
      position: {x: 0, y: maxY, w: 6, h: 10},
    })
    onCreate(data.id)
  }
  return (
    <Core.Modal
      loading={queryWidgetCreate.isPending}
      closeOnClickAway
      overrideActions={null}
      content={close => (
        <WidgetCreate close={close} loading={queryWidgetCreate.isPending} onSubmit={_ => createWidget(_).then(close)} />
      )}
    >
      <Core.Btn
        icon="add"
        variant="outlined"
        sx={{
          m: 1,
          mt: 0,
          width: `calc(100% - ${t.vars.spacing} * 2)`,
          border: '1px dashed',
          borderColor: t.vars.palette.divider,
        }}
      >
        {m.create}
      </Core.Btn>
    </Core.Modal>
  )
}
