import React from "react";
import Header from "../components/Header";
import MenuList from "../components/MenuList";

const TeamMenu = () => {
  return (
    <div className="team-menu">
      <Header />
      <MenuList
        items={4}
        srcArray={[
          "../../public/create-team-icon.png",
          "../../public/join-team-icon.png",
          "../../public/edit-team-icon.png",
          "../../public/arrow-icon.png",
        ]}
        altArray={[
          "icone de criar time",
          "icone de entrar em time",
          "icone de editar time",
          "icone de voltar",
        ]}
        links={["/player/createteam", "/player/jointeam", "", "/player/menu"]}
        labels={["Criar Time", "Entrar em Time", "Editar Time", "Voltar"]}
        colors={["#14AE5C", "#14AE5C", "#14AE5C", "#EC221F"]}
      />
    </div>
  );
};

export default TeamMenu;
