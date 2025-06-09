import {Modal, Page} from '@/shared'
import {useSession} from '@/core/Session/SessionContext'
import {WorkspaceCard, WorkspaceCardAdd} from '@/features/Workspace/WorkspaceCard'
import {Grid2} from '@mui/material'
import {WorkspaceCreate} from '@/features/Workspace/WorkspaceCreate'
import {useI18n} from '@/core/i18n'

export const Workspaces = () => {
  const {session} = useSession()
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
        {session?.workspaces?.map(_ => (
          <Grid2 key={_.slug} size={{xs: 6, sm: 4, md: 3}}>
            <WorkspaceCard workspace={_} />
          </Grid2>
        ))}
      </Grid2>
    </Page>
  )
}
