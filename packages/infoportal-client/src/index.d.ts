import {tsRouter} from '@/TanstackRouter'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof tsRouter
  }
}
