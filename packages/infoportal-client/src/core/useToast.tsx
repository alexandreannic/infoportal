import {appConfig} from '../conf/AppConfig'
import {useToast} from '@/shared/Toast'

export const useIpToast = () => {
  const toasts = useToast()
  return {
    ...toasts,
    toastHttpError: (e: unknown) => {
      console.error(e)
      toasts.toastError(`Something went wrong. Contact ${appConfig.contact}`)
    },
  }
}
