import React from "react";
import "./styles.css";
import Header from "../../components/Header";
import ChampCardList from "../../components/ChampCardList";
const PlayerChamp = () => {
  return (
    <div className="player-champ">
      <div className="player-champ__title">
        <p>Campeonatos</p>
      </div>
      <Header />
      <div className="player-champ__subtitle">
        <p>Em Andamento</p>
      </div>
      <ChampCardList
        items={1}
        isInProgress={true}
        altArray={["logo 1"]}
        finalDateArray={["15/04/2025"]}
        initialDateArray={["01/02/2025"]}
        srcArray={["../../public/team-1-icon.png"]}
        teamArray={["Fatec FC"]}
        titleArray={["COPA FATEC"]}
        premiationArray={[]}
      />
      <div className="player-champ__subtitle">
        <p>Não iniciados</p>
      </div>
      <ChampCardList
        items={1}
        isInProgress={false}
        altArray={["logo 1"]}
        finalDateArray={["15/04/2025"]}
        initialDateArray={["01/02/2025"]}
        srcArray={["../../public/team-1-icon.png"]}
        teamArray={["Fatec FC"]}
        titleArray={["COPA FATEC"]}
        premiationArray={["R$100,00"]}
      />
    </div>
  );
};

export default PlayerChamp;
