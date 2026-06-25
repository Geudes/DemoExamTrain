import { useApartments } from "../entities/apartments/api/apartmentQuery";
import ApartmentCard from "../entities/apartments/ui/ApartmentCard";

const MyListingsPage = () => {

  const { data: apartments} = useApartments(0, {
    mine: 'true'
  })

  return (
    <>
      <div className="heading">
        <h1>Мои объекты</h1>
      </div>
      <div className="content">
        <div className="list">
          {
            apartments?.items?.map(apartment => (
              <ApartmentCard key={apartment?.id} apartment={apartment} />
            ))
          }
        </div>
      </div>
    </>
  );
};

export default MyListingsPage;