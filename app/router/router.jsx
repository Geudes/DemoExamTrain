import { createBrowserRouter, redirect } from "react-router";
import Layout from "../layout/layout";
import ErrorLayout from "../layout/error-layout";
import TeachersPage from "../../pages/teachers/teachers-page";
import TeacherProfile from "../../pages/teachers/teacher-profile";
import MyLessonsPage from "../../pages/lessons/my-lessons-page";
import InstrumentsPage from "../../pages/instruments/intruments-page";
import ProfilePage from "../../pages/profile/profile-page";
import LoginPage from "../../pages/auth/login-page";
import RegisterPage from "../../pages/auth/register-page";
import NotFoundPage from "../../pages/errors/not-found-page";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorLayout />,
        children: [
            {
                index: true,
                loader: () => redirect('/teachers')
            },
            {
                path: 'teachers',
                element: <TeachersPage />
            },
            {
                path: 'teachers/:id',
                element: <TeacherProfile />
            },
            {
                path: 'lessons',
                element: <MyLessonsPage />
            },
            {
                path: 'instruments',
                element: <InstrumentsPage />
            },
            {
                path: 'profile',
                element: <ProfilePage />
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            },
            {
                path: '404',
                element: <NotFoundPage />
            }
        ]
    }
])