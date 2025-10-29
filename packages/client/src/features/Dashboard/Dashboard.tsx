import {UseQueryDashboard} from '@/core/query/dashboard/useQueryDashboard'
import {UseQueryDashboardSecion} from '@/core/query/dashboard/useQueryDashboardSection'
import {UseQueryDashboardWidget} from '@/core/query/dashboard/useQueryDashboardWidget'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {UseQuerySubmission} from '@/core/query/useQuerySubmission'
import {DashboardProvider} from '@/features/Dashboard/DashboardContext'
import {dashboardSettingsRoute} from '@/features/Dashboard/DashboardSettings'
import {dashboardSectionRoute} from '@/features/Dashboard/Section/DashboardSection'
import {useGetDashboardLink} from '@/features/Dashboard/useGetDashboardLink'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {Core, Page} from '@/shared'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {PopoverShareLink} from '@/shared/PopoverShareLink'
import {useEffectFn} from '@axanc/react-hooks'
import {useI18n} from '@infoportal/client-i18n'
import {Box, Collapse, Icon, Tab, Tabs, useTheme} from '@mui/material'
import {createRoute, Link, Outlet, useMatchRoute, useNavigate} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'
import {useState} from 'react'
import 'react-grid-layout/css/styles.css'
import {DashboardTheme} from './DashboardTheme'
import {useIpToast} from '@/core/useToast'

export const dashboardRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'dashboard/$dashboardId/edit',
  component: Dashboard,
})

const useActiveTab = ({
  sections,
  dashboardId,
  workspaceId,
}: {
  dashboardId?: Ip.DashboardId
  sections?: Ip.Dashboard.Section[]
  workspaceId: Ip.WorkspaceId
}) => {
  const matchRoute = useMatchRoute()
  const settingsMatch = matchRoute({
    to: dashboardSettingsRoute.fullPath,
    params: {workspaceId},
    fuzzy: true,
  })
  if (settingsMatch) return 'settings'
  return sections?.find(_ => {
    return matchRoute({
      to: '/$workspaceId/dashboard/$dashboardId/edit/s/$sectionId',
      params: {workspaceId, dashboardId, sectionId: _.id},
      fuzzy: true,
    })
  })?.id
}

