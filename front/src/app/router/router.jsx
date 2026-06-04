import { createBrowserRouter, redirect } from "react-router";
import Layout from "../layout/layout";
import ErrorLayout from "../layout/error-layout";
import TrainersPage from "../../pages/trainers/trainers-page";
import TrainerProfile from "../../pages/trainers/trainer-profile";
import NotFoundPage from "../../pages/errors/not-found-page";
import LoginPage from "../../pages/auth/login-page";
import RegisterPage from "../../pages/auth/register-page";
import SpecializationsPage from "../../pages/specializations/specializations-page";
import ProfilePage from "../../pages/profile/profile-page";
import BookingsPage from "../../pages/bookings/bookings-page";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorLayout />,
        children: [
            {
                index: true, 
                loader: () => redirect('/trainers')
            },
            {
                path: 'trainers',
                element: <TrainersPage />
            },
            {
                path: 'trainers/:id',
                element: <TrainerProfile />
            },
            {
                path: '404',
                element: <NotFoundPage />
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
                path: 'specializations',
                element: <SpecializationsPage />
            },
            {
                path: 'profile',
                element: <ProfilePage />
            },
            {
                path: 'bookings',
                element: <BookingsPage />
            },
        ]
    }
])