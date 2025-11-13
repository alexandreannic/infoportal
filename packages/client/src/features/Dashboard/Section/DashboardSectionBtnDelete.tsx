import {Ip} from '@infoportal/api-sdk'
import {UseQueryDashboardSecion} from '@/core/query/dashboard/useQueryDashboardSection'
import {useNavigate} from '@tanstack/react-router'
import {useI18n} from '@infoportal/client-i18n'
import {Box} from '@mui/material'
import {Core} from '@/shared'

export function DeleteSectionBtn({
  sectionId,
  workspaceId,
  dashboardId,
  sections,
}: {
  workspaceId: Ip.WorkspaceId
  dashboardId: Ip.DashboardId
  sectionId: Ip.Dashboard.SectionId
  sections: Ip.Dashboard.Section[]
}) {
  const querySectionRemove = UseQueryDashboardSecion.remove({workspaceId, dashboardId})
  const navigate = useNavigate()
  const {m} = useI18n()
  const navigateToDefaultRoute = (deletedSectionId: Ip.Dashboard.SectionId) => {
    const firstSection = sections.filter(_ => _.id !== deletedSectionId)[0]
    if (firstSection) {
      navigate({
        to: '/$workspaceId/dashboard/$dashboardId/edit/s/$sectionId',
        params: {workspaceId, dashboardId: dashboardId, sectionId: firstSection.id},
      })
    } else {
      navigate({
        to: '/$workspaceId/dashboard/$dashboardId/edit/settings',
        params: {workspaceId, dashboardId: dashboardId},
      })
    }
  }

  return (
    <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
      <Core.Modal
        loading={querySectionRemove.pendingIds.has(sectionId)}
        title={m.deleteSection}
        onConfirm={(e, close) =>
          querySectionRemove
            .mutateAsync({id: sectionId})
            .then(close)
            .then(() => navigateToDefaultRoute(sectionId))
        }
      >
        <Core.Btn color="error" icon="delete" variant="outlined">
          {m.deleteSection}
        </Core.Btn>
      </Core.Modal>
    </Box>
  )
}
