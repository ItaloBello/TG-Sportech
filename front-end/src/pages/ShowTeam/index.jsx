import React from "react";
import Header from "../../components/Header";
import CardList from "../../components/CardList";
import "./styles.css"

const ShowTeam = () => {
  return (
    <div className="show-team">
      <Header />
      <div className="show-team__title">
        <p>Meus times:</p>
      </div>
      <CardList
        items={1}
        names={["Fatec FC"]}
        dates={["25/01/2025"]}
        srcArray={["../../public/team-1-icon.png"]}
        altArray={["imagem do time 1"]}
        addPlayerType={1}
      />
      <div className="show-team__title">
        <p>Times que participo:</p>
      </div>
      <CardList
        items={1}
        names={["Fatec FC"]}
        dates={["25/01/2025"]}
        buttonColorsArray={["#EC221F", "#14AE5C"]}
        buttonLabelsArray={["Excluir", "Editar"]}
        srcArray={["../../public/team-1-icon.png"]}
        altArray={["imagem do time 1"]}
        addPlayerType={0}
        
      />
    </div>
  );
};

export default ShowTeam;
