import React, { useEffect, useCallback } from "react";
import "./styles.css";
import Header from "../../../components/Header";
import ChampMatch from "../../../components/ChampMatch";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import { useAdminAuth } from "../../../hooks/useAdminAuth"; // Assuming path
import { useNavigate, useParams } from "react-router-dom";

//TODO integrar com o back

const ChampionshipProgressPlayoffs = () => {
  const { championshipId } = useParams(); // Get championshipId from URL
  const navigate = useNavigate()
  const teamNumber = 16;
  const { playoffsMatches, handlePlayoffsGetChampMatches } = usePlayerAuth();
  const { admin, handleUpdateMatchResult: adminHandleUpdateMatchResult } = useAdminAuth(); // Removed selectedChampionship as we'll use championshipId from params

  const getMatches = useCallback(async () => {
    if (championshipId) {
      try {
        console.log(`Fetching matches for championship ID: ${championshipId}`);
        await handlePlayoffsGetChampMatches(championshipId);
      } catch (error) {
        console.error('Erro ao buscar partidas:', error);
      }
    } else {
      console.log('Championship ID not found in URL for ChampionshipProgressPlayoffs');
    }
  }, [championshipId, handlePlayoffsGetChampMatches]);

  useEffect(() => {
    getMatches();
  }, [getMatches]); // Changed dependency to the memoized getMatches

  const handleSaveMatchResultWrapper = useCallback(async (partidaId, golsTimeA, golsTimeB) => {
    if (!adminHandleUpdateMatchResult) {
      console.error("handleUpdateMatchResult is not available from admin context");
      return;
    }
    try {
      await adminHandleUpdateMatchResult(partidaId, golsTimeA, golsTimeB);
      // Notification is handled in adminHandleUpdateMatchResult
      // Refresh matches after successful update
      await getMatches(); 
    } catch (error) {
      // Error notification is also handled in adminHandleUpdateMatchResult
      console.error("Failed to save match result from component:", error);
    }
  }, [adminHandleUpdateMatchResult, getMatches]);

  // useEffect(() => {
  //   const getMatches = async () => {
    // --- Stray code removed here ---
    // This useEffect is now replaced by the one above that calls the memoized getMatches
  // }, [championshipId, handlePlayoffsGetChampMatches]); // Add handlePlayoffsGetChampMatches to dependency array

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

        <div className="playoffs-card">
          <div className="playoffs-bracket">
          {/* Oitavas de Final */}
          {matchesByPhase.oitavas.length > 0 && (
            <div className="phase-column">
              <h2>Oitavas de Final</h2>
              {matchesByPhase.oitavas.map(match => (
                <ChampMatch 
                  key={match.id} 
                  {...match} 
                  partidaId={match.id} // Ensure match.id is the correct match identifier
                  isAdmin={!!admin && !!admin.id}
                  matchStatus={match.status} // Ensure match.status is available (e.g., 'agendada', 'finalizada')
                  onSaveResult={handleSaveMatchResultWrapper} 
                />
              ))}
            </div>
          )}

          {/* Quartas de Final */}
          {matchesByPhase.quartas.length > 0 && (
            <div className="phase-column">
              <h2>Quartas de Final</h2>
              {matchesByPhase.quartas.map(match => (
                <ChampMatch 
                  key={match.id} 
                  {...match} 
                  partidaId={match.id} // Ensure match.id is the correct match identifier
                  isAdmin={!!admin && !!admin.id}
                  matchStatus={match.status} // Ensure match.status is available (e.g., 'agendada', 'finalizada')
                  onSaveResult={handleSaveMatchResultWrapper} 
                />
              ))}
            </div>
          )}

          {/* Semifinal */}
          {matchesByPhase.semi.length > 0 && (
            <div className="phase-column">
              <h2>Semifinal</h2>
              {matchesByPhase.semi.map(match => (
                <ChampMatch 
                  key={match.id} 
                  {...match} 
                  partidaId={match.id} // Ensure match.id is the correct match identifier
                  isAdmin={!!admin && !!admin.id}
                  matchStatus={match.status} // Ensure match.status is available (e.g., 'agendada', 'finalizada')
                  onSaveResult={handleSaveMatchResultWrapper} 
                />
              ))}
            </div>
          )}

          {/* Final */}
          {matchesByPhase.final.length > 0 && (
            <div className="phase-column">
              <h2>Final</h2>
              {matchesByPhase.final.map(match => (
                <ChampMatch 
                  key={match.id} 
                  {...match} 
                  partidaId={match.id} // Ensure match.id is the correct match identifier
                  isAdmin={!!admin && !!admin.id}
                  matchStatus={match.status} // Ensure match.status is available (e.g., 'agendada', 'finalizada')
                  onSaveResult={handleSaveMatchResultWrapper} 
                />
              ))}
            </div>
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
