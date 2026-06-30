import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useGetUser, useLogout } from "../../features/users/api/usersQuery";
import logo from "/favicon.svg";
import { NavLink, Outlet } from "react-router";
import Loader from "../../ui/Loader";

const Layout = () => {

    const isFetching = useIsFetching() > 0
    const isMutating = useIsMutating() > 0

    const isLoading = isFetching || isMutating

  const { data: user } = useGetUser();
  const userRole = user?.role ?? "guest";

  const { mutateAsync: logoutHandle } = useLogout();

  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="Логотип «MediBook»" />
        <nav className="nav">
          <NavLink to={"/doctors"}>Найти врача</NavLink>
          {userRole === "doctor" && <NavLink to={"/specializations"}>Специализации</NavLink>}
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
        {userRole !== "guest" && (
          <span onClick={logoutHandle} className="btn">
            Выйти
          </span>
        )}
      </header>
      <main className="page">
        <Outlet context={{ user, userRole }} />
      </main>
      { isLoading && <Loader /> }
    </div>
  );
};

export default Layout;
