import { createBrowserRouter, redirect } from 'react-router'
import Layout from '../layout/Layout'
import ErrorLayout from '../layout/ErrorLayout'
import LoginPage from '../../pages/LoginPage'
import RegisterPage from '../../pages/RegisterPage'
import ProfilePage from '../../pages/ProfilePage'
import MyBookingsPage from '../../pages/MyBookingsPage'
import MyListingsPage from '../../pages/MyListingsPage'
import ApartmentPage from '../../pages/ApartmentPage'
import CreateListingPage from '../../pages/CreateListingPage'
import NotFoundPage from '../../pages/NotFoundPage'
import HomePage from '../../pages/HomePage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorLayout />,
        children: [
            {
                index: true,
                loader: () => redirect('/apartments')
            },
            {
                path: 'apartments',
                element: <HomePage />
            },
            {
                path: 'login',
                element: <LoginPage />
            },
            {
                path: 'register',
                element: <RegisterPage />
            },
            {
                path: 'profile',
                element: <ProfilePage />
            },
            {
                path: 'bookings',
                element: <MyBookingsPage />
            },
            {
                path: 'my-listings',
                element: <MyListingsPage />
            },
            {
                path: 'apartments/:id',
                element: <ApartmentPage />
            },
            {
                path: 'listings/new',
                element: <CreateListingPage />
            },
            {
                path: '404',
                element: <NotFoundPage />
            },
        ]
    }
])