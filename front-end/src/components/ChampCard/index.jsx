import React from "react";
import "./styles.css";
import CardButton from "../CardButton";
const ChampCard = ({
  isInProgress = false,
  title,
  src,
  alt,
  initialDate,
  finalDate,
  team,
  premiation,
  onClick
}) => {
  return (
    <>
      <div className="champ-card">
        <div className="champ-card__header">
          <img src={src} alt={alt} />
          <div className="champ-card__button-area">
            <p>{title}</p>
            {isInProgress ? (
              <CardButton label="Visualizar" colorButton="#14AE5C" link={'/player/championship-progress/playoffs'} onClick={onClick}/>
            ) : (
              <CardButton label={"Mais Detalhe"} colorButton={'#14AE5C'} link='/player/subscribe-team' onClick={onClick}/>
            )}
          </div>
        </div>
        <div className="champ-card__data">
          <p>Data de Inicio: {initialDate}</p>
          <p>Data prevista de fim: {finalDate}</p>
          {isInProgress ? (
            <p>Time Inscrito: {team}</p>
          ) : (
            <p>Premiação: {premiation}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChampCard;
