import { Controller } from "react-hook-form";

const Input = ({ control, name, type = 'text', label, placeholder = label }) => {
  return (
    <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error }}) => (
            <div className="input">
                <label htmlFor={name}>{label}</label>
                <input id={name} type={type} placeholder={placeholder} className={error && 'error-input'} {...field} />
                <small className="error">{error?.message}</small>
            </div>
        )}
    />
  );
};

export default Input;