export function Dashboard() {
  const t = useTheme()
  const {m} = useI18n()
  const params = dashboardRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const dashboardId = params.dashboardId as Ip.DashboardId
  const {toastSuccess} = useIpToast()

  const dashboardUrl = useGetDashboardLink({workspaceId, dashboardId}).absolute ?? '...'
  const queryDashboardPublish = UseQueryDashboard.publish({workspaceId, id: dashboardId})
  const queryDashboard = UseQueryDashboard.getById({workspaceId, id: dashboardId})
  const queryDashboardSection = UseQueryDashboardSecion.search({workspaceId, dashboardId})
  const querySchema = useQuerySchema({workspaceId, formId: queryDashboard.data?.sourceFormId})
  const querySubmissions = UseQuerySubmission.search({workspaceId, formId: queryDashboard.data?.sourceFormId})
  const queryWidgets = UseQueryDashboardWidget.search({workspaceId, dashboardId})
  const queryDashboardSectionCreate = UseQueryDashboardSecion.create({workspaceId, dashboardId})

  const navigate = useNavigate()

  const [isEditingDesign, setIsEditingDesign] = useState(false)

  const isLoading = [queryDashboard, queryDashboardSection, querySchema, querySubmissions, queryWidgets].some(
    _ => _.isLoading,
  )

  const {setTitle} = useLayoutContext()
  const [newSectionName, setNewSectionName] = useState('')

  useEffectFn(queryDashboard.data, _ => setTitle(_.name))

  const activeTab = useActiveTab({workspaceId, dashboardId, sections: queryDashboardSection.data})

  return (
    <Page width="full" loading={isLoading} sx={{height: `calc(100% - ${t.vars.spacing})`}}>
      <Tabs variant="scrollable" scrollButtons="auto" value={activeTab}>
        {queryDashboardSection.data?.map(_ => (
          <Tab
            key={_.id}
            iconPosition="start"
            component={Link}
            {...({
              value: _.id,
              to: dashboardSectionRoute.fullPath,
              params: {sectionId: _.id},
            } as any)}
            label={_.title}
          />
        ))}
        <Core.Modal
          title={m._dashboard.newSection}
          loading={queryDashboardSectionCreate.isPending}
          confirmLabel={m.create}
          onConfirm={async (e, close) => {
            const newSection = await queryDashboardSectionCreate.mutateAsync({title: newSectionName})
            close()
            setNewSectionName('')
            navigate({
              to: '/$workspaceId/dashboard/$dashboardId/edit/s/$sectionId',
              params: {workspaceId, dashboardId, sectionId: newSection.id},
            })
          }}
          content={close => (
            <Core.Input
              sx={{mt: 1}}
              autoFocus
              value={newSectionName}
              onChange={_ => setNewSectionName(_.target.value)}
              label={m.name}
            />
          )}
        >
          <Core.Btn icon="add" sx={{ml: 0.5, my: 0.25, textTransform: 'capitalize'}}>
            {m.new}
          </Core.Btn>
        </Core.Modal>
        <Tab
          icon={<Icon>settings</Icon>}
          iconPosition="start"
          sx={{mr: 0.75, marginLeft: 'auto', minHeight: 34, py: 1, maxWidth: 50}} //,  }}
          component={Link}
          value="settings"
          to={dashboardSettingsRoute.fullPath}
          // label={m.settings}
        />
        <Core.IconBtn
          sx={{mr: 0.5}}
          onClick={() => setIsEditingDesign(_ => !_)}
          color={isEditingDesign ? 'primary' : undefined}
        >
          format_paint
        </Core.IconBtn>
        <PopoverShareLink url={dashboardUrl}>
          <Core.IconBtn
            tooltip={m.share}
            children="share"
            disabled={!dashboardUrl || !queryDashboard.data || !queryDashboard.data.isPublished}
            sx={{height: 36, alignSelf: 'center', mr: 1}}
          />
        </PopoverShareLink>
        <Core.Btn
          onClick={() =>
            queryDashboardPublish.mutateAsync().then(() => {
              toastSuccess(m._dashboard.successfullyPublished, {
                action: (
                  <Core.Btn href={dashboardUrl} icon="open_in_new" target="_blank">
                    {m.open}
                  </Core.Btn>
                ),
              })
            })
          }
          loading={queryDashboardPublish.isPending}
          variant="contained"
          icon="rocket_launch"
          sx={{boxShadow: 'none !important', height: 36, alignSelf: 'center', mr: 0.5}}
        >
          {m.publish}
        </Core.Btn>
      </Tabs>
      <Box sx={{display: 'flex'}}>
        {querySubmissions.data &&
          queryDashboardSection.data &&
          queryWidgets.data &&
          queryWidgets.data &&
          queryDashboard.data &&
          querySchema.data && (
            <DashboardProvider
              workspaceId={workspaceId}
              widgets={queryWidgets.data}
              schema={querySchema.data}
              submissions={querySubmissions.data.data}
              dashboard={queryDashboard.data}
              sections={queryDashboardSection.data}
            >
              <>
                <Outlet />
                <Collapse
                  sx={{height: '100%', position: 'sticky', top: t.vars.spacing}}
                  in={!!isEditingDesign}
                  orientation="horizontal"
                  mountOnEnter
                  unmountOnExit
                >
                  <Core.Panel sx={{width: 300, m: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0, mr: 0}}>
                    <DashboardTheme />
                  </Core.Panel>
                </Collapse>
              </>
            </DashboardProvider>
          )}
      </Box>
    </Page>
  )
}
