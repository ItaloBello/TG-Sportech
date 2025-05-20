import React, { useEffect } from "react";
import "./styles.css";
import Header from "../../../components/Header";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import { useNavigate } from "react-router-dom";

//TODO Integrar com o back

const ChampionshipProgressPoints = () => {
  const navigate = useNavigate()
  const teamNumber = 16;
  const { selectedChampionship, champTablePoints,handleGetChampPointsTable } = usePlayerAuth();

  useEffect(() => {
    const getMatches = async () => {
      await handleGetChampPointsTable(1);
    };
    getMatches();
    console.log(champTablePoints);
  }, []);
  return (
    <div className="championship-in-progress">
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
          <button className="progress-card__button-selected">Pontos Corridos</button>
          <button className="progress-card__button" onClick={()=>navigate('/player/championship-progress/points/top-players')}>Artilheiros</button>
        </div>
        <div className="progress-card__display-area">
          <div className="progress-card__points-table">
            <div className="progress-card__table-header">
                <span>Pos</span>
                <span>Time</span>
                <span>PJ</span>
                <span>Vit</span>
                <span>E</span>
                <span>Der</span>
                <span>SG</span>
                <span>PTS</span>
            </div>
            {champTablePoints.map((row,index)=>
            <div className="progress-card__table-row" key={index}>
              <div className="progress-card__table-column">{row.position}</div>
              <div className="progress-card__table-column">{row.name}</div>
              <div className="progress-card__table-column">{row.playedMatches}</div>
              <div className="progress-card__table-column">{row.victories}</div>
              <div className="progress-card__table-column">{row.draws}</div>
              <div className="progress-card__table-column">{row.defeats}</div>
              <div className="progress-card__table-column">{row.goalDifference}</div>
              <div className="progress-card__table-column">{row.points}</div>
            </div>)}
            
          </div>
        </div>
      </div>
      <div className="my-matches-button-area">
        <button className="my-matches-button" onClick={()=>navigate('/player/my-matches')}>Minhas Partidas</button>
      </div>
    </div>
  );
};

export default ChampionshipProgressPoints;
