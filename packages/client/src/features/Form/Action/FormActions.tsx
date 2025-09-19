import {createRoute, Link, Outlet, useMatches} from '@tanstack/react-router'
import {Core} from '@/shared/index.js'
import {Box, Icon, Skeleton, Tab, Tabs, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import {UseQueryFromAction} from '@/core/query/useQueryFromAction.js'
import {Ip} from 'infoportal-api-sdk'
import {formRoute} from '@/features/Form/Form.js'
import {TabContent} from '@/shared/Tab/TabContent.js'
import {mapFor} from '@axanc/ts-utils'
import {FormActionRow} from '@/features/Form/Action/FormActionRow.js'
import {formActionReportsRoute} from '@/features/Form/Action/FormActionReports.js'
import {formActionLogsRoute} from '@/features/Form/Action/FormActionLogs.js'
import {FormActionCreateBtn} from '@/features/Form/Action/FormActionCreateBtn.js'

export const formActionsRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'action',
  component: FormActions,
})

export function FormActions() {
  const {m} = useI18n()
  const t = useTheme()
  const params = formActionsRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const formId = params.formId as Ip.FormId
  const queryActionGet = UseQueryFromAction.getByDbId(workspaceId, formId)
  const currentFullPath = useMatches().slice(-1)[0].fullPath

  return (
    <TabContent
      width="full"
      sx={{
        gap: t.vars.spacing,
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gridTemplateRows: '1fr',
        flex: '1 1 auto',
        minHeight: 0,
      }}
    >
      <Core.Panel
        sx={{
          p: 1,
          gridColumn: 1,
          gridRow: '1',
          overflowY: 'scroll',
        }}
      >
        <Tabs
          value={currentFullPath}
          sx={{
            p: 0,
            border: `1px solid ${t.vars.palette.divider} !important`,
            borderRadius: t.vars.shape.borderRadius,
            mb: 1,
          }}
        >
          <Tab
            sx={{flex: 1}}
            component={Link}
            value={formActionReportsRoute.fullPath}
            to={formActionReportsRoute.fullPath}
            icon={<Icon children="terminal" />}
            label={m._formAction.executionsHistory}
          />
          <Tab
            sx={{flex: 1, mr: 0.5}}
            component={Link}
            value={formActionLogsRoute.fullPath}
            to={formActionLogsRoute.fullPath}
            icon={<Icon children="overview" />}
            label={m.logs}
          />
        </Tabs>
        <FormActionCreateBtn workspaceId={workspaceId} formId={formId} />
        {queryActionGet.isLoading && mapFor(3, i => <Skeleton key={i} height={50} sx={{transform: 'none', mb: 1}} />)}
        {queryActionGet.data?.map(_ => (
          <FormActionRow workspaceId={workspaceId} action={_} key={_.id} />
        ))}
      </Core.Panel>
      <Box
        sx={{
          minWidth: 0,
          minHeight: 0,
          gridColumn: 2,
          gridRow: '1',
          mb: 1,
        }}
      >
        <Outlet />
      </Box>
    </TabContent>
  )
}
