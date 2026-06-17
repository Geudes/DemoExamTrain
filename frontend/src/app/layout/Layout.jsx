import { NavLink, Outlet } from 'react-router';
import logo from '../../shared/assets/vite.svg'
import { useUser } from '../../features/user/api/userQuery';


const Layout = () => {

    const { data: user } = useUser()

  return (
    <div className="app">
        <header className="header">
            <div className="logo">
                <img src={logo} alt="HomeRent" className="logo" />
            </div>
            <nav className="nav">
                <NavLink to={'/apartments'} className='nav-btn'>Найти&nbsp;жильё</NavLink>
                <NavLink to={'/login'} className='nav-btn'>Вход</NavLink>
                <NavLink to={'/register'} className='nav-btn'>Регистрация</NavLink>
                <NavLink to={'/profile'} className='nav-btn'>Профиль</NavLink>
                <NavLink to={'/bookings'} className='nav-btn'>Мои&nbsp;бронирования</NavLink>
            </nav>
            <span className='btn'>Выйти</span>
        </header>
        <main className="page">
            <Outlet context={{ user }} />
        </main>
    </div>
  );
};

export default Layout;