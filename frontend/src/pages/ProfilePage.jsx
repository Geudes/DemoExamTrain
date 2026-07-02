import { Link, useOutletContext } from "react-router";
import { useDeleteProfile } from "../features/user/api/userQuery";
import ProfileForm from "../features/user/ui/ProfileForm";

const ProfilePage = () => {
  const { user, userRole, showForm, setShowForm } = useOutletContext();
    const { mutateAsync: deleteHandle } = useDeleteProfile()

  return (
    <>
      <div className="heading">
        <h1>Профиль</h1>
      </div>
      <div className="content">
        <Link to={"/appointments"} className="btn">
          К записям
        </Link>
        <div className="card">
            {userRole === 'doctor' && <img src={user?.photo} alt={user?.name} />}
          <div className="text">
            <h2>{user?.name}</h2>
            <span>{user?.email}</span>
            <div className="badges">
              <span>Пароль</span>
              <div className="badge">******</div>
            </div>
            {userRole === "doctor" && (
              <>
                <h3>
                  {user?.price} ₽ <br />
                  {user?.rating} ⭐
                </h3>
                <p style={{ width: "370px" }}>{user?.about}</p>
                <div className="badges">
                  <span>Контакты</span>
                  <div className="badge">{user?.contacts}</div>
                </div>
                <div className="badges">
                  <span>Мои специализации</span>
                  {user?.specializations?.map((spec) => (
                    <span key={spec?.id} className="badge">
                      {spec?.name}
                    </span>
                  ))}
                </div>
                <div className="badges">
                  <span>Форматы приёма</span>
                  {user?.visitFormats?.map((format) => (
                    <span key={format} className="badge">
                      {format}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          <button className="btn" onClick={() => setShowForm(!showForm)}>Обновить</button>
          <button className="btn error" onClick={() => confirm("Вы точно хотите удалить аккаунт?") && deleteHandle(user?.id)}>Удалить</button>
        </div>
      </div>
      {showForm && <ProfileForm />}
    </>
  );
};

export default ProfilePage;
