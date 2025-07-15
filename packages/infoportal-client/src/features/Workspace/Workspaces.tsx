import {Modal, Page} from '@/shared'
import {WorkspaceCard, WorkspaceCardAdd} from '@/features/Workspace/WorkspaceCard'
import {Grid, Skeleton} from '@mui/material'
import {WorkspaceCreate} from '@/features/Workspace/WorkspaceCreate'
import {useI18n} from '@/core/i18n'
import {useQueryWorkspace} from '@/core/query/useQueryWorkspace'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {Layout} from '@/shared/Layout/Layout'
import {AppHeader} from '@/core/layout/AppHeader'

export const Workspaces = () => {
  const queryWorkspace = useQueryWorkspace()
  const {m} = useI18n()
  return (
    <ProtectRoute>
      <Layout header={<AppHeader />}>
        <Page>
          <Grid container spacing={2}>
            <Grid size={{xs: 6, sm: 4, md: 3}}>
              <Modal
                title={m.createWorkspace}
                maxWidth="xs"
                onClose={null}
                content={close => <WorkspaceCreate onClose={close} />}
              >
                <WorkspaceCardAdd />
              </Modal>
            </Grid>
            {queryWorkspace.get.isLoading && (
              <Grid size={{xs: 6, sm: 4, md: 3}}>
                <Skeleton
                  variant="rectangular"
                  sx={theme => ({
                    height: '100%',
                    borderRadius: theme.shape.borderRadius + 'px',
                  })}
                />
              </Grid>
            )}
            {queryWorkspace.get.data?.map(_ => (
              <Grid key={_.slug} size={{xs: 6, sm: 4, md: 3}}>
                <WorkspaceCard workspace={_} />
              </Grid>
            ))}
          </Grid>
        </Page>
      </Layout>
    </ProtectRoute>
  )
}
