import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from './app/router/router'
import ToastProvider from './widgets/toasts/providers/toast-provider'

export const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </QueryClientProvider>
)
