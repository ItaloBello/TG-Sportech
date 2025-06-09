import React, { useEffect } from "react";
import "./styles.css";
import Header from "../../../components/Header";
import ChampMatch from "../../../components/ChampMatch";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import { useNavigate } from "react-router-dom";

//TODO integrar com o back

const ChampionshipProgressPlayoffs = () => {
  const navigate = useNavigate()
  const teamNumber = 16;
  const { selectedChampionship, playoffsMatches, handlePlayoffsGetChampMatches } = usePlayerAuth();

  useEffect(() => {
    const getMatches = async () => {
      if (selectedChampionship?.id) {
        try {
          await handlePlayoffsGetChampMatches(selectedChampionship.id);
        } catch (error) {
          console.error('Erro ao buscar partidas:', error);
        }
      }
    };
    getMatches();
  }, [selectedChampionship]);
  return (
    <div className="championship-in-progress">
      <Header link={1}/>
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
          <button className="progress-card__button-selected">Playoffs</button>
          {/* <button className="progress-card__button" onClick={()=>navigate('/player/championship-progress/playoffs/top-players')}>Artilheiros</button> */}
        </div>
        <div className="progress-card__display-area">
          {teamNumber >= 16 ? (
            <>
              <div className="display-area__row" >
                {playoffsMatches.map((match, index) =>
                  match.type == "oitavas" ? (
                    <ChampMatch
                      type={match.type}
                      names={match.names}
                      points={match.points}
                      images={match.images}
                      key={match.id}
                    />
                  ) : (
                    <></>
                  )
                )}
              </div>
            </>
          ) : (
            <></>
          )}
          {teamNumber >= 8 ? (
            <>
              <div className="display-area__row">
                {playoffsMatches.map((match, index) =>
                  match.type == "quartas" ? (
                    <ChampMatch
                      type={match.type}
                      names={match.names}
                      points={match.points}
                      images={match.images}
                      key={match.id}
                    />
                  ) : (
                    <></>
                  )
                )}
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="display-area__row">
            {playoffsMatches.map((match, index) =>
              match.type == "semi" ? (
                <ChampMatch
                  type={match.type}
                  names={match.names}
                  points={match.points}
                  images={match.images}
                  key={match.id}
                />
              ) : (
                <></>
              )
            )}
          </div>
          <div className="display-area__row">
            {playoffsMatches.map((match, index) =>
              match.type == "final" ? (
                <ChampMatch
                  type={match.type}
                  names={match.names}
                  points={match.points}
                  images={match.images}
                  key={match.id}
                />
              ) : (
                <></>
              )
            )}
          </div>
        </div>
      </div>
      <div className="my-matches-button-area">
        <button className="my-matches-button" onClick={()=>navigate('/player/my-matches')}>Minhas Partidas</button>
      </div>
    </div>
  );
};

export default ChampionshipProgressPlayoffs;
