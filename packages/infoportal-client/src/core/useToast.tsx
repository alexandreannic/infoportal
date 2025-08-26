import {appConfig} from '../conf/AppConfig'
import {useToast} from '../../../infoportal-client-core/src/Toast.js'

export const useIpToast = () => {
  const toasts = useToast()
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
