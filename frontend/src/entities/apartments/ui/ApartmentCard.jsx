import { Link } from "react-router";

const ApartmentCard = ({ apartment }) => {
  return (
    <div className="card">
      <img src={apartment?.photo} alt={apartment?.title} />
      <div className="text">
        <h3>
          {apartment?.title} / {apartment?.rating} ⭐
        </h3>
        <h2>{apartment?.pricePerNight} ₽</h2>
        <span>г. {apartment?.city}</span>
        <p>{apartment?.shortDescription}</p>
      </div>
      <Link to={`/apartments/${apartment?.id}`} className="btn">
        Подробнее
      </Link>
    </div>
  );
};

export default ApartmentCard;
