import React from "react";
import "./styles.css"
import CardButton from "../CardButton"

const ChampDescription = ({description, title, registration, initialDate, finalDate, numberPlayers}) => {
  return (
    <div className="champ-description">
      <div className="champ-description__header">
        <img src=".../../../public/team-1-icon.png" alt="logoo" />
        <p>{title}</p>
      </div>
      <div className="champ-description__description">
        <p>
          Descrição:{description}
        </p>
      </div>
      <div className="champ-description__data">
        <p>Taxa de Inscricao: {registration}</p>
        <p>Data de inicio: {initialDate}</p>
        <p>Fim previsto: {finalDate}</p>
        <p>Numero de Jogadores: {numberPlayers}</p>
      </div>
      <div className="champ-description__button">
        <CardButton label="Escolha o time" colorButton="#14AE5C"/>
      </div>
    </div>
  );
};

export default ChampDescription;
