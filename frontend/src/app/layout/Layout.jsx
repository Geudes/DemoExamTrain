import { NavLink, Outlet, useLocation } from "react-router";
import mediBookLogo from "/favicon.svg";
import { useGetUser, useLogout } from "../../features/user/api/userQuery";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import Loader from "../../shared/ui/Loader";
import { useState } from "react";

const Layout = () => {

    const { pathname } = useLocation()
    console.log(location)

const { mutateAsync: logoutHandle } = useLogout()
  const isFetching = useIsFetching() > 0;
  const isMutating = useIsMutating() > 0;
  const isLoading = isFetching || isMutating;
  const { data: user } = useGetUser();
  const userRole = user?.role ?? "guest";
  
  const [ showForm, setShowForm ] = useState(false)

  return (
    <div className="app">
      <header className="header">
        <img src={mediBookLogo} alt="Логотип «MediBook»" />
        <nav className="nav">
          <NavLink to={"/doctors"} end>Найти врача</NavLink>
          {userRole === "doctor" && (
            <NavLink to={"/specializations"}>Специализации</NavLink>
          )}
          {userRole !== "guest" ? (
            <>
              <NavLink to={"/profile"}>Профиль</NavLink>
              <NavLink to={"/appointments"}>Мои записи</NavLink>
            </>
          ) : (
            <>
              <NavLink to={"/login"}>Войти</NavLink>
              <NavLink to={"/register"}>Регистрация</NavLink>
            </>
          )}
        </nav>
        {userRole !== "guest" && <div onClick={logoutHandle} className="btn">Выйти</div>}
      </header>
      <main>
        <Outlet context={{ user, userRole, showForm, setShowForm }} />
      </main>
      { (pathname.includes('/register') || pathname.includes('/login') || showForm) && <div className="overlay" />}
      {isLoading && <Loader />}
    </div>
  );
};

export default Layout;
