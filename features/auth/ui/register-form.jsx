import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRegister } from '../../../shared/api/query-hooks'

const schema = z.object({
    role: z.string().min(1, 'Это поле обязательно'),
    name: z.string().min(5, 'Имя слишком короткое').max(15, 'Имя слишком длинное'),
    email: z.string().email('Неправильная электронная почта'),
    password: z.string().min(6, 'Имя слишком короткое').max(10, 'Имя слишком длинное')
}).refine(({ role }) => role === 'student' || role === 'teacher', {
    message: 'Неправильная роль. Доступные роли: «Студент», «Учитель»',
    path: ['role']
})

function RegisterForm() {

    const { mutateAsync: registerHandle } = useRegister()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema)
    })

  return (
    <div className="form">
        <form onSubmit={handleSubmit(registerHandle)}>
            <label>
                Роль
                <select className={errors?.role && 'error-input'} type="text" {...register('role')}>
                    <option value="student">Студент</option>
                    <option value="teacher">Учитель</option>
                </select>
                <small className='error'>{errors?.role?.message}</small>
            </label>
            <label>
                Имя
                <input placeholder='Ivan' className={errors?.name && 'error-input'} type="text" {...register('name')} />
                <small className='error'>{errors?.name?.message}</small>
            </label>
            <label>
                Электронная почта
                <input placeholder='example@mail.ru' className={errors?.email && 'error-input'} type="text" {...register('email')} />
                <small className='error'>{errors?.email?.message}</small>
            </label>
            <label>
                Электронная почта
                <input placeholder='******' className={errors?.password && 'error-input'} type="text" {...register('password')} />
                <small className='error'>{errors?.password?.message}</small>
            </label>
            <button>Регистрация</button>
        </form>
    </div>
  )
}

export default RegisterForm