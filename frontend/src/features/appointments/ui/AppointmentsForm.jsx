import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useOutletContext, useParams } from 'react-router';
import { usePostAppointment } from '../api/appointmentsQuery';

const schema = z.object({
    doctorId: z.coerce.number(),
    date: z.string().min(1, 'Это поле обязательно'),
    time: z.string().min(1, 'Это поле обязательно'),
    format: z.enum(['in_person', 'online'], { message: 'Неверный фомат приёма'}),
    comment: z.string().min(1, 'Это поле обязательно'),
})

const AppointmentsForm = () => {

    const { id } = useParams()
    const { setShowForm } = useOutletContext()
    const { mutateAsync } = usePostAppointment()

    const postHandle = async(data) => {
        await mutateAsync(data)
        setShowForm(false)
    }


    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            doctorId: id,
        }
    })

  return (
    <form onSubmit={handleSubmit(postHandle)}>
      <div className="heading">
        <h1>Форма записи на приём</h1>
        <button className='btn' onClick={() => setShowForm(false)}>Закрыть</button>
      </div>
        <label>
            Формат приёма
            <select className={errors?.format && 'error'} {...register('format')}>
                <option value="in_person">Очно</option>
                <option value="online">Онлайн</option>
            </select>
            <small className='error'>{errors?.format?.message}</small>
        </label>
        <label>
            Дата приёма
            <input type='date' className={errors?.date && 'error'} {...register('date')} />  
            <small className='error'>{errors?.date?.message}</small>
        </label>
        <label>
            Время приёма
            <input type='time' className={errors?.time && 'error'} {...register('time')} />  
            <small className='error'>{errors?.time?.message}</small>
        </label>
        <label>
            Комментарий
            <input placeholder='Оставьте комментарий для врача' className={errors?.comment && 'error'} {...register('comment')} />  
            <small className='error'>{errors?.comment?.message}</small>
        </label>
        <button className="btn primary">
            Записаться на приём
        </button>
    </form>
  );
};

export default AppointmentsForm;
