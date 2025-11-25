import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../../context/ConfigContext'
import {useIpToast} from '../../useToast'
import {queryKeys} from '../query.index'
import {Ip, IpClient} from '@infoportal/api-sdk'

type Params<T extends keyof IpClient['form']['version']> = Parameters<IpClient['form']['version'][T]>[0]
type Return<T extends keyof IpClient['form']['version']> = Awaited<ReturnType<IpClient['form']['version'][T]>>

export const useQueryVersion = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
  const {apiv2} = useAppSettings()
  const queryClient = useQueryClient()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()

  const get = useQuery({
    queryKey: queryKeys.version(workspaceId, formId),
    queryFn: () => apiv2.form.version.getByFormId({workspaceId, formId}),
  })

  const validateXls = useMutation({
    mutationFn: (xlsFile: File) => apiv2.form.version.validateXlsForm({workspaceId, formId, xlsFile}),
  })

  const deployLast = useMutation({
    mutationFn: (params: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => apiv2.form.version.deployLast(params),
    onSuccess: newVersion => {
      queryClient.invalidateQueries({queryKey: queryKeys.version(workspaceId, formId)})
      queryClient.invalidateQueries({queryKey: queryKeys.form(workspaceId, formId)})
      queryClient.invalidateQueries({queryKey: queryKeys.schema(workspaceId, formId)})
      // queryClient.setQueryData<Return<'getByFormId'>>(queryKeys.version(workspaceId, formId), old =>
      //   (old ?? []).map(_ => (_.id === newVersion.id ? newVersion : _)),
      // )
    },
  })

  const upload = useMutation({
    mutationFn: async (params: Omit<Params<'uploadXlsForm'>, 'formId' | 'workspaceId'>) => {
      return apiv2.form.version.uploadXlsForm({formId, workspaceId, ...params}).catch(toastAndThrowHttpError)
    },
    onSuccess: newVersion => {
      queryClient.invalidateQueries({queryKey: queryKeys.version(workspaceId, formId)})
      // queryClient.setQueryData<Return<'getByFormId'>>(queryKeys.version(workspaceId, formId), old => [
      //   ...(old ?? []),
      //   newVersion,
      // ])
    },
    onError: toastHttpError,
  })

  const importLastKoboSchema = useMutation({
    mutationFn: async () => {
      return apiv2.form.version.importLastKoboSchema({formId, workspaceId}).catch(toastAndThrowHttpError)
    },
    onSuccess: newVersion => {
      queryClient.invalidateQueries({queryKey: queryKeys.version(workspaceId, formId)})
    },
    onError: toastHttpError,
  })

  const createNewVersion = useMutation({
    mutationFn: async (body: Omit<Ip.Form.Version.Payload.CreateNewVersion, 'formId'>) => {
      return apiv2.form.version.createNewVersion({formId, ...body}).catch(toastAndThrowHttpError)
    },
    onSuccess: newVersion => {
      queryClient.invalidateQueries({queryKey: queryKeys.version(workspaceId, formId)})
    },
    onError: toastHttpError,
  })

  return {
    createNewVersion,
    importLastKoboSchema,
    deployLast,
    validateXls,
    get,
    upload,
  }
}

export class UseQueryVersion {
  static readonly createNewVersion = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const {toastHttpError, toastAndThrowHttpError} = useIpToast()
    return useMutation({
      mutationFn: async (body: Omit<Ip.Form.Version.Payload.CreateNewVersion, 'workspaceId' | 'formId'>) => {
        return apiv2.form.version.createNewVersion({formId, workspaceId, ...body}).catch(toastAndThrowHttpError)
      },
      onSuccess: newVersion => {
        queryClient.invalidateQueries({queryKey: queryKeys.version(workspaceId, formId)})
      },
      onError: toastHttpError,
    })
  }
}
