import { useOutletContext, useParams } from "react-router";
import { useGetDoctor } from "../entities/doctors/api/doctorsQuery";
import AppointmentsForm from "../features/appointments/ui/AppointmentsForm";

const DoctorPage = () => {
  const { id } = useParams();
  const { data: doctor } = useGetDoctor(id);

    const { userRole, showForm, setShowForm } = useOutletContext()

  return (
    <>
      <div className="heading">
        <h1>Профиль врача</h1>
      </div>
      <div className="content">
        <div className="card">
          <img src={doctor?.photo} alt={doctor?.name} />
          <div className="text">
            <h2>
              {doctor?.name} <br /> {doctor?.rating} ⭐
            </h2>
            <p style={{ width: '370px'}}>
                {doctor?.about}
            </p>
            <h3>{doctor?.price} ₽</h3>
            <div className="badges">
                <span>Контакты</span>
                <div className="badge">
                    {doctor?.contacts}
                </div>
            </div>
            <div className="badges">
              <span>Спецализации</span>
              {doctor?.specializations?.map((spec) => (
                <div key={spec?.id} className="badge">
                  {spec?.name}
                </div>
              ))}
            </div>
            <div className="badges">
              <span>Формат приёма</span>
              {doctor?.visitFormats?.map((format) => (
                <div key={format} className="badge">
                  {format}
                </div>
              ))}
            </div>
          </div>
          {
            userRole === 'patient' && (<button onClick={() => setShowForm(!showForm)} className="btn primary">Записаться на приём</button>)
          }
        </div>
        { showForm && (<AppointmentsForm />)}
      </div>
    </>
  );
};

export default DoctorPage;
