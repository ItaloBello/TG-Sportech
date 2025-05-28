import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
const AppointmentCard = ({
  type,
  adversary = null,
  date,
  times,
  status,
  court = '',
  toEdit = false,
}) => {
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
          <span key={index}>{time + "; "}</span>
        ))}
      </p>
      <p className="appointment-card__text">Quadra:{court}</p>
      <p className="appointment-card__text">
        Status:{" "}
        {status.split(" ")[0] == "Pagamento" ? (
          <span style={{ color: "#F17C3C" }}>{status}</span>
        ) : (
          <span style={{ color: "#14AE5C" }}>{status}</span>
        )}
      </p>
      {type == "Amistoso" && status.split(" ")[0] == "Confirmação" ? (
        <div>
          <button>Aceitar</button>
          <button>Recusar</button>
        </div>
      ) : (
        <></>
      )}
      {toEdit ? <Link to='/admin/select-appointment/edit'>Editar</Link> : <></>}
    </div>
  );
};

export default AppointmentCard;
