import React from "react";
import { Controller } from "react-hook-form";

const ComboBoxItem = ({
  placeholder = "selecione",
  label,
  name,
  control,
  errorMessage,
  id,
  options = [],
  onChange,
  values = undefined,
}) => {
  return (
    <div>
      <div className="input-item">
        <Controller
          name={name}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <select
              {...field}
              className="input-item__input"
              id={id}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">{placeholder}</option>
              {!values ? (
                <>
                  {options.map((value, index) => {
                    return (
                      <option value={value} key={index}>
                        {options[index]}
                      </option>
                    );
                  })}
                </>
              ) : (
                <>{
                  values.map((value,index)=>{
                    return(
                      <option value={value} key={index}>
                        {options[index]}
                      </option>
                    )
                  })
                }</>
              )}
            </select>
          )}
        />

        {errorMessage ? (
          <p style={{ color: "red" }}>{errorMessage}</p>
        ) : (
          <p>{label}</p>
        )}
      </div>
    </div>
  );
};

export default ComboBoxItem;
