import { useBookings } from "../features/booking/api/BookingQuery";
import BookingCard from "../features/booking/ui/BookingCard";

const MyBookingsPage = () => {
  const { data: bookings } = useBookings()
  return (
    <>
      <div className="heading">
        <h1>Мои бронирования</h1>
      </div>
      <div className="content">
        <div className="table">
          <div className="th">Объект жилья</div>
          <div className="th">Даты жилья</div>
          <div className="th">Статус заявки</div>
          {
            bookings?.map(booking => (
              <BookingCard key={booking?.id} booking={booking} />
            ))
          }
        </div>
      </div>
    </>
  );
};

export default MyBookingsPage;