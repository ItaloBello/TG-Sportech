import React from "react";
import CardButton from "./CardButton";
import { Link } from "react-router-dom";

const TeamCard = ({
  name,
  date,
  buttonLabels,
  buttonColors,
  src,
  alt,
  addPlayer,
}) => {
  return (
    <div className="team-card">
      <img src={src} alt={alt} className="team-card__image" />
      <div className="team-card__content">
        <div className="team-card__text-area">
          <p className="team-card__team-name">Nome do time: {name}</p>
          <p className="team-card__creation-date">Data de Fundação: {date}</p>
        </div>
        <div className="team-card__button-area">
          <CardButton label={buttonLabels[0]} colorButton={buttonColors[0]} />
          <CardButton label={buttonLabels[1]} colorButton={buttonColors[1]} />
          {addPlayer ? (
            <Link>
              <img
                className="button-area__image"
                src="../../public/add-player-icon.png"
                alt="icone de adiconar o jogador"
              />
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
