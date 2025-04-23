import * as React from 'react'
import {ReactNode} from 'react'

export type ModalType<T extends object> = (t: T) => ReactNode //React.FunctionComponent<T>;

export interface ModalContextType<T extends object> {
  showModal(key: string, component: ModalType<T>, props: T): void
  hideModal(key: string): void
}

const invariantViolation = () => {
  throw new Error(
    'Attempted to call useModal outside of modal context. Make sure your app is rendered inside ModalProvider.',
  )
}

export const ModalContext = React.createContext<ModalContextType<object>>({
  showModal: invariantViolation,
  hideModal: invariantViolation,
})
ModalContext.displayName = 'ModalContext'
