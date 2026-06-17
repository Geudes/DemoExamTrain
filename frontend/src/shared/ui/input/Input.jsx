
const Input = ({ register, errors, name, label, type = 'text', placeholder }) => {
  return (
    <label>
        { label }
        <input className={errors[name] && 'error-input'} type={type} placeholder={placeholder} {...register(name)} />
        <small className="error">{errors[name]?.message}</small>
    </label>
  );
};

export default Input;