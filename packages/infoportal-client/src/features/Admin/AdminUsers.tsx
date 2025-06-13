import {useAppSettings} from '@/core/context/ConfigContext'
import {useWorkspaceRouter} from '@/core/context/WorkspaceContext'
import {useI18n} from '@/core/i18n'
import {useSession} from '@/core/Session/SessionContext'
import {IpBtn, Modal} from '@/shared'
import {AppAvatar} from '@/shared/AppAvatar'
import {Datatable} from '@/shared/Datatable/Datatable'
import {useFetcher} from '@/shared/hook/useFetcher'
import {IpIconBtn} from '@/shared/IconBtn'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {TableIcon} from '@/shared/TableIcon'
import {Txt} from '@/shared/Txt'
import {seq} from '@axanc/ts-utils'
import {useEffect, useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {AddUserForm} from './AddUserForm'
import {useAsync} from '@/shared/hook/useAsync'
import {useIpToast} from '@/core/useToast'

export const AdminUsers = () => {
  const {api, conf} = useAppSettings()
  const {workspaceId} = useWorkspaceRouter()
  const {toastHttpError} = useIpToast()
  const {session, setSession} = useSession()
  const _connectAs = useFetcher(api.session.connectAs)
  const _users = useFetcher(api.user.search)
  const {m, formatDate, formatDateTime} = useI18n()
  const navigate = useNavigate()
  const asyncCreateAccess = useAsync(api.workspaceAccess.create)

  useEffect(() => asyncCreateAccess.error && toastHttpError(asyncCreateAccess.error), [asyncCreateAccess.error])

  useEffect(() => {
    _users.fetch({clean: false}, {workspaceId})
  }, [workspaceId])

  const connectAs = async (email: string) => {
    const session = await _connectAs.fetch({force: true, clean: true}, email)
    await navigate('/')
    setSession(session)
  }

  const filteredData = _users.get

  const emailsLists = useMemo(() => _users.get?.map(_ => _.email), [_users.get])

  return (
    <Page width="full">
      <Panel>
        <Datatable
          loading={_users.loading}
          id="users"
          showExportBtn
          defaultLimit={100}
          data={filteredData}
          header={
            <Modal
              onClose={null}
              title={m.addUser}
              content={close => (
                <AddUserForm
                  existingEmails={emailsLists}
                  loading={asyncCreateAccess.loading}
                  onClose={close}
                  onSubmit={_ =>
                    asyncCreateAccess
                      .call({..._, workspaceId})
                      .then(() => _users.fetch({force: true, clean: false}, {workspaceId}))
                  }
                />
              )}
            >
              <IpBtn icon="person_add" variant="contained">
                {m.addUser}
              </IpBtn>
            </Modal>
          }
          columns={[
            {
              width: 0,
              id: 'avatar',
              head: '',
              renderQuick: _ => <AppAvatar size={24} email={_.email} />,
            },
            {
              type: 'string',
              id: 'name',
              head: m.name,
              renderQuick: _ => _.name,
            },
            {
              id: 'email',
              head: m.email,
              render: _ => {
                return {
                  label: <Txt bold>{_.email}</Txt>,
                  value: _.email,
                }
              },
              type: 'string',
            },
            {
              width: 110,
              id: 'createdAt',
              head: m.createdAt,
              type: 'date',
              render: _ => {
                return {
                  label: <Txt color="hint">{formatDate(_.createdAt)}</Txt>,
                  value: _.createdAt,
                }
              },
            },
            {
              type: 'date',
              width: 140,
              id: 'lastConnectedAt',
              head: m.lastConnectedAt,
              render: _ => {
                return {
                  label: _.lastConnectedAt && <Txt color="hint">{formatDateTime(_.lastConnectedAt)}</Txt>,
                  value: _.lastConnectedAt,
                }
              },
            },
            {
              id: 'drcJob',
              head: m.drcJob,
              renderQuick: _ => _.drcJob,
              type: 'select_one',
              options: () =>
                seq(_users.get?.map(_ => _.drcJob))
                  .distinct(_ => _)
                  .compact()
                  .map(_ => ({value: _, label: _})),
            },
            {
              id: 'drcOffice',
              type: 'select_one',
              head: m.location,
              renderQuick: _ => _.drcOffice,
              // options: () => seq(_users.get?.map(_ => _.drcOffice)).distinct(_ => _).compact().map(_ => ({value: _, label: _}))
            },
            {
              type: 'select_one',
              id: 'admin',
              width: 10,
              align: 'center',
              head: m.admin,
              render: _ => ({
                label: _.admin && <TableIcon color="success">check_circle</TableIcon>,
                value: _.admin ? 'true' : 'false',
              }),
              options: () => [
                {value: 'true', label: m.yes},
                {value: 'false', label: m.no},
              ],
            },
            {
              id: 'action',
              width: 10,
              align: 'right',
              renderQuick: _ => (
                <IpIconBtn
                  disabled={_.email === conf.contact || _.email === session.user.email}
                  children="visibility"
                  loading={_connectAs.loading}
                  onClick={() => connectAs(_.email)}
                  tooltip={m.connectAs}
                />
              ),
            },
          ]}
        />
      </Panel>
    </Page>
  )
}
