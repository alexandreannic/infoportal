import {Alert, AlertTitle} from '@mui/material'
import {Panel, PanelBody} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import React from 'react'
import {useQueryServer} from '@/core/query/useQueryServers'
import {Ip} from 'infoportal-api-sdk'
import {IpBtn} from '@/shared'

export const FormCreatorKoboFender = ({workspaceId, form}: {workspaceId: Ip.Uuid; form: Ip.Form}) => {
  const {m} = useI18n()
  const queryServer = useQueryServer({workspaceId, serverId: form.serverId})

  return (
    <Panel loading={queryServer.isLoading}>
      {queryServer.data && (
        <PanelBody>
          <Alert color="info">
            <AlertTitle>{m.thisFormIsManagedByKobo}</AlertTitle>
            <IpBtn
              sx={{mb: .5, mt: 1}}
              icon="open_in_new"
              component="a"
              target="_blank"
              href={queryServer.data.url + `/#/forms/${form.id}/landing`}
            >
              {m.viewInKobo}
            </IpBtn>
            <br/>
            <IpBtn icon="open_in_new" component="a" target="_blank" href={form.enketoUrl}>
              {m.fillForm}
            </IpBtn>
          </Alert>
        </PanelBody>
      )}
    </Panel>
  )
}
