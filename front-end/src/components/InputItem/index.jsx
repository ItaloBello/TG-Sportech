import React from "react";
import "./styles.css";
import { Controller } from "react-hook-form";

const InputItem = ({
  placeholder,
  label,
  type,
  name,
  control,
  errorMessage,
  isDisabled = false,
  id
}) => {
  return (
    <div className="input-item">
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            className="input-item__input"
            placeholder={placeholder}
            disabled = {isDisabled}
            id={id}
          />
        )}
      />
      {errorMessage?
      <p style={{color:'red'}}>{errorMessage}</p>:
      <p>{label}</p>}
    </div>
  );
};

export default InputItem;
