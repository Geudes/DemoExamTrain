import { Link } from "react-router";

const DoctorCard = ({ doctor }) => {

  return (
    <div className="card">
        <img src={doctor?.photo} alt={doctor?.name} />
        <div className="text">
            <h2>{doctor?.name} <br /> {doctor?.rating} ⭐</h2>
            <h3>{doctor?.price} ₽</h3>
            <div className="badges">
                <span>Спецализации</span>
                {doctor?.specializations?.map(spec => (
                    <div key={spec?.id} className="badge">
                        {spec?.name}
                    </div>
                ))}
            </div>
            <div className="badges">
                <span>Формат приёма</span>
                {doctor?.visitFormats?.map(format => (
                    <div key={format} className="badge">
                        {format}
                    </div>
                ))}
            </div>
        </div>
        <Link to={`/doctors/${doctor?.id}`} className="btn">Подробнее</Link>
    </div>
  );
};

export default DoctorCard;