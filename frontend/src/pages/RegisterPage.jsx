import RegisterForm from "../features/user/ui/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <div className="heading">
        <h1>Регистрация</h1>
      </div>
      <div className="content">
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;