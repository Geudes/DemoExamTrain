import { Link } from 'react-router'

const NotFoundPage = () => {

  return (
    <>
      <div className="heading">
        <h1>Страница не найдена</h1>
      </div>
      <div className="content">
        <Link to={'/'} className='btn'>На главную</Link>
      </div>
    </>
  );
};

export default NotFoundPage;