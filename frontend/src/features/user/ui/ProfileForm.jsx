import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateProfile } from "../api/userQuery";
import { useOutletContext } from "react-router";

const schema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("patient"),
      role: z.enum(["patient", "doctor"], { message: "Недопустимая роль" }),
      name: z
        .string()
        .min(5, "Поле слишком короткое")
        .max(20, "Поле слишком длинное"),
      email: z
        .string()
        .email("Некорректная почта")
        .min(1, "Это поле обязательно"),
      password: z
        .string()
        .min(6, "Поле слишком короткое")
        .max(12, "Поле слишком длинное"),
      confirmPassword: z.string().min(1, "Это поле обязательно"),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      message: "Пароли не совпадают",
      path: ["confirmPassword"],
    }),
  z
    .object({
      type: z.literal("doctor"),
      role: z.enum(["patient", "doctor"], { message: "Недопустимая роль" }),
      name: z
        .string()
        .min(5, "Поле слишком короткое")
        .max(20, "Поле слишком длинное"),
      email: z
        .string()
        .email("Некорректная почта")
        .min(1, "Это поле обязательно"),
      password: z
        .string()
        .min(6, "Поле слишком короткое")
        .max(12, "Поле слишком длинное"),
      confirmPassword: z.string().min(1, "Это поле обязательно"),
      about: z.string().min(1, "Это поле обязательно"),
      photo: z
        .string()
        .url("Не правильный URL адрес")
        .min(1, "Это поле обязательно"),
      price: z.coerce.number().gt(0, "Приём не должен быть бесплатным"),
      rating: z.coerce
        .number()
        .gt(0, "Вы не можете поставить 0 оценку")
        .lte(5, "Оценка не может быть больше 5"),
      contacts: z.string().min(1, "Это поле обязательно"),
      visitFormats: z
        .array(z.string())
        .nonempty("Массив не должен быть пустым"),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      message: "Пароли не совпадают",
      path: ["confirmPassword"],
    }),
]);

const ProfileForm = () => {
  const { user, userRole, setShowForm } = useOutletContext();

  const { mutateAsync } = useUpdateProfile();

  const updateHandle = async (data) => {
    await mutateAsync(data);
    setShowForm(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...user,
      type: user?.role ?? 'guest',
    },
  });

  return (
    <form onSubmit={handleSubmit(updateHandle)}>
      <div className="heading">
        <h1>Обновление профиля</h1>
        <button onClick={() => setShowForm(false)} className="btn">Закрыть</button>
      </div>
      <label>
        Роль
        <select className={errors?.role && "error"} {...register("role")}>
          <option value="patient">Пациент</option>
          <option value="doctor">Доктор</option>
        </select>
        <small className="error">{errors?.role?.message}</small>
      </label>
      <label>
        Имя
        <input
          placeholder="Ivan"
          className={errors?.name && "error"}
          {...register("name")}
        />
        <small className="error">{errors?.name?.message}</small>
      </label>
      <label>
        Электронная почта
        <input
          placeholder="example@mail.ru"
          className={errors?.email && "error"}
          {...register("email")}
        />
        <small className="error">{errors?.email?.message}</small>
      </label>
      <label>
        Пароль
        <input
          placeholder="******"
          className={errors?.password && "error"}
          {...register("password")}
        />
        <small className="error">{errors?.password?.message}</small>
      </label>
      <label>
        Подтверждение пароля
        <input
          placeholder="******"
          className={errors?.confirmPassword && "error"}
          {...register("confirmPassword")}
        />
        <small className="error">{errors?.confirmPassword?.message}</small>
      </label>
      {userRole === "doctor" && (
        <>
          <label>
            Описание
            <input
              placeholder="Опишите себя как врача"
              className={errors?.about && "error"}
              {...register("about")}
            />
            <small className="error">{errors?.about?.message}</small>
          </label>
          <label>
            Ссылка на фото
            <input
              placeholder="https://example.com"
              className={errors?.photo && "error"}
              {...register("photo")}
            />
            <small className="error">{errors?.photo?.message}</small>
          </label>
          <label>
            Цена
            <input
              placeholder="100"
              min={1}
              step={100}
              className={errors?.price && "error"}
              {...register("price")}
            />
            <small className="error">{errors?.price?.message}</small>
          </label>
          <label>
            Рейтинг
            <input
              placeholder="1-5"
              min={1}
              step={0.1}
              max={5}
              className={errors?.rating && "error"}
              {...register("rating")}
            />
            <small className="error">{errors?.rating?.message}</small>
          </label>
          <label>
            Номер телефона
            <input
              placeholder="+7 999 999 99 99"
              className={errors?.contacts && "error"}
              {...register("contacts")}
            />
            <small className="error">{errors?.contacts?.message}</small>
          </label>
          <label>
            Форматы визита
            {user?.visitFormats.map((format) => (
              <label key={format}>
                {format}
                <input
                  type="checkbox"
                  {...register("visitFormats")}
                  value={format}
                />
              </label>
            ))}
          </label>
        </>
      )}
      <button className="btn primary">Обновить</button>
    </form>
  );
};

export default ProfileForm;
