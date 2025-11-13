import {Alert, AlertTitle, Box, ButtonBase, ButtonBaseProps, Icon, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import React from 'react'
import {useQueryServer} from '@/core/query/useQueryServers'
import {Ip} from '@infoportal/api-sdk'
import {Core} from '@/shared'

const Button = ({href, label, icon, sx, ...props}: {href: string; label: string; icon: string} & ButtonBaseProps) => {
  const t = useTheme()
  return (
    <ButtonBase
      sx={{
        minWidth: 200,
        border: '1px solid',
        borderColor: t.vars.palette.divider,
        borderRadius: t.vars.shape.borderRadius,
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
          <Core.Txt size="big">{label}</Core.Txt>
          <Icon sx={{ml: 1}}>open_in_new</Icon>
        </Box>
      </Box>
    </ButtonBase>
  )
}
export const FormBuilderKoboFender = ({workspaceId, form}: {workspaceId: Ip.WorkspaceId; form: Ip.Form}) => {
  const {m} = useI18n()
  const queryServer = useQueryServer({workspaceId, serverId: form.kobo!.accountId!}).get

  return (
    <Core.Panel loading={queryServer.isLoading}>
      {queryServer.data && (
        <Core.PanelBody>
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
            href={queryServer.data.url + `/#/forms/${form.kobo!.koboId}/landing`}
          />
          {form.kobo?.enketoUrl && <Button icon="ballot" href={form.kobo?.enketoUrl} label={m.fillForm} />}
        </Core.PanelBody>
      )}
    </Core.Panel>
  )
}
