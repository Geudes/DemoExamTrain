import { useNavigate } from 'react-router'


function NotFoundPage() {

    const navigate = useNavigate()

  return (
    <>
        <div className="heading">
            <h1>Страница не найдена</h1>
        </div>
        <div className="content">
            <button onClick={() => navigate}>На главную</button>
        </div>
    </>
  )
}

export default NotFoundPage