import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegister } from '../api/userQuery';
import { Link } from 'react-router';

const schema = z.object({
    role: z.enum(['patient', 'doctor'], {message: 'Недопустимая роль'}),
    name: z.string().min(5, 'Поле слишком короткое').max(20, 'Поле слишком длинное'),
    email: z.string().email('Некорректная почта').min(1, 'Это поле обязательно'),
    password: z.string().min(6, 'Поле слишком короткое').max(12, 'Поле слишком длинное'),
    confirmPassword: z.string().min(1, 'Это поле обязательно'),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
})


const RegisterForm = () => {

    console.log(schema)

    const { mutateAsync: registerHandle } = useRegister()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema)
    })

  return (
    <form onSubmit={handleSubmit(registerHandle)}>
      <div className="heading">
        <h1>Регистрация</h1>
        <Link className='btn' to={-1}>Назад</Link>
      </div>
        <label>
            Роль
            <select className={errors?.role && 'error'} {...register('role')}>
                <option value="patient">Пациент</option>
                <option value="doctor">Доктор</option>
            </select>
            <small className='error'>{errors?.role?.message}</small>
        </label>
        <label>
            Имя
            <input placeholder='Ivan' className={errors?.name && 'error'} {...register('name')} />  
            <small className='error'>{errors?.name?.message}</small>
        </label>
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
        <label>
            Подтверждение пароля
            <input placeholder='******' className={errors?.confirmPassword && 'error'} {...register('confirmPassword')} />  
            <small className='error'>{errors?.confirmPassword?.message}</small>
        </label>
        <button className="btn primary">
            Зарегестрироваться
        </button>
    </form>
  );
};

export default RegisterForm;
