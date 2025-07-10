import {Alert, AlertTitle, Box, ButtonBase, ButtonBaseProps, Icon, useTheme} from '@mui/material'
import {Panel, PanelBody} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import React from 'react'
import {useQueryServer} from '@/core/query/useQueryServers'
import {Ip} from 'infoportal-api-sdk'
import {Txt} from '@/shared'

const Button = ({href, label, icon, sx, ...props}: {href: string; label: string; icon: string} & ButtonBaseProps) => {
  const t = useTheme()
  return (
    <ButtonBase
      sx={{
        minWidth: 200,
        border: '1px solid',
        borderColor: t.palette.divider,
        borderRadius: t.shape.borderRadius + 'px',
        p: 3,
        ...sx,
      }}
      component="a"
      target="_blank"
      href={href}
      {...props}
    >
      <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <Icon sx={{fontSize: 70}}>{icon}</Icon>
        <Box display="flex" alignItems="center" sx={{mt: 2}}>
          <Txt size="big">{label}</Txt>
          <Icon sx={{ml: 1}}>open_in_new</Icon>
        </Box>
      </Box>
    </ButtonBase>
  )
}
export const FormBuilderKoboFender = ({workspaceId, form}: {workspaceId: Ip.Uuid; form: Ip.Form}) => {
  const {m} = useI18n()
  const queryServer = useQueryServer({workspaceId, serverId: form.serverId!})

  return (
    <Panel loading={queryServer.isLoading}>
      {queryServer.data && (
        <PanelBody>
          <Alert color="info" sx={{mb: 2}}>
            <AlertTitle>
              {m.thisFormIsManagedByKobo}{' '}
              <a className="link" href={queryServer.data.url}>
                {queryServer.data.url}
              </a>
            </AlertTitle>
          </Alert>
          <Button
            sx={{mr: 2}}
            icon="assistant_on_hub"
            label={m.viewInKobo}
            href={queryServer.data.url + `/#/forms/${form.id}/landing`}
          />
          {form.enketoUrl && <Button icon="ballot" href={form.enketoUrl} label={m.fillForm} />}
        </PanelBody>
      )}
    </Panel>
  )
}
