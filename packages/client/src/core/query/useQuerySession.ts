import {useAppSettings} from '@/core/context/ConfigContext'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {Session} from '@/core/sdk/server/session/Session'
import {useIpToast} from '@/core/useToast'
import {Api} from '@infoportal/api-sdk'

export const useQuerySession = () => {
  const {api} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const setSessionDataAndCache = ({workspaces, originalEmail, user}: Session) => {
    queryClient.setQueryData(queryKeys.workspaces(), workspaces)
    queryClient.setQueryData(queryKeys.originalEmail(), originalEmail)
    return user
  }

  const getMe = useQuery({
    retry: 0,
    queryKey: queryKeys.session(),
    queryFn: async () => {
      try {
        const data = await api.session.getMe()
        return setSessionDataAndCache(data)
      } catch (e) {
        // toastError(m.youDontHaveAccess)
        throw e
      }
    },
  })

  const connectAs = useMutation({
    mutationFn: async (email: Api.User.Email) => {
      const session = await api.session.connectAs(email)
      return setSessionDataAndCache(session)
    },
    onError: toastHttpError,
  })

  const revertConnectAs = useMutation({
    mutationFn: async () => {
      const session = await api.session.revertConnectAs()
      return setSessionDataAndCache(session)
    },
    onError: toastHttpError,
  })

  const logout = useMutation({
    mutationFn: async () => {
      await api.session.logout()
      queryClient.removeQueries({queryKey: queryKeys.session()})
      queryClient.removeQueries({queryKey: queryKeys.formAccess()})
      queryClient.removeQueries({queryKey: queryKeys.workspaces()})
    },
    onError: toastHttpError,
  })

  return {
    originalEmail: queryClient.getQueryData<string>(queryKeys.originalEmail()),
    getMe,
    connectAs,
    revertConnectAs,
    logout,
  }
}
