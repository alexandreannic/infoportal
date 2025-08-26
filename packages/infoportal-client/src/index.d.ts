import {tsRouter} from '@/Router'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof tsRouter
  }
}

import type {} from '@mui/material/themeCssVarsAugmentation'

// declare module '@mui/material/styles' {
//   interface Theme {
//     vars: NonNullable<Theme['vars']>
//   }
// }
