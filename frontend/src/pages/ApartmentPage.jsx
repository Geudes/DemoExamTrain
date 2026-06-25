import { Link, useOutletContext, useParams } from "react-router";
import { useApartment } from "../entities/apartments/api/apartmentQuery";
import { useState } from "react";
import Modal from "../widgets/modal/Modal";
import BookingForm from "../features/booking/ui/BookingForm";

const ApartmentPage = () => {
  const { userRole, showModal, setShowModal } = useOutletContext();
  const [currentImg, setCurrentImg] = useState(0);

  const { id } = useParams();

  const { data: apartment } = useApartment(id);

  return (
    <>
      <div className="heading">
        <h1>Объект жилья</h1>
      </div>
      <div className="content">
        <div className="card">
          <img src={apartment?.photos[currentImg]} alt={apartment?.title} />
          {apartment?.photos.length > 1 && (
            <div className="btns">
              <button
                className="btn"
                onClick={() => setCurrentImg((p) => p - 1)}
                disabled={currentImg === 0}
              >
                ‹
              </button>
              <button
                className="btn"
                onClick={() => setCurrentImg((p) => p + 1)}
                disabled={currentImg === apartment?.photos.length - 1}
              >
                ›
              </button>
            </div>
          )}
          <div className="text">
            <h3>
              {apartment?.title} / {apartment?.rating} ⭐
            </h3>
            <h2>{apartment?.pricePerNight} ₽</h2>
            <span>
              г. {apartment?.city}, {apartment?.address}
            </span>
            <p>{apartment?.description}</p>
            <label>
              Удобства
              <div className="badges">
                {apartment?.amenities?.map((ament) => (
                  <span key={ament} className="badge">
                    {ament}
                  </span>
                ))}
              </div>
            </label>
            <label>
              Владелец: {apartment?.owner?.name}
              <div className="badges">
                <span className="badge">{apartment?.owner?.email}</span>
                <span className="badge">{apartment?.owner?.phone}</span>
              </div>
              <p>{apartment?.owner?.description}</p>
            </label>
          </div>
          {userRole === "tenant" && (
            <button
              onClick={() => setShowModal((p) => !p)}
              className="btn primary"
            >
              Забронировать
            </button>
          )}
          {userRole === "guest" && (
            <Link to={"/login"} className="btn">
              Ко входу
            </Link>
          )}
        </div>
      </div>
      { showModal && (
        <Modal heading={'Форма бронирования'} isOpen={showModal} onClose={() => setShowModal(false)}>
          <BookingForm />
        </Modal>
      )}
    </>
  );
};

export default ApartmentPage;
