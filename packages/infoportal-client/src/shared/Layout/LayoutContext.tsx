import * as React from 'react'
import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {useTheme} from '@mui/material'
import {Breakpoint} from '@mui/system'

const LayoutContext = createContext<UseLayoutContextProps>({} as UseLayoutContextProps)

export interface LayoutProviderProps {
  children: ReactNode
  /** @depreacted use isLowerThanBp */
  mobileBreakpoint?: number
  title?: string
  showSidebarButton?: boolean
}

export interface UseLayoutContextProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  sidebarPinned: boolean
  setSidebarPinned: Dispatch<SetStateAction<boolean>>
  title?: string
  setTitle: Dispatch<SetStateAction<string | undefined>>
  /** @depreacted use currentBreakpointDown */
  isMobileWidth: boolean
  showSidebarButton?: boolean
  currentBreakpointDown: Breakpoint
}

export const LayoutProvider = ({
  title: _title,
  showSidebarButton,
  mobileBreakpoint = 760,
  children,
}: LayoutProviderProps) => {
  const [title, setTitle] = useState(_title)
  const [pageWidth, setPageWidth] = useState(getWidth())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarPinned, setSidebarPinned] = useState(true)
  const t = useTheme()

  const currentBreakpointDown = useMemo(() => {
    let bp: Breakpoint = 'xs'
    for (const k in t.breakpoints.values) {
      if (t.breakpoints.values[k as Breakpoint] < pageWidth) {
        bp = k as Breakpoint
      }
    }
    return bp
  }, [pageWidth, t])

  useEffectFn(_title, setTitle)

  useEffect(() => {
    document.title = (process.env.NODE_ENV === 'development' ? '🖥️' : '') + (title ? title + ' - ' : '') + 'InfoPortal'
    window.addEventListener('resize', () => setPageWidth(getWidth()))
    // TODO looks needed when duplicate tab, must be verified
    setPageWidth(getWidth())
  }, [])

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        sidebarPinned,
        setSidebarPinned,
        title,
        setTitle,
        currentBreakpointDown,
        isMobileWidth: pageWidth < mobileBreakpoint,
        showSidebarButton,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

function getWidth(): number {
  return typeof window !== 'undefined' ? window.outerWidth : 1100
}

export const useLayoutContext = (): UseLayoutContextProps => {
  return useContext<UseLayoutContextProps>(LayoutContext)
}
