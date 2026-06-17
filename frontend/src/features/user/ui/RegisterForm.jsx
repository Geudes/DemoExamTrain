import { useRegister } from "../api/userQuery";
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from "../../../shared/ui/input/Input";

const schema = z.object({
    role: z.enum(['tenant', 'owner']),
    name: z.string().min(5, 'Поле слишком короткое').max(20, 'Поле слишком длинное'),
    email: z.string().email('Некорректная почта').min(1, 'Это поле обязательно'),
    password: z.string().min(6, 'Поле слишком короткое').max(12, 'Поле слишком длинное'),
    confirmPassword: z.string().min(1, 'Это поле обязательно'),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
})
 

const RegisterForm = () => {
    
    const { mutateAsync: registerHandle } = useRegister()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema)
    })

  return (
    <form onSubmit={handleSubmit(registerHandle)}>
        <Input
            register={register}
            errors={errors}
            label={'Имя'}
            name={'name'}
            placeholder={'Ivan'}
        />
        <Input
            register={register}
            errors={errors}
            label={'Электронная почта'}
            name={'email'}
            placeholder={'example@mail.ru'}
        />
        <Input
            register={register}
            errors={errors}
            label={'Пароль'}
            name={'password'}
            placeholder={'******'}
        />
        <Input
            register={register}
            errors={errors}
            label={'Подтверждение пароля'}
            name={'confirmPassword'}
            placeholder={'******'}
        />
        <label>
         Роль
        <select className={errors.role && 'error-input'} {...register('role')}>
            <option value="tenant">Арендатор</option>
            <option value="owner">Владелец</option>
        </select>
        <small className="error">{errors?.role?.message}</small>
    </label>
    <button className="btn primary">Зарегестрироваться</button>
    </form>
  )
}
export default RegisterForm;