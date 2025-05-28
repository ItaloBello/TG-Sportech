import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const SelectChampCard = ({
  img = "../../../public/championship-icon.png",
  title = "",
  isInProgress = false,
}) => {
  return (
    <div className="select-champ-card">
      <img src={img} alt="" />
      <div className="select-champ-card__text-area">
        <p>{title}</p>
        <Link
          to={
            isInProgress
              ? "/admin/select-championship/in-progress/select-match"
              : "/admin/select-championship/not-started/edit"
          }
        >
          Configurar
        </Link>
      </div>
    </div>
  );
};

export default SelectChampCard;
