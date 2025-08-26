import {Page} from '@/shared'
import {ScRadioGroup, ScRadioGroupItem} from '../../../../infoportal-client-core/src/RadioGroup'
import {useI18n} from '@/core/i18n'
import {Collapse} from '@mui/material'
import {useEffect, useState} from 'react'
import {Panel, PanelBody, PanelHead} from '../../../../infoportal-client-core/src/Panel'
import {useDialogs} from '@toolpad/core'
import {KoboServerFormDialog} from '@/features/NewForm/KoboServerForm'
import {SelectKoboForm} from '@/features/NewForm/SelectKoboForm'
import {useQueryServers} from '@/core/query/useQueryServers'
import {fnSwitch} from '@axanc/ts-utils'
import {NewFormCreateInternal} from '@/features/NewForm/NewFormCreateInternal'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {createRoute} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'

export const newFormRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'new-form',
  component: NewForm,
})

function NewForm() {
  const {m} = useI18n()
  const {workspaceId} = newFormRoute.useParams() as {workspaceId: Ip.WorkspaceId}
  const dialog = useDialogs()
  const [source, setSource] = useState<Ip.Form.Source>(Ip.Form.Source.internal)
  const [selectedServerId, setSelectedServerId] = useState<Ip.ServerId>()
  const {setTitle} = useLayoutContext()

  const queryServer = useQueryServers(workspaceId)

  const handleOpen = () => {
    dialog.open(KoboServerFormDialog, {workspaceId})
  }

  const icons = {
    [Ip.Form.Source.kobo]: 'cloud_download',
    [Ip.Form.Source.internal]: 'add',
  }

  useEffect(() => {
    setTitle(m.newForm)
    return () => setTitle('')
  }, [])

  return (
    <Page width="xs">
      <Panel>
        <PanelHead>{m.source}</PanelHead>
        <PanelBody>
          <ScRadioGroup value={source} sx={{flex: 1, minWidth: 200}} dense onChange={setSource}>
            <ScRadioGroupItem icon={icons['kobo']} value="kobo" title={m.formSource['kobo']} />
            <ScRadioGroupItem icon={icons['internal']} value="internal" title={m.formSource['internal']} />
          </ScRadioGroup>
        </PanelBody>
      </Panel>
      {source &&
        fnSwitch(
          source,
          {
            kobo: (
              <>
                <Panel>
                  <PanelHead>{m.selectAccount}</PanelHead>
                  <PanelBody>
                    <ScRadioGroup sx={{flex: 1, minWidth: 200}} dense onChange={setSelectedServerId}>
                      {queryServer.getAll.data?.map(_ => (
                        <ScRadioGroupItem
                          key={_.id}
                          value={_.id}
                          title={_.name}
                          description={_.url}
                          // endContent={
                          //   <IpIconBtn
                          //     size="small"
                          //     loading={queryServer.remove.isPending}
                          //     onClick={e => {
                          //       e.stopPropagation()
                          //       handleDelete(_.id)
                          //     }}
                          //   >
                          //     delete
                          //   </IpIconBtn>
                          // }
                        />
                      ))}
                      <ScRadioGroupItem value={null} title={m.addNewKoboAccount} onClick={handleOpen} icon="add" />
                    </ScRadioGroup>
                  </PanelBody>
                </Panel>
                <Collapse in={!!selectedServerId} mountOnEnter unmountOnExit>
                  <SelectKoboForm
                    workspaceId={workspaceId}
                    serverId={selectedServerId!}
                    onAdded={() => queryServer.getAll.refetch()}
                  />
                </Collapse>
              </>
            ),
            internal: <NewFormCreateInternal workspaceId={workspaceId} />,
          },
          () => <></>,
        )}
    </Page>
  )
}
