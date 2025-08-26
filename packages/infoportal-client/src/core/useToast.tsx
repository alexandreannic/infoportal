import {Core} from '@/shared'
import {appConfig} from '../conf/AppConfig'

export const useIpToast = () => {
  const toasts = Core.useToast()
  return {
    ...toasts,
    toastHttpError: (e: unknown) => {
      console.error(e)
      toasts.toastError(`Something went wrong. Contact ${appConfig.contact}`)
    },
    toastAndThrowHttpError: (e: unknown) => {
      console.error(e)
      toasts.toastError(`Something went wrong. Contact ${appConfig.contact}`)
      throw e
    },
  }
}
