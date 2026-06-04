import { NavLink, Outlet } from "react-router";

function Layout() {
    return (
        <div className="app">
            <header className="header">
                <nav className="header__nav nav">
                    <NavLink to={'/trainers'}>Найти тренера</NavLink>
                    <NavLink to={'/login'}>Войти</NavLink>
                    <NavLink to={'/register'}>Регистрация</NavLink>
                    <span>Выйти</span>
                    <NavLink to={'/profile'}>Профиль</NavLink>
                    <NavLink to={'/bookings'}>Мои тренировки</NavLink>
                    <NavLink to={'/specializations'}>Специализации</NavLink>
                </nav>
            </header>
            <main className="main">
                <div className="page">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default Layout;