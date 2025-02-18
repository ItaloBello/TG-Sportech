import React from "react";
import { Link } from "react-router-dom";

const MenuItem = ({ src, alt, link, label }) => {
  return (
    <div className="menu-item">
      <Link>
        <img src="../../public/calendar-icon.png" alt="imagem x" />
        <p>Agendamentos</p>
      </Link>
    </div>
  );
};

export default MenuItem;
