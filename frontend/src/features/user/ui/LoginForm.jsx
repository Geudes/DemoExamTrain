import { useLogin } from "../api/userQuery";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../shared/ui/input/Input";

const schema = z.object({
  email: z.string().email("Некорректная почта").min(1, "Это поле обязательно"),
  password: z
    .string()
    .min(6, "Поле слишком короткое")
    .max(12, "Поле слишком длинное"),
});

const LoginForm = () => {
  const { mutateAsync: loginHandle } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(loginHandle)}>
      <Input
        register={register}
        errors={errors}
        label={"Электронная почта"}
        name={"email"}
        placeholder={"example@mail.ru"}
      />
      <Input
        register={register}
        errors={errors}
        label={"Пароль"}
        name={"password"}
        placeholder={"******"}
      />
      <button className="btn primary">Зарегестрироваться</button>
    </form>
  );
};
export default LoginForm;
