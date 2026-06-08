import { Navigate } from "react-router"

function ErrorLayout() {
  return <Navigate to={'/404'} />
}

export default ErrorLayout