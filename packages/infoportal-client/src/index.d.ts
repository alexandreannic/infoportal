import {tsRouter} from '@/Router'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof tsRouter
  }
}
