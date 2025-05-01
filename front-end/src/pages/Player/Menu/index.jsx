import React from "react";
import Header from "../../../components/Header";
import "./styles.css";
import MenuItem from "../../../components/MenuItem";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
const PlayerMenu = () => {
  //no player estou guardando os dados do player obtidos apos o login
  const { player, handleLogOut } = usePlayerAuth();
  

  return (
    <div className="player-menu">
      <Header />
      {/* TODO remover este p depois, é so para testar */}
      <p>Olá, {player?.name ? player.name : "sem nome "}</p>
      <MenuItem
        src="../../public/profile-icon.png"
        alt="icone de perfil"
        link="/player/profile/"
        label="Meu perfil"
      />
      <MenuItem
        src="../../public/team-icon.png"
        alt="icone de time"
        link="/player/team-menu"
        label="Time"
      />
      <MenuItem
        src="../../public/championship-icon.png"
        alt="icone de campeonato"
        link="/player/championship"
        label="Campeonato"
      />
      <MenuItem
        src="../../public/calendar-icon.png"
        alt="icone de agendamento"
        link=""
        label="Agendamento"
      />
   
      <div className="player-menu__log-out-button">
        <button onClick={handleLogOut}>
          <img src="../../public/log-out-icon.png" alt="icone de log out" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default PlayerMenu;
