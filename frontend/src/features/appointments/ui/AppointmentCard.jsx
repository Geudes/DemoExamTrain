import { usePatchAppointment } from "../api/appointmentsQuery";

const AppointmentCard = ({ appointment, isPatient = true }) => {
  
    const { mutateAsync: changeStatusHandle } = usePatchAppointment()
     
  
    return (
    <tr>
      <td>
        {isPatient ? appointment?.doctor?.name : appointment?.patient?.name}
      </td>
      <td>
        {appointment?.date}, {appointment?.time}
      </td>
      <td>{appointment?.format}</td>
      <td>
        <div className="status">
            <div className={"badge " + appointment?.status}>{appointment?.status}</div>
            { isPatient && appointment?.status === 'pending' && (<button onClick={() => changeStatusHandle({ status: 'cancelled', id: appointment?.id })} className="btn">Отменить</button>)}
            {!isPatient && appointment?.status === 'pending' && (
                <div className="btns">
                    <button onClick={() => changeStatusHandle({ status: 'confirmed', id: appointment?.id })} className="btn primary">Подтвердить</button>
                    <button onClick={() => changeStatusHandle({ status: 'rejected', id: appointment?.id })} className="btn">Отклонить</button>
                </div>
            )}
        </div>
      </td>
    </tr>
  );
};

export default AppointmentCard;
