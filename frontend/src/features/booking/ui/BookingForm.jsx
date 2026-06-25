import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams } from 'react-router';
import { usePostBooking } from '../api/BookingQuery';

// apartmentId, checkIn, checkOut, guests, comment

const schema = z.object({
    apartmentId: z.string(),
    checkIn: z.string().min(1, 'Это поле обязательно'),
    checkOut: z.string().min(1, 'Это поле обязательно'),
    guests: z.coerce.number().gt(0, 'Укажите количество гостей'),
    comment: z.string().min(1, 'Это поле обязательно'),
}).refine(({checkIn, checkOut}) => (new Date(checkIn)) < (new Date(checkOut)), {
    message: 'Дата выезда не может быть раньше даты заезда.',
    path: ['checkOut']
})

const BookingForm = () => {

    const { id: apartmentId } = useParams()

    const { mutateAsync: postHandle } = usePostBooking()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            apartmentId,
        }
    })

    console.log(errors)

  return (
    <form onSubmit={handleSubmit(postHandle)}>
        <label>
            Дата заезда
            <input className={errors?.checkIn && 'error-input'} type="date" {...register('checkIn')} />
            <small className='errors'>{errors?.checkIn?.message}</small>
        </label>
        <label>
            Дата выезда
            <input className={errors?.checkOut && 'error-input'} type="date" {...register('checkOut')} />
            <small className='errors'>{errors?.checkOut?.message}</small>
        </label>
        <label>
            Количество гостей
            <input placeholder='Кол-во гостей' className={errors?.guests && 'error-input'} type="number" {...register('guests')} />
            <small className='errors'>{errors?.guests?.message}</small>
        </label>
        <label>
            Комментарий
            <input placeholder='Комментарий' className={errors?.comment && 'error-input'} type="text" {...register('comment')} />
            <small className='errors'>{errors?.comment?.message}</small>
        </label>
        <button className='btn primary'>Записаться</button>
    </form>
  );
};

export default BookingForm;