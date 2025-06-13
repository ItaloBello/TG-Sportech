import React, { useEffect } from "react";
import "./styles.css";
import Header from "../../../components/Header";
import ChampMatch from "../../../components/ChampMatch";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import { useNavigate, useParams } from "react-router-dom";

//TODO integrar com o back

const ChampionshipProgressPlayoffs = () => {
  const { championshipId } = useParams(); // Get championshipId from URL
  const navigate = useNavigate()
  const teamNumber = 16;
  const { playoffsMatches, handlePlayoffsGetChampMatches } = usePlayerAuth(); // Removed selectedChampionship as we'll use championshipId from params

  useEffect(() => {
    const getMatches = async () => {
      if (championshipId) { // Use championshipId from URL
        try {
          // For now, we are just focusing on displaying the screen.
          // The actual data fetching might need adjustment based on how handlePlayoffsGetChampMatches works.
          console.log(`Fetching matches for championship ID: ${championshipId}`);
          await handlePlayoffsGetChampMatches(championshipId);
        } catch (error) {
          console.error('Erro ao buscar partidas:', error);
        }
      } else {
        console.log('Championship ID not found in URL for ChampionshipProgressPlayoffs');
      }
    };
    getMatches();
  }, [championshipId, handlePlayoffsGetChampMatches]); // Add handlePlayoffsGetChampMatches to dependency array

  // Group matches by phase
  const matchesByPhase = {
    oitavas: playoffsMatches.filter(m => m.type === 'oitavas'),
    quartas: playoffsMatches.filter(m => m.type === 'quartas'),
    semi: playoffsMatches.filter(m => m.type === 'semi'),
    final: playoffsMatches.filter(m => m.type === 'final'),
  };

  return (
    <div className="championship-progress-playoffs-container">
      <Header link={1}/>
      <div className="display-area">
        <div className="display-area__header">
          <h1>Chaveamento do campeonato</h1>
          <button className="back-button" onClick={() => navigate(-1)}>Voltar</button>
        </div>

        <div className="playoffs-bracket">
          {/* Oitavas de Final */}
          {matchesByPhase.oitavas.length > 0 && (
            <div className="phase-column">
              <h2>Oitavas de Final</h2>
              {matchesByPhase.oitavas.map(match => (
                <ChampMatch key={match.id} {...match} />
              ))}
            </div>
          )}

          {/* Quartas de Final */}
          {matchesByPhase.quartas.length > 0 && (
            <div className="phase-column">
              <h2>Quartas de Final</h2>
              {matchesByPhase.quartas.map(match => (
                <ChampMatch key={match.id} {...match} />
              ))}
            </div>
          )}

          {/* Semifinal */}
          {matchesByPhase.semi.length > 0 && (
            <div className="phase-column">
              <h2>Semifinal</h2>
              {matchesByPhase.semi.map(match => (
                <ChampMatch key={match.id} {...match} />
              ))}
            </div>
          )}

          {/* Final */}
          {matchesByPhase.final.length > 0 && (
            <div className="phase-column">
              <h2>Final</h2>
              {matchesByPhase.final.map(match => (
                <ChampMatch key={match.id} {...match} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="my-matches-button-area">
        <button className="my-matches-button" onClick={()=>navigate('/player/my-matches')}>Minhas Partidas</button>
      </div>
    </div>
  );
};

export default ChampionshipProgressPlayoffs;
