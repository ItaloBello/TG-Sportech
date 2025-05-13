import React from 'react'
import { Controller } from 'react-hook-form'

const RadioItem = ({ label, name, control, errorMessage, id, value }) => {
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
                type="radio"
                className="check-box-item__input"
                id={id}
                value={value}
              />
              <label htmlFor={id}>{label}</label>
            </>
          )}
        />
        {/* apagar aqui depois, error message apenas para fins de depuração de erros */}
        {errorMessage ? <p style={{ color: "red" }}>{errorMessage}</p> : <></>}
      </div>
    </div>
  )
}

export default RadioItem