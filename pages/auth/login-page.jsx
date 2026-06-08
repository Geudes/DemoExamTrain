import LoginForm from "../../features/auth/ui/login-form"

function LoginPage() {
  return (
        <>
        <div className="heading">
            <h1>Вход</h1>
        </div>
        <div className="content">
            <LoginForm />
        </div>
    </>
  )
}

export default LoginPage