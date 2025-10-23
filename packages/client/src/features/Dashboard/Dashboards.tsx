import {Core, Page} from '@/shared'
import {Grid, Skeleton} from '@mui/material'
import {CardAdd} from '@/shared/CardAdd'
import {useI18n} from '@infoportal/client-i18n'
import {createRoute} from '@tanstack/react-router'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {appConfig} from '@/conf/AppConfig'
import {DashboardCreate} from '@/features/Dashboard/DashboardCreate'
import {Ip} from 'infoportal-api-sdk'
import {UseQueryDashboard} from '@/core/query/dashboard/useQueryDashboard'
import {DashboardCard} from '@/features/Dashboard/DashboardCard'
import {GridProps} from '@mui/system'
import {UseQueryWorkspace} from '@/core/query/useQueryWorkspace'
import {map} from '@axanc/ts-utils'
import {useEffect, useState} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import html2canvas from 'html2canvas'

export const dashboardsRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'dashboard',
  component: Dashboards,
})

const gridSize: GridProps['size'] = {xs: 6, sm: 6, md: 4, lg: 3}

export function Dashboards() {
  const {conf} = useAppSettings()
  const {m} = useI18n()
  const params = dashboardsRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const queryWorkspace = UseQueryWorkspace.getById(workspaceId)
  const queryDashboards = UseQueryDashboard.getAll({workspaceId})
  const [urls, setUrls] = useState<Record<Ip.DashboardId, string>>({})
  // useEffect(() => {
  //   if (queryDashboards.data && queryWorkspace.data)
  //     buildDashboardScreenshot({
  //       baseUrl: conf.baseURL,
  //       workspace: queryWorkspace.data,
  //       dashboards: queryDashboards.data,
  //     }).then(urls => {
  //       setUrls(urls)
  //     })
  // }, [queryWorkspace.data, queryDashboards.data])

  return (
    <Page width="md">
      <Grid container spacing={2} sx={{mt: 1}}>
        <Core.AnimateList delay={50}>
          <Grid size={gridSize}>
            <Core.Modal
              title={m.createDashboard}
              overrideActions={null}
              content={close => <DashboardCreate workspaceId={workspaceId} onClose={close} />}
            >
              <CardAdd icon={appConfig.icons.dashboard} title={m.createDashboard} />
            </Core.Modal>
          </Grid>
          {queryDashboards.data &&
            queryDashboards.data.map(_ => (
              <Grid size={gridSize} key={_.id}>
                <DashboardCard dashboard={_} workspaceId={workspaceId} img={urls[_.id]} />
              </Grid>
            )
          )}
          {queryDashboards.isLoading && (
            <Grid size={gridSize}>
              <Skeleton
                variant="rectangular"
                sx={theme => ({
                  height: '100%',
                  borderRadius: theme.vars.shape.borderRadius,
                })}
              />
            </Grid>
          )}
        </Core.AnimateList>
      </Grid>
    </Page>
  )
}

export async function screenshotMany(
  items: {url: string; id: Ip.DashboardId}[],
): Promise<Record<Ip.DashboardId, string>> {
  const results: Record<Ip.DashboardId, string> = {}

  for (const item of items) {
    const iframe = document.createElement('iframe')
    iframe.src = item.url
    // iframe.style.position = 'absolute'
    // iframe.style.left = '-9999px'
    document.body.appendChild(iframe)

    await new Promise<void>(resolve => {
      iframe.onload = async () => {
        await iframe.contentDocument!.fonts.ready
        const canvas = await html2canvas(iframe.contentDocument!.body, {
          useCORS: true,
          allowTaint: true,
        })
        const dataUrl = canvas.toDataURL('image/png')
        results[item.id] = dataUrl
        iframe.remove()
        resolve()
      }
    })
  }

  return results
}

// async function screenshotMany(items: {url: string; fileName: string}[]) {
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()
//
//   for (let i = 0; i < items.length; i++) {
//     const item = items[i]
//     await page.goto(item.url, {waitUntil: 'networkidle0'})
//
//     await page.screenshot({
//       path: `${item.fileName}.png`,
//       clip: {x: 0, y: 0, width: 800, height: 400},
//     })
//   }
//   await browser.close()
// }

async function buildDashboardScreenshot({
  baseUrl,
  workspace,
  dashboards,
}: {
  workspace: Ip.Workspace
  baseUrl: string
  dashboards: Ip.Dashboard[]
}) {
  return screenshotMany(
    dashboards.map(dashboard => {
      return {
        url: new URL(Ip.Dashboard.buildPath(workspace, dashboard), baseUrl).toString(),
        id: dashboard.id,
      }
    }),
  )
}
