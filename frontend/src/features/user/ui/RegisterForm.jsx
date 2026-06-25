import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegister } from '../api/userQuery';


const schema = z.object({
    email: z.string().email('Некорректная электронная почта').min(1, 'Это поле обязательно'),
    name: z.string().min(5, 'Поле слишком короткое').max(20, 'Поле слишком длинное'),
    password: z.string().min(6, 'Поле слишком короткое').max(12, 'Поле слишком длинное'),
    confirmPassword: z.string().min(1, 'Это поле обязательно'),
    role: z.enum(['tenant', 'owner'])
}).refine(({password, confirmPassword}) => password === confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
})

const RegisterForm = () => {

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
        <label>
            Электронная почта
            <input placeholder='Электронная почта' className={errors?.email && 'error-input'} type="text" {...register('email')} />
            <small className='errors'>{errors?.email?.message}</small>
        </label>
        <label>
            Имя
            <input placeholder='Имя' className={errors?.name && 'error-input'} type="text" {...register('name')} />
            <small className='errors'>{errors?.name?.message}</small>
        </label>
        <label>
            Пароль
            <input placeholder='Пароль' className={errors?.password && 'error-input'} type="password" {...register('password')} />
            <small className='errors'>{errors?.password?.message}</small>
        </label>
        <label>
            Подтверждение пароля
            <input placeholder='Подтверждение пароля' className={errors?.confirmPassword && 'error-input'} type="password" {...register('confirmPassword')} />
            <small className='errors'>{errors?.confirmPassword?.message}</small>
        </label>
        <label>
            Роль
            <select {...register('role')}>
                <option value="tenant">Арендатор</option>
                <option value="owner">Собственник</option>
            </select>
            <small className='errors'>{errors?.role?.message}</small>
        </label>
        <button className='btn primary'>Зарегестрироваться</button>
    </form>
  );
};

export default RegisterForm;