
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/lib/queryClient'
import ToastProvider from './widgets/toasts/provider/ToastProvider'
import { RouterProvider } from 'react-router'
import { router } from './app/router/router'

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </QueryClientProvider>
)
