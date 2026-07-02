import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '../api/userQuery';
import { Link } from 'react-router';

const schema = z.object({
    email: z.string().email('Некорректная почта').min(1, 'Это поле обязательно'),
    password: z.string().min(6, 'Поле слишком короткое').max(12, 'Поле слишком длинное'),
})

const LoginForm = () => {

    const { mutateAsync: loginHandle } = useLogin()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema)
    })

  return (
    <form onSubmit={handleSubmit(loginHandle)}>
      <div className="heading">
        <h1>Вход</h1>
        <Link className='btn' to={-1}>Назад</Link>
      </div>
        <label>
            Электронная почта
            <input placeholder='example@mail.ru' className={errors?.email && 'error'} {...register('email')} />  
            <small className='error'>{errors?.email?.message}</small>
        </label>
        <label>
            Пароль
            <input placeholder='******' className={errors?.password && 'error'} {...register('password')} />  
            <small className='error'>{errors?.password?.message}</small>
        </label>

        <button className="btn primary">
            Войти
        </button>
    </form>
  );
};

export default LoginForm;
