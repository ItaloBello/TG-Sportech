import React, { useEffect } from "react";
import Header from "../../../components/Header";
import ChampDescription from "../../../components/ChampDescription";
import "./styles.css";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import CardButton from "../../../components/CardButton";

const SubscribeTeam = () => {
  const { selectedChampionship } = usePlayerAuth();
  
  return (
    <div className="subscribe-team">
      <Header link={1}/>
      <ChampDescription
        description={selectedChampionship.description}
        title={selectedChampionship.title}
        finalDate={selectedChampionship.finalDate}
        initialDate={selectedChampionship.initialDate}
        registration={selectedChampionship.registration}
        image={selectedChampionship.image}
      />
    </div>
  );
};

export default SubscribeTeam;
