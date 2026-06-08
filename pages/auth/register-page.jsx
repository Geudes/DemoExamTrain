import RegisterForm from "../../features/auth/ui/register-form"

function RegisterPage() {
  return (
        <>
        <div className="heading">
            <h1>Регистрация</h1>
        </div>
        <div className="content">
            <RegisterForm />
        </div>
    </>
  )
}

export default RegisterPage