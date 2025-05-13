import React from "react";
import Header from "../../../components/Header";
import MenuItem from "../../../components/MenuItem";

const TeamMenu = () => {
  return (
    <div className="team-menu">
      <Header />
      <MenuItem
        src="../../public/create-team-icon.png"
        alt="icone de criar time"
        link="/player/create-team"
        label="Criar Time"
      />
      <MenuItem
        src="../../public/join-team-icon.png"
        alt="icone de entrar em time"
        link="/player/join-team"
        label="Entrar em Time"
      />
      <MenuItem
        src="../../public/edit-team-icon.png"
        alt="icone de editar time"
        link="/player/show-team"
        label="Editar Time"
      />
      <MenuItem
        src="../../public/arrow-icon.png"
        alt="icone de voltar"
        link="/player/menu"
        label="Voltar"
        color="#EC221F"
      />
    </div>
  );
};

export default TeamMenu;
