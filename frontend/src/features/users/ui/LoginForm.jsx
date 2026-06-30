import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import Input from '../../../ui/Input';
import { useLogin } from '../api/usersQuery';

const schema = z.object({
    email: z.string('Это поле обязательно').email('Некорректная почта').min(1, 'Это поле обязательно'),
    password: z.string('Это поле обязательно').min(6, 'Поле слишком короткое').max(12, 'Поле слишком длинное'),
})

const LoginForm = () => {

    const { mutateAsync: loginHandle } = useLogin()

    const {
        control,
        handleSubmit,
    } = useForm({
        resolver: zodResolver(schema)
    })

  return (
    <form onSubmit={handleSubmit(loginHandle)}>
        <Input
            control={control}
            name={'email'}
            label={'Электронная почта'}
            placeholder={'example@mail.com'}
        />
        <Input
            control={control}
            name={'password'}
            label={'Пароль'}
            placeholder={'******'}
        />
        <button className="btn primary">Войти</button>
    </form>
  );
};

export default LoginForm;