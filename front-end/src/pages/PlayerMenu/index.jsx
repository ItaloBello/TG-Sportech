import React from "react";
import Header from "../../components/Header";
import "./styles.css";
import MenuItem from "../../components/MenuItem";
const PlayerMenu = () => {
  return (
    <div className="player-menu">
      <Header />
      <MenuItem
        src="../../public/profile-icon.png"
        alt="icone de perfil"
        link="/player/profile/"
        label="Meu perfil"
      />
      <MenuItem
        src="../../public/team-icon.png"
        alt="icone de time"
        link="/player/teammenu"
        label="Time"
      />
      <MenuItem
        src="../../public/championship-icon.png"
        alt="icone de campeonato"
        link=""
        label="Campeonato"
      />
      <MenuItem
        src="../../public/calendar-icon.png"
        alt="icone de agendamento"
        link=""
        label="Agendamento"
      />
      <MenuItem
        src="../../public/log-out-icon.png"
        alt="icone de log out"
        link="/"
        label="Sair"
        color="#EC221F"
      />
    </div>
  );
};

export default PlayerMenu;
