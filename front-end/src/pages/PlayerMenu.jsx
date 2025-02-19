import React from "react";
import Header from "../components/Header";
import MenuList from "../components/MenuList";

const PlayerMenu = () => {
  return (
    <div className="player-menu">
      <Header />
      <MenuList
        items={5}
        srcArray={[
          "../../public/profile-icon.png",
          "../../public/team-icon.png",
          "../../public/championship-icon.png",
          "../../public/calendar-icon.png",
          "../../public/log-out-icon.png",
        ]}
        altArray={[
          "icone de perfil",
          "icone de time",
          "icone de campeonato",
          "icone de agendamento",
          "icone de log out",
        ]}
        links={[]}
        labels={["Meu perfil", "Time", "Campeonato", "Agendamento", "Sair"]}
        colors={["#14AE5C", "#14AE5C", "#14AE5C", "#14AE5C", "#EC221F"]}
      />
    </div>
  );
};

export default PlayerMenu;
