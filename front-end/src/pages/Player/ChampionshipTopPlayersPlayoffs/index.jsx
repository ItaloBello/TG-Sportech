import React, { useEffect } from "react";
import "./styles.css";
import Header from "../../../components/Header";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import { useNavigate } from "react-router-dom";

//TODO Integrar com o back

const ChampionshipTopPlayersPlayoffs = () => {
  const navigate = useNavigate();
  const teamNumber = 16;
  const { selectedChampionship, topPlayers, handleGetTopPlayersChamp } =
    usePlayerAuth();

  useEffect(() => {
    const getTopPlayers = async () => {
      await handleGetTopPlayersChamp(1);
    };
    getTopPlayers();
    console.log(topPlayers);
  }, []);
  return (
    <div className="championship-in-progress top-players">
      <Header />
      <div className="progress-card">
        <div className="progress-card__title-area">
          <img
            className="progress-card__title-area-image"
            src="../../../../public/copa-fatec-icon.png"
            alt=""
          />
          <p>Copa Fatec</p>
        </div>
        <div className="progress-card__button-area">
          <button
            className="progress-card__button"
            onClick={() => navigate("/player/championship-progress/playoffs")}
          >
            Playoffs
          </button>
          <button className="progress-card__button-selected">
            Artilheiros
          </button>
        </div>
        <div className="progress-card__display-area top-players__display-area">
          <div className="progress-card__top-players">
            <div className="top-players__header">
              <span>Jogadores</span>
              <span>Gols</span>
            </div>
            {topPlayers.map((player, index) => (
              <div className="top-players__row" key={index}>
                <span>{player.name}</span>
                <span>{player.goals}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="my-matches-button-area">
        <button
          className="my-matches-button"
          onClick={() => navigate("/player/my-matches")}
        >
          Minhas Partidas
        </button>
      </div>
    </div>
  );
};

export default ChampionshipTopPlayersPlayoffs;
