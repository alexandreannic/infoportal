import {IpBtn, Modal, Page, Txt} from '@/shared'
import {Panel, PanelBody} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import {ReactNode} from 'react'
import {Box, Switch, useTheme} from '@mui/material'
import {useFormContext} from '@/features/Form/Form'
import {useQueryForm, useQueryFormById} from '@/core/query/useQueryForm'
import {useNavigate} from 'react-router-dom'
import {appRouter} from '@/Router'
import {fnSwitch, match} from '@axanc/ts-utils'

const Row = ({label, desc, children}: {label: string; desc: string; children: ReactNode}) => {
  const t = useTheme()
  return (
    <Box
      display="flex"
      sx={{'&:not(:last-of-type)': {mb: 2, pb: 2, borderBottom: '1px solid', borderColor: t.palette.divider}}}
    >
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
  const queryForm = useQueryFormById({workspaceId, formId: form.id})
  const navigate = useNavigate()
  return (
    <Page width="xs">
      <Panel>
        <PanelBody>
          {(form.source === 'kobo' || form.source === 'disconnected') && (
            <Row label={m.connectedToKobo} desc={m.connectedToKoboDesc}>
              <Modal
                loading={queryForm.updateSource.isPending}
                title={match(form.source)
                  .cases({
                    kobo: m.disconnectToKobo,
                    disconnected: m.connectToKobo,
                  })
                  .exhaustive()}
                content={match(form.source)
                  .cases({
                    kobo: m.disconnectToKoboDesc,
                    disconnected: m.connectToKoboDesc,
                  })
                  .exhaustive()}
                onConfirm={async (e, close) => {
                  await queryForm.updateSource.mutateAsync({
                    source: form.source === 'kobo' ? 'disconnected' : 'kobo',
                  })
                  close()
                }}
              >
                <Switch checked={form.source === 'kobo'} disabled={queryForm.updateSource.isPending} />
              </Modal>
            </Row>
          )}
          <Row label={m.deleteThisProject} desc={m.deleteThisProjectDesc}>
            <Modal
              loading={queryForm.remove.isPending}
              title={m.deleteThisProject}
              content={form.name}
              onConfirm={async (e, close) => {
                await queryForm.remove.mutateAsync()
                close()
                navigate(appRouter.ws(workspaceId).form.list)
              }}
            >
              <IpBtn color="error" variant="outlined" icon="delete">
                {m.delete}
              </IpBtn>
            </Modal>
          </Row>
        </PanelBody>
      </Panel>
    </Page>
  )
}
