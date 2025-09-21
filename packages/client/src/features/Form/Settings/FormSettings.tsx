import {useI18n} from '@infoportal/client-i18n'
import {UseQueryForm} from '@/core/query/useQueryForm'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {Core} from '@/shared'
import {TabContent} from '@/shared/Tab/TabContent.js'
import {Box, CircularProgress, Icon, Switch, useTheme} from '@mui/material'
import {createRoute, useNavigate} from '@tanstack/react-router'
import {ReactNode} from 'react'
import {assetStyle, Asset, AssetType} from '@/shared/Asset.js'
import {SelectFormCategory} from '@/shared/SelectFormCategory.js'
import {Ip} from 'infoportal-api-sdk'

export const formSettingsRoute = createRoute({
  getParentRoute: () => formRoute,
  path: 'settings',
  component: FormSettings,
})

const DialogKoboRow = ({icon, children, active}: {icon: string; children: string; active: boolean}) => {
  const t = useTheme()
  return (
    <Box sx={{display: 'flex', alignItems: 'center', '&:not(:last-of-type)': {mb: 2}}}>
      <Icon sx={{color: t.vars.palette.text.secondary, mr: 1, alignSelf: 'flex-start', mt: 0.5}}>{icon}</Icon>
      <Box
        flex={1}
        sx={{textDecoration: active ? 'line-through' : undefined}}
        dangerouslySetInnerHTML={{__html: children}}
      />
      <Box sx={{ml: 2}}>
        {active ? <Icon color="error" children="block" /> : <Icon color="success" children="check_circle" />}
      </Box>
    </Box>
  )
}

const Row = ({
  icon,
  label,
  desc,
  children,
}: {
  icon: string
  label: ReactNode
  desc?: ReactNode
  children: ReactNode
}) => {
  const t = useTheme()
  return (
    <Box
      display="flex"
      sx={{
        '&:not(:last-of-type) .FormSettings-Row-Body': {
          mb: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: t.vars.palette.divider,
        },
      }}
    >
      <Icon sx={{mt: 0.5, mr: 1.5, color: t.vars?.palette.text.secondary}}>{icon}</Icon>
      <Box flex={1} display="flex" alignItems="center" className="FormSettings-Row-Body">
        <Box flex={1}>
          <Core.Txt bold block>
            {label}
          </Core.Txt>
          {desc && (
            <Core.Txt block color="hint">
              {desc}
            </Core.Txt>
          )}
        </Box>
        <div>{children}</div>
      </Box>
    </Box>
  )
}

function FormSettings() {
  const {m} = useI18n()
  const {workspaceId, form} = useFormContext()
  const queryUpdate = UseQueryForm.update(workspaceId)
  const queryUpdateKoboConnexion = UseQueryForm.updateKoboConnexion(workspaceId)
  const queryRemove = UseQueryForm.remove(workspaceId)
  const navigate = useNavigate()

  const isConnectedToKobo = Ip.Form.isConnectedToKobo(form)

  return (
    <TabContent width="xs">
      <Core.Panel>
        <Core.PanelBody>
          <Row icon="category" label={m.category} desc={m._settings.setCategoryDesc}>
            <SelectFormCategory
              InputProps={{label: '', placeholder: '...'}}
              sx={{minWidth: 150}}
              workspaceId={workspaceId}
              loading={queryUpdate.isPending}
              value={form.category}
              onChange={(e, value) => {
                queryUpdate.mutateAsync({formId: form.id, category: value})
              }}
            />
          </Row>
          {Ip.Form.isKobo(form) && (
            <Row
              icon={assetStyle.icon[AssetType.kobo]}
              label={m._settings.connectedToKobo}
              desc={m._settings.connectedToKoboDesc}
            >
              {queryUpdateKoboConnexion.isPending && <CircularProgress size={24} />}
              <Core.Modal
                loading={queryUpdateKoboConnexion.isPending}
                title={isConnectedToKobo ? m._settings.disconnectToKobo : m._settings.reconnectToKobo}
                content={
                  <Box>
                    <DialogKoboRow icon="cloud_upload" children={m._settings.ipToKobo} active={isConnectedToKobo} />
                    <DialogKoboRow icon="cloud_download" children={m._settings.koboToIp} active={isConnectedToKobo} />
                    <Core.Alert severity="info" title={m._settings.koboDisconnectedNoteTitle}>
                      {m._settings.koboDisconnectedNoteDesc}
                    </Core.Alert>
                  </Box>
                }
                onConfirm={async (e, close) => {
                  await queryUpdateKoboConnexion.mutateAsync({formId: form.id, connected: !isConnectedToKobo})
                  close()
                }}
              >
                <Switch checked={isConnectedToKobo} disabled={queryUpdateKoboConnexion.isPending} />
              </Core.Modal>
            </Row>
          )}
          <Row
            icon="archive"
            label={m.archive}
            desc={
              <>
                {m.archiveFormDesc}{' '}
                {Ip.Form.isKobo(form) && <span style={{fontWeight: 'bold'}}>{m.archiveKoboFormDesc}</span>}
              </>
            }
          >
            <Core.Btn
              loading={queryUpdate.pendingIds.has(form.id)}
              icon={form.deploymentStatus === 'archived' ? 'unarchive' : 'archive'}
              variant="outlined"
              onClick={() => queryUpdate.mutateAsync({formId: form.id, archive: form.deploymentStatus !== 'archived'})}
            >
              {form.deploymentStatus === 'archived' ? m.unarchive : m.archive}
            </Core.Btn>
          </Row>
          <Row icon="delete" label={m.deleteThisProject} desc={m.deleteThisProjectDesc}>
            <Core.Modal
              loading={queryRemove.pendingIds.has(form.id)}
              title={m.deleteThisProject}
              content={form.name}
              onConfirm={async (e, close) => {
                await queryRemove.mutateAsync(form.id)
                close()
                navigate({to: '/$workspaceId/form/list', params: {workspaceId}})
              }}
            >
              <Core.Btn icon="delete" color="error" variant="outlined">
                {m.delete}
              </Core.Btn>
            </Core.Modal>
          </Row>
        </Core.PanelBody>
      </Core.Panel>
    </TabContent>
  )
}
