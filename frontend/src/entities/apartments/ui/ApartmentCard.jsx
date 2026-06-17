
const ApartmentCard = ({ apartment }) => {

    console.log(apartment)

  return (
    <div className="card">
        <img src={apartment?.photo} alt={apartment?.name} className="photo" />
        <div className="text">
            <small className="badge">{apartment?.type}</small>
            <h3>{apartment?.title} / {apartment?.rating} ⭐</h3>
            <h2>{apartment?.pricePerNight} ₽</h2>
            <span>Комнат: {apartment?.rooms}</span>
            <span>г. {apartment?.city}</span>
        </div>
    </div>
  );
};

export default ApartmentCard;