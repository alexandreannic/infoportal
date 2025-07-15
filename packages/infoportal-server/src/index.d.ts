import {tsRouter} from 'infoportal-client/src/TanstackRouter'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof tsRouter
  }
}
