import { useApartments, useDeleteApartments } from "../entities/apartments/api/apartmentQuery";

const MyListingsPage = () => {
  const { data: apartments } = useApartments(0, {
    mine: "true",
  });

  const { mutateAsync: deleteHandler } = useDeleteApartments()

  return (
    <>
      <div className="heading">
        <h1>Мои объекты</h1>
      </div>
      <div className="content">
        <div className="list">
          {apartments?.items?.map((apartment) => (
            <div className="card">
              <img src={apartment?.photo} alt={apartment?.title} />
              <div className="text">
                <h3>{apartment?.title}</h3>
                <h2>{apartment?.pricePerNight} ₽</h2>
                <span>
                  {apartment?.published ? "Опубликовано" : "Не опубликовано"}
                </span>
              </div>
              <div className="btns">
                <button className="btn">Редактировать</button>
                <button onClick={() => confirm('Вы точно хотите удалить') && deleteHandler(apartment?.id)} className="btn error">Удалить</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyListingsPage;
