import LoginForm from "../features/users/ui/LoginForm";

const LoginPage = () => {
  return (
    <>
      <div className="heading">
        <h1>Вход</h1>
      </div>
      <div className="content">
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;