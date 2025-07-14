import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {RouterProvider} from '@tanstack/react-router'
import {tsRouter} from '@/TanstackRouter'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={tsRouter} />
  </StrictMode>,
)
