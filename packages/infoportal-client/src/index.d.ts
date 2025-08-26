import {tsRouter} from '@/Router'
// noinspection ES6UnusedImports
import {} from '@mui/material/themeCssVarsAugmentation'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof tsRouter
  }
}

// declare module '@mui/material/styles' {
//   interface Theme {
//     vars: NonNullable<Theme['vars']>
//   }
// }
