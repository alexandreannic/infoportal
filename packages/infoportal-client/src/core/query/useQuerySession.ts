import {useAppSettings} from '@/core/context/ConfigContext'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {Session} from '@/core/sdk/server/session/Session'
import {useI18n} from '@/core/i18n'
import {useIpToast} from '@/core/useToast'

export const useQuerySession = () => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const {toastError, toastHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const setSessionDataAndCache = ({workspaces, originalEmail, user}: Session) => {
    queryClient.setQueryData(queryKeys.workspaces(), workspaces)
    queryClient.setQueryData(queryKeys.originalEmail(), originalEmail)
    return user
  }

  const getMe = useQuery({
    queryKey: queryKeys.session(),
    queryFn: async () => {
      try {
        const data = await api.session.getMe()
        return setSessionDataAndCache(data)
      } catch (e) {
        toastError(m.youDontHaveAccess)
        throw e
      }
    },
  })

  const connectAs = useMutation({
    mutationFn: async (email: string) => {
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
      queryClient.removeQueries({queryKey: queryKeys.access()})
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
