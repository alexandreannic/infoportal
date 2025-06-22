import {Modal, Page} from '@/shared'
import {WorkspaceCard, WorkspaceCardAdd} from '@/features/Workspace/WorkspaceCard'
import {Grid2, Skeleton} from '@mui/material'
import {WorkspaceCreate} from '@/features/Workspace/WorkspaceCreate'
import {useI18n} from '@/core/i18n'
import {useQueryWorkspace} from '@/core/query/useQueryWorkspace'

export const Workspaces = () => {
  const queryWorkspace = useQueryWorkspace()
  const {m} = useI18n()
  return (
    <Page>
      <Grid2 container spacing={2}>
        <Grid2 size={{xs: 6, sm: 4, md: 3}}>
          <Modal
            title={m.createWorkspace}
            maxWidth="xs"
            onClose={null}
            content={close => <WorkspaceCreate onClose={close} />}
          >
            <WorkspaceCardAdd />
          </Modal>
        </Grid2>
        {queryWorkspace.get.isLoading && (
          <Grid2 size={{xs: 6, sm: 4, md: 3}}>
            <Skeleton
              variant="rectangular"
              sx={theme => ({
                height: '100%',
                borderRadius: theme.shape.borderRadius + 'px',
              })}
            />
          </Grid2>
        )}
        {queryWorkspace.get.data?.map(_ => (
          <Grid2 key={_.slug} size={{xs: 6, sm: 4, md: 3}}>
            <WorkspaceCard workspace={_} />
          </Grid2>
        ))}
      </Grid2>
    </Page>
  )
}
