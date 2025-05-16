import React from "react";
import "./styles.css";
import CardButton from "../CardButton";

const ChampDescription = ({
  description,
  title,
  registration,
  initialDate,
  finalDate,
  image,
}) => {
  return (
    <div className="champ-description">
      <div className="champ-description__header">
        <img src={image} alt="logoo" />
        <p>{title}</p>
      </div>
      <div className="champ-description__description">
        <p>Descrição:{description}</p>
      </div>
      <div className="champ-description__data">
        <p>Taxa de Inscricao: {registration}</p>
        <p>Data de inicio: {initialDate}</p>
        <p>Fim previsto: {finalDate}</p>
      </div>
      <div className="champ-description__button">
        <CardButton
          label="Escolha o time"
          colorButton="#14AE5C"
          link="/player/choose-team"
        />
      </div>
    </div>
  );
};

export default ChampDescription;
