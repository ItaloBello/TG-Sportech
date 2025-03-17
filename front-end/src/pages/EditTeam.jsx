import React from "react";
import Header from "../components/Header";
import CardList from "../components/CardList";

const EditTeam = () => {
  return (
    <div className="edit-team">
      <Header />
      <CardList
        items={1}
        names={["Fatec FC"]}
        dates={["25/01/2025"]}
        buttonColorsArray={["#EC221F", "#14AE5C"]}
        buttonLabelsArray={["Excluir", "Editar"]}
        srcArray={["../../public/team-1-icon.png"]}
        altArray={["imagem do time 1"]}
        addPlayerType={1}
      />
    </div>
  );
};

export default EditTeam;
