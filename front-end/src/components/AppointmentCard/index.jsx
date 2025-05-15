import React from "react";
import "./styles.css";
const ApoointmentCard = ({ type, adversary = null, date, times, status }) => {
  return (
    <div className="appointment-card">
      <p className="appointment-card__text">Tipo de Jogo: {type}</p>
      {adversary ? (
        <p className="appointment-card__text">Advesario: {adversary}</p>
      ) : (
        <></>
      )}
      <p className="appointment-card__text">Data: {date}</p>
      <p className="appointment-card__text">
        Horario(s):
        {times.map((time, index) => (
          <span>{time + "; "}</span>
        ))}
      </p>
      <p className="appointment-card__text">
        Status:{" "}
        {status.split(" ")[0] == "Pagamento" ? (
          <span style={{ color: "#F17C3C" }}>{status}</span>
        ) : (
          <span style={{ color: "#14AE5C" }}>{status}</span>
        )}
      </p>
    </div>
  );
};

export default ApoointmentCard;
