import { Controller, useForm } from "react-hook-form";
import { useGetDoctors } from "../entities/doctors/api/doctorsQuery";
import DoctorCard from "../entities/doctors/ui/DoctorCard";
import { useGetSpecializations } from "../features/specializations/api/specializationsQuery";
import Select from "../ui/Select";

const HomePage = () => {

    const { control, watch } = useForm()

    const filters = watch()

    const { data: doctors } = useGetDoctors(filters)
    const { data: specializations } = useGetSpecializations()

  return (
    <>
      <div className="heading">
        <h1>Найти врача</h1>
      </div>
      <div className="content">
        <div className="filters">
            <Select
                control={control}
                name={'specializationId'}
                label={"Специализация"}
                values={specializations ?? []}
                defaultValue={''}
                emptyOption
            />
        </div>
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