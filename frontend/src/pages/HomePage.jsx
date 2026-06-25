import { useState } from "react";
import {
  useApartments,
  useCities,
} from "../entities/apartments/api/apartmentQuery";
import ApartmentCard from "../entities/apartments/ui/ApartmentCard";

const HomePage = () => {
  const [ offset ] = useState(0);
  const [ filters, setFilters ] = useState({});

  const { data: apartments } = useApartments(offset, filters);
  const { data: cities } = useCities();

  const changeHandler = (e) => {
    const { name, value } = e.target;

    if (value === "all" || value === 0) {
      setFilters((prev) => ({
        ...prev,
        [name]: undefined,
      }));
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ['apartment', 'studio', 'house', 'room']

  return (
    <>
      <div className="heading">
        <h1>Найти жильё</h1>
      </div>
      <div className="content">
        <div className="filters">
          <label>
            Город
            <select
              name="city"
              onChange={filters?.city}
              onChange={changeHandler}
            >
              <option value={"all"}>Все</option>
              {cities?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <label>
            Тип жилья
            <select name="type" value={filters?.type} onChange={changeHandler}>
              <option value="all">Все</option>
              <option value="apartment">Апартаменты</option>
              <option value="studio">Студия</option>
              <option value="house">Дом</option>
              <option value="room">Комната</option>
            </select>
          </label>
          <label>
            Кол-во комнат
            <select
              name="rooms"
              value={filters?.rooms}
              onChange={changeHandler}
            >
              <option value="all">Все</option>
              <option value="1">Однокомнатная</option>
              <option value="2">Двухкомнатная</option>
              <option value="3">Трёхкомнатная</option>
              <option value="4">Четыре комнаты</option>
            </select>
          </label>
          <div className="price">
            <label>
              Минимальная цена, ₽
              <input
                type="number"
                name="priceMin"
                min={0}
                step={50}
                value={filters?.priceMin}
                onChange={changeHandler}
              />
            </label>
            <label>
              Максимальная цена, ₽
              <input
                type="number"
                name="priceMax"
                min={0}
                step={50}
                value={filters?.priceMax}
                onChange={changeHandler}
              />
            </label>
          </div>
          <div className="sort">
              <label>
                Сортировать по
                <select
                  name="sortBy"
                  value={filters?.sortBy}
                  onChange={changeHandler}
                >
                  <option value="all">Не выбрано</option>
                  <option value="price">Цене</option>
                  <option value="rating">Рейтингу</option>
                </select>
              </label>
              <label>
                Значение сортировки
                <select
                  name="sortOrder"
                  value={filters?.sortOrder}
                  onChange={changeHandler}
                >
                  <option value="all">Не выбрано</option>
                  <option value="asc">По возрастанию</option>
                  <option value="desc">По убыванию</option>
                </select>
              </label>
            </div>
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
