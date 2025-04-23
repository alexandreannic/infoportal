import * as React from 'react'
import {ReactNode, useCallback, useMemo, useState} from 'react'
import {ModalContext, ModalType} from './ModalContext'
import {ModalRoot} from './ModalRoot'

/**
 * Modal Provider Props
 */
export interface ModalProviderProps {
  /**
   * Specifies the root element to render modals into
   */
  container?: Element

  /**
   * Container component for modal nodes
   */
  rootComponent?: React.ComponentType<any>

  /**
   * Subtree that will receive modal context
   */
  children: React.ReactNode
}

/**
 * Modal Provider
 *
 * Provides modal context and renders ModalRoot.
 */
export const ModalProvider = ({container, rootComponent, children}: ModalProviderProps) => {
  if (container && !(container instanceof HTMLElement)) {
    throw new Error(`Container must specify DOM element to mount modal root into.

    This behavior has changed in 3.0.0. Please use \`rootComponent\` prop instead.
    See: https://github.com/mpontus/react-modal-hook/issues/18`)
  }
  const [modals, setModals] = useState<Record<string, ReactNode>>({})
  const showModal = useCallback(
    (key: string, modal: ModalType<any>, props: any) =>
      setModals((modals) => ({
        ...modals,
        [key]: modal(props),
      })),
    [],
  )
  const hideModal = useCallback(
    (key: string) =>
      setModals((modals) => {
        if (!modals[key]) {
          return modals
        }
        const newModals = {...modals}
        delete newModals[key]
        return newModals
      }),
    [],
  )
  const contextValue = useMemo(() => ({showModal, hideModal}), [])

  return (
    <ModalContext.Provider value={contextValue}>
      <React.Fragment>
        {children}
        <ModalRoot modals={modals} component={rootComponent} container={container} />
      </React.Fragment>
    </ModalContext.Provider>
  )
}
