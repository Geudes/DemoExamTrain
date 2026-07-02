import { useOutletContext } from "react-router";
import { useGetAppointments } from "../features/appointments/api/appointmentsQuery";
import AppointmentCard from "../features/appointments/ui/AppointmentCard";

const MyAppointmentsPage = () => {
  const { userRole } = useOutletContext();
  const { data: appointments } = useGetAppointments();
  return (
    <>
      <div className="heading">
        <h1>Мои записи</h1>
      </div>
      <div className="table-hidden">
        <table>
          <thead>
            <tr>
              <th>{userRole === "patient" ? "Врач" : "Пациент"}</th>
              <th>Дата и время</th>
              <th>Формат приёма</th>
              <th>Статус заявки</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((appointment) => (
              <AppointmentCard
                key={appointment?.id}
                isPatient={userRole === "patient"}
                appointment={appointment}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyAppointmentsPage;
