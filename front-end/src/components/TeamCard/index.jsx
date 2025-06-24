import React from "react";
import CardButton from "../CardButton";
import { Link } from "react-router-dom";
import "./styles.css"

const TeamCard = ({
  name,
  date,
  src,
  alt ='logo',
  inviteCode,
  addPlayer,
  onDelete,
  id, // Adicionando id como prop
}) => {
  return (
    <div className="team-card">
      <img src={src} alt={alt} className="team-card__image" />
      <div className="team-card__content">
        <div className="team-card__text-area">
          <p className="team-card__team-name">Nome do time: {name}</p>
          <p className="team-card__creation-date">Data de Fundação: {date}</p>
          <p className="team-card__team-name">código: {inviteCode}</p>
        </div>
        <div className="team-card__button-area">
          <CardButton label="Excluir" colorButton="#EC221F" onClick={() => {
  console.log('Excluir clicado para time:', name);
  if (window.confirm('Tem certeza que deseja excluir este time? Essa ação não pode ser desfeita.')) {
    onDelete && onDelete();
  }
}} />
          {addPlayer ? (<>
            <CardButton label="Editar" colorButton="#14AE5C" link={`/player/edit-team/${id}`}/>
            {/* <button style={{border:'none', background:'transparent'}}>
              <img
                className="button-area__image"
                src="../../public/add-player-icon.png"
                alt="icone de adiconar o jogador"
                />
            </button> */}
                </>
          ) : (
            <><CardButton label="Visualizar" colorButton="#14AE5C" link={`/player/view-team/${id}`}/></>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
