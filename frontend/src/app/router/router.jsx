import { createBrowserRouter, redirect } from 'react-router'
import Layout from '../layout/Layout'
import ErrorLayout from '../layout/ErrorLayout'
import ApartmentPage from '../../pages/ApartmentPage'
import LoginPage from '../../pages/LoginPage'
import RegisterPage from '../../pages/RegisterPage'
import ProfilePage from '../../pages/ProfilePage'
import MyBookingPage from '../../pages/MyBookingPage'
import MyListingsPage from '../../pages/MyListingsPage'
import HomePage from '../../pages/HomePage'
import CreateListingPage from '../../pages/CreateListingPage'
import NotFoundPage from '../../pages/NotFoundPage'

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
                path: '/apartments',
                element: <HomePage />
            },
            {
                path: '/login',
                element: <LoginPage />
            },
            {
                path: '/register',
                element: <RegisterPage />
            },
            {
                path: '/profile',
                element: <ProfilePage />
            },
            {
                path: '/bookings',
                element: <MyBookingPage />
            },
            {
                path: '/my-listings',
                element: <MyListingsPage />
            },
            {
                path: '/apartments/:id',
                element: <ApartmentPage />
            },
            {
                path: '/listings/new',
                element: <CreateListingPage />
            },
            {
                path: '/404',
                element: <NotFoundPage />
            },
        ]
    }
])