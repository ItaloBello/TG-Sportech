import React from "react";
import "./styles.css";
import { Controller } from "react-hook-form";

const TableInputItem = ({ name, control, errorMessage, type = 'text'}) => {
  return (
    <div className="table-input-item">
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            className="table-input-item__input"
          />
        )}
      />
      {/* apagar aqui depois, error message apenas para fins de depuração de erros */}
      {errorMessage ? <p style={{ color: "red" }}>{errorMessage}</p> : <></>}
    </div>
  );
};

export default TableInputItem;
