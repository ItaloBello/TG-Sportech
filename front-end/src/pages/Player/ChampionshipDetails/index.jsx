import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayerAuthContext } from '../../../context/playerAuth';
import { notifySuccess, notifyError } from '../../../utils/notify';
import './styles.css';

export default function ChampionshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    player, 
    teams, 
    handleGetTeams, 
    selectedChampionship, 
    handleSetSelectedChamp, 
    handleSubscribeTeamToChampionship,
    handlePlayoffsGetChampInfo,
    handlePlayoffsGetChampMatches,
    handlePlayoffsGetChampTeams,
    handlePlayoffsGetChampTopScorers
  } = useContext(PlayerAuthContext);
  
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [championshipDetails, setChampionshipDetails] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Carregar times do jogador
      await handleGetTeams();
      
      // Se temos um ID de campeonato na URL, carregamos os detalhes
      if (id) {
        try {
          // Carregar informações do campeonato
          const champInfo = await handlePlayoffsGetChampInfo(id);
          setChampionshipDetails(champInfo);
          handleSetSelectedChamp(champInfo);
          
          // Carregar partidas do campeonato
          const matchesData = await handlePlayoffsGetChampMatches(id);
          setMatches(matchesData);
          
          // Carregar times do campeonato
          const teamsData = await handlePlayoffsGetChampTeams(id);
          setTeamsList(teamsData);
          
          // Carregar artilheiros
          const scorersData = await handlePlayoffsGetChampTopScorers(id);
          setTopScorers(scorersData);
        } catch (error) {
          console.error("Erro ao carregar detalhes do campeonato:", error);
          notifyError("Não foi possível carregar os detalhes do campeonato");
        }
      } else if (selectedChampionship && selectedChampionship.id) {
        // Se não temos ID na URL mas temos um campeonato selecionado no contexto
        setChampionshipDetails(selectedChampionship);
      } else {
        // Se não temos nem ID nem campeonato selecionado, voltamos para a lista
        navigate('/player/championships');
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [id]);
  
  const handleSubscribe = async () => {
    if (!selectedTeam) {
      notifyError("Selecione um time para inscrever no campeonato");
      return;
    }
    
    try {
      setLoading(true);
      const result = await handleSubscribeTeamToChampionship(selectedTeam, championshipDetails.id);
      
      if (result.success) {
        notifySuccess(result.message || "Time inscrito com sucesso!");
        // Recarregar os dados do campeonato
        const teamsData = await handlePlayoffsGetChampTeams(id);
        setTeamsList(teamsData);
      } else {
        notifyError(result.message || "Erro ao inscrever time no campeonato");
      }
    } catch (error) {
      console.error("Erro ao inscrever time:", error);
      notifyError("Ocorreu um erro ao inscrever o time no campeonato");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Carregando...</div>;
  }
  
  if (!championshipDetails) {
    return <div className="error">Campeonato não encontrado</div>;
  }
  
  return (
    <div className="championship-details-container">
      <header className="championship-header">
        <h1>{championshipDetails.title}</h1>
        <div className="championship-info">
          <p><strong>Data de início:</strong> {championshipDetails.initialDate}</p>
          {championshipDetails.finalDate && (
            <p><strong>Data de término:</strong> {championshipDetails.finalDate}</p>
          )}
          {championshipDetails.premiation && (
            <p><strong>Premiação:</strong> {championshipDetails.premiation}</p>
          )}
          {championshipDetails.registration && (
            <p><strong>Taxa de inscrição:</strong> {championshipDetails.registration}</p>
          )}
        </div>
        
        {championshipDetails.description && (
          <div className="championship-description">
            <h3>Descrição</h3>
            <p>{championshipDetails.description}</p>
          </div>
        )}
      </header>
      
      <div className="championship-content">
        {/* Seção de inscrição */}
        {championshipDetails.status === 'inscricoes' && (
          <section className="subscribe-section">
            <h2>Inscrever Time</h2>
            <div className="subscribe-form">
              <select 
                value={selectedTeam} 
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="">Selecione um time</option>
                {teams && teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <button 
                onClick={handleSubscribe} 
                disabled={!selectedTeam || loading}
              >
                {loading ? 'Inscrevendo...' : 'Inscrever Time'}
              </button>
            </div>
          </section>
        )}
        
        {/* Lista de times inscritos */}
        <section className="teams-section">
          <h2>Times Inscritos</h2>
          {teamsList && teamsList.length > 0 ? (
            <div className="teams-list">
              {teamsList.map(team => (
                <div key={team.id} className="team-card">
                  <h3>{team.name}</h3>
                  <div className="team-colors">
                    <div className="color primary" style={{ backgroundColor: team.primaryColor }}></div>
                    <div className="color secondary" style={{ backgroundColor: team.secondaryColor }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum time inscrito ainda.</p>
          )}
        </section>
        
        {/* Partidas do campeonato */}
        <section className="matches-section">
          <h2>Partidas</h2>
          {matches && matches.length > 0 ? (
            <div className="matches-list">
              {matches.map(match => (
                <div key={match.id} className="match-card">
                  <div className="match-teams">
                    <span className="team-a">{match.timeA?.name || 'A definir'}</span>
                    <span className="match-score">
                      {match.status === 'finalizada' ? `${match.golsTimeA} x ${match.golsTimeB}` : 'x'}
                    </span>
                    <span className="team-b">{match.timeB?.name || 'A definir'}</span>
                  </div>
                  <div className="match-info">
                    <p>
                      <strong>Data:</strong> {match.data ? new Date(match.data).toLocaleDateString('pt-BR') : 'A definir'}
                    </p>
                    <p>
                      <strong>Horário:</strong> {match.horario || 'A definir'}
                    </p>
                    <p>
                      <strong>Fase:</strong> {match.fase || 'A definir'}
                    </p>
                    <p>
                      <strong>Status:</strong> {match.status || 'Agendada'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhuma partida agendada ainda.</p>
          )}
        </section>
        
        {/* Artilharia */}
        <section className="top-scorers-section">
          <h2>Artilharia</h2>
          {topScorers && topScorers.length > 0 ? (
            <div className="scorers-list">
              <table>
                <thead>
                  <tr>
                    <th>Jogador</th>
                    <th>Time</th>
                    <th>Gols</th>
                  </tr>
                </thead>
                <tbody>
                  {topScorers.map((scorer, index) => (
                    <tr key={index}>
                      <td>{scorer.jogador}</td>
                      <td>{scorer.time}</td>
                      <td>{scorer.gols}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Nenhum gol registrado ainda.</p>
          )}
        </section>
      </div>
    </div>
  );
}
