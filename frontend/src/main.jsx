import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/lib/queryClient'
import ToastsProvider from './widgets/toasts/provider/ToastsProvider'
import { RouterProvider } from 'react-router'
import router from './app/router/router'

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ToastsProvider>
      <RouterProvider router={router} />
    </ToastsProvider>
  </QueryClientProvider>
)
