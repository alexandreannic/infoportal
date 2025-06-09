import {Page} from '@/shared'
import {useSession} from '@/core/Session/SessionContext'
import {WorkspaceCard} from '@/features/Home/WorkspaceCard'
import {Grid2} from '@mui/material'

export const Home = () => {
  const {session} = useSession()

  return (
    <Page>
      <Grid2 container spacing={2}>
        {session.workspaces?.map(_ => (
          <Grid2 key={_.slug} size={{xs: 6, sm: 4, md: 3}}>
            <WorkspaceCard workspace={_} />
          </Grid2>
        ))}
      </Grid2>
    </Page>
  )
}
