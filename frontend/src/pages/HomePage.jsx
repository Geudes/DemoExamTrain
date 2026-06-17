import { useState } from "react";
import { useApartments } from "../entities/apartments/api/apartmentsQuery";
import ApartmentCard from "../entities/apartments/ui/ApartmentCard";
import { useForm } from "react-hook-form";

const HomePage = () => {
  const [offset, setOffset] = useState(0);
  const [filtres, setFilters] = useState({});

  const { data: apartments } = useApartments(offset, filtres);

  const changeHandler = (e) => {
    const { name, value } = e.target

    if(value === 'all') {
        setFilters(p => ({
            ...p,
            [name]: null
        }))
        return
    }

    setFilters(p => ({
        ...p,
        [name]: value
    }))
  }

  const {
    register,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  })

  console.log(apartments);

  return (
    <>
      <div className="heading">
        <h1>HomePage</h1>
      </div>
      <div className="content">
        <div className="filters">
            <label>
                Тип жилья
                <select name="type" value={filtres?.type} onChange={changeHandler} >
                    <option value="all">Все</option>
                    <option value="apartment">Апартаменты</option>
                    <option value="studio">Студия</option>
                    <option value="house">Дом</option>
                    <option value="room">Комната</option>
                </select>
            </label>
            <label>
                Кол-во комнат
                <select name="rooms" value={filtres?.rooms} onChange={changeHandler} >
                    <option value="all">Все</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </label>
            <label>
                Минимальная цена {filtres?.priceMin}
                <input type="range" name="priceMin" value={filtres?.priceMin} min={0} step={100} max={20000} onChange={changeHandler} />
            </label>
            <label>
                Максимальная цена {filtres?.priceMax}
                <input type="range" name="priceMax" value={filtres?.priceMax} min={0} step={100} max={20000} onChange={changeHandler} />
            </label>
        </div>
        <div className="list">
          {apartments?.items?.map((apartment) => (
            <ApartmentCard key={apartment?.id} apartment={apartment} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
