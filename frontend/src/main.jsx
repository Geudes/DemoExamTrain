import { createRoot } from 'react-dom/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/lib/queryClient'
import ToastProvider from './widgets/toasts/provider/ToastProvider'
import { RouterProvider } from 'react-router'
import { router } from './app/router/router'
import './index.css'

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <ToastProvider>
            <RouterProvider router={router} />
        </ToastProvider>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
)
