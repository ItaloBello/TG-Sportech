import React, { useEffect, useCallback, useContext, useRef } from "react";
import "./styles.css";
import Header from "../../../components/Header";
import ChampMatch from "../../../components/ChampMatch";
import { usePlayerAuth } from "../../../hooks/usePlayerAuth";
import { useAdminAuth } from "../../../hooks/useAdminAuth"; // Assuming path
import { useNavigate, useParams } from "react-router-dom";
import { PlayerAuthContext } from "../../../context/playerAuth";

//TODO integrar com o back

const ChampionshipProgressPlayoffs = () => {
  const { championshipId } = useParams(); // Get championshipId from URL
  const navigate = useNavigate()
  const teamNumber = 16;
  const { playoffsMatches, handlePlayoffsGetChampMatches } = usePlayerAuth();
  const { isAdmin, handleUpdateMatchResult, handleGenerateNextPhase } = useAdminAuth();
  const { player } = useContext(PlayerAuthContext);

  // Debug: Check if handlePlayoffsGetChampMatches function reference changes
  const prevHandleGetMatchesRef = useRef();
  useEffect(() => {
    if (prevHandleGetMatchesRef.current && prevHandleGetMatchesRef.current !== handlePlayoffsGetChampMatches) {
      console.warn('DEBUG: handlePlayoffsGetChampMatches function reference CHANGED!');
    }
    prevHandleGetMatchesRef.current = handlePlayoffsGetChampMatches;
  }, [handlePlayoffsGetChampMatches]);
  
  // Verificar se o usuário é um dono de quadra
  const isCourtOwner = player && player.role === 'courtOwner';
  
  // Verificar se estamos na rota de admin ou jogador
  const currentPath = window.location.pathname;
  const isAdminRoute = currentPath.includes('/admin/');
  const isPlayerRoute = currentPath.includes('/player/');
  
  // Debug de permissões
  console.log('Path detection:', { 
    currentPath, 
    isAdminRoute, 
    isPlayerRoute,
    isAdmin,
    isCourtOwner
  });
  
  // CORRIGIDO: Forçar permissão de edição para rota admin
  // Problema: a URL mostrada na screenshot tem '/admin/' mas isAdminRoute não está detectando
  const hasAdminPath = currentPath.toLowerCase().includes('admin');
  const canEdit = hasAdminPath || isAdmin || isCourtOwner;
  
  console.log('Permissão final:', { canEdit, hasAdminPath });
  
  // Determinar título da página baseado na rota
  const pageTitle = hasAdminPath ? "Gerenciamento de Chaveamento" : "Chaveamento do campeonato";

  useEffect(() => {
    if (championshipId && typeof handlePlayoffsGetChampMatches === 'function') {
      console.log(`Fetching matches for championship ID: ${championshipId} (from useEffect)`);
      handlePlayoffsGetChampMatches(championshipId);
    } else if (!championshipId) {
      console.log('Championship ID not found in URL for ChampionshipProgressPlayoffs (from useEffect)');
    } else if (typeof handlePlayoffsGetChampMatches !== 'function'){
      console.warn('handlePlayoffsGetChampMatches is not a function or not yet available from context (from useEffect)');
    }
  }, [championshipId, handlePlayoffsGetChampMatches]);

  const handleSaveMatchResultWrapper = useCallback(async (partidaId, golsTimeA, golsTimeB) => {
    if (!handleUpdateMatchResult) {
      console.error("handleUpdateMatchResult is not available from admin context");
      return;
    }
    try {
      await handleUpdateMatchResult(partidaId, golsTimeA, golsTimeB);
      // Notification is handled in handleUpdateMatchResult
      // Refresh matches after successful update
      if (championshipId) {
        await handlePlayoffsGetChampMatches(championshipId);
      }
    } catch (error) {
      // Error notification is also handled in handleUpdateMatchResult
      console.error("Failed to save match result from component:", error);
    }
  }, [championshipId, handleUpdateMatchResult, handlePlayoffsGetChampMatches]);

  // Group matches by phase
  const matchesByPhase = {
    oitavas: playoffsMatches.filter(m => m.type === 'oitavas'),
    quartas: playoffsMatches.filter(m => m.type === 'quartas'),
    semi: playoffsMatches.filter(m => m.type === 'semi'),
    final: playoffsMatches.filter(m => m.type === 'final'),
  };
  
  // Determinar se há um campeão - quando a partida final tem resultado
  const finalMatch = matchesByPhase.final[0];
  const hasFinalScore = finalMatch && 
    (finalMatch.time1_pontos !== null && finalMatch.time2_pontos !== null);
  
  // Definir o campeão
  let champion = null;
  if (hasFinalScore) {
    // Verifica qual time venceu
    if (finalMatch.time1_pontos > finalMatch.time2_pontos) {
      // Time A venceu
      champion = {
        name: finalMatch.time1_nome || finalMatch.nameTimeA || 'Campeão',
        id: finalMatch.time1_id || finalMatch.timeAId,
        image: finalMatch.time1_image || finalMatch.imgTimeA || '../../../../public/copa-zn-icon.png',
        score: finalMatch.time1_pontos
      };
    } else {
      // Time B venceu
      champion = {
        name: finalMatch.time2_nome || finalMatch.nameTimeB || 'Campeão',
        id: finalMatch.time2_id || finalMatch.timeBId,
        image: finalMatch.time2_image || finalMatch.imgTimeB || '../../../../public/copa-zn-icon.png',
        score: finalMatch.time2_pontos
      };
    }
    console.log('Time campeão:', champion);
  }

  const getTeamNames = (match) => {
    // Assuming team names are available in match object
    return [match.time1_nome, match.time2_nome];
  };

  const getTeamImages = (match) => {
    // Return team logos if available
    return [match.time1_logo, match.time2_logo];
  };

  const handleSaveResult = (partidaId, golsTimeA, golsTimeB) => {
    if (handleSaveMatchResultWrapper) {
      handleSaveMatchResultWrapper(partidaId, golsTimeA, golsTimeB);
    } else {
      console.warn('handleSaveMatchResultWrapper is not defined');
    }
  };
  
  // Função para gerar a próxima fase do campeonato
  const handleGeneratePhase = async (fase) => {
    if (!handleGenerateNextPhase) {
      console.error("handleGenerateNextPhase não está disponível no contexto");
      return;
    }
    
    try {
      console.log(`Gerando fase: ${fase} para campeonato ${championshipId}`);
      
      // Usar quadraId do campeonato atual ou um valor padrão
      const quadraId = 1; // Você pode pegar dinamicamente de algum lugar se necessário
      
      // Chamar a API para gerar a próxima fase
      const result = await handleGenerateNextPhase(championshipId, fase, quadraId);
      console.log('Resultado da geração de fase:', result);
      
      // Forçar uma espera de 1 segundo para garantir que o backend processou as mudanças
      setTimeout(async () => {
        // Atualizar os dados com delay para garantir que o backend atualizou
        console.log('Recarregando dados após delay...');
        await handlePlayoffsGetChampMatches(championshipId);
      }, 1000);
      
    } catch (error) {
      console.error(`Erro ao gerar fase de ${fase}:`, error);
    }
  };

  return (
    <div className="championship-progress-playoffs-container">
      <Header link={1}/>
      <div className="display-area">
        <div className="display-area__header">
          <h1>{pageTitle}</h1>
          {isAdminRoute && (
            <div className="admin-controls">
              <p className="admin-notice">Você pode editar os resultados das partidas</p>
              
              <div className="next-phase-buttons">
                <button 
                  className="generate-phase-button" 
                  onClick={() => handleGeneratePhase('quartas')} 
                  disabled={matchesByPhase.quartas.length > 0}
                >
                  {matchesByPhase.quartas.length > 0 ? 'Quartas já geradas' : 'Gerar Quartas de Final'}
                </button>
                
                <button 
                  className="generate-phase-button" 
                  onClick={() => handleGeneratePhase('semi')} 
                  disabled={matchesByPhase.semi.length > 0 || matchesByPhase.quartas.length === 0}
                >
                  {matchesByPhase.semi.length > 0 ? 'Semifinais já geradas' : 'Gerar Semifinais'}
                </button>
                
                <button 
                  className="generate-phase-button" 
                  onClick={() => handleGeneratePhase('final')} 
                  disabled={matchesByPhase.final.length > 0 || matchesByPhase.semi.length === 0}
                >
                  {matchesByPhase.final.length > 0 ? 'Final já gerada' : 'Gerar Final'}
                </button>
              </div>
            </div>
          )}
          <button className="back-button" onClick={() => navigate(-1)}>Voltar</button>
        </div>

        {/* Exibir campeão se o campeonato estiver finalizado */}
        {champion && (
          <div className="champion-display">
            <div className="champion-container">
              <h2 className="champion-title">CAMPEONATO FINALIZADO</h2>
              <div className="champion-badge">
                <img src="/trophy.png" alt="Troféu" className="trophy-image-large" 
                     onError={(e) => { e.target.src = '/default-trophy.png'; }}
                />
                <h3 className="champion-subtitle">CAMPEÃO</h3>
              </div>
              
              <div className="champion-team">
                <img 
                  src={champion.image} 
                  alt={`${champion.name} - Campeão`} 
                  className="champion-image"
                  onError={(e) => { e.target.src = '/default-team.png'; }}
                />
                <h3 className="champion-name">{champion.name}</h3>
              </div>
              
              <div className="final-score">
                <p className="final-match-title">Placar da Final</p>
                <div className="final-match-score">
                  <span className="final-team-name">{finalMatch.nameTimeA || finalMatch.time1?.name || 'Time A'}</span>
                  <span className="final-score-value">{finalMatch.time1_pontos}</span>
                  <span className="final-score-separator">x</span>
                  <span className="final-score-value">{finalMatch.time2_pontos}</span>
                  <span className="final-team-name">{finalMatch.nameTimeB || finalMatch.time2?.name || 'Time B'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="playoffs-card">
          <div className="playoffs-bracket">
          {/* Oitavas de Final */}
          {matchesByPhase.oitavas.length > 0 && (
            <div className="phase-column">
              <h2>Oitavas de Final</h2>
              {matchesByPhase.oitavas.map(match => (
                <ChampMatch
                  key={match.id} 
                  type={match.type}
                  names={getTeamNames(match)}
                  images={getTeamImages(match)}
                  partidaId={match.id}
                  matchStatus={match.status}
                  golsTimeA={match.time1_pontos}
                  golsTimeB={match.time2_pontos}
                  onSaveResult={handleSaveResult}
                  isAdmin={canEdit}
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
                  type={match.type}
                  names={getTeamNames(match)}
                  images={getTeamImages(match)}
                  partidaId={match.id}
                  matchStatus={match.status}
                  golsTimeA={match.time1_pontos}
                  golsTimeB={match.time2_pontos}
                  onSaveResult={handleSaveResult}
                  isAdmin={canEdit}
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
                  type={match.type}
                  names={getTeamNames(match)}
                  images={getTeamImages(match)}
                  partidaId={match.id}
                  matchStatus={match.status}
                  golsTimeA={match.time1_pontos}
                  golsTimeB={match.time2_pontos}
                  onSaveResult={handleSaveResult}
                  isAdmin={canEdit}
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
                  type={match.type}
                  names={getTeamNames(match)}
                  images={getTeamImages(match)}
                  partidaId={match.id}
                  matchStatus={match.status}
                  golsTimeA={match.time1_pontos}
                  golsTimeB={match.time2_pontos}
                  onSaveResult={handleSaveResult}
                  isAdmin={canEdit}
                />
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
      <div className="my-matches-button-area">
        <button className="my-matches-button">Campeonato de número {championshipId}</button>
      </div>
    </div>
  );
};

export default ChampionshipProgressPlayoffs;
