import React from "react";
import { Controller } from "react-hook-form";
import "./styles.css";

const CheckBoxItem = ({ label, name, control, errorMessage, id, onChange }) => {
  const handleChange = (e) => {
    const isChecked = e.target.checked
    onChange(label,isChecked)
  };
  return (
    <div>
      <div className="check-box-item">
        <Controller
          name={name}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <>
              <input
                {...field}
                type="checkbox"
                className="check-box-item__input"
                id={id}
                onChange={handleChange}
              />
              <label htmlFor={id}>{label}</label>
            </>
          )}
        />
        {/* apagar aqui depois, error message apenas para fins de depuração de erros */}
        {errorMessage ? <p style={{ color: "red" }}>{errorMessage}</p> : <></>}
      </div>
    </div>
  );
};

export default CheckBoxItem;
