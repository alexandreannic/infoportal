import {Core, Page} from '@/shared'
import {useI18n} from '@/core/i18n'
import {ReactNode} from 'react'
import {Box, useTheme} from '@mui/material'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {useQueryFormById} from '@/core/query/useQueryForm'
import {createRoute, useNavigate} from '@tanstack/react-router'

export const formSettingsRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'settings',
  component: FormSettings,
})

const Row = ({label, desc, children}: {label: ReactNode; desc: ReactNode; children: ReactNode}) => {
  const t = useTheme()
  return (
    <Box
      display="flex"
      sx={{'&:not(:last-of-type)': {mb: 2, pb: 2, borderBottom: '1px solid', borderColor: t.vars.palette.divider}}}
    >
      <Box flex={1}>
        <Core.Txt bold block>
          {label}
        </Core.Txt>
        <Core.Txt block color="hint">
          {desc}
        </Core.Txt>
      </Box>
      <div>{children}</div>
    </Box>
  )
}

function FormSettings() {
  const {m} = useI18n()
  const {workspaceId, form, schema} = useFormContext()
  const queryForm = useQueryFormById({workspaceId, formId: form.id})
  const navigate = useNavigate()
  return (
    <Page width="xs">
      <Core.Panel>
        <Core.PanelBody>
          {form.kobo && (
            <Row label={m.connectedToKobo} desc={m.connectedToKoboDesc}>
              <Core.Modal
                loading={queryForm.update.isPending}
                title={m.disconnectToKobo}
                content={m.disconnectToKoboDesc}
                onConfirm={async (e, close) => {
                  await queryForm.disconnectFromKobo.mutateAsync()
                  close()
                }}
              >
                <Core.Btn disabled={queryForm.update.isPending}>{m.disconnect}</Core.Btn>
              </Core.Modal>
            </Row>
          )}
          <Row
            label={m.archive}
            desc={
              <>
                {m.archiveFormDesc} {form.kobo && <span style={{fontWeight: 'bold'}}>{m.archiveKoboFormDesc}</span>}
              </>
            }
          >
            <Core.Btn
              loading={queryForm.update.isPending}
              icon={form.deploymentStatus === 'archived' ? 'unarchive' : 'archive'}
              variant="outlined"
              onClick={() => queryForm.update.mutateAsync({archive: form.deploymentStatus !== 'archived'})}
            >
              {form.deploymentStatus === 'archived' ? m.unarchive : m.archive}
            </Core.Btn>
          </Row>
          <Row label={m.deleteThisProject} desc={m.deleteThisProjectDesc}>
            <Core.Modal
              loading={queryForm.remove.isPending}
              title={m.deleteThisProject}
              content={form.name}
              onConfirm={async (e, close) => {
                await queryForm.remove.mutateAsync()
                close()
                navigate({to: '/$workspaceId/form/list', params: {workspaceId}})
              }}
            >
              <Core.Btn color="error" variant="outlined" icon="delete">
                {m.delete}
              </Core.Btn>
            </Core.Modal>
          </Row>
        </Core.PanelBody>
      </Core.Panel>
    </Page>
  )
}
