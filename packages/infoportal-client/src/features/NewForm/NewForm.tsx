import {Page} from '@/shared'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {useI18n} from '@/core/i18n'
import {Collapse} from '@mui/material'
import {useEffect, useState} from 'react'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useDialogs} from '@toolpad/core'
import {KoboServerFormDialog} from '@/features/NewForm/KoboServerForm'
import {UUID} from 'infoportal-common'
import {SelectKoboForm} from '@/features/NewForm/SelectKoboForm'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useQueryServers} from '@/core/query/useQueryServers'
import {fnSwitch} from '@axanc/ts-utils'
import {NewFormCreateInternal} from '@/features/NewForm/NewFormCreateInternal'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'

enum FormSource {
  kobo = 'kobo',
  internal = 'internal',
}

export const NewForm = () => {
  const {m} = useI18n()
  const {workspaceId} = useWorkspaceRouter()
  const dialog = useDialogs()
  const [source, setSource] = useState<FormSource>(FormSource.internal)
  const [selectedServerId, setSelectedServerId] = useState<UUID>()
  const {setTitle} = useLayoutContext()

  const queryServer = useQueryServers(workspaceId)

  const handleOpen = () => {
    dialog.open(KoboServerFormDialog, {workspaceId})
  }

  const icons = {
    [FormSource.kobo]: 'cloud_download',
    [FormSource.internal]: 'add',
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
                  <SelectKoboForm serverId={selectedServerId!} onAdded={() => queryServer.getAll.refetch()} />
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
