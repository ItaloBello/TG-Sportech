import React, { useEffect, useLayoutEffect, useState } from "react";
import Header from "../../../components/Header";
import CardList from "../../../components/CardList";
import "./styles.css";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import TeamCard from "../../../components/TeamCard";

const ShowTeam = () => {
  const { handleGetMyTeams, player, myTeams } =
    usePlayerAuth();
    const [isLoading, setIsLoading]= useState(true)
  useEffect(() => {
    const getMyTeams = async () => {
      try{
        await handleGetMyTeams(player.id);
      }finally{
        setIsLoading(false)
      }
    };
    if (player?.id) {
      getMyTeams();
    }
  }, [player?.id]);

  if(isLoading) return <></>
  return (
    <div className="show-team">
      <Header />
      <div className="show-team__title">
        <p>Meus times:</p>
      </div>
      {Array(myTeams.length)
        .fill(" ")
        .map((value, index) => (
          <TeamCard
            addPlayer={true}
            name={myTeams[index].name}
            date={myTeams[index].data_criacao}
            key={index}
          />
        ))}

      <div className="show-team__title">
        <p>Times que participo:</p>
      </div>
      {/* TODO: Aqui tem que integrar para pegar os times que o jogador participa, mas não é dono */}
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
