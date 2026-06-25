import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '../api/userQuery';


const schema = z.object({
    email: z.string().email('Некорректная электронная почта').min(1, 'Это поле обязательно'),
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
        <label>
            Электронная почта
            <input placeholder='Электронная почта' className={errors?.email && 'error-input'} type="text" {...register('email')} />
            <small className='errors'>{errors?.email?.message}</small>
        </label>
        <label>
            Пароль
            <input placeholder='Пароль' className={errors?.password && 'error-input'} type="password" {...register('password')} />
            <small className='errors'>{errors?.password?.message}</small>
        </label>
        <button className='btn primary'>Войти</button>
    </form>
  );
};

export default LoginForm;