import {UUID} from 'infoportal-common'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {duration, seq} from '@axanc/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {useMemo} from 'react'
import {Ip} from 'infoportal-api-sdk'

export const useQueryAccess = (workspaceId: UUID) => {
  const {apiv2} = useAppSettings()
  const {toastAndThrowHttpError, toastHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const getAll = useQuery({
    queryKey: queryKeys.access(workspaceId),
    queryFn: async () => {
      return apiv2.form.access.search({workspaceId}).catch(toastAndThrowHttpError)
    },
    staleTime: duration(10, 'minute'),
  })

  const accessesByFormIdMap = useMemo(() => {
    return seq(getAll.data).groupBy(_ => _.formId)
  }, [getAll.data])

  const remove = useMutation({
    mutationFn: async (args: {id: Ip.Uuid}) => {
      return apiv2.form.access.remove({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const update = useMutation({
    mutationFn: async (args: Omit<Ip.Form.Access.Payload.Update, 'workspaceId'>) => {
      return apiv2.form.access.update({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const create = useMutation({
    mutationFn: async (args: Ip.Form.Access.Payload.Create) => {
      return apiv2.form.access.create({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  return {
    create,
    update,
    remove,
    getAll,
    accessesByFormIdMap,
  }
}
