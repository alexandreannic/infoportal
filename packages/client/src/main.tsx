import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {tsRouter} from '@/Router'
import {RouterProvider} from '@tanstack/react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={tsRouter} />
  </StrictMode>,
)
