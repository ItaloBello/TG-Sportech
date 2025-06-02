import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { Controller } from "react-hook-form";

const MatchCardToCreate = ({ nameDate, nameTime, title, control }) => {
  return (
    <div className="match-card">
      <p className="match-card__text">{title}</p>
      <div className="match-card__input-area">
        <div className="match-card__input-item">
          <p>Insira a data</p>
          <Controller
            name={nameDate}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className="input-item__input"
                placeholder=""
              />
            )}
          />
        </div>
        <div className="match-card__input-item">
          <p>Escolha o horário</p>
          <Controller
            name={nameTime}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="time"
                className="input-item__input"
                placeholder=""
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchCardToCreate;
