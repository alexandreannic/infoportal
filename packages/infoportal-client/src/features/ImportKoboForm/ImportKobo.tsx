import {IpIconBtn, Page, PageTitle} from '@/shared'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {useI18n} from '@/core/i18n'
import {Collapse} from '@mui/material'
import {useState} from 'react'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useDialogs} from '@toolpad/core'
import {KoboServerFormDialog} from '@/features/ImportKoboForm/KoboServerForm'
import {UUID} from 'infoportal-common'
import {SelectKoboForm} from '@/features/ImportKoboForm/SelectKoboForm'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useQueryServers} from '@/core/query/useQueryServers'
import {FormSource} from '@prisma/client'
import {fnSwitch, Obj} from '@axanc/ts-utils'
import {CreateNewForm} from '@/features/ImportKoboForm/CreateNewForm'

export const ImportKobo = () => {
  const {m} = useI18n()
  const {workspaceId} = useWorkspaceRouter()
  const dialog = useDialogs()
  const [source, setSource] = useState<FormSource>('internal')
  const [selectedServerId, setSelectedServerId] = useState<UUID>()

  const queryServer = useQueryServers(workspaceId)

  const handleOpen = () => {
    dialog.open(KoboServerFormDialog, {workspaceId})
  }

  const handleDelete = async (id: UUID) => {
    queryServer.remove.mutate({id})
  }

  const icons = {
    [FormSource.kobo]: 'cloud_download',
    [FormSource.internal]: 'add',
  }

  return (
    <Page width="xs">
      <PageTitle>{m.newForm}</PageTitle>
      <Panel>
        <PanelHead>{m.source}</PanelHead>
        <PanelBody>
          <ScRadioGroup value={source} sx={{flex: 1, minWidth: 200}} dense onChange={setSource}>
            {new Obj(FormSource)
              .sortManual(['internal', 'kobo'])
              .keys()
              .map(_ => (
                <ScRadioGroupItem icon={icons[_]} value={_} title={m.formSource[_]} key={_} />
              ))}
          </ScRadioGroup>
        </PanelBody>
      </Panel>
      {source &&
        fnSwitch(source, {
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
          internal: <CreateNewForm workspaceId={workspaceId} />,
        })}
    </Page>
  )
}
