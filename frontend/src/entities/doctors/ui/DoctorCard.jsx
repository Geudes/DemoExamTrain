import { Link } from "react-router";

const DoctorCard = ({ doctor }) => {
  const visitFormats = {
    in_person: "Очно",
    online: "Онлайн",
  };

  return (
    <div className="card">
      <img src={doctor?.photo} alt={doctor?.name} />
      <div className="text">
        <h3>
          {doctor?.name} <br /> {doctor?.rating} ⭐
        </h3>
        <h2>{doctor?.price} ₽</h2>
        <div className="badges">
          {doctor?.specializations?.map((specialization) => (
            <span key={specialization?.id} className="badge">
              {specialization?.name}
            </span>
          ))}
        </div>
        <div className="group">
            <span>Формат приёма</span>
          <div className="badges">
            {doctor?.visitFormats?.map((visitFormat) => (
              <span key={visitFormat} className="badge">
                {visitFormats[visitFormat]}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Link className="btn">Подробнее</Link>
    </div>
  );
};

export default DoctorCard;
