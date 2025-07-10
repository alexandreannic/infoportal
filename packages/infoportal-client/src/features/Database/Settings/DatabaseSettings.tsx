import {IpBtn, Modal, Page, Txt} from '@/shared'
import {Panel, PanelBody} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import {ReactNode} from 'react'
import {Box} from '@mui/material'
import {useFormContext} from '@/features/Database/Database'
import {useQueryForm} from '@/core/query/useQueryForm'
import {useNavigate} from 'react-router-dom'
import {appRouter} from '@/Router'

const Row = ({label, desc, children}: {label: string; desc: string; children: ReactNode}) => {
  return (
    <Box display="flex">
      <Box flex={1}>
        <Txt block fontSize="big">
          {label}
        </Txt>
        <Txt block color="hint">
          {desc}
        </Txt>
      </Box>
      <div>{children}</div>
    </Box>
  )
}

export const DatabaseSettings = () => {
  const {m} = useI18n()
  const {workspaceId, form, schema} = useFormContext()
  const queryRemove = useQueryForm(workspaceId).remove
  const navigate = useNavigate()
  return (
    <Page width="full">
      <Panel>
        <PanelBody sx={{maxWidth: 700, margin: 'auto'}}>
          <Row label={m.deleteThisProject} desc={m.deleteThisProjectDesc}>
            <Modal
              loading={queryRemove.isPending}
              title={m.deleteThisProject}
              content={form.name}
              onConfirm={async (e, close) => {
                await queryRemove.mutateAsync({formId: form.id})
                close()
                navigate(appRouter.ws(workspaceId).database.list)
              }}
            >
              <IpBtn color="error" variant="contained" icon="delete">
                {m.delete}
              </IpBtn>
            </Modal>
          </Row>
        </PanelBody>
      </Panel>
    </Page>
  )
}
