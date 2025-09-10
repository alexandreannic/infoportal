import {Core, Page} from '@/shared'
import {useI18n} from '@/core/i18n'
import {Box, Collapse, Icon} from '@mui/material'
import {useEffect, useState} from 'react'
import {useDialogs} from '@toolpad/core'
import {KoboServerFormDialog} from '@/features/NewForm/KoboServerForm'
import {SelectKoboForm} from '@/features/NewForm/SelectKoboForm'
import {useQueryServers} from '@/core/query/useQueryServers'
import {Obj} from '@axanc/ts-utils'
import {NewFormCreateInternal} from '@/features/NewForm/NewFormCreateInternal'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {createRoute, useNavigate} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'
import {useQueryForm} from '@/core/query/useQueryForm'
import {Asset} from '@/shared/Asset.js'

export const newFormRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'new-form',
  component: NewForm,
})

const OptionBody = ({icon, color, label}: {color: string; icon: string; label: string}) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Icon sx={{fontSize: 50, color}}>{icon}</Icon>
      {label}
    </Box>
  )
}

function NewForm() {
  const {m} = useI18n()
  const {workspaceId} = newFormRoute.useParams() as {workspaceId: Ip.WorkspaceId}
  const {setTitle} = useLayoutContext()
  const dialog = useDialogs()
  const navigate = useNavigate()

  const [type, setType] = useState<Ip.Form.Type>()
  const [selectedServerId, setSelectedServerId] = useState<Ip.ServerId>()

  const queryForm = useQueryForm(workspaceId)
  const queryServer = useQueryServers(workspaceId)

  const handleOpen = () => {
    dialog.open(KoboServerFormDialog, {workspaceId})
  }
  useEffect(() => {
    setTitle(m.newForm)
    return () => setTitle('')
  }, [])

  return (
    <Page width="xs">
      <Core.Panel>
        <Core.PanelHead>{m.source}</Core.PanelHead>
        <Core.PanelBody>
          <Core.RadioGroup value={type} sx={{flex: 1}} inline onChange={setType}>
            {Obj.keys(Ip.Form.Type).map(asset => (
              <Core.RadioGroupItem
                key={asset}
                hideRadio
                value={asset}
                title={<OptionBody color={Asset.color[asset]} icon={Asset.icon[asset]} label={m.formSource[asset]} />}
                sx={{flex: 1}}
              />
            ))}
          </Core.RadioGroup>
        </Core.PanelBody>
      </Core.Panel>
      {type &&
        (() => {
          switch (type) {
            case 'internal':
            case 'smart': {
              return (
                <NewFormCreateInternal
                  workspaceId={workspaceId}
                  loading={queryForm.create.isPending}
                  btnLabel={m.create + ' ' + m.formSource[type].toLowerCase()}
                  onSubmit={async form => {
                    const newForm = await queryForm.create.mutateAsync({...form, type})
                    navigate({to: '/$workspaceId/form/$formId', params: {workspaceId, formId: newForm.id}})
                  }}
                />
              )
            }
            case 'kobo': {
              return (
                <>
                  <Core.Panel>
                    <Core.PanelHead>{m.selectAccount}</Core.PanelHead>
                    <Core.PanelBody>
                      <Core.RadioGroup sx={{flex: 1, minWidth: 200}} dense onChange={setSelectedServerId}>
                        {queryServer.getAll.data?.map(_ => (
                          <Core.RadioGroupItem
                            key={_.id}
                            value={_.id}
                            title={_.name}
                            description={_.url}
                            // endContent={
                            //   <Core.IconBtn
                            //     size="small"
                            //     loading={queryServer.remove.isPending}
                            //     onClick={e => {
                            //       e.stopPropagation()
                            //       handleDelete(_.id)
                            //     }}
                            //   >
                            //     delete
                            //   </Core.IconBtn>
                            // }
                          />
                        ))}
                        <Core.RadioGroupItem value={null} title={m.addNewKoboAccount} onClick={handleOpen} icon="add" />
                      </Core.RadioGroup>
                    </Core.PanelBody>
                  </Core.Panel>
                  <Collapse in={!!selectedServerId} mountOnEnter unmountOnExit>
                    <SelectKoboForm
                      workspaceId={workspaceId}
                      serverId={selectedServerId!}
                      onAdded={() => queryServer.getAll.refetch()}
                    />
                  </Collapse>
                </>
              )
            }
          }
        })()}
    </Page>
  )
}
