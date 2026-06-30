import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import { useRegister } from '../api/usersQuery';

const schema = z.object({
    role: z.enum(['patient', 'doctor']),
    name: z.string('Это поле обязательно').min(5, 'Поле слишком короткое').max(20, 'Поле слишком длинное'),
    email: z.string('Это поле обязательно').email('Некорректная почта').min(1, 'Это поле обязательно'),
    password: z.string('Это поле обязательно').min(6, 'Поле слишком короткое').max(12, 'Поле слишком длинное'),
    confirmPassword: z.string('Это поле обязательно').min(1, 'Это поле обязательно'),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Пароли не обязательны',
    path: ['confirmPassword']
})

const RegisterForm = () => {

    const { mutateAsync: registerHandle } = useRegister()

    const {
        control,
        handleSubmit,
    } = useForm({
        resolver: zodResolver(schema)
    })

  return (
    <form onSubmit={handleSubmit(registerHandle)}>
        <Input
            control={control}
            name={'name'}
            label={'Имя'}
        />
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
        <Input
            control={control}
            name={'confirmPassword'}
            label={'Подтверждение пароля'}
            placeholder={'******'}
        />
        <Select 
            control={control}
            name={'role'}
            label={'Роль'}
            values={[
                {id: 'patient', name: 'Пациент'},
                {id: 'doctor', name: 'Доктор'},
            ]}
        />
        <button className="btn primary">Зарегестрироваться</button>
    </form>
  );
};

export default RegisterForm;