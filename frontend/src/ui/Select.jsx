import { Controller } from "react-hook-form";

const Select = ({ control, name, values, label, defaultValue, emptyOption = false}) => {
  return (
    <Controller
        control={control}
        name={name}
        render={({ field, fieldState: {error}}) => (
            <div className="select">
                <label htmlFor={name}>{label}</label>
                <select className={error && 'error-input'} id={name} {...field}>
                    {emptyOption && (<option key={'all'} value={''}>Все</option>)}
                    {
                    values.map((value) => (
                        
                        <option key={value?.id ?? value} value={value?.id ?? value}>{value?.name ?? value}</option>
                    ))
                    }
                </select>
                <small className="error">{error?.message}</small>
            </div>
        )}
        defaultValue={defaultValue ?? values[0]?.id}
    />
  );
};

export default Select;