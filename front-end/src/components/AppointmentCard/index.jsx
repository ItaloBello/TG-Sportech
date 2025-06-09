import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
const AppointmentCard = ({
  type,
  adversary = null,
  date,
  times,
  status,
  court = "",
  toEdit = false,
  id,
  dell,
}) => {
  const { handleSetSelectedAppointment } = useAdminAuth();
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
      {toEdit ? (
        <div className="appointment-card__button-area">
          <Link
            to="/admin/select-appointment/edit"
            onClick={() => handleSetSelectedAppointment(id)}
          >
            Editar
          </Link>
          <button className="appointment-card__delete-button" onClick={dell}>Excluir</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AppointmentCard;
