import { useGetDoctors } from "../entities/doctors/api/doctorsQuery";
import DoctorCard from "../entities/doctors/ui/DoctorCard";

const HomePage = () => {

    const { data: doctors } = useGetDoctors()

  return (
    <>
      <div className="heading">
        <h1>Найти врача</h1>
      </div>
      <div className="content">
            <div className="list">
                {
                    doctors?.items?.map(doctor => (
                        <DoctorCard key={doctor?.id} doctor={doctor} />
                    ))
                }
            </div>
      </div>
    </>
  );
};

export default HomePage;