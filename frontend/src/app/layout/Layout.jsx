import { NavLink, Outlet } from 'react-router';
import logo from '../../shared/assets/react.svg'
import { useLogout, useUser } from '../../features/user/api/userQuery';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import Loader from '../../shared/ui/Loader';
import { useState } from 'react';


const Layout = () => {

    const [ showModal, setShowModal ] = useState(false)

    const isMutating = useIsMutating() > 0
    const isFetching = useIsFetching() > 0
    const isLoading = isFetching || isMutating

    const { data: user } = useUser()
    const userRole = user?.role ?? 'guest'

    const { mutateAsync: logoutHandle } = useLogout()

  return (
    <div className="app">
        <header className="header">
            <img src={logo} alt="HomeRent-logo" />
            <nav className="nav">
                <NavLink to={'/apartments'}>Найти&nbsp;жильё</NavLink>
                { userRole === 'owner' && <NavLink to={'/my-listings'}>Мои&nbsp;объекты</NavLink>}
                {
                    userRole !== 'guest' ? (
                        <>
                            <NavLink to={'/bookings'}>Мои&nbsp;бронирования</NavLink>
                            <NavLink to={'/profile'}>Профиль</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to={'/login'}>Войти</NavLink>
                            <NavLink to={'/register'}>Регистрация</NavLink>
                        </>
                    )
                }  
            </nav>
            { userRole !== 'guest' && <span onClick={logoutHandle} className="btn">Выйти</span>}
        </header>
        <main className="page">
            <Outlet context={{user, userRole, showModal, setShowModal}} />
        </main>
        { isLoading && <Loader />}
    </div>
  );
};

export default Layout;