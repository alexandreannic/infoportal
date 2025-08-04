import {Modal, Page} from '@/shared'
import {WorkspaceCard, WorkspaceCardAdd, WorkspaceCardInvitation} from '@/features/Workspace/WorkspaceCard'
import {Grid, Skeleton} from '@mui/material'
import {WorkspaceCreate} from '@/features/Workspace/WorkspaceCreate'
import {useI18n} from '@/core/i18n'
import {useQueryWorkspace} from '@/core/query/useQueryWorkspace'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {Layout} from '@/shared/Layout/Layout'
import {AppHeader} from '@/core/layout/AppHeader'
import {createRoute} from '@tanstack/react-router'
import {rootRoute} from '@/Router'
import {AnimateList} from '@/shared/AnimatedList.js'
import {useQueryWorkspaceInvitation} from '@/core/query/useQueryWorkspaceInvitation.js'
import {Column, DataTable2} from '@/shared/Datatable2/DataTable2.js'

export const workspacesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Workspaces,
})

function Workspaces() {
  const queryWorkspace = useQueryWorkspace.get()
  const queryInvitations = useQueryWorkspaceInvitation.getMine()
  const {m} = useI18n()

  // const exampleData = Array.from({length: 1000}, (_, i) => ({
  //   id: '' + i,
  //   name: `Item ${i}`,
  //   value: Math.floor(Math.random() * 1000),
  // }))

  // return (
  //   <DataTable2
  //     rowKey={_ => _.id + ''}
  //     data={exampleData}
  //     columns={[
  //       {
  //         id: 'id',
  //         type: 'id',
  //         head: 'ID',
  //         render: _ => {
  //           return {
  //             value: _.id,
  //             label: 'l' + _.id,
  //           }
  //         },
  //         // renderQuick: row => row.id,
  //       },
  //       {
  //         id: 'name',
  //         head: 'Name',
  //         renderQuick: row => row.name,
  //       },
  //       {
  //         id: 'value',
  //         head: 'Value',
  //         renderQuick: row => row.value,
  //       },
  //     ]}
  //   />
  // )

  const loading = queryInvitations.isLoading || queryWorkspace.isLoading
  return (
    <ProtectRoute>
      <Layout header={<AppHeader />}>
        <Page>
          <Grid container spacing={2} sx={{mt: 1}}>
            <AnimateList delay={50}>
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
            </AnimateList>
          </Grid>
        </Page>
      </Layout>
    </ProtectRoute>
  )
}
