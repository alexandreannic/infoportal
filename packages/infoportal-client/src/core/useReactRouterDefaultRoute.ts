import {useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

/**
 * Workaround since we cannot use <Route index ...> since we put <HashRouter> in _app.tsx.
 */
export const useReactRouterDefaultRoute = (route: string, home: string = '/', deps: any[] = []) => {
  const loc = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (loc.pathname === home) navigate(route)
  }, deps)
}
