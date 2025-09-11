import {Core, Page} from '@/shared'
import {WorkspaceCard, WorkspaceCardAdd, WorkspaceCardInvitation} from '@/features/Workspace/WorkspaceCard'
import {Grid, Skeleton} from '@mui/material'
import {WorkspaceCreate} from '@/features/Workspace/WorkspaceCreate'
import {useI18n} from '@/core/i18n'
import {UseQueryWorkspace} from '@/core/query/useQueryWorkspace'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {Layout} from '@/shared/Layout/Layout'
import {AppHeader} from '@/core/layout/AppHeader'
import {createRoute} from '@tanstack/react-router'
import {rootRoute} from '@/Router'
import {UseQueryWorkspaceInvitation} from '@/core/query/useQueryWorkspaceInvitation.js'

export const workspacesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Workspaces,
})

function Workspaces() {
  const queryWorkspace = UseQueryWorkspace.get()
  const queryInvitations = UseQueryWorkspaceInvitation.getMine()
  const {m} = useI18n()
  const loading = queryInvitations.isLoading || queryWorkspace.isLoading
  return (
    <ProtectRoute>
      <Layout header={<AppHeader />}>
        <Page>
          <Grid container spacing={2} sx={{mt: 1}}>
            <Core.AnimateList delay={50}>
              <Grid size={{xs: 6, sm: 4, md: 3}}>
                <Core.Modal
                  title={m.createWorkspace}
                  maxWidth="xs"
                  onClose={null}
                  content={close => <WorkspaceCreate onClose={close} />}
                >
                  <WorkspaceCardAdd />
                </Core.Modal>
              </Grid>
              {queryInvitations.data?.map(_ => (
                <Grid size={{xs: 6, sm: 4, md: 3}} key={_.id}>
                  <WorkspaceCardInvitation invitation={_} />
                </Grid>
              ))}
              {queryWorkspace.data?.map(_ => (
                <Grid key={_.slug} size={{xs: 6, sm: 4, md: 3}}>
                  <WorkspaceCard workspace={_} />
                </Grid>
              ))}
              {loading && (
                <Grid size={{xs: 6, sm: 4, md: 3}}>
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
      </Layout>
    </ProtectRoute>
  )
}
