import { useOutletContext } from "react-router";
import { usePatchBooking } from "../api/BookingQuery";


const BookingCard = ({ booking }) => {
  const { userRole } = useOutletContext();
  const { mutateAsync: patchHandle } = usePatchBooking();

  console.log(patchHandle)

  return (
    <>
      <div className="td">{booking?.apartment?.title}</div>
      <div className="td">
        {booking?.checkIn} — {booking?.checkOut}
      </div>
      <div className="td">
        <span className={`badge badge-${booking?.status}`}>
          {booking?.status}
        </span>
        {userRole === "tenant" || booking?.status === 'pending' && (
          <button
            onClick={() => patchHandle({ id: booking.id, status: "cancelled" })}
            className="btn error small"
          >
            Отменить
          </button>
        )}
      </div>
    </>
  );
};

export default BookingCard;
