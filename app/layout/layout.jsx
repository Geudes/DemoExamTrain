import { NavLink, Outlet } from 'react-router'
import logo from '../../assets/logo.svg'
import { useGetMe, useLogout } from '../../shared/api/query-hooks'

function Layout() {

    const { data: user } = useGetMe()
    const { mutateAsync: logoutHandler } = useLogout()

    return (
        <div className="app">
            <header className="header">
                <img src={logo} alt="Логотип «МузыкаУрок»" />
                <nav className="nav">
                    <NavLink to={'/teachers'}>Найти преподавателя</NavLink>
                    <NavLink to={'/login'}>Войти</NavLink>
                    <NavLink to={'/register'}>Регистрация</NavLink>
                    <NavLink to={'/lessons'}>Мои уроки</NavLink>
                    <NavLink to={'/instruments'}>Выбор инструментов</NavLink>
                    <NavLink to={'/profile'}>Профиль</NavLink>
                </nav>
                <span onClick={logoutHandler}>Выйти</span>
            </header>
            <main className="page">
                <Outlet context={{ user }}/>
            </main>
        </div>
    )
}

export default Layout