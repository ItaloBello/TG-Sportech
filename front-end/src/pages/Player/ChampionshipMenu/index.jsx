import React, { useEffect } from "react";
import "./styles.css";
import Header from "../../../components/Header";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import ChampCard from "../../../components/ChampCard";

//TODO Integrar
const PlayerChamp = () => {
  const {
    player,
    inProgressChampionship,
    avaliableChampionship,
    handleGetInProgressChampionship,
    handleGetAvaliableChampionship,
    handleSetSelectedChamp
  } = usePlayerAuth();

  useEffect(() => {
    handleGetInProgressChampionship(player.id);
    handleGetAvaliableChampionship(player.id);
  }, [player.id]);

  return (
    <div className="player-champ">
      <div className="player-champ__title">
        <p>Campeonatos</p>
      </div>
      <Header link={1}/>
      <div className="player-champ__subtitle">
        <p>Em Andamento</p>
      </div>
      {inProgressChampionship.map((champ, index) => (
        <ChampCard
          alt={champ.altImage}
          finalDate={champ.finalDate}
          initialDate={champ.initialDate}
          src={champ.image}
          team={champ.subscribedTeam}
          title={champ.title}
          isInProgress={true}
          key={champ.id}
          onClick={()=>handleSetSelectedChamp(champ)}
        />
      ))}

      <div className="player-champ__subtitle">
        <p>Não iniciados</p>
      </div>
      {avaliableChampionship.map((champ, index) => (
        <ChampCard
          alt={champ.altImage}
          finalDate={champ.finalDate}
          initialDate={champ.initialDate}
          src={champ.image}
          premiation={champ.premiation}
          title={champ.title}
          isInProgress={false}
          key={champ.id}
          onClick={()=>handleSetSelectedChamp(champ)}
        />
      ))}
    </div>
  );
};

export default PlayerChamp;
