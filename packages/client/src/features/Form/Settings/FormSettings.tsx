import {useI18n} from '@infoportal/client-i18n'
import {UseQueryForm} from '@/core/query/form/useQueryForm'
import {formRoute, useFormContext} from '@/features/Form/Form'
import {Core} from '@/shared'
import {TabContent} from '@/shared/Tab/TabContent.js'
import {Box, CircularProgress, Icon, Switch, useTheme} from '@mui/material'
import {createRoute, useNavigate} from '@tanstack/react-router'
import {ReactNode} from 'react'
import {assetStyle, Asset, AssetType} from '@/shared/Asset.js'
import {SelectFormCategory} from '@/shared/customInput/SelectFormCategory.js'
import {Ip} from '@infoportal/api-sdk'

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

export const SettingsRow = ({
  icon,
  label,
  desc,
  children,
  action,
}: {
  icon: string | ReactNode
  label: ReactNode
  desc?: ReactNode
  children?: ReactNode
  action?: ReactNode
}) => {
  const t = useTheme()
  return (
    <Box
      display="flex"
      sx={{
        '&:not(:last-of-type) .Settings-Row-Body': {
          mb: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: t.vars.palette.divider,
        },
      }}
    >
      <Box sx={{mt: 0.5, mr: 1.5}}>
        {typeof icon === 'string' ? <Icon sx={{color: t.vars?.palette.text.secondary}}>{icon}</Icon> : icon}
      </Box>
      <Box flex={1} className="Settings-Row-Body">
        <Box flex={1} display="flex" alignItems="flex-start">
          <Box flex={1} sx={{alignSelf: 'center'}}>
            <Core.Txt bold block>
              {label}
            </Core.Txt>
            {desc && (
              <Core.Txt block color="hint">
                {desc}
              </Core.Txt>
            )}
          </Box>
          <div>{action}</div>
        </Box>
        {children}
      </Box>
    </Box>
  )
}

function FormSettings() {
  const {m} = useI18n()
  const form = useFormContext(_ => _.form)
  const workspaceId = useFormContext(_ => _.workspaceId)
  const queryUpdate = UseQueryForm.update(workspaceId)
  const queryUpdateKoboConnexion = UseQueryForm.updateKoboConnexion(workspaceId)
  const queryRemove = UseQueryForm.remove(workspaceId)
  const navigate = useNavigate()

  const isConnectedToKobo = Ip.Form.isConnectedToKobo(form)

  return (
    <TabContent width="xs">
      <Core.Panel>
        <Core.PanelBody>
          <SettingsRow
            icon="folder"
            label={m.folder}
            desc={m._settings.setCategoryDesc}
            action={
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
            }
          />

          {Ip.Form.isKobo(form) && (
            <SettingsRow
              icon={assetStyle.icon[AssetType.kobo]}
              label={m._settings.connectedToKobo}
              desc={m._settings.connectedToKoboDesc}
              action={
                <>
                  {queryUpdateKoboConnexion.isPending && <CircularProgress size={24} />}
                  <Core.Modal
                    loading={queryUpdateKoboConnexion.isPending}
                    title={isConnectedToKobo ? m._settings.disconnectToKobo : m._settings.reconnectToKobo}
                    content={
                      <Box>
                        <DialogKoboRow icon="cloud_upload" children={m._settings.ipToKobo} active={isConnectedToKobo} />
                        <DialogKoboRow
                          icon="cloud_download"
                          children={m._settings.koboToIp}
                          active={isConnectedToKobo}
                        />
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
                </>
              }
            />
          )}
          <SettingsRow
            icon="archive"
            label={m.archive}
            desc={
              <>
                {m.archiveFormDesc}{' '}
                {Ip.Form.isKobo(form) && <span style={{fontWeight: 'bold'}}>{m.archiveKoboFormDesc}</span>}
              </>
            }
            action={
              <Core.Btn
                loading={queryUpdate.pendingIds.has(form.id)}
                icon={form.deploymentStatus === 'archived' ? 'unarchive' : 'archive'}
                variant="outlined"
                onClick={() =>
                  queryUpdate.mutateAsync({formId: form.id, archive: form.deploymentStatus !== 'archived'})
                }
              >
                {form.deploymentStatus === 'archived' ? m.unarchive : m.archive}
              </Core.Btn>
            }
          />
          <SettingsRow
            icon="delete"
            label={m.deleteThisProject}
            desc={m.deleteThisProjectDesc}
            action={
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
            }
          />
        </Core.PanelBody>
      </Core.Panel>
    </TabContent>
  )
}
