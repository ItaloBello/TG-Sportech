import React, { useEffect } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const CourtCard = ({ name, id }) => {
  const { handleSetSelectedCourt } = useAdminAuth();

  return (
    <div className="court-card">
      <span>{name}</span>
      <Link  onClick={()=>handleSetSelectedCourt(id)}>
        Editar
      </Link>
    </div>
  );
};

export default CourtCard;
