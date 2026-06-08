import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLogin } from '../../../shared/api/query-hooks'

const schema = z.object({
    email: z.string().email('Неправильная электронная почта'),
    password: z.string().min(6, 'Имя слишком короткое').max(10, 'Имя слишком длинное')
})

function LoginForm() {

    const { mutateAsync: loginHandle } = useLogin()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema)
    })

  return (
    <div className="form">
        <form onSubmit={handleSubmit(loginHandle)}>
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
            <button>Вход</button>
        </form>
    </div>
  )
}

export default LoginForm