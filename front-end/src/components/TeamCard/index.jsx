import React from "react";
import CardButton from "../CardButton";
import { Link } from "react-router-dom";
import "./styles.css"

const TeamCard = ({
  name,
  date,
  src = '../../public/team-1-icon.png',
  alt ='logo',
  addPlayer = false,
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
          <CardButton label="Excluir" colorButton="#EC221F" />
          {addPlayer ? (<>
            <CardButton label="Editar" colorButton="#14AE5C" link='/player/edit-team'/>
            <button style={{border:'none', background:'transparent'}}>
              <img
                className="button-area__image"
                src="../../public/add-player-icon.png"
                alt="icone de adiconar o jogador"
                />
            </button>
                </>
          ) : (
            <><CardButton label="Visualizar" colorButton="#14AE5C" link='/player/view-team'/></>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
