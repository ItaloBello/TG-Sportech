import React, { useEffect, useLayoutEffect, useState } from "react";
import Header from "../../../components/Header";
import CardList from "../../../components/CardList";
import "./styles.css";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import TeamCard from "../../../components/TeamCard";
import { notifySuccess, notifyError } from "../../../utils/notify";
import { api } from "../../../services/api";

const ShowTeam = () => {
  const handleDeleteTeam = async (teamId) => {
    try {
      await api.delete(`/api/jogador/times/${teamId}`);
      notifySuccess("Time deletado com sucesso!");
      handleGetMyTeams(player.id);
    } catch (error) {
      notifyError("Erro ao deletar time.");
    }
  };
  const { handleGetMyTeams, handleGetMyTeamSubscriptions,player, myTeams, mySubscriptions } = usePlayerAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getMyTeams = async () => {
      try {
        await handleGetMyTeams(player.id);
        await handleGetMyTeamSubscriptions(player.id);
      } finally {
        setIsLoading(false);
      }
    };
    if (player?.id) {
      getMyTeams();
    }
  }, [player?.id]);


  if (isLoading) return <></>;

  return (
    <div className="show-team">
      <Header link={1}/>
      <div className="show-team__title">
        <p>Meus times:</p>
      </div>
      {myTeams.map((team, index) => (
        <React.Fragment key={`team-${team.id || index}`}>
          <TeamCard
            addPlayer={true}
            name={team.name}
            date={team.data_criacao}
            id={team.id}
            src={team.img && team.img !== '' ? team.img : undefined}
            inviteCode={team.inviteCode}
            onDelete={() => handleDeleteTeam(team.id)}
          />
          <p>----------------------</p> 
        </React.Fragment>
      ))}

      <div className="show-team__title">
        <p>Times que participo:</p>
      </div>
      {mySubscriptions.map((team, index) => (
        <React.Fragment key={`subscription-${team.id || index}`}>
          <TeamCard
            addPlayer={false}
            name={team.name}
            date={team.data_criacao}
            id={team.id}
            src={team.img && team.img !== '' ? team.img : undefined}
            inviteCode={team.inviteCode}
          />
          <p>----------------------</p> 
        </React.Fragment>
      ))}
    </div>
  );
};

export default ShowTeam;
