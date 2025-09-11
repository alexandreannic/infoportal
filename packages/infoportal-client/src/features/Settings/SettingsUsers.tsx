import {useAppSettings} from '@/core/context/ConfigContext'
import {useI18n} from '@/core/i18n'
import {Core, Datatable} from '@/shared'
import {AppAvatar} from '@/shared/AppAvatar'
import {Page} from '@/shared/Page'
import {fnSwitch, Obj, seq} from '@axanc/ts-utils'
import {useMemo} from 'react'
import {AddUserForm} from './AddUserForm'
import {UseQueryUser} from '@/core/query/useQueryUser'
import {useSession} from '@/core/Session/SessionContext'
import {createRoute, useNavigate} from '@tanstack/react-router'
import {settingsRoute} from '@/features/Settings/Settings'
import {Ip} from 'infoportal-api-sdk'
import {useWorkspaceContext} from '@/features/Workspace/Workspace'
import {UseQueryWorkspaceInvitation} from '@/core/query/useQueryWorkspaceInvitation.js'
import {Icon} from '@mui/material'

export const settingsUsersRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: 'users',
  component: SettingsUsers,
})

type Data = Omit<Ip.User, 'id'> & {
  userId?: Ip.UserId
  invitationId?: Ip.Workspace.InvitationId
  status: 'invitation' | 'user'
}

function SettingsUsers() {
  const {m, formatDate, formatDateTime} = useI18n()
  const {user: connectedUser} = useSession()
  const {permission} = useWorkspaceContext()
  const {conf} = useAppSettings()
  const {workspaceId} = settingsUsersRoute.useParams() as {workspaceId: Ip.WorkspaceId}
  const navigate = useNavigate()
  const ctxSession = useSession()
  const queryUserUpdate = UseQueryUser.update(workspaceId)
  const queryUserGet = UseQueryUser.getAll(workspaceId)
  const queryInvitation = UseQueryWorkspaceInvitation.search({workspaceId})
  const queryInvitationRemove = UseQueryWorkspaceInvitation.remove({workspaceId})

  const connectAs = async (email: Ip.User.Email) => {
    await ctxSession.connectAs.mutateAsync(email)
    await navigate({to: '/'})
  }

  const data: Data[] | undefined = useMemo(() => {
    if (queryUserGet.data && queryInvitation.data) {
      return [
        ...queryInvitation.data.map(_ => {
          return {
            invitationId: _.id,
            accessLevel: _.accessLevel,
            createdAt: _.createdAt,
            status: 'invitation',
            email: _.toEmail,
            avatar: undefined,
          } as const
        }),
        ...queryUserGet.data.map(_ => ({..._, userId: _.id, status: 'user'}) as const),
      ]
    }
  }, [queryUserGet.data, queryInvitation.data])

  const emailsLists = useMemo(() => queryUserGet.data?.map(_ => _.email), [queryUserGet.data])

  return (
    <Page width="full">
      <Core.Panel>
        <Datatable.Component
          rowHeight={36}
          loading={queryUserGet.isLoading}
          id="users"
          module={
            {
              // cellSelection: {enabled: true},
            }
          }
          data={data}
          getRowKey={_ => _.invitationId ?? _.userId!}
          header={
            permission.user_canCreate && (
              <Core.Modal
                onClose={null}
                title={m.addUser}
                content={close => (
                  <AddUserForm workspaceId={workspaceId} existingEmails={emailsLists} onClose={close} />
                )}
              >
                <Core.Btn icon="person_add" variant="outlined" sx={{marginLeft: 'auto'}}>
                  {m.addUser}
                </Core.Btn>
              </Core.Modal>
            )
          }
          columns={[
            {
              width: 60,
              id: 'status',
              type: 'select_one',
              head: m.status,
              align: 'center',
              render: _ => {
                const label = fnSwitch(_.status, {
                  user: <Icon color="success">person_check</Icon>,
                  invitation: <Icon color="warning">schedule</Icon>,
                })
                return {label, value: _.status}
              },
            },
            {
              width: 50,
              align: 'center',
              id: 'avatar',
              head: '',
              renderQuick: _ => _.status === 'user' && <AppAvatar sx={{my: 0.75}} size={28} email={_.email} />,
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
                  label: <Core.Txt bold>{_.email}</Core.Txt>,
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
                  label: <Core.Txt color="hint">{formatDate(_.createdAt)}</Core.Txt>,
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
                  label: _.lastConnectedAt && <Core.Txt color="hint">{formatDateTime(_.lastConnectedAt)}</Core.Txt>,
                  value: _.lastConnectedAt,
                }
              },
            },
            {
              id: 'job',
              head: m.job,
              render: _ => {
                return {
                  label: <Datatable.Input value={_.job} onChange={console.log} />,
                  value: _.job,
                }
              },
              type: 'select_one',
              options: () =>
                seq(queryUserGet.data?.map(_ => _.job))
                  .distinct(_ => _)
                  .compact()
                  .map(_ => ({value: _, label: _})),
            },
            {
              id: 'location',
              type: 'select_one',
              head: m.location,
              renderQuick: _ => _.location,
              // options: () => seq(ctxUser.fetchSearch.get?.map(_ => _.location)).distinct(_ => _).compact().map(_ => ({value: _, label: _}))
            },
            {
              type: 'select_one',
              id: 'admin',
              width: 100,
              align: 'center',
              head: m.admin,
              actionOnSelected: 'none',
              render: _ => ({
                label: (
                  <Core.SelectSingle
                    hideNullOption
                    slotProps={{
                      notchedOutline: {sx: {border: 'none'}},
                    }}
                    loading={queryUserUpdate.pendingIds.has(_.userId!)}
                    disabled={_.email === connectedUser.email || !permission.user_canUpdate || !_.userId}
                    onChange={res => {
                      queryUserUpdate.mutateAsync({id: _.userId!, accessLevel: res!})
                    }}
                    value={_.accessLevel}
                    options={Obj.keys(Ip.AccessLevel)}
                  />
                ),
                value: _.accessLevel,
              }),
              options: () => Obj.keys(Ip.AccessLevel).map(_ => ({value: _, label: _})),
            },
            {
              id: 'action',
              align: 'right',
              renderQuick: _ => (
                <>
                  {_.status === 'user' && permission.user_canConnectAs && (
                    <Core.IconBtn
                      disabled={_.email === conf.contact || _.email === ctxSession.user.email}
                      children="visibility"
                      loading={ctxSession.connectAs.isPending}
                      onClick={() => connectAs(_.email)}
                      tooltip={m.connectAs}
                    />
                  )}
                  {_.status === 'invitation' && permission.user_canDelete && (
                    <Core.IconBtn
                      children="delete"
                      loading={queryInvitationRemove.pendingIds.has(_.invitationId!)}
                      onClick={() => queryInvitationRemove.mutate({id: _.invitationId!})}
                      tooltip={m.connectAs}
                    />
                  )}
                </>
              ),
            },
          ]}
        />
      </Core.Panel>
    </Page>
  )
}
