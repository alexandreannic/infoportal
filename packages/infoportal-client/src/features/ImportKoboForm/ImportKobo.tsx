import {IpIconBtn, Page, PageTitle} from '@/shared'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {useI18n} from '@/core/i18n'
import {Collapse, useTheme} from '@mui/material'
import {useEffect, useState} from 'react'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useAsync, useEffectFn, useFetcher} from '@axanc/react-hooks'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useDialogs} from '@toolpad/core'
import {KoboServerFormDialog} from '@/features/ImportKoboForm/KoboServerForm'
import {KoboServerCreate} from '@/core/sdk/server/kobo/KoboMapper'
import {UUID} from 'infoportal-common'
import {useIpToast} from '@/core/useToast'
import {SelectKoboForm} from '@/features/ImportKoboForm/SelectKoboForm'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {useWorkspaceRouter} from '@/core/context/WorkspaceContext'

export const ImportKobo = () => {
  const {m} = useI18n()
  const {workspaceId} = useWorkspaceRouter()
  const {api} = useAppSettings()
  const dialog = useDialogs()
  const {toastHttpError} = useIpToast()
  const [selectedServerId, setSelectedServerId] = useState<UUID>()
  const ctx = useDatabaseContext()

  const fetch = useFetcher(api.kobo.server.getAll)
  const asyncDelete = useAsync(api.kobo.server.delete)
  const asyncCreate = useAsync(async (payload: KoboServerCreate) => {
    const res = await api.kobo.server.create(payload)
    if (res) {
      fetch.set(prev => [...(prev ?? []), res])
    }
  })

  useEffect(() => {
    fetch.fetch({}, {workspaceId})
  }, [])

  useEffectFn(asyncDelete.error, toastHttpError)

  const handleOpen = () => {
    dialog.open(KoboServerFormDialog, {
      call: asyncCreate.call,
      loading: asyncCreate.loading,
      error: asyncCreate.error,
    })
  }

  const handleDelete = async (id: UUID) => {
    await asyncDelete.call({id, workspaceId})
    if (!asyncDelete.error) fetch.set(prev => (prev ?? []).filter(_ => _.id !== id))
  }

  return (
    <Page width="xs">
      <PageTitle>{m.importFromKobo}</PageTitle>
      <Panel>
        <PanelHead>{m.selectServer}</PanelHead>
        <PanelBody>
          <ScRadioGroup sx={{flex: 1, minWidth: 200}} dense onChange={setSelectedServerId}>
            {fetch.get?.map(_ => (
              <ScRadioGroupItem
                value={_.id}
                title={_.name}
                description={_.url}
                endContent={
                  <IpIconBtn
                    size="small"
                    loading={asyncDelete.loading}
                    onClick={e => {
                      e.stopPropagation()
                      handleDelete(_.id)
                    }}
                  >
                    delete
                  </IpIconBtn>
                }
              />
            ))}
            <ScRadioGroupItem value={null} title={m.addNewKoboAccount} onClick={handleOpen} icon="add" />
          </ScRadioGroup>
        </PanelBody>
      </Panel>
      <Collapse in={!!selectedServerId} mountOnEnter unmountOnExit>
        <SelectKoboForm
          serverId={selectedServerId!}
          onAdded={() => ctx._forms.fetch({force: true, clean: false}, {workspaceId})}
        />
      </Collapse>
    </Page>
  )
}
