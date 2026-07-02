import { createBrowserRouter, redirect } from "react-router";
import Layout from "../layout/Layout";
import NotFoundPage from "../../pages/NotFoundPage";
import HomePage from "../../pages/HomePage";
import DoctorPage from "../../pages/DoctorPage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import ProfilePage from "../../pages/ProfilePage";
import MyAppointmentsPage from "../../pages/MyAppointmentsPage";
import SpecializationsPage from "../../pages/SpecializationsPage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                loader: () => redirect('/doctors')
            },
            {
                path: '/doctors',
                element: <HomePage />
            },
            {
                path: '/doctors/:id',
                element: <DoctorPage />
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
                path: '/appointments',
                element: <MyAppointmentsPage />
            },
            {
                path: '/specializations',
                element: <SpecializationsPage />
            },
        ]
    }
])

export default